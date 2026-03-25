import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export async function rem_cocktail(name: string): Promise<{
  ok: boolean;
}> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "cocktail",
    "rem_cocktail.py",
  );

  const input = {
    name: name,
  };

  return runPythonJson<{
    ok: boolean;
  }>(scriptPath, input);
}
