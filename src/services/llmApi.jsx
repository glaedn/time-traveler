// Import the GoogleGenerativeAI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_SECRET_KEY);

// Select the Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Call the model to generate content
export async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text(); // Return the response text
    } catch (error) {
        console.error("Error generating content:", error);
        return null; // Return null in case of an error
    }
}
