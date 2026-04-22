import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is missing from .env.local");
}

// Use gemini-2.0-flash for the latest production stability
export const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});

// For Vision tasks
export const geminiVisionModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});
