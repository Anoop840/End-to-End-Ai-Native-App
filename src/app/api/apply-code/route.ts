import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { codeSnippet, fileName = 'src/ai-generated-logic.ts' } = await request.json();

    if (!codeSnippet) {
      return NextResponse.json({ error: "Code snippet is required" }, { status: 400 });
    }

    const requestedPath = path.resolve(path.join(process.cwd(), fileName));
    const projectRoot = path.resolve(process.cwd());

    // 2. Security Check: Ensure the resolved path is a subpath of the project root.
    if (!requestedPath.startsWith(projectRoot)) {
       return NextResponse.json({ error: "Invalid file path detected: attempting to write outside the project directory." }, { status: 400 });
    }
    
    // Write the new content to the file
    await fs.writeFile(requestedPath, codeSnippet);

    return NextResponse.json({ message: `Successfully applied changes to ${fileName}.` });

  } catch (error) {
    console.error("File write error:", error);
    return NextResponse.json({ error: "Failed to apply code changes to the file system." }, { status: 500 });
  }
}