import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

type Ingredient = {
  name: string;
  type: string;
  active: boolean;
};

type Cocktail = {
  name: string;
  updatedOnto: string;
  ingredients: Ingredient[];
  updatedSvg: string;
};

export async function get_cocktails(): Promise<Cocktail[]> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "get_cocktails.py",
  );
  const pythonDir = path.join(process.cwd(), "src", "python", "cocktail");

  const input = {
    path: pythonDir,
  };

  return runPythonJson<Cocktail[]>(scriptPath, input);
}
