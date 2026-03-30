import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

type RemainingIngredient = {
  name: string;
  type: string;
  updatedCode: string;
  updatedCharacteristics: string;
  updatedExtraData: string;
  table: {
    section: string;
    rows: string[][];
  }[];
};

export async function getRemainingIngredients(
  existingIngredientNames: string[],
): Promise<{ ingredients: RemainingIngredient[] }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "ingredient",
    "getRemainingIngredients.py",
  );

  const parsed = await runPythonJson<{ ingredients: RemainingIngredient[] }>(
    scriptPath,
    {
      existing_names: existingIngredientNames,
    },
  );

  return {
    ingredients: parsed.ingredients,
  };
}