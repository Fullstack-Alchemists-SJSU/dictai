import 'dotenv/config';

interface EnvConfig {
    VAPI_API_KEY: string;
    VAPI_ORG_ID: string;
    VAPI_PRIVATE_KEY: string;
    VAPI_ASSISTANT_ID: string;
    VAPI_API_VERSION: string;
}

// Validate required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = [
    'VAPI_API_KEY',
    'VAPI_ORG_ID',
    'VAPI_PRIVATE_KEY',
    'VAPI_ASSISTANT_ID',
    'VAPI_API_VERSION'
];

// Check if all required environment variables are present
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Export validated environment variables
export const env: EnvConfig = {
    VAPI_API_KEY: process.env.VAPI_API_KEY!,
    VAPI_ORG_ID: process.env.VAPI_ORG_ID!,
    VAPI_PRIVATE_KEY: process.env.VAPI_PRIVATE_KEY!,
    VAPI_ASSISTANT_ID: process.env.VAPI_ASSISTANT_ID!,
    VAPI_API_VERSION: process.env.VAPI_API_VERSION!
}; 