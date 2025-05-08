import Vapi from "@vapi-ai/web";

const vapi = new Vapi("50d99ca3-1ff9-4d2a-a1af-4d142e85f7db");

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
                'Authorization': "1dcc6ff4-1e9e-459b-ac02-219f11e67a16",
                'Content-Type': 'application/json',
                'x-vapi-version': "aaaaf259-ead9-461e-a418-daad075a75a0",
                'x-vapi-organization': "2024-06-01"
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
                'Authorization': "1dcc6ff4-1e9e-459b-ac02-219f11e67a16",
                'Content-Type': 'application/json',
                'x-vapi-version': "aaaaf259-ead9-461e-a418-daad075a75a0",
                'x-vapi-organization': "2024-06-01"
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

