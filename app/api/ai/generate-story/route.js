import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import { getAiInstance, initializeGoogleAuth } from '@/lib/config/googleAuth';

// Story generation prompt template
const storyPromptTemplate = (studentName, age, context, discardedStories = []) => `
You are an expert story writer at a daycare specializing in creating engaging, age-appropriate stories for the parents and guardians of children and toddlers.

Create a personalized story based on the following details:

Child's Name: ${studentName}
Age: ${age} months
Context/Scenario: ${context}

${discardedStories.length > 0 ? `
IMPORTANT: Do NOT create stories similar to these previously generated ones:
${discardedStories.map((story, index) => `${index + 1}. "${story}" - Please create a completely different story approach.`).join('\n')}

Please create a story that is unique and distinct from the above.
` : ''}

Story Requirements:
1. The story should be engaging and appropriate for the parents of the child.
2. Follow the provided context as the main theme of the story.
3. Keep the story positive, educational, fun and a means to convey the activity to the parent.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters
${discardedStories.length > 0 ? '9. Ensure this story is COMPLETELY DIFFERENT from the previously generated stories listed above' : ''}

Format the response as a JSON object with the following structure:
{
  "title": "The Title of the Story",
  "content": "The full story content here..."
}
`;

const sampleStoryPromptTemplate = (context, discardedStories = []) => `
You are an expert story writer at a daycare specializing in creating engaging, age-appropriate stories for the parents and guardians of children and toddlers.

Create a personalized story based on the following details:

Context/Scenario: ${context}

${discardedStories.length > 0 ? `
IMPORTANT: Do NOT create stories similar to these previously generated ones:
${discardedStories.map((story, index) => `${index + 1}. "${story}" - Please create a completely different story approach.`).join('\n')}

Please create a story that is unique and distinct from the above.
` : ''}

Story Requirements:
1. The story should be engaging and appropriate for the parents of the child.
2. Follow the provided context as the main theme of the story.
3. Keep the story positive, educational, fun and a means to convey the activity to the parent.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters
${discardedStories.length > 0 ? '9. Ensure this story is COMPLETELY DIFFERENT from the previously generated stories listed above' : ''}

Format the response as a JSON object with the following structure:
{
  "title": "The Title of the Story",
  "content": "The full story content here..."
}
`;

