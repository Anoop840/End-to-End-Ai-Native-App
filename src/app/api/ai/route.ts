import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the GoogleGenAI client with the API key from environment variables
// The SDK automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

// Define the expected structure for the request body
interface RequestBody {
  prompt: string;
}

export async function POST(request: Request) {
  try {
    const { prompt }: RequestBody = await request.json();

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // --- AI GENERATION LOGIC: Generate Code Snippet ---

    // Define the AI request based on the user's prompt
    const aiPrompt = `Review the following user text and propose an elegant solution as a single block of TypeScript or JavaScript code. The proposal must be a complete, runnable code snippet.

User Request: ${prompt}

Proposed Solution (Code Snippet):`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using a powerful model for code generation
      contents: aiPrompt,
    });
    
    // Extract the generated code snippet from the AI response
    // Simple heuristic to extract a code block (assuming it starts and ends with ```)
    const fullText = response.text.trim();
    
    const codeMatch = fullText.match(/```(?:[a-zA-Z]+\n)?([\s\S]*?)```/);
    const codeSnippet = codeMatch ? codeMatch[1].trim() : fullText;
    
    // --- AI GENERATION LOGIC: Generate Review Message ---
    
    const messageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a concise, persuasive message (under 30 words) to the user for the generated code solution. The message should ask for approval or rejection of the proposed solution. 
        
Proposed Solution: ${codeSnippet}
        
Message:`,
    });

    const message = messageResponse.text.trim();

    // Return the AI-generated message and code snippet
    return new NextResponse(JSON.stringify({ message, codeSnippet }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("AI API Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate AI content. Check server logs." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}