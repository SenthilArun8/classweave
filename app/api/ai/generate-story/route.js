import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';

// Story generation prompt template
const storyPromptTemplate = (studentName, age, context) => `
You are an expert story writer at a daycare specializing in creating engaging, age-appropriate stories for the parents and guardians of children and toddlers.

Create a personalized story based on the following details:

Child's Name: ${studentName}
Age: ${age} months
Context/Scenario: ${context}

Story Requirements:
1. The story should be engaging and appropriate for the parents of the child.
2. Incorporate the provided context as the main theme of the story.
3. Keep the story positive, educational, fun and a means to convey the activity to the parent.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters and stay as true to the facts as possible

Format the response as a JSON object with the following structure:
{
  "title": "The Title of the Story",
  "content": "The full story content here..."
}
`;

const sampleStoryPromptTemplate = (context) => `
You are an expert story writer at a daycare specializing in creating engaging, age-appropriate stories for the parents and guardians of children and toddlers.

Create a personalized story based on the following details:

Context/Scenario: ${context}

Story Requirements:
1. The story should be engaging and appropriate for the parents of the child.
2. Incorporate the provided context as the main theme of the story.
3. Keep the story positive, educational, fun and a means to convey the activity to the parent.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters and stay as true to the facts as possible

Format the response as a JSON object with the following structure:
{
  "title": "The Title of the Story",
  "content": "The full story content here..."
}
`;

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { studentName, age, context, isSampleStory } = body;

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

    try {
      // For now, let's create a mock story response since we need to set up the AI integration properly
      const mockStory = {
        title: isSampleStory ? "A Wonderful Classroom Moment" : `${studentName}'s Special Day`,
        content: `Today was filled with wonderful discoveries and learning moments. ${isSampleStory ? 'The children in our classroom' : studentName} ${context.toLowerCase().includes('during') ? context : 'had an amazing experience during ' + context}. 

This activity helped develop important skills like communication, creativity, and social interaction. The joy and enthusiasm shown throughout the experience was truly heartwarming to witness.

It's moments like these that remind us how much growth and learning happens every single day in our classroom. We're so proud of the progress being made and can't wait to see what tomorrow brings!`,
        generatedAt: new Date().toISOString(),
        context: context,
        studentName: studentName || 'your child'
      };

      return NextResponse.json({
        story: mockStory
      });

    } catch (err) {
      console.error('Error generating story:', err);
      return NextResponse.json(
        { 
          error: 'Failed to generate story. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
