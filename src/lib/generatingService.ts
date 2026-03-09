import { spawn } from "child_process";
import path from "path";

export async function generateDataFromOntology(
  onto: string,
  name: string,
): Promise<{ updatedOnto: string; updatedViz: string; ingredients: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "prepareOnto.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    onto,
    name,
  };

  const result = await new Promise<string>((resolve, reject) => {
    const python = spawn("python", [scriptPath]);
    let stdout = "";
    let stderr = "";

    python.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    python.stdin?.write(JSON.stringify(input));
    python.stdin?.end();
  });

  const parsed = JSON.parse(result);

  return {
    updatedOnto: parsed.updatedOnto,
    updatedViz: parsed.updatedSvg,
    ingredients: parsed.ingredients,
  };
}
