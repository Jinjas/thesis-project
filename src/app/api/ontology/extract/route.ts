import { NextResponse } from "next/server";
import { execFileSync } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const onto = body?.onto;
    if (!onto) {
      return NextResponse.json(
        { error: 'Missing "onto" in request body' },
        { status: 400 },
      );
    }

    const scriptPath = path.join(
      process.cwd(),
      "src",
      "python",
      "extract_ingredients.py",
    );
    const pythonCmd = process.env.PYTHON || "python";

    const result = execFileSync(pythonCmd, [scriptPath], {
      input: onto,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });

    const data = JSON.parse(result);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error extracting ingredients from ontology", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
