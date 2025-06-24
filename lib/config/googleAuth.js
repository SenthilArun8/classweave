// server/src/config/googleAuth.js
import { GoogleAuth } from 'google-auth-library';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

let googleAuthClientInstance;
let aiInstance;

export const initializeGoogleAuth = async () => {
    if (googleAuthClientInstance) return googleAuthClientInstance; // Return existing instance if already initialized

    if (process.env.NODE_ENV === 'production') {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
            try {
                const tempFilePath = path.join(os.tmpdir(), 'google-credentials.json');
                fs.writeFileSync(tempFilePath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
                process.env.GOOGLE_APPLICATION_CREDENTIALS = tempFilePath;
                console.log(`Service account credentials loaded from environment variable.`);
                googleAuthClientInstance = new GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                });
            } catch (error) {
                console.error('Error processing GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
                throw new Error('Failed to set up production Google credentials.');
            }
        } else {
            throw new Error('CRITICAL: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not found in production.');
        }
    } else {
        if (process.env.GOOGLE_CREDENTIALS) {
            try {
                const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                googleAuthClientInstance = new GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                });
                console.log('Google credentials loaded from GOOGLE_CREDENTIALS for development.');
            } catch (error) {
                console.error('Error parsing GOOGLE_CREDENTIALS:', error);
                console.warn('⚠️ Falling back to default Google application credentials lookup.');
                googleAuthClientInstance = new GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                });
            }
        } else {
            console.warn('⚠️ GOOGLE_CREDENTIALS env variable is not set for development. Relying on default ADC lookup order.');
            googleAuthClientInstance = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            });
        }
    }
    return googleAuthClientInstance;
};

export const getAiInstance = (authClient) => {
    if (aiInstance) return aiInstance; // Return existing instance if already initialized
    if (!authClient) throw new Error("Google Auth Client not initialized.");

    aiInstance = new GoogleGenAI({
        vertexai: true,
        project: 'gen-lang-client-0993206169',
        location: 'global',
        authClient: authClient,
    });
    return aiInstance;
};