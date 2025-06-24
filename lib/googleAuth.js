import { google } from 'googleapis';

let googleAuthClient = null;

/**
 * Initializes and returns the Google Auth client
 * @returns {Promise<import('google-auth-library').JWT>} Google Auth client
 */
export async function initializeGoogleAuth() {
  if (googleAuthClient) return googleAuthClient;

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing required Google Auth environment variables');
  }

  try {
    googleAuthClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    return googleAuthClient;
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    throw new Error('Failed to initialize Google Auth client');
  }
}

/**
 * Returns an instance of the Google Docs API client
 * @returns {import('googleapis').docs_v1.Docs}
 */
export function getAiInstance() {
  if (!googleAuthClient) {
    throw new Error('Google Auth Client not initialized. Call initializeGoogleAuth() first.');
  }
  
  return google.docs({
    version: 'v1',
    auth: googleAuthClient,
  });
}

/**
 * Returns an instance of the Google Drive API client
 * @returns {import('googleapis').drive_v3.Drive}
 */
export function getDriveInstance() {
  if (!googleAuthClient) {
    throw new Error('Google Auth Client not initialized. Call initializeGoogleAuth() first.');
  }
  
  return google.drive({
    version: 'v3',
    auth: googleAuthClient,
  });
}
