import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({});

// Define the expected input structure from the approved plan (Phase 1 Output)
interface RequestBody {
    plan: {
        targetFile: string;
        componentName: string;
        dependencies: string[];
        architecturalPlan: string;
    };
}

// Define the final output structure the AI should return (Developer Agent output)
const fileOperationSchema = {
    type: Type.OBJECT,
    properties: {
        fileName: {
            type: Type.STRING,
            description: "The target file path (e.g., src/components/MyComponent.tsx or src/ai-generated-logic.ts)."
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
            description: "A concise message (under 30 words) to the user for the generated code solution, asking for approval or rejection (CodeRabbit simulation)."
        },
        fileOperation: fileOperationSchema
    },
    required: ["message", "fileOperation"]
};

export async function POST(request: Request) {
    try {
        const { plan }: RequestBody = await request.json();

        if (!plan || !plan.architecturalPlan) {
            return new NextResponse(JSON.stringify({ error: "Architectural plan is missing" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { targetFile, componentName, dependencies, architecturalPlan } = plan;

        // Developer Agent Prompt
        const aiPrompt = `You are the 'Developer Agent'. Your task is to generate the complete, ready-to-use TypeScript/React code to implement the following architectural plan.

ARCHITECTURAL PLAN (FROM Strategist Agent):
- Target File: ${targetFile}
- Component Name: ${componentName}
- Dependencies to consider: ${dependencies.join(', ') || 'None'}
- Detailed Plan: ${architecturalPlan}

Generate the actual, full, runnable TypeScript/React code snippet that fulfills this plan. Use the project's existing Tailwind CSS conventions where possible. The 'fileName' must be exactly '${targetFile}'.

Output a single JSON object that conforms to the provided schema. The 'codeSnippet' field must contain the full, runnable code.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: aiPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        
        if (!response.text) {
            throw new Error("The Gemini API returned an empty response.");
        }

        let rawResponseText = (response.text ?? '').trim();
        if (rawResponseText.startsWith('```json')) {
            rawResponseText = rawResponseText.substring(7, rawResponseText.lastIndexOf('```')).trim();
        }

        const jsonResponse = JSON.parse(rawResponseText);
        
        const { message, fileOperation } = jsonResponse;

        // Return the final code snippet (Phase 2 Output)
        return new NextResponse(JSON.stringify({ 
            message, 
            codeSnippet: fileOperation.codeSnippet,
            fileName: fileOperation.fileName
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Developer Agent API Error:", error);
        return new NextResponse(JSON.stringify({ error: `Developer Agent failed. Original Error: ${error.message || error.stack}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}