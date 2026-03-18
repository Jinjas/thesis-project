import { NextRequest, NextResponse } from "next/server";

import { setIngredientCode } from "@/lib/setIngredientCode";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateIngredientType,
  validateName,
  validateTextField,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ingredient-set-code");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { ingredientName, ingredientType, newCode } = parsedBody.data;
    const validatedIngredientName = validateName(ingredientName);
    const validatedIngredientType = validateIngredientType(ingredientType);
    const validatedNewCode = validateTextField(newCode, 120_000);

    if (
      !validatedIngredientName ||
      !validatedIngredientType ||
      !validatedNewCode
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await setIngredientCode(
      validatedIngredientName,
      validatedIngredientType,
      validatedNewCode,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ontology update error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
