/**
 * AI Activity Generation API Route
 * 
 * Generates personalized educational activities for toddlers using Google's Gemini AI.
 * Analyzes student data and creates tailored activity suggestions based on recent performance,
 * developmental stage, interests, and learning goals.
 * 
 * ENDPOINT: POST /api/ai/generate
 * 
 * REQUEST BODY:
 * - prompt: String - Student context and requirements
 * - discardedActivities: Array - Previously generated activities to avoid repeating
 * 
 * RESPONSE:
 * - response: Object - Contains activity_suggestions array with structured activities
 * 
 * AI MODEL: Google Gemini 2.0 Flash
 * 
 */

import { getAiInstance, initializeGoogleAuth } from '@/lib/config/googleAuth.js';

// AI model configuration
const model = 'gemini-2.0-flash-001';

/**
 * Predefined skill categories for structured AI responses
 * These categories ensure consistent skill classification across all generated activities
 */
const allowedSkills = [
  'Social-Emotional Skills',
  'Cognitive Skills',
  'Literacy Skills',
  'Physical Skills',
  'Creative Arts/Expression Skills',
  'Language and Communication Skills',
  'Self-Help/Adaptive Skills',
  'Problem-Solving Skills',  'Sensory Processing Skills'
];

/**
 * AI Prompt Template for Activity Generation
 * 
 * Comprehensive prompt that instructs the AI to:
 * - Analyze recent activity performance (success/failure)
 * - Generate 5 diverse, age-appropriate activities
 * - Structure output with title, rationale, and categorized skills
 * - Ensure skill categories match predefined allowedSkills array
 * 
 * OUTPUT FORMAT: JSON with activity_suggestions array
 */
const activityPrompt = `Objective and Persona:You are an expert in early childhood development, specializing in creating engaging and developmentally appropriate activities for toddlers. Your task is to provide diverse activity suggestions tailored to a toddler's individual needs and recent performance.Instructions:To complete the task, you need to follow these steps:Analyze the recent_activity result.If the toddler failed the activity:Provide 5 diverse activity options that help build towards success in the same skill area.Prioritize observations from the recent_activity when suggesting new activities.Also consider developmental_stage, goals, interests, energy_level, and social_behavior.If the toddler succeeded in the activity:Provide 5 diverse activity options to help them grow and develop necessary skills further.Consider their developmental_stage, goals, interests, energy_level, and social_behavior.Ensure all activity suggestions are diverse in nature (e.g., varying types of play, skill focus, materials).For each activity, provide only the following three details:Title of Activity (String)Why it works (String)Skills supported (Array of Objects)Constraints:For the 'Skills supported' array, ONLY use objects of the form { "name": "Skill Name", "category": "One of: ${allowedSkills.join(', ')}" }. The 'name' can be a unique skill (e.g., 'Empathy', 'Counting', 'Jumping'), but the 'category' must be one of the following: ${allowedSkills.map(s => `'${s}'`).join(', ')}. Do not invent new categories. Do not use any other text or explanations outside of the JSON output.Output Format:{ "activity_suggestions": [  {   "Title of Activity": "String",   "Why it works": "String",   "Skills supported": [{"name": "String", "category": "String"}]  } ]}`

/**
 * Gemini AI Generation Configuration
 * 
 * SETTINGS:
 * - maxOutputTokens: 8192 - Sufficient for 5 detailed activities
 * - temperature: 1 - High creativity for diverse activity suggestions
 * - topP: 1 - Full vocabulary access for varied responses
 * - safetySettings: OFF - Educational content doesn't require filtering
 */
const generationConfig = {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 1,
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }    ]
};

/**
 * POST Handler for AI Activity Generation
 * 
 * PROCESS:
 * 1. Extracts prompt and discarded activities from request
 * 2. Builds exclusion list to avoid repeating previous suggestions
 * 3. Combines user input with system prompt for AI processing
 * 4. Streams response from Gemini AI model
 * 5. Parses and validates JSON response structure
 * 
 * ERROR HANDLING:
 * - Missing prompt validation
 * - Google Auth initialization errors
 * - AI response parsing failures
 * - Network/streaming errors
 * 
 */
export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();
        
        /**
         * Process discarded activities to avoid repetition
         * Handles multiple formats: strings, objects with various title properties
         */
        const discardedActivities = body.discardedActivities || [];
        let discardedTitles = [];
        if (Array.isArray(discardedActivities)) {
            discardedTitles = discardedActivities.map(a =>
                typeof a === 'string' ? a : (a['Title of Activity'] || a.title || a.name || '')
            ).filter(Boolean);
        }
        
        /**
         * Build exclusion text for AI prompt
         * Only adds if prompt doesn't already mention these activities
         */
        let otherThanText = '';
        if (discardedTitles.length > 0 && (!body.prompt || !discardedTitles.every(title => body.prompt.includes(title)))) {
            otherThanText = ` Other than: ${discardedTitles.join(', ')}.`;
        }
          // Combine user input with system prompt
        const userInput = body.prompt + otherThanText + " " + activityPrompt;
        console.log('User input for AI:', userInput);
        
        // Validate required fields
        if (!body.prompt) {
            return Response.json({ error: 'Prompt is missing from the request body.' }, { status: 400 });
        }

        // Initialize Google Auth and get AI instance
        const googleAuthClient = await initializeGoogleAuth();
        const ai = getAiInstance(googleAuthClient);

        // Create chat session with configured model
        const chat = ai.chats.create({ model, config: generationConfig });
        
        // Stream AI response for real-time processing
        const stream = await chat.sendMessageStream({ message: { text: userInput } });

        // Collect streamed response chunks
        let fullResponse = '';
        for await (const chunk of stream) {
            if (chunk.text) fullResponse += chunk.text;
        }

        console.log('Response from AI:', fullResponse);
        
        /**
         * Parse and validate AI response
         * Removes markdown code blocks and validates JSON structure
         */
        try {
            const cleaned = fullResponse.replace(/```json|```/gi, '').trim();
            const parsed = JSON.parse(cleaned);
            return Response.json({ response: parsed });
        } catch (e) {
            console.error('JSON parse error from AI:', e.message, '\nRaw response:', fullResponse);
            return Response.json({ error: 'Model did not return valid JSON.' }, { status: 500 });
        }
        
    } catch (err) {
        console.error('Error during AI generation:', err);
        return Response.json({ error: 'Something went wrong during AI generation.' }, { status: 500 });
    }
}