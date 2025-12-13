import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import {promises as fs} from 'fs';
import path from 'path';


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the expected structure for the request body
interface RequestBody {
  prompt: string;
}
async function getProjectContext(): Promise<string> {
    const filePaths = [
        'src/app/globals.css', // Styles and variables
        'src/ai-generated-logic.ts', // Existing example logic
        'src/app/page.tsx',
        'src/components/AICreationForm.tsx', // Main page structure
    ];

    let context = "PROJECT CONTEXT (OUMI RAG DATA):\n\n";

    for (const filePath of filePaths) {
        const absolutePath = path.join(process.cwd(), filePath);
        try {
            const content = await fs.readFile(absolutePath, 'utf-8');
            context += `--- START FILE: ${filePath} ---\n`;
            context += content;
            context += `\n--- END FILE: ${filePath} ---\n\n`;
        } catch (error) {
            console.warn(`RAG Warning: Could not read ${filePath}. Error: ${(error as Error).message}`);
            context += `--- WARNING: Could not read ${filePath} ---\n\n`;
        }
    }
    return context;
}
// Define the file structure the AI should return
const planningSchema = {
    type: Type.OBJECT,
    properties: {
        targetFile: {
            type: Type.STRING,
            description: "The primary file path that will be modified or created (e.g., src/components/MyComponent.tsx or src/ai-generated-logic.ts)."
        },
        componentName: {
            type: Type.STRING,
            description: "A simple, single-word name for the main component/function to be created (e.g., 'DarkModeToggle')."
        },
        dependencies: {
            type: Type.ARRAY,
            description: "A list of new NPM packages or internal components required.",
            items: {
                type: Type.STRING
            }
        },
        architecturalPlan: {
            type: Type.STRING,
            description: "A detailed, step-by-step description of the architectural changes, logic, and component implementation plan to be followed in Phase 2. This is the core output of the strategist agent."
        }
    },
    required: ["targetFile", "componentName", "architecturalPlan", "dependencies"]
};

// Define the final JSON response structure
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        message: {
            type: Type.STRING,
            description: "A concise, persuasive message (under 30 words) to the user for the generated code solution, asking for approval or rejection."
        },
        planningOutput: planningSchema
    },
    required: ["message", "planningOutput"]
};

export async function POST(request: Request) {
  
  try {
    const { prompt }: RequestBody = await request.json();

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const projectContext=await getProjectContext();
    // New AI Prompt to enforce structured JSON output
    const aiPrompt = `Review the following user request. Generate an elegant and complete TypeScript/React code solution that addresses the request. The solution should be suitable for a new file at 'src/ai-generated-logic.ts'. Then, create a short message to the user asking for approval.
${projectContext}
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
    
    // --- NEW ROBUSTNESS CHECKS ---
    if (!response.text) {
        throw new Error("The Gemini API returned an empty response. The model may have failed to generate content or the prompt was blocked.");
    }
    
    let rawResponseText = (response.text ?? '').trim();
    
    // Attempt to strip common markdown delimiters if the model fails to adhere to strict JSON output
    if (rawResponseText.startsWith('```json')) {
        rawResponseText = rawResponseText.substring(7, rawResponseText.lastIndexOf('```')).trim();
    }
    
    const jsonResponse = JSON.parse(rawResponseText);
    
    if (!jsonResponse || !jsonResponse.message || !jsonResponse.planningOutput) {
         throw new Error("AI response was malformed. Missing 'message' or 'planningOutput' field.");
    }
    // --- END ROBUSTNESS CHECKS ---
    
    const { message, planningOutput } = jsonResponse;

    // Return the AI-generated message and code snippet
    return new NextResponse(JSON.stringify({ 
        message, 
        plan: planningOutput,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("AI API Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate AI content. Check server logs." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