// Generation configuration for consistent AI responses
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
};

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { studentName, age, context, isSampleStory, discardedStories = [] } = body;

    if (!context || (!isSampleStory && (!studentName || !age))) {
      return NextResponse.json(
        { 
          error: isSampleStory 
            ? 'Missing required field: context is required.' 
            : 'Missing required fields: studentName, age, and context are required.'
        },
        { status: 400 }
      );
    }

    // Initialize Google Auth and get AI instance
    let googleAuthClient;
    try {
      googleAuthClient = await initializeGoogleAuth();
    } catch (authError) {
      console.error('❌ Failed to initialize Google Auth:', authError.message);
      console.log('⚠️ Falling back to mock story generation');
      
      return generateFallbackStory({ 
        studentName, 
        age, 
        context, 
        isSampleStory, 
        discardedStories 
      });
    }
    
    if (!googleAuthClient) {
      console.log('Google Auth client not initialized, using fallback generation');
      return generateFallbackStory({ 
        studentName, 
        age, 
        context, 
        isSampleStory, 
        discardedStories 
      });
    }

    const ai = getAiInstance(googleAuthClient);

    // Prepare the prompt based on whether it's a sample story or not
    const prompt = isSampleStory 
      ? sampleStoryPromptTemplate(context, discardedStories)
      : storyPromptTemplate(studentName, age, context, discardedStories);

    console.log('Generating story with Vertex AI...');
    console.log('Discarded stories count:', discardedStories.length);
    
    const chat = ai.chats.create({ 
      model: 'gemini-2.0-flash-001',
      config: generationConfig
    });
    
    const stream = await chat.sendMessageStream({ message: { text: prompt } });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.text) fullResponse += chunk.text;
    }

    console.log('Raw story response from Vertex AI:', fullResponse);
    
    try {
      // Clean and parse the response
      const cleaned = fullResponse.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.title || !parsed.content) {
        throw new Error('Invalid story format from AI');
      }

      return NextResponse.json({
        story: {
          ...parsed,
          generatedAt: new Date().toISOString(),
          context: context,
          studentName: studentName || 'your child'
        }
      });
      
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError.message, '\nRaw response:', fullResponse);
      
      return generateFallbackStory({ 
        studentName, 
        age, 
        context, 
        isSampleStory, 
        discardedStories,
        rawResponse: fullResponse 
      });
    }

  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Specific handling for Google credentials errors
    if (error.message.includes('JSON') || error.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
      console.error('🔧 This appears to be a Google credentials issue.');
      console.error('🔧 Check your GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.');
      
      return NextResponse.json({
        error: 'Configuration error: Please check Google credentials setup',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Invalid credentials format'
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

// Helper function to generate fallback stories when AI fails
function generateFallbackStory({ 
  studentName, 
  age, 
  context, 
  isSampleStory, 
  discardedStories = [],
  rawResponse 
}) {
  try {
    // Create an array of mock stories to choose from, avoiding repeated ones
    const allMockStories = [
      {
        title: isSampleStory ? "A Wonderful Classroom Moment" : `${studentName}'s Special Day`,
        content: `Today was filled with wonderful discoveries and learning moments. ${isSampleStory ? 'The children in our classroom' : studentName} ${context.toLowerCase().includes('during') ? context : 'had an amazing experience during ' + context}. 

This activity helped develop important skills like communication, creativity, and social interaction. The joy and enthusiasm shown throughout the experience was truly heartwarming to witness.

It's moments like these that remind us how much growth and learning happens every single day in our classroom. We're so proud of the progress being made and can't wait to see what tomorrow brings!`
      },
      {
        title: isSampleStory ? "An Adventure in Learning" : `${studentName}'s Creative Adventure`,
        content: `What an exciting day we had! ${isSampleStory ? 'Our little explorers' : studentName} ${context.toLowerCase().includes('during') ? context : 'embarked on a wonderful journey during ' + context}.

The curiosity and eagerness to learn was simply amazing to witness. Each moment brought new discoveries and opportunities to grow. The smiles, laughter, and "aha!" moments made this experience truly special.

These are the moments that make teaching so rewarding - watching young minds explore, question, and discover the world around them with such enthusiasm and wonder!`
      },
      {
        title: isSampleStory ? "A Day of Discovery" : `${studentName}'s Learning Journey`,
        content: `Today brought so many wonderful learning opportunities! ${isSampleStory ? 'The children' : studentName} ${context.toLowerCase().includes('during') ? context : 'showed incredible focus and enthusiasm during ' + context}.

It was beautiful to see the concentration, problem-solving, and determination in action. Every challenge was met with curiosity and a willingness to try new things. The growth and development happening right before our eyes is truly remarkable.

Days like these remind us why we love what we do - nurturing young minds and celebrating every milestone along the way!`
      },
      {
        title: isSampleStory ? "Moments of Magic" : `${studentName}'s Magical Moment`,
        content: `Today was absolutely magical! ${isSampleStory ? 'Our amazing students' : studentName} ${context.toLowerCase().includes('during') ? context : 'created something truly special during ' + context}.

The imagination, creativity, and joy that filled the room was infectious. Watching the excitement build as new skills were practiced and mastered was a highlight of our day. The pride and accomplishment shining through was unmistakable.

These precious moments of growth and discovery are what make every day in our classroom an adventure worth celebrating!`
      },
      {
        title: isSampleStory ? "Building Tomorrow" : `${studentName}'s Building Blocks`,
        content: `What a fantastic day of building and growing! ${isSampleStory ? 'Our young learners' : studentName} ${context.toLowerCase().includes('during') ? context : 'demonstrated amazing skills during ' + context}.

The focus, determination, and collaborative spirit displayed today was inspiring. Each step forward represents not just learning, but confidence building and personal growth. The foundation being laid today will support future learning adventures.

We're so proud of the progress being made and excited to see where this learning journey leads next!`
      }
    ];

    // Filter out any stories that have been discarded (by title)
    const availableStories = allMockStories.filter(story => 
      !discardedStories.includes(story.title)
    );

    // If all stories have been used, provide a generic new one
    let selectedStory;
    if (availableStories.length === 0) {
      selectedStory = {
        title: isSampleStory ? "Another Great Day" : `${studentName}'s New Adventure`,
        content: `Another wonderful day filled with learning and growth! ${isSampleStory ? 'The children' : studentName} ${context.toLowerCase().includes('during') ? context : 'had another amazing experience during ' + context}.

Each day brings new opportunities to learn, explore, and discover. The enthusiasm and curiosity shown continues to be a source of inspiration for everyone around.

We look forward to many more days of learning, growing, and celebrating achievements together!`
      };
    } else {
      // Select the first available story (could be randomized)
      selectedStory = availableStories[0];
    }

    const mockStory = {
      ...selectedStory,
      generatedAt: new Date().toISOString(),
      context: context,
      studentName: studentName || 'your child'
    };

    return NextResponse.json({
      story: mockStory,
      note: rawResponse ? 
        "Generated using our backup system with AI guidance - still personalized for your child!" :
        "Generated using our backup system - still personalized for your child!"
    });

  } catch (err) {
    console.error('Error generating fallback story:', err);
    return NextResponse.json(
      { 
        error: 'Failed to generate story. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}
