/**
 * Google Credentials Debug Script
 * 
 * Run this script to debug issues with GOOGLE_APPLICATION_CREDENTIALS_JSON
 * 
 * Usage: node debug-credentials.js
 */

// Load environment variables
require('dotenv').config();

function debugCredentials() {
    console.log('🔍 Debugging Google Credentials...\n');
    
    const rawCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (!rawCredentials) {
        console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON not found in environment variables');
        return;
    }
    
    console.log('✅ Environment variable found');
    console.log('📊 Basic Info:');
    console.log(`   - Length: ${rawCredentials.length} characters`);
    console.log(`   - Type: ${typeof rawCredentials}`);
    console.log(`   - Starts with: "${rawCredentials.substring(0, 10)}"`);
    console.log(`   - Ends with: "${rawCredentials.substring(rawCredentials.length - 10)}"`);
    
    // Check for common issues
    console.log('\n🔧 Common Issues Check:');
    
    if (!rawCredentials.startsWith('{')) {
        console.error('❌ Does not start with { (might have extra quotes)');
    } else {
        console.log('✅ Starts with {');
    }
    
    if (!rawCredentials.endsWith('}')) {
        console.error('❌ Does not end with } (might have extra quotes)');
    } else {
        console.log('✅ Ends with }');
    }
    
    if (rawCredentials.includes('\\"')) {
        console.log('⚠️  Contains escaped quotes (might be double-escaped)');
    }
    
    if (rawCredentials.includes('\\n')) {
        console.log('✅ Contains escaped newlines (good for private key)');
    }
    
    // Try to parse
    console.log('\n🧪 Parse Test:');
    try {
        const parsed = JSON.parse(rawCredentials);
        console.log('✅ Successfully parsed as JSON');
        
        // Check required fields
        const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
        requiredFields.forEach(field => {
            if (parsed[field]) {
                console.log(`✅ Has ${field}`);
            } else {
                console.error(`❌ Missing ${field}`);
            }
        });
        
        if (parsed.project_id) {
            console.log(`📋 Project ID: ${parsed.project_id}`);
        }
        
    } catch (error) {
        console.error('❌ JSON Parse Error:', error.message);
        
        // Try with fixing
        try {
            const fixed = rawCredentials.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
            const parsed = JSON.parse(fixed);
            console.log('✅ Successfully parsed with escaping fix');
            console.log('💡 Your credentials need the escaping fix');
        } catch (fixError) {
            console.error('❌ Still failed after escaping fix:', fixError.message);
            
            // Show first JSON error position
            console.log('\n🔍 Detailed Error Analysis:');
            console.log(`Error at position: ${error.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
            
            if (error.message.includes('position')) {
                const position = parseInt(error.message.match(/position (\d+)/)?.[1]) || 0;
                const context = rawCredentials.substring(Math.max(0, position - 20), position + 20);
                console.log(`Context around error: "${context}"`);
                console.log(`Character at error: "${rawCredentials[position]}"`);
            }
        }
    }
    
    console.log('\n💡 Solutions:');
    console.log('1. Ensure your JSON is properly formatted');
    console.log('2. Remove any extra quotes around the entire JSON');
    console.log('3. Make sure newlines in private_key are escaped as \\n');
    console.log('4. Check your deployment platform for JSON escaping issues');
    console.log('5. Try copying the JSON from your Google Cloud service account again');
}

debugCredentials();
