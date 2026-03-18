import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function generateCocktail(
  cocktailName: string,
  ingredientName: string,
  ingredientType: string,
): Promise<{ updatedOnto: string; updatedViz: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "generate_onto.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    cocktail_name: cocktailName,
    ingredient_name: ingredientName,
    ingredient_type: ingredientType,
  };

  const parsed = await runPythonJson<{
    updatedOnto: string;
    updatedSvg: string;
  }>(scriptPath, input);

  return {
    updatedOnto: parsed.updatedOnto,
    updatedViz: parsed.updatedSvg,
  };
}
