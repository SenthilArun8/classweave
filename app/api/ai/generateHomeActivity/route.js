/**
 * API Endpoint: Generate Home Activities
 * 
 * Generates personalized educational activities for children to do at home
 * based on provided child information, interests, and available materials.
 * 
 * FEATURES:
 * - AI-powered activity generation using Google Vertex AI
 * - Personalized based on child's age, interests, and personality
 * - Considers available materials and time constraints
 * - Returns structured activity with instructions, materials, and learning outcomes
 */

import { NextResponse } from 'next/server';
import { getAiInstance, initializeGoogleAuth } from '@/lib/config/googleAuth';
import { connectDB } from '@/lib/config/db';

// Activity generation prompt template
const activityPromptTemplate = (childInfo, options, discardedActivities = []) => `
You are an expert early childhood educator and child development specialist creating personalized educational activities for children to do at home.

Create a personalized activity based on the following details:

Child Information:
- Age: ${childInfo.age}
${childInfo.interests ? `- Interests: ${childInfo.interests}` : ''}
${childInfo.personality ? `- Personality: ${childInfo.personality}` : ''}
${childInfo.developmentalStage ? `- Developmental Focus: ${childInfo.developmentalStage}` : ''}
${childInfo.childDislikes ? `- Things to Avoid: ${childInfo.childDislikes}` : ''}

Activity Requirements:
- Location: ${options.activityLocation}
- Duration: ${options.desiredActivityLength}
- Number of Children: ${options.numberOfChildren}
${options.availableTime ? `- Parent Available Time: ${options.availableTime}` : ''}
${options.availableMaterials ? `- Available Materials: ${options.availableMaterials}` : ''}
${options.learningGoals ? `- Learning Goals: ${options.learningGoals}` : ''}
${options.activityType ? `- Preferred Activity Type: ${options.activityType}` : ''}

${discardedActivities.length > 0 ? `
IMPORTANT: Do NOT create activities similar to these previously generated ones:
${discardedActivities.map((activity, index) => `${index + 1}. "${activity.title}" - ${activity.description}`).join('\n')}

Please create a completely different type of activity that is unique and distinct from the above.
` : ''}

Create an engaging, age-appropriate activity that:
1. Is suitable for ${options.activityLocation.toLowerCase()} setting
2. Can be completed within ${options.desiredActivityLength}
3. Is designed for ${options.numberOfChildren} participant(s)
${childInfo.interests ? `4. Incorporates the child's interests: ${childInfo.interests}` : '4. Is engaging and fun for the specified age group'}
${childInfo.personality ? `5. Matches the child's personality traits: ${childInfo.personality}` : '5. Is suitable for various personality types'}
${childInfo.childDislikes ? `6. AVOIDS things the child dislikes: ${childInfo.childDislikes}` : '6. Is positive and encouraging'}
${childInfo.developmentalStage ? `7. Focuses on developing ${childInfo.developmentalStage} skills` : '7. Promotes overall development and learning'}
${options.availableMaterials ? `8. Uses materials mentioned or common household items` : '8. Uses common household items that are easily available'}
9. Is safe and suitable for the child's age
10. Promotes learning, creativity, and development
11. Includes clear, step-by-step instructions
12. Provides educational value and learning outcomes
13. Includes helpful tips for parents/caregivers
${discardedActivities.length > 0 ? '14. Is COMPLETELY DIFFERENT from the previously generated activities listed above' : ''}

