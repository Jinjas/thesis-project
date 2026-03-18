import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function addIngredientService(
  ingredientName: string,
  ingredientType: string,
  onto: string,
): Promise<{ updatedOnto: string; updatedViz: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "add_ingredient.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    onto,
    ingredient_name: ingredientName,
    ingredient_type: ingredientType,
  };

  const parsed = await runPythonJson<{
    updatedOnto: string;
    updatedSvg: string;
  }>(scriptPath, input);

  return {
    updatedOnto: parsed.updatedOnto,
    updatedViz: parsed.updatedSvg, // SVG como string
  };
}
