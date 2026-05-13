import { NextRequest, NextResponse } from "next/server";

import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateIngredientType,
  validateName,
  validateTextField,
} from "@/lib/apiSecurity";
import {
  createIngredientDefinition,
  type CreateIngredientDefinitionParams,
} from "@/lib/createIngredientDefinition";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ingredient-get-code");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const data = parsedBody.data;
    const name = validateName(data.name);
    const inputType = validateIngredientType(data.input_type);
    const fileType = validateName(data.fileType);
    const grammarText = validateTextField(data.grammar_text, 120_000);

    if (!name || !inputType || !fileType || !grammarText) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const params: CreateIngredientDefinitionParams = {
      name,
      input_type: inputType,
      fileType,
      grammar_text: grammarText,
    };

    const result = await createIngredientDefinition(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ontology update error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
