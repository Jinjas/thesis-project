import { NextRequest, NextResponse } from "next/server";

import { mergeIngredientTables } from "@/lib/mergeIngredientTables";
import {
  enforceRateLimit,
  parseJsonBody,
  validateName,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ingredient-get-cocktail-table");
  if (rateLimited) return rateLimited;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { ingredientNames } = parsedBody.data;
    if (!Array.isArray(ingredientNames)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const validatedIngredientNames = ingredientNames
      .map((ingredientName) => validateName(ingredientName))
      .filter((ingredientName): ingredientName is string =>
        Boolean(ingredientName),
      );

    if (validatedIngredientNames.length !== ingredientNames.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await mergeIngredientTables(validatedIngredientNames);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get cocktail table error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
