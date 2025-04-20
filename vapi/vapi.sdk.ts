import Vapi from "@vapi-ai/web";
import { env } from "@/config/env";

const vapi = new Vapi(env.VAPI_API_KEY);

vapi.on("speech-start", () => {
    console.log("Vapi speech started");
});

vapi.on("speech-end", () => {
    console.log("Vapi speech stopped");
});

vapi.on("call-start", () => {
    console.log("Vapi call started");
});

vapi.on("call-end", () => {
    console.log("Vapi call ended");
});

// Add method to fetch call logs using the SDK
export const fetchCallLogs = async () => {
    try {
        console.log('Making API call to fetch call logs...');
        const response = await fetch('https://api.vapi.ai/call', {
            method: 'GET',
            headers: {
                'Authorization': env.VAPI_PRIVATE_KEY,
                'Content-Type': 'application/json',
                'x-vapi-version': env.VAPI_API_VERSION,
                'x-vapi-organization': env.VAPI_ORG_ID
            }
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to fetch call logs: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        } else if (data && typeof data === 'object') {
            return [data]; // If single object, wrap in array
        }
        
        console.log('No valid data found in response');
        return [];
    } catch (error) {
        console.error('Error fetching call logs:', error);
        return [];
    }
};

// Add method to fetch a specific call's details
export const fetchCallDetails = async (callId: string) => {
    try {
        const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
            method: 'GET',
            headers: {
                'Authorization': env.VAPI_PRIVATE_KEY,
                'Content-Type': 'application/json',
                'x-vapi-version': env.VAPI_API_VERSION,
                'x-vapi-organization': env.VAPI_ORG_ID
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to fetch call details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('Error fetching call details:', error);
        return null;
    }
};

export default vapi;

