import { spawn } from "child_process";
import path from "path";

export async function getIngredientCode(
  ingredientName: string,
  ingredientType: string,
): Promise<{
  updatedCode: string;
  updatedCharacteristics: string;
  updatedExtraData: string;
  table: {
    section: string;
    rows: string[][];
  }[];
}> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "ingredient",
    "getIngredientOnto.py",
  );

  const input = {
    ingredient_name: ingredientName,
    ingredient_type: ingredientType,
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
    updatedCode: parsed.updatedCode,
    updatedCharacteristics: parsed.updatedCharacteristics,
    updatedExtraData: parsed.updatedExtraData,
    table: parsed.table,
  };
}
