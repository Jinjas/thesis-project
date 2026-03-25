import { NextRequest, NextResponse } from "next/server";
import { rem_cocktail } from "@/lib/remCocktailsService";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateName,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ontology-update");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { cocktailName } = parsedBody.data;
    const validatedCocktailName = validateName(cocktailName);

    if (!validatedCocktailName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await rem_cocktail(validatedCocktailName);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get cocktails error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
