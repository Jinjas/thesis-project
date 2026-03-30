import { NextRequest, NextResponse } from "next/server";

import { getRemainingIngredients } from "@/lib/getRemainingIngredients";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateName,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ingredient-get-remaining");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { existingIngredientNames } = parsedBody.data;
    if (!Array.isArray(existingIngredientNames)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const validatedNames = existingIngredientNames
      .map((name) => validateName(name))
      .filter((name): name is string => Boolean(name));

    const result = await getRemainingIngredients(validatedNames);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Remaining ingredients error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
