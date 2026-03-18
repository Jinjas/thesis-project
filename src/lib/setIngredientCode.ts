import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function setIngredientCode(
  ingredientName: string,
  ingredientType: string,
  newCode: string,
): Promise<{
  onto: string;
  extraData: string;
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
    "setIngredientOnto.py",
  );

  const input = {
    ingredient_name: ingredientName,
    ingredient_type: ingredientType,
    newCode: newCode,
  };

  const parsed = await runPythonJson<{
    onto: string;
    extraData: string;
    table: {
      section: string;
      rows: string[][];
    }[];
  }>(scriptPath, input);

  return {
    onto: parsed.onto,
    extraData: parsed.extraData,
    table: parsed.table,
  };
}
