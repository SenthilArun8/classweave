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

// Helper function to get age-specific activity requirements
const getAgeSpecificRequirements = (age) => {
  if (age.includes('2-3')) {
    return 'Simple, large motor activities suitable for toddlers (stacking, simple sorting, basic art with large materials)';
  } else if (age.includes('3-4')) {
    return 'Preschool activities focusing on basic skills (simple puzzles, imaginative play, early pre-writing)';
  } else if (age.includes('4-5')) {
    return 'Pre-K activities with more complexity (basic cutting with safety scissors, simple counting, letter recognition)';
  } else if (age.includes('5-6')) {
    return 'Kindergarten-level activities (early reading, writing practice, basic math concepts, more detailed crafts)';
  } else if (age.includes('6-7')) {
    return 'Early elementary activities (reading comprehension, math problems, detailed art projects, simple science experiments)';
  } else if (age.includes('7-8')) {
    return 'Elementary activities (more complex reading and writing, advanced math, multi-step projects, group activities)';
  } else if (age.includes('8-9')) {
    return 'Advanced elementary activities (chapter books, complex problem-solving, detailed crafts, independent research)';
  } else if (age.includes('9-10')) {
    return 'Pre-teen activities (critical thinking, complex projects, collaborative work, creative expression)';
  }
  return 'Age-appropriate developmental activities';
};

// Helper function to get age-specific safety and complexity guidelines
const getAgeSpecificGuidelines = (age) => {
  if (age.includes('2-3')) {
    return `
TODDLER-SPECIFIC GUIDELINES (2-3 years):
- Use only large materials (no choking hazards)
- Focus on sensory exploration and large motor skills
- Keep instructions to 2-3 simple steps maximum
- Expect 10-15 minute attention spans
- Include plenty of movement and exploration
- Use washable, non-toxic materials only`;
  } else if (age.includes('3-4')) {
    return `
PRESCHOOLER GUIDELINES (3-4 years):
- Can handle slightly smaller materials but still avoid tiny pieces
- Can follow 3-4 step instructions
- Developing fine motor skills - include cutting, drawing, threading
- Attention span 15-20 minutes
- Love imaginative play and storytelling
- Beginning to understand rules and sequences`;
  } else if (age.includes('4-5')) {
    return `
PRE-K GUIDELINES (4-5 years):
- Can use child-safe scissors and basic tools with minimal supervision
- Can follow 4-5 step instructions
- Ready for early learning concepts (letters, numbers, patterns)
- Attention span 20-30 minutes
- Enjoy more complex games and challenges
- Can work on projects over multiple sessions`;
  } else if (age.includes('5-6')) {
    return `
KINDERGARTEN GUIDELINES (5-6 years):
- Can handle more complex materials and tools
- Can follow multi-step instructions (5-7 steps)
- Ready for academic content (reading, writing, math)
- Attention span 30-45 minutes
- Enjoy collaborative activities and rule-based games
- Can plan and execute longer projects`;
  } else if (age.includes('6-7')) {
    return `
EARLY ELEMENTARY GUIDELINES (6-7 years):
- Can use regular child scissors and basic crafting tools
- Can follow detailed, multi-step instructions
- Ready for complex academic activities and problem-solving
- Attention span 45+ minutes
- Enjoy challenges and competitive elements
- Can work independently on structured tasks`;
  } else if (age.includes('7-8')) {
    return `
ELEMENTARY GUIDELINES (7-8 years):
- Can handle more sophisticated tools and materials
- Can follow complex, multi-part instructions with 8+ steps
- Ready for advanced academic content and creative projects
- Attention span 60+ minutes
- Enjoy collaborative work and leadership roles
- Can plan and execute extended projects over multiple days`;
  } else if (age.includes('8-9')) {
    return `
ADVANCED ELEMENTARY GUIDELINES (8-9 years):
- Can use most adult tools with supervision
- Can follow detailed written instructions independently
- Ready for abstract thinking and complex problem-solving
- Attention span 60-90 minutes
- Enjoy research, investigation, and discovery
- Can mentor younger children and lead group activities`;
  } else if (age.includes('9-10')) {
    return `
PRE-TEEN GUIDELINES (9-10 years):
- Can handle sophisticated projects and tools safely
- Can create and follow their own project plans
- Ready for critical thinking and analytical activities
- Attention span 90+ minutes
- Enjoy independence and creative control
- Can organize and execute complex multi-part projects`;
  }
  return 'Follow age-appropriate developmental guidelines for the specified age group.';
};

// Activity generation prompt template
const activityPromptTemplate = (childInfo, options, discardedActivities = []) => `
You are an expert early childhood educator and child development specialist creating personalized educational but MAINLY engaging, compelling activities for children to do at home.

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
- Parent Involvement: ${options.parentInvolved === 'full' ? 'FULL - Parent will actively supervise/participate' : 
                      options.parentInvolved === 'minimal' ? 'MINIMAL - Parent nearby but child works mostly independently' : 
                      'NONE - Child must be able to do this completely independently'}
${options.availableTime ? `- Parent Available Time: ${options.availableTime}` : ''}
${options.availableMaterials ? `- Available Materials: ${options.availableMaterials}` : ''}
${options.learningGoals ? `- Learning Goals: ${options.learningGoals}` : ''}
${options.activityType ? `- Preferred Activity Type: ${options.activityType}` : ''}

${options.parentInvolved === false || options.parentInvolved === 'none' ? `
CRITICAL SAFETY REQUIREMENT: This activity MUST be designed for completely independent play.
- Use only materials that are 100% safe for the child's age group without supervision
- NO small parts that could be choking hazards for ${childInfo.age}
- NO sharp objects, scissors, or potentially dangerous tools
- NO cooking, heating, or activities requiring stove/oven use
- NO activities requiring adult assistance for safety
- Materials should be soft, large enough to handle safely, and non-toxic
- All steps must be simple enough for ${childInfo.age} to understand and execute independently
- Focus on activities like: drawing, building with large blocks, reading, simple crafts with safe materials, imaginative play
` : options.parentInvolved === 'minimal' ? `
MINIMAL SUPERVISION ACTIVITY: Parent is nearby but child works mostly independently.
- Use mostly safe materials with minimal risk
- Simple tools like child-safe scissors (with rounded tips) are okay
- Basic kitchen activities (no heat/sharp knives) with adult nearby
- Craft activities with some small parts but age-appropriate for ${childInfo.age}
- Instructions should be clear enough for child to follow with minimal guidance
- Parent can help with setup but child does most of the activity
` : `
PARENT-SUPERVISED ACTIVITY: Since parents will be actively involved, you can include:
- More complex materials and tools (with proper supervision noted)
- Activities requiring active adult assistance
- Cooking or kitchen activities (with safety precautions)
- More advanced crafts or experiments appropriate for ${childInfo.age}
`}

${discardedActivities.length > 0 ? `
IMPORTANT: Do NOT create activities similar to these previously generated ones:
${discardedActivities.map((activity, index) => `${index + 1}. "${activity.title}" - ${activity.description}`).join('\n')}

Please create a completely different type of activity that is unique and distinct from the above.
` : ''}

Create an engaging, age-appropriate activity that:
1. Is suitable for ${options.activityLocation.toLowerCase()} setting
2. Can be completed within ${options.desiredActivityLength}
3. Is designed for ${options.numberOfChildren} participant(s) where they may engage with one another if more than one
4. ${options.parentInvolved === 'full' ? 'Includes active parent participation and supervision' : 
     options.parentInvolved === 'minimal' ? 'Can be done mostly independently with parent nearby for assistance' : 
     'Can be done SAFELY and COMPLETELY INDEPENDENTLY by children of this age'}
5. ${getAgeSpecificRequirements(childInfo.age)}
${childInfo.interests ? `6. Incorporates the child's interests: ${childInfo.interests}` : '6. Is engaging and fun for the specified age group'}
${childInfo.personality ? `7. Matches the child's personality traits: ${childInfo.personality}` : '7. Is suitable for various personality types'}
${childInfo.childDislikes ? `8. AVOIDS things the child dislikes: ${childInfo.childDislikes}` : '8. Is positive and encouraging'}
${childInfo.developmentalStage ? `9. Focuses on developing ${childInfo.developmentalStage} skills` : '9. Promotes overall development and learning'}
${options.availableMaterials ? `10. Uses materials mentioned or common household items` : '10. Uses common household items that are easily available'}
11. Is safe and suitable for the child's age
12. Promotes learning, creativity, and development
13. Includes clear, step-by-step instructions
14. Provides educational value and learning outcomes
15. Includes helpful tips for parents/caregivers
16. ${options.parentInvolved === false || options.parentInvolved === 'none' ? 'Uses only SAFE, NON-TOXIC, AGE-APPROPRIATE materials without supervision risks' : 
       options.parentInvolved === 'minimal' ? 'Uses mostly safe materials with minimal risk, suitable for light supervision' :
       'Includes proper supervision guidelines for parent-involved activities'}
${discardedActivities.length > 0 ? '17. Is COMPLETELY DIFFERENT from the previously generated activities listed above' : ''}

${getAgeSpecificGuidelines(childInfo.age)}

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
      parentInvolved = 'none', // 'none', 'minimal', 'full'
      discardedActivities = []
    } = body;

    // Validate required fields
    if (!age || !activityLocation || !desiredActivityLength) {
      console.log('Validation failed:', { age, activityLocation, desiredActivityLength, numberOfChildren });
      return NextResponse.json(
        { error: 'Missing required fields: age, activity location, and desired activity length are required.' },
        { status: 400 }
      );
    }

    console.log('Request validated successfully:', { age, activityLocation, desiredActivityLength, numberOfChildren: numberOfChildren || '1' });

    // Initialize Google Auth and get AI instance
    let googleAuthClient;
    try {
      googleAuthClient = await initializeGoogleAuth();
    } catch (authError) {
      console.error('❌ Failed to initialize Google Auth:', authError.message);
      console.log('⚠️ Falling back to backup activity generation');
      
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
          parentInvolved,
          discardedActivities
      });
    }
    
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
            parentInvolved,
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
      numberOfChildren: numberOfChildren || '1', // Default to 1 child if not specified
      parentInvolved
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
        parentInvolved,
        discardedActivities,
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
        console.error('🔧 Ensure it contains valid JSON without extra quotes or formatting issues.');
        
        // Return a more helpful error in production
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
  parentInvolved = 'none', // 'none', 'minimal', 'full'
  discardedActivities = [],
  rawResponse 
}) {
  const ageGroup = age.includes('2-3') ? 'toddler' : 
                   age.includes('3-4') ? 'preschooler' : 
                   age.includes('4-5') ? 'pre-k' : 
                   age.includes('5-6') ? 'kindergarten' : 
                   age.includes('6-7') ? 'early elementary' :
                   age.includes('7-8') ? 'elementary' :
                   age.includes('8-9') ? 'advanced elementary' :
                   age.includes('9-10') ? 'pre-teen' : 'young child';

  const location = activityLocation || 'indoors';
  const duration = desiredActivityLength || '30 minutes';
  const childCount = numberOfChildren || '1 child';
  const personalityText = personality || 'curious and creative';
  const interestsText = interests || 'learning and play';

  // Age-specific safe materials based on supervision level
  const getAgeMaterials = (age, supervisionLevel) => {
    const isToddler = age.includes('2-3');
    const isPreschool = age.includes('3-4');
    const isPreK = age.includes('4-5');
    const isKindergarten = age.includes('5-6');
    const isEarlyElementary = age.includes('6-7');
    const isElementary = age.includes('7-8');
    const isAdvancedElementary = age.includes('8-9');
    const isPreTeen = age.includes('9-10');

    if (supervisionLevel === 'full') {
      if (isToddler) return ["Large paper", "Chunky crayons", "Play dough", "Large wooden blocks", "Washable markers"];
      if (isPreschool) return ["Paper", "Crayons", "Child-safe scissors", "Glue stick", "Stickers"];
      if (isPreK) return ["Construction paper", "Markers", "Safety scissors", "Glue", "Small blocks"];
      if (isKindergarten) return ["Paper", "Pencils", "Scissors", "Craft materials", "Educational games"];
      if (isEarlyElementary) return ["Notebook", "Pens/pencils", "Ruler", "Craft supplies", "Building materials"];
      if (isElementary) return ["Advanced craft supplies", "Science experiment materials", "Books", "Writing materials", "Art supplies"];
      if (isAdvancedElementary) return ["Complex building sets", "Research materials", "Advanced art supplies", "Science kits", "Technology tools"];
      if (isPreTeen) return ["Project planning materials", "Advanced technology", "Complex craft supplies", "Research tools", "Leadership materials"];
    } else if (supervisionLevel === 'minimal') {
      if (isToddler) return ["Large chunky crayons", "Big paper", "Soft blocks", "Large containers"];
      if (isPreschool) return ["Crayons", "Paper", "Large stickers", "Soft building materials"];
      if (isPreK) return ["Markers", "Paper", "Child-safe scissors", "Large puzzle pieces"];
      if (isKindergarten) return ["Coloring books", "Crayons", "Simple crafts", "Building blocks"];
      if (isEarlyElementary) return ["Books", "Paper", "Colored pencils", "Simple craft materials"];
      if (isElementary) return ["Notebooks", "Art supplies", "Simple science materials", "Building sets"];
      if (isAdvancedElementary) return ["Research books", "Complex art supplies", "Model-building materials", "Educational games"];
      if (isPreTeen) return ["Planning notebooks", "Advanced art materials", "Project supplies", "Reference materials"];
    } else { // 'none' - completely independent
      if (isToddler) return ["Extra large crayons", "Large paper", "Soft fabric pieces", "Large wooden blocks"];
      if (isPreschool) return ["Chunky crayons", "Paper", "Large stickers", "Soft toys"];
      if (isPreK) return ["Crayons", "Coloring books", "Large building blocks", "Picture books"];
      if (isKindergarten) return ["Colored pencils", "Drawing paper", "Simple puzzles", "Books"];
      if (isEarlyElementary) return ["Books", "Notebooks", "Colored pencils", "Simple board games"];
      if (isElementary) return ["Chapter books", "Drawing supplies", "Simple craft materials", "Educational games"];
      if (isAdvancedElementary) return ["Reference books", "Art supplies", "Independent project materials", "Complex puzzles"];
      if (isPreTeen) return ["Project books", "Advanced art materials", "Research materials", "Planning tools"];
    }
    return ["Paper", "Crayons", "Safe household items"];
  };

  const materials = availableMaterials ? 
    availableMaterials.split(',').map(item => item.trim()).slice(0, 5) : 
    getAgeMaterials(age, parentInvolved);

  // Age and supervision-specific activity types
  const getAgeSpecificActivities = (age, supervisionLevel, personalityText, location) => {
    const isToddler = age.includes('2-3');
    const isPreschool = age.includes('3-4');
    const isPreK = age.includes('4-5');
    const isKindergarten = age.includes('5-6');
    const isEarlyElementary = age.includes('6-7');
    const isElementary = age.includes('7-8');
    const isAdvancedElementary = age.includes('8-9');
    const isPreTeen = age.includes('9-10');

    const activities = [];

    // Nature exploration (always safe for all ages)
    activities.push({
      type: 'nature_exploration',
      title: `${isToddler ? 'Toddler' : isPreschool ? 'Preschool' : isPreK ? 'Pre-K' : isKindergarten ? 'Kindergarten' : isEarlyElementary ? 'Early Elementary' : isElementary ? 'Elementary' : isAdvancedElementary ? 'Advanced Elementary' : isPreTeen ? 'Pre-Teen' : 'Elementary'} Nature Discovery`,
      baseInstructions: supervisionLevel === 'full' ? [
        "Take your child to a safe outdoor area",
        `${isToddler ? 'Help them touch different textures' : 'Explore different natural materials together'}`,
        `${isToddler ? 'Point out colors and shapes' : 'Collect interesting natural items'}`,
        `${isToddler ? 'Let them feel grass and leaves' : 'Create patterns with nature treasures'}`,
        "Talk about your discoveries together"
      ] : supervisionLevel === 'minimal' ? [
        "Go to your safe backyard or nearby area",
        `${isToddler ? 'Look at different colors in nature' : 'Find interesting leaves and rocks'}`,
        `${isToddler ? 'Touch soft grass carefully' : 'Make a small collection of nature items'}`,
        `${isToddler ? 'Show parent what you found' : 'Arrange items in patterns'}`,
        "Tell someone about your favorite discovery"
      ] : [
        "Look around your safe outdoor space",
        `${isToddler ? 'Look at pretty flowers and trees' : 'Find smooth rocks and interesting leaves'}`,
        `${isToddler ? 'Sit on grass and feel textures' : 'Make patterns on the ground'}`,
        `${isToddler ? 'Wave at birds and insects' : 'Count how many different items you found'}`,
        "Remember to stay in your safe area"
      ],
      safeForIndependent: !isToddler || supervisionLevel !== 'none'
    });

    // Art activities (complexity varies by age)
    activities.push({
      type: 'creative_art',
      title: `${isToddler ? 'Big Crayon Art' : isPreschool ? 'Creative Drawing' : isPreK ? 'Art & Design' : isKindergarten ? 'Artistic Creation' : isEarlyElementary ? 'Advanced Art Project' : isElementary ? 'Complex Art Creation' : isAdvancedElementary ? 'Masterpiece Project' : isPreTeen ? 'Independent Art Studio' : 'Advanced Art Project'}`,
      baseInstructions: supervisionLevel === 'full' ? [
        `${isToddler ? 'Set up large paper and chunky crayons' : 'Gather age-appropriate art supplies'}`,
        `${isToddler ? 'Let them scribble and explore marks' : 'Help them plan their artwork'}`,
        `${isToddler ? 'Name colors as they use them' : 'Encourage creativity and experimentation'}`,
        `${isToddler ? 'Celebrate every mark they make' : 'Ask about their artistic choices'}`,
        "Display their finished artwork proudly"
      ] : supervisionLevel === 'minimal' ? [
        `${isToddler ? 'Get your big crayons and paper' : 'Set up your art materials'}`,
        `${isToddler ? 'Make colorful marks on paper' : 'Draw whatever makes you happy'}`,
        `${isToddler ? 'Try different colors' : 'Use different colors and shapes'}`,
        `${isToddler ? 'Show grown-up your picture' : 'Add details to make it special'}`,
        "Clean up your materials when done"
      ] : [
        `${isToddler ? 'Get safe crayons and big paper' : 'Get your drawing materials ready'}`,
        `${isToddler ? 'Make big circles and lines' : 'Draw your favorite things'}`,
        `${isToddler ? 'Use different colors' : 'Fill in your drawing with colors'}`,
        `${isToddler ? 'Make more pictures' : 'Sign your name if you can write it'}`,
        "Put your artwork somewhere safe"
      ],
      safeForIndependent: true
    });

    // Building activities (age-appropriate complexity)
    if (!isToddler || supervisionLevel !== 'none') {
      activities.push({
        type: 'building_construction',
        title: `${isToddler ? 'Big Block Stacking' : isPreschool ? 'Building Fun' : isPreK ? 'Construction Challenge' : isKindergarten ? 'Architecture Project' : 'Engineering Challenge'}`,
        baseInstructions: supervisionLevel === 'full' ? [
          `${isToddler ? 'Help them stack large soft blocks' : 'Provide various building materials'}`,
          `${isToddler ? 'Count blocks as you stack' : 'Challenge them to build something specific'}`,
          `${isToddler ? 'Clap when tower falls' : 'Help problem-solve when structures fall'}`,
          `${isToddler ? 'Build together' : 'Discuss shapes, sizes, and balance'}`,
          "Take photos of creations before dismantling"
        ] : [
          `${isToddler ? 'Stack soft blocks carefully' : 'Build with your blocks or materials'}`,
          `${isToddler ? 'Make towers as tall as you' : 'Try building different structures'}`,
          `${isToddler ? 'Knock down and rebuild' : 'If it falls down, try a different way'}`,
          `${isToddler ? 'Count your blocks' : 'Make it as tall or wide as you can'}`,
          `${isToddler ? 'Clean up blocks' : 'Show someone your creation'}`
        ],
        safeForIndependent: !isToddler || supervisionLevel !== 'none'
      });
    }

    // Reading/storytelling (all ages love stories)
    activities.push({
      type: 'reading_stories',
      title: `${isToddler ? 'Picture Book Fun' : isPreschool ? 'Story Time' : isPreK ? 'Reading Adventure' : isKindergarten ? 'Independent Reading' : isEarlyElementary ? 'Chapter Book Exploration' : isElementary ? 'Advanced Reading' : isAdvancedElementary ? 'Literature Discovery' : isPreTeen ? 'Independent Book Study' : 'Chapter Book Exploration'}`,
      baseInstructions: supervisionLevel === 'full' ? [
        `${isToddler ? 'Choose board books with big pictures' : 'Select age-appropriate books together'}`,
        `${isToddler ? 'Point to pictures and name things' : 'Take turns reading or looking at pictures'}`,
        `${isToddler ? 'Make animal sounds from the book' : 'Ask questions about the story'}`,
        `${isToddler ? 'Let them turn pages' : 'Act out parts of the story'}`,
        `${isToddler ? 'Read the same book multiple times' : 'Create your own ending'}`
      ] : [
        `${isToddler ? 'Get your favorite picture books' : 'Choose books you can handle safely'}`,
        `${isToddler ? 'Look at all the pictures' : 'Look at pictures and words'}`,
        `${isToddler ? 'Point to things you know' : 'Tell yourself the story from pictures'}`,
        `${isToddler ? 'Turn pages carefully' : 'Make different voices for characters'}`,
        `${isToddler ? 'Talk to your book' : 'Share your favorite part with someone'}`
      ],
      safeForIndependent: true
    });

    // Movement activities (age-appropriate physical play)
    activities.push({
      type: 'movement_dance',
      title: `${isToddler ? 'Toddler Movement' : isPreschool ? 'Dance & Move' : isPreK ? 'Active Play' : isKindergarten ? 'Exercise Fun' : isEarlyElementary ? 'Fitness Challenge' : isElementary ? 'Physical Activity' : isAdvancedElementary ? 'Advanced Movement' : isPreTeen ? 'Independent Fitness' : 'Fitness Challenge'}`,
      baseInstructions: supervisionLevel === 'full' ? [
        "Create a safe movement space together",
        `${isToddler ? 'Help them march and clap' : 'Put on music and dance together'}`,
        `${isToddler ? 'Practice walking and stopping' : 'Copy each other\'s movements'}`,
        `${isToddler ? 'Spin slowly together' : 'Try different types of movement'}`,
        `${isToddler ? 'End with gentle swaying' : 'End with stretching or calm movements'}`
      ] : [
        "Make sure you have safe space to move",
        `${isToddler ? 'March around like a little soldier' : 'Dance to music or make up moves'}`,
        `${isToddler ? 'Clap your hands and stomp feet' : 'Try jumping, hopping, or skipping'}`,
        `${isToddler ? 'Sit down and stand up' : 'Stretch your arms and legs'}`,
        `${isToddler ? 'Rest when you\'re tired' : 'Take deep breaths when finished'}`
      ],
      safeForIndependent: true
    });

    // Science exploration (for older kids)
    if (isEarlyElementary || isElementary || isAdvancedElementary || isPreTeen) {
      activities.push({
        type: 'science_exploration',
        title: `${isEarlyElementary ? 'Simple Science Discovery' : isElementary ? 'Science Investigation' : isAdvancedElementary ? 'Advanced Science Project' : 'Independent Research'}`,
        baseInstructions: supervisionLevel === 'full' ? [
          `${isEarlyElementary ? 'Set up a simple observation experiment' : 'Choose an age-appropriate science activity'}`,
          `${isEarlyElementary ? 'Help them observe and record findings' : 'Guide them through the scientific method'}`,
          `${isEarlyElementary ? 'Ask questions about what they see' : 'Encourage hypothesis formation'}`,
          `${isEarlyElementary ? 'Celebrate their discoveries' : 'Help analyze and discuss results'}`,
          "Connect findings to real-world applications"
        ] : supervisionLevel === 'minimal' ? [
          `${isEarlyElementary ? 'Set up a safe observation activity' : 'Choose a simple experiment to try'}`,
          `${isEarlyElementary ? 'Watch and record what happens' : 'Follow steps and observe carefully'}`,
          `${isEarlyElementary ? 'Draw pictures of what you see' : 'Write down your observations'}`,
          `${isEarlyElementary ? 'Ask for help if needed' : 'Compare results with expectations'}`,
          "Share your findings with someone"
        ] : [
          `${isEarlyElementary ? 'Do a safe observation activity' : 'Choose a safe science activity'}`,
          `${isEarlyElementary ? 'Look carefully at what happens' : 'Follow all steps safely'}`,
          `${isEarlyElementary ? 'Draw pictures of your observations' : 'Record your observations carefully'}`,
          `${isEarlyElementary ? 'Think about why it happened' : 'Think about what you learned'}`,
          "Tell someone about your discovery"
        ],
        safeForIndependent: supervisionLevel !== 'none' || !isEarlyElementary
      });
    }

    // Research and investigation (for advanced learners)
    if (isAdvancedElementary || isPreTeen) {
      activities.push({
        type: 'research_investigation',
        title: `${isAdvancedElementary ? 'Topic Investigation' : 'Independent Research Project'}`,
        baseInstructions: supervisionLevel === 'full' ? [
          "Help them choose an interesting topic to explore",
          "Guide them to appropriate research sources",
          "Assist with organizing their findings",
          "Help them create a presentation or report",
          "Discuss what they learned together"
        ] : supervisionLevel === 'minimal' ? [
          "Choose a topic that interests you",
          "Find safe sources to learn about it",
          "Write down the most interesting facts",
          "Organize your information clearly",
          "Prepare to share what you learned"
        ] : [
          "Pick a topic you want to learn about",
          "Use books or safe online resources",
          "Take notes on interesting information",
          "Create your own mini-report",
          "Share your findings with someone"
        ],
        safeForIndependent: true
      });
    }

    // Creative writing and storytelling (for all ages with appropriate complexity)
    activities.push({
      type: 'creative_writing',
      title: `${isToddler ? 'Story Picture Book' : isPreschool ? 'Picture Story Creation' : isPreK ? 'Beginning Story Writing' : isKindergarten ? 'Story Adventures' : isEarlyElementary ? 'Creative Writing' : isElementary ? 'Story Development' : isAdvancedElementary ? 'Advanced Storytelling' : 'Creative Writing Project'}`,
      baseInstructions: supervisionLevel === 'full' ? [
        `${(isToddler || isPreschool) ? 'Help them create a picture story' : 'Guide them in story creation'}`,
        `${(isToddler || isPreschool) ? 'Let them dictate while you write' : 'Encourage creative ideas and characters'}`,
        `${(isToddler || isPreschool) ? 'Draw pictures together' : 'Help with story structure and plot'}`,
        `${(isToddler || isPreschool) ? 'Read their story back to them' : 'Review and edit together'}`,
        "Celebrate their creativity and imagination"
      ] : supervisionLevel === 'minimal' ? [
        `${(isToddler || isPreschool) ? 'Draw pictures and tell a story' : 'Think of an interesting story idea'}`,
        `${(isToddler || isPreschool) ? 'Tell someone about your pictures' : 'Write or draw your story'}`,
        `${(isToddler || isPreschool) ? 'Make up voices for characters' : 'Add details and descriptions'}`,
        `${(isToddler || isPreschool) ? 'Act out your story' : 'Read through and make improvements'}`,
        "Share your story with someone"
      ] : [
        `${(isToddler || isPreschool) ? 'Draw pictures and make up a story' : 'Create your own story'}`,
        `${(isToddler || isPreschool) ? 'Tell your story to your pictures' : 'Write down your ideas'}`,
        `${(isToddler || isPreschool) ? 'Use different voices' : 'Add interesting characters and events'}`,
        `${(isToddler || isPreschool) ? 'Share with family' : 'Read through and polish your story'}`,
        "Be proud of your creative work"
      ],
      safeForIndependent: true
    });

    return activities.filter(activity => activity.safeForIndependent || supervisionLevel !== 'none');
  };

  const allActivityTypes = getAgeSpecificActivities(age, parentInvolved, personalityText, location);

  // Filter activities based on safety requirements
  const activityTypes = allActivityTypes;

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
    tips: parentInvolved === 'full' ? [
      "Stay actively involved throughout the activity",
      "Ask open-ended questions about their creations",
      `Keep the activity within the ${duration} timeframe`,
      "Supervise closely and ensure age-appropriate materials",
      childDislikes ? `Avoid: ${childDislikes}` : "Adapt the activity based on your child's engagement level",
      numberOfChildren > 1 ? "Encourage sharing and cooperation" : "Celebrate individual achievements",
      "Be ready to help and guide throughout the activity"
    ] : parentInvolved === 'minimal' ? [
      "Stay nearby but let your child work mostly independently",
      "Check in periodically and offer help if needed",
      `Encourage independent work for ${duration}`,
      "Ensure all materials are age-appropriate and safe",
      childDislikes ? `Remember to avoid: ${childDislikes}` : "Let your child explore at their own pace",
      numberOfChildren > 1 ? "Monitor sharing but let children work it out" : "Praise their independent efforts",
      "Be available for questions but don't take over"
    ] : [
      "Make sure your child can do this activity completely safely on their own",
      "Check that all materials are safe and age-appropriate before starting",
      `Encourage independent play for ${duration}`,
      "All materials should be large enough to handle safely",
      childDislikes ? `Remember to avoid: ${childDislikes}` : "Let your child explore and create at their own pace",
      numberOfChildren > 1 ? "Ensure children can share materials safely without conflict" : "Celebrate their independent accomplishments",
      "Adult should be nearby but child works completely independently"
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
