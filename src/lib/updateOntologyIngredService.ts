import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function updateIngredientOnOntology(
  ingredientName: string,
  ingredientType: string,
  prevName: string,
  prevType: string,
  onto: string,
): Promise<{ updatedOnto: string; updatedViz: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "updateIngredientOnOnto.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    onto,
    new_ingredient: ingredientName,
    new_ingredient_type: ingredientType,
    prev_ingredient: prevName,
    prev_ingredient_type: prevType,
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
