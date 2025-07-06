import { getAiInstance } from '@/lib/config/googleAuth';

// Story generation prompt template
const storyPromptTemplate = (student, context) => `
You are an expert children's story writer specializing in creating engaging, age-appropriate stories for young children.

Create a personalized story based on the following details:

Child's Name: ${student.name}
Age: ${student.age_months} months
Context/Scenario: ${context}

Story Requirements:
1. The story should be engaging and appropriate for a the parents of the child.
2. Follow the provided context as the main theme of the story.
3. Keep the story positive, educational, and fun.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters

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
1. The story should be engaging and appropriate for a the parents of the child.
2. Follow the provided context as the main theme of the story.
3. Keep the story positive, educational, fun and a means to convey the activity to the parent.
4. The story should be between 100-200 words.
5. Include a clear beginning, middle, and end.
6. Be creative in your story but do not digress from the main context too much
7. The purpose of this story is to create a post for the parent for the child to view about what activity their child had done that day in a creative, engaging, and professional manner. 
8. DO NOT create characters

Format the response as a JSON object with the following structure:
{
  "title": "The Title of the Story",
  "content": "The full story content here..."
}
`;

export const generateStory = async (req, res) => {
    const { studentName, age, context, isSampleStory } = req.body;

    if (!context || (isSampleStory === undefined && (!studentName || !age))) {
        return res.status(400).json({ 
            error: isSampleStory 
                ? 'Missing required field: context is required.' 
                : 'Missing required fields: studentName, age, and context are required.'
        });
    }

    try {
        const googleAuthClient = req.app.get('googleAuthClient');
        if (!googleAuthClient) {
            return res.status(500).json({ error: 'Google AI client not initialized.' });
        }
        
        const ai = getAiInstance(googleAuthClient);
        const prompt = isSampleStory
            ? sampleStoryPromptTemplate(context)
            : storyPromptTemplate(
                { name: studentName, age_months: age },
                context
              );

        console.log('Generating story with prompt:', prompt);
        
        const chat = ai.chats.create({ 
            model: 'gemini-2.0-flash-001',
            config: {
                ...generationConfig,
                temperature: 0.8, // Slightly more creative for stories
                topP: 0.9
            } 
        });
        
        const stream = await chat.sendMessageStream({ message: { text: prompt } });

        let fullResponse = '';
        for await (const chunk of stream) {
            if (chunk.text) fullResponse += chunk.text;
        }

        console.log('Raw story response from AI:', fullResponse);
        
        try {
            // Remove all code block markers and trim whitespace
            const cleaned = fullResponse.replace(/```json|```/gi, '').replace(/^[\s\n]+|[\s\n]+$/g, '');
            // Extract only the first {...} block if present
            const match = cleaned.match(/{[\s\S]*}/);
            const jsonString = match ? match[0] : cleaned;
            const parsed = JSON.parse(jsonString);

            if (!parsed.title || !parsed.content) {
                throw new Error('Invalid story format from AI');
            }

            res.json({
                story: {
                    title: parsed.title,
                    content: parsed.content,
                    generatedAt: new Date().toISOString(),
                    context: context,
                    studentName: studentName
                }
            });
        } catch (e) {
            // Fallback: Try to extract title/content manually if JSON.parse fails
            let fallbackTitle = '';
            let fallbackContent = '';
            try {
                const fallbackMatch = fullResponse.match(/{[\s\S]*}/);
                if (fallbackMatch) {
                    const fallbackJson = JSON.parse(fallbackMatch[0]);
                    fallbackTitle = fallbackJson.title || '';
                    fallbackContent = fallbackJson.content || '';
                }
            } catch (fallbackError) {
                // If still fails, just use the raw response as content
                fallbackContent = fullResponse;
            }
            console.error('Error parsing AI response:', e.message, '\nRaw response:', fullResponse);
            res.json({
                story: {
                    title: fallbackTitle || `A Story for ${studentName}`,
                    content: fallbackContent,
                    generatedAt: new Date().toISOString(),
                    context: context,
                    studentName: studentName
                }
            });
        }
    } catch (err) {
        console.error('Error generating story:', err);
        res.status(500).json({ 
            error: 'Failed to generate story. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}