import path from "path";

import { runPythonJson } from "@/lib/runPythonJson";

export type CocktailTableResponse = {
  table: {
    section: string;
    title?: string;
    rows: string[][];
  }[];
};

export async function mergeIngredientTables(
  ingredientNames: string[],
): Promise<CocktailTableResponse> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "ingredient",
    "mergeIngredientTables.py",
  );

  return runPythonJson<CocktailTableResponse>(scriptPath, {
    ingredient_names: ingredientNames,
  });
}
