import { NextRequest, NextResponse } from "next/server";
import { rem_ingredient } from "@/lib/remIngredientService";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateName,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ingredient-remove");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { ingredientName } = parsedBody.data;
    const validatedIngredientName = validateName(ingredientName);

    if (!validatedIngredientName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await rem_ingredient(validatedIngredientName);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Remove ingredient error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
