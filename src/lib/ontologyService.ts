import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export async function generateOntoAndVizFromOntology(
  ingredientName: string,
  ingredientType: string,
  active: boolean,
  onto: string,
): Promise<{ updatedOnto: string; updatedViz: string }> {
  const scriptPath = path.join(process.cwd(), "src", "python", "updateOnto.py");

  const { stdout } = await execFileAsync("python3", [
    scriptPath,
    onto,
    ingredientName,
    ingredientType,
    String(active),
  ]);

  const parsed = JSON.parse(stdout);

  return {
    updatedOnto: parsed.updatedOnto,
    updatedViz: parsed.updatedSvg, // SVG como string
  };
}
