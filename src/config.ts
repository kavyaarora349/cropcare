
// Logic to determine the API URL based on the environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

console.log("Using API URL:", API_BASE_URL); // Debugging help
