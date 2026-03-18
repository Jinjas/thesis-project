import { NextRequest, NextResponse } from "next/server";

import { generateCocktail } from "@/lib/generatingCocktailService";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateIngredientType,
  validateName,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ontology-generate");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { cocktailName, ingredientName, ingredientType } = parsedBody.data;
    const validatedCocktailName = validateName(cocktailName);
    const validatedIngredientName = validateName(ingredientName);
    const validatedIngredientType = validateIngredientType(ingredientType);

    if (
      !validatedCocktailName ||
      !validatedIngredientName ||
      !validatedIngredientType
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateCocktail(
      validatedCocktailName,
      validatedIngredientName,
      validatedIngredientType,
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
