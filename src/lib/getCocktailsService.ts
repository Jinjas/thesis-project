import { spawn } from "child_process";
import path from "path";

type Ingredient = {
  name: string;
  type: string;
  active: boolean;
};

type Cocktail = {
  name: string;
  updatedOnto: string;
  ingredients: Ingredient[];
  updatedSvg: string;
};

export async function get_cocktails(): Promise<Cocktail[]> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "get_cocktails.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
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

  return JSON.parse(result) as Cocktail[];
}