Format the response as a JSON object with the following structure:
{
  "title": "Activity Title",
  "description": "Brief description of the activity and its purpose",
  "materials": ["list", "of", "required", "materials"],
  "instructions": ["step 1", "step 2", "step 3", "etc."],
  "learningOutcomes": ["what the child will learn", "skills developed"],
  "tips": ["helpful tips for parents", "safety considerations", "variations"]
}
`;

// Generation configuration for consistent AI responses
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
};

/**
 * POST /api/ai/generateHomeActivity
 * 
 * Generates a personalized at-home activity for a child
 * 
 * @param {Request} request - Contains child information and preferences
 * @returns {Promise<NextResponse>} Generated activity with instructions and materials
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      age,
      interests,
      personality,
      developmentalStage,
      availableTime,
      availableMaterials,
      learningGoals,
      activityType,
      activityLocation,
      desiredActivityLength,
      numberOfChildren,
      childDislikes,
      discardedActivities = []
    } = body;

    // Validate required fields
    if (!age || !activityLocation || !desiredActivityLength || !numberOfChildren) {
      return NextResponse.json(
        { error: 'Missing required fields: age, activity location, desired activity length, and number of children are required.' },
        { status: 400 }
      );
    }

    // Initialize Google Auth and get AI instance
    const googleAuthClient = await initializeGoogleAuth();
    if (!googleAuthClient) {
        console.log('Google Auth client not initialized, using fallback generation');
        return generateFallbackActivity({ 
            age, 
            interests, 
            personality, 
            developmentalStage, 
            availableMaterials,
            activityLocation,
            desiredActivityLength,
            numberOfChildren,
            childDislikes,
            discardedActivities
        });
    }
    const ai = getAiInstance(googleAuthClient);

    // Prepare child info and options
    const childInfo = {
      age,
      interests,
      personality,
      developmentalStage,
      childDislikes
    };
    
    const options = {
      availableTime,
      availableMaterials,
      learningGoals,
      activityType,
      activityLocation,
      desiredActivityLength,
      numberOfChildren
    };
    
    const prompt = activityPromptTemplate(childInfo, options, discardedActivities);

    console.log('Generating home activity with Vertex AI...');
    console.log('Discarded activities count:', discardedActivities.length);
    
    const chat = ai.chats.create({ 
      model: 'gemini-2.0-flash-001', // or your preferred model
      config: generationConfig
    });
    
    const stream = await chat.sendMessageStream({ message: { text: prompt } });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.text) fullResponse += chunk.text;
    }

    console.log('Raw activity response from Vertex AI:', fullResponse);
    
    try {
      // Clean and parse the response
      const cleaned = fullResponse.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.title || !parsed.description || !Array.isArray(parsed.instructions)) {
        throw new Error('Invalid activity format from AI');
      }

      return NextResponse.json({
        success: true,
        activity: {
          ...parsed,
          generatedAt: new Date().toISOString()
        },
        childInfo: {
          age,
          interests,
          personality
        }
      });
      
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError.message, '\nRaw response:', fullResponse);
      
      return generateFallbackActivity({ 
        age, 
        interests, 
        personality, 
        developmentalStage, 
        availableMaterials,
        activityLocation,
        desiredActivityLength,
        numberOfChildren,
        childDislikes,
        discardedActivities,
        rawResponse: fullResponse 
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    if (error.message.includes('JSON')) {
        console.error('This may be a credentials JSON parsing error. Check the GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.');
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate fallback activities when AI fails
function generateFallbackActivity({ 
  age, 
  interests, 
  personality, 
  developmentalStage, 
  availableMaterials, 
  activityLocation, 
  desiredActivityLength, 
  numberOfChildren, 
  childDislikes, 
  discardedActivities = [],
  rawResponse 
}) {
  const ageGroup = age.includes('2-3') ? 'toddler' : 
                   age.includes('3-4') ? 'preschooler' : 
                   age.includes('4-5') ? 'pre-k' : 
                   age.includes('5-6') ? 'kindergarten' : 'young child';

  const location = activityLocation || 'indoors';
  const duration = desiredActivityLength || '30 minutes';
  const childCount = numberOfChildren || '1 child';
  const personalityText = personality || 'curious and creative';
  const interestsText = interests || 'learning and play';

  const materials = availableMaterials ? 
    availableMaterials.split(',').map(item => item.trim()).slice(0, 5) : 
    ["Paper", "Crayons or markers", "Household items", "Container or box"];

  // Define different activity types to avoid repetition
  const activityTypes = [
    {
      type: 'nature_exploration',
      title: `Outdoor Discovery Adventure`,
      baseInstructions: [
        "Find a safe outdoor space for exploration",
        "Encourage your child to observe nature around them",
        "Collect interesting natural items (leaves, rocks, sticks)",
        "Create patterns or pictures with collected items",
        "Talk about what you discovered together"
      ]
    },
    {
      type: 'creative_art',
      title: `Creative ${personalityText.charAt(0).toUpperCase() + personalityText.slice(1)} Activity`,
      baseInstructions: [
        "Set up a comfortable workspace for your child",
        "Gather materials in an organized way",
        "Let your child explore and create freely with the materials",
        "Encourage them to tell you about what they're making",
        "Celebrate their creativity and efforts throughout the activity"
      ]
    },
    {
      type: 'building_construction',
      title: `Building and Construction Challenge`,
      baseInstructions: [
        "Gather building materials from around the house",
        "Challenge your child to build something specific or let them create freely",
        "Encourage problem-solving when structures fall down",
        "Talk about shapes, sizes, and balance",
        "Take photos of their creations before dismantling"
      ]
    },
    {
      type: 'sensory_play',
      title: `Sensory Exploration Activity`,
      baseInstructions: [
        "Set up a sensory play area with various textures",
        "Let your child explore different materials safely",
        "Encourage them to describe what they feel",
        "Create sensory bins or play areas",
        "Always supervise and ensure materials are safe"
      ]
    },
    {
      type: 'movement_dance',
      title: `Movement and Dance Adventure`,
      baseInstructions: [
        "Create a safe space for movement",
        "Put on some music or make your own rhythm",
        "Encourage different types of movement",
        "Copy each other's movements",
        "End with stretching or calm movements"
      ]
    },
    {
      type: 'cooking_kitchen',
      title: `Little Chef Kitchen Adventure`,
      baseInstructions: [
        "Choose a simple, safe cooking or food preparation activity",
        "Let your child help with measuring and mixing",
        "Talk about ingredients and cooking processes",
        "Practice following steps in order",
        "Enjoy eating what you've made together"
      ]
    }
  ];

  // Filter out activity types that match discarded activities
  const discardedTitles = discardedActivities.map(activity => activity.title.toLowerCase());
  const availableTypes = activityTypes.filter(type => {
    const typeWords = type.title.toLowerCase();
    return !discardedTitles.some(discarded => 
      discarded.includes(typeWords.split(' ')[0]) || 
      typeWords.includes(discarded.split(' ')[0])
    );
  });

  // Select activity type based on location and available types
  let selectedActivity;
  if (availableTypes.length > 0) {
    if (location.toLowerCase().includes('outdoor')) {
      selectedActivity = availableTypes.find(type => type.type === 'nature_exploration') || availableTypes[0];
    } else {
      selectedActivity = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }
  } else {
    // If all types have been used, create a unique combination
    selectedActivity = {
      type: 'unique_combination',
      title: `Unique ${personalityText} Learning Experience`,
      baseInstructions: [
        "Combine elements from different activities you've enjoyed",
        "Create your own unique approach to learning and play",
        "Focus on what your child enjoys most",
        "Adapt and modify based on their interests",
        "Make it a completely new adventure"
      ]
    };
  }

  const fallbackActivity = {
    title: selectedActivity.title,
    description: `A fun, engaging ${duration} activity designed for ${childCount} ${ageGroup}${interests ? ` who enjoys ${interestsText}` : ''}. Perfect for ${location} activities that promote creativity and learning.`,
    materials: materials,
    instructions: selectedActivity.baseInstructions,
    learningOutcomes: [
      developmentalStage ? `Develops ${developmentalStage} skills` : "Develops various developmental skills",
      "Encourages creativity and imagination",
      "Promotes language development through description",
      numberOfChildren > 1 ? "Builds social interaction skills" : "Builds confidence through independent exploration"
    ],
    tips: [
      "Follow your child's lead and interests",
      "Ask open-ended questions about their creations",
      `Keep the activity within the ${duration} timeframe`,
      "Safety first - supervise and ensure age-appropriate materials",
      childDislikes ? `Avoid: ${childDislikes}` : "Adapt the activity based on your child's engagement level",
      numberOfChildren > 1 ? "Encourage sharing and cooperation" : "Celebrate individual achievements"
    ],
    generatedAt: new Date().toISOString()
  };

  return NextResponse.json({
    success: true,
    activity: fallbackActivity,
    childInfo: { 
      age, 
      interests: interests || 'various interests', 
      personality: personality || 'curious',
      location: activityLocation,
      duration: desiredActivityLength,
      numberOfChildren
    },
    note: rawResponse ? 
      "Generated using our backup system with AI guidance - still personalized for your child!" :
      "Generated using our backup system - still personalized for your child!"
  });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate activities.' },
    { status: 405 }
  );
}
