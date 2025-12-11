// anoop840/end-to-end-ai-native-app/End-to-End-Ai-Native-App-abe9c590d0b9a39301bc24e51dd2618ef037fe4c/src/app/api/ai/route.ts
import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the GoogleGenAI client with the API key from environment variables
// The SDK automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

// Define the expected structure for the request body
interface RequestBody {
  prompt: string;
}

// Define the file structure the AI should return
const fileOperationSchema = {
    type: Type.OBJECT,
    properties: {
        fileName: {
            type: Type.STRING,
            description: "The target file path (e.g., src/components/MyComponent.tsx or src/app/page.tsx). For this initial implementation, always set this to 'src/ai-generated-logic.ts'."
        },
        codeSnippet: {
            type: Type.STRING,
            description: "The complete, elegant, and runnable code snippet to be added or used. It should be a standalone component or function, not a diff."
        }
    },
    required: ["fileName", "codeSnippet"]
};

// Define the final JSON response structure
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        message: {
            type: Type.STRING,
            description: "A concise, persuasive message (under 30 words) to the user for the generated code solution, asking for approval or rejection."
        },
        fileOperation: fileOperationSchema
    },
    required: ["message", "fileOperation"]
};

export async function POST(request: Request) {
  try {
    const { prompt }: RequestBody = await request.json();

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // New AI Prompt to enforce structured JSON output
    const aiPrompt = `Review the following user request. Generate an elegant and complete TypeScript/React code solution that addresses the request. The solution should be suitable for a new file at 'src/ai-generated-logic.ts'. Then, create a short message to the user asking for approval.

User Request: ${prompt}

Output a single JSON object that conforms to the provided schema. The 'codeSnippet' field must contain the full, runnable code.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: aiPrompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
      }
    });
    
    // The response text is now a guaranteed JSON string matching the schema
    const jsonResponse = JSON.parse((response.text ?? '').trim());
    
    const { message, fileOperation } = jsonResponse;

    // Return the AI-generated message and code snippet
    return new NextResponse(JSON.stringify({ 
        message, 
        codeSnippet: fileOperation.codeSnippet,
        fileName: fileOperation.fileName // Pass the filename to the frontend
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("AI API Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate AI content. Check server logs." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}