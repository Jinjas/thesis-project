import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function rem_ingredient(name: string): Promise<{
  ok: boolean;
}> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "ingredient",
    "rem_ingredient.py",
  );

  const input = {
    name: name,
  };

  return runPythonJson<{
    ok: boolean;
  }>(scriptPath, input);
}
