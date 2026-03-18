import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function generateOntoAndVizFromOntology(
  ingredientName: string,
  ingredientType: string,
  active: boolean,
  onto: string,
): Promise<{ updatedOnto: string; updatedViz: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "updateOnto.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    onto,
    ingredient_name: ingredientName,
    ingredient_type: ingredientType,
    active,
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
