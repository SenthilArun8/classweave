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
            console.log('Last 100 characters:', credentialsJson.substring(credentialsJson.length - 100));
            
            // Check if the string starts and ends with proper JSON brackets
            if (!credentialsJson.startsWith('{') || !credentialsJson.endsWith('}')) {
                console.error('❌ Credentials JSON does not start with { or end with }');
                throw new Error('Invalid JSON format: must start with { and end with }');
            }
            
            // Remove any potential BOM or invisible characters
            credentialsJson = credentialsJson.replace(/^\uFEFF/, '');
            
            // Try to parse the JSON directly first
            let credentials;
            try {
                credentials = JSON.parse(credentialsJson);
            } catch (directParseError) {
                console.log('Direct parse failed, trying with escaping fix...');
                
                // If direct parsing fails, try with the escaping fix
                const fixedCredentialsJson = credentialsJson.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
                credentials = JSON.parse(fixedCredentialsJson);
            }
            
            // Validate that we have the required fields
            if (!credentials.type || !credentials.project_id || !credentials.private_key || !credentials.client_email) {
                throw new Error('Invalid credentials format: missing required fields (type, project_id, private_key, client_email)');
            }
            
            console.log('✅ Successfully parsed Google credentials with project_id:', credentials.project_id);
            
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
            console.error('❌ Error processing GOOGLE_APPLICATION_CREDENTIALS_JSON:', error.message);
            console.error('Raw credentials info:');
            console.error('- Length:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length);
            console.error('- Type:', typeof process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
            console.error('- Starts with:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.substring(0, 10));
            console.error('- Ends with:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.substring(-10));
            
            // Additional debugging for production
            if (process.env.NODE_ENV === 'production') {
                console.error('❌ Production environment detected. Common issues:');
                console.error('1. Ensure the environment variable contains valid JSON');
                console.error('2. Check for extra quotes or escaping in your deployment platform');
                console.error('3. Verify the JSON is properly formatted without line breaks');
            }
            
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