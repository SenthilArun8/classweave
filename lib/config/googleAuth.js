// Google Auth configuration for Next.js
import { GoogleAuth } from 'google-auth-library';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';

let googleAuthClientInstance;
let aiInstance;

export const initializeGoogleAuth = async () => {
    if (googleAuthClientInstance) return googleAuthClientInstance; // Return existing instance if already initialized

    // Try to use GOOGLE_APPLICATION_CREDENTIALS_JSON first (works for both dev and production)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        try {
            // Parse the JSON credentials, handling potential formatting issues
            let credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.trim();
            
            console.log('Raw credentials string length:', credentialsJson.length);
            console.log('First 100 characters:', credentialsJson.substring(0, 100));
            
            // Make the string valid for JSON.parse() by correctly escaping characters.
            // 1. Escape all backslashes to handle characters like in Windows paths.
            // 2. Replace all newline characters with the '\\n' string literal.
            const fixedCredentialsJson = credentialsJson.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');

            const credentials = JSON.parse(fixedCredentialsJson);
            
            // After parsing, JSON.parse automatically converts the '\\n' string literal to a '\n' newline character.
            // This is the format the Google Auth library expects for the private_key, so no more processing is needed.

            // Validate that we have the required fields
            if (!credentials.type || !credentials.project_id || !credentials.private_key || !credentials.client_email) {
                throw new Error('Invalid credentials format: missing required fields');
            }
            
            console.log('Successfully parsed Google credentials with project_id:', credentials.project_id);
            
            if (process.env.NODE_ENV === 'production') {
                // In production, write to temp file for Google Auth
                const tempFilePath = path.join(os.tmpdir(), 'google-credentials.json');
                fs.writeFileSync(tempFilePath, JSON.stringify(credentials, null, 2));
                process.env.GOOGLE_APPLICATION_CREDENTIALS = tempFilePath;
                console.log(`Service account credentials written to temp file for production.`);
                googleAuthClientInstance = new GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                });
            } else {
                // In development, use credentials directly
                googleAuthClientInstance = new GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                });
                console.log('Google credentials loaded directly for development.');
            }
        } catch (error) {
            console.error('Error processing GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
            console.error('Raw credentials string length:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length);
            console.error('First 100 characters:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.substring(0, 100));
            throw new Error('Failed to parse Google credentials JSON: ' + error.message);
        }
    } else {
        console.warn('⚠️ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not found.');
        console.warn('⚠️ Relying on default Application Default Credentials (ADC) lookup order.');
        googleAuthClientInstance = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
    }
    return googleAuthClientInstance;
};

export const getAiInstance = (authClient) => {
    if (aiInstance) return aiInstance; // Return existing instance if already initialized
    if (!authClient) throw new Error("Google Auth Client not initialized.");

    // Use the project ID from the service account credentials
    const projectId = 'tokyo-botany-461703-d6'; // Your actual project ID from the credentials
    
    aiInstance = new GoogleGenAI({
        vertexai: true,
        project: projectId,
        location: 'us-central1', // Standard Vertex AI location
        authClient: authClient,
    });
    
    console.log('Google Vertex AI instance created for project:', projectId);
    return aiInstance;
};