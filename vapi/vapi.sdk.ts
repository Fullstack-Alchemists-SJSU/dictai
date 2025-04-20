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

export default vapi;
