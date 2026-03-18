import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function generateDataFromOntology(
  onto: string,
  name: string,
): Promise<{ updatedOnto: string; updatedViz: string; ingredients: string }> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "prepareOnto.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
    onto,
    name,
  };

  const parsed = await runPythonJson<{
    updatedOnto: string;
    updatedSvg: string;
    ingredients: string;
  }>(scriptPath, input);

  return {
    updatedOnto: parsed.updatedOnto,
    updatedViz: parsed.updatedSvg,
    ingredients: parsed.ingredients,
  };
}
