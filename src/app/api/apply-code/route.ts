import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { codeSnippet, fileName = 'src/ai-generated-logic.ts' } = await request.json();

    if (!codeSnippet) {
      return NextResponse.json({ error: "Code snippet is required" }, { status: 400 });
    }

    if (fileName.includes('..')) {
       return NextResponse.json({ error: "Invalid file path detected." }, { status: 400 });
    }
    
    // Define the full path for the file (e.g., in the project root)
    const filePath = path.join(process.cwd(), fileName);

    // Write the new content to the file
    await fs.writeFile(filePath, codeSnippet);

    return NextResponse.json({ message: `Successfully applied changes to ${fileName}.` });

  } catch (error) {
    console.error("File write error:", error);
    return NextResponse.json({ error: "Failed to apply code changes to the file system." }, { status: 500 });
  }
}