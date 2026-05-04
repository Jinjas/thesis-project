import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function getIngredientCode(
  ingredientName: string,
  ingredientType: string,
): Promise<{
  updatedCode: string;
  updatedCharacteristics: string;
  updatedExtraData: string;
  table: {
    section: string;
    title?: string;
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

  const parsed = await runPythonJson<{
    updatedCode: string;
    updatedCharacteristics: string;
    updatedExtraData: string;
    table: {
      section: string;
      title?: string;
      rows: string[][];
    }[];
  }>(scriptPath, input);

  return {
    updatedCode: parsed.updatedCode,
    updatedCharacteristics: parsed.updatedCharacteristics,
    updatedExtraData: parsed.updatedExtraData,
    table: parsed.table,
  };
}
