import path from "path";
import { runPythonJson } from "@/lib/runPythonJson";

export type CreateIngredientDefinitionParams = {
  name: string;
  input_type: string;
  fileType: string;
  grammar_text: string;
};

export async function createIngredientDefinition(
  params: CreateIngredientDefinitionParams,
): Promise<{
  updatedCode: string;
}> {
  const scriptPath = path.join(
    process.cwd(),
    "src",
    "python",
    "createIngredientDefinition",
    "centralCall.py",
  );

  const input = {
    name: params.name,
    input_type: params.input_type,
    fileType: params.fileType,
    grammar_text: params.grammar_text,
  };

  const parsed = await runPythonJson<{
    updatedCode: string;
  }>(scriptPath, input);

  return {
    updatedCode: parsed.updatedCode,
  };
}
