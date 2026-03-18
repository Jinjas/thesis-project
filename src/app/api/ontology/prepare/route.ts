import { NextRequest, NextResponse } from "next/server";

import { generateDataFromOntology } from "@/lib/generatingService";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseJsonBody,
  validateName,
  validateTextField,
} from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ontology-prepare");
  if (rateLimited) return rateLimited;

  const unauthorized = enforceWriteApiKey(req);
  if (unauthorized) return unauthorized;

  try {
    const parsedBody = await parseJsonBody(req);
    if ("response" in parsedBody) return parsedBody.response;

    const { currentOnto, cocktailName } = parsedBody.data;
    const validatedCocktailName = validateName(cocktailName);
    const validatedCurrentOnto = validateTextField(currentOnto, 200_000);

    if (!validatedCocktailName || !validatedCurrentOnto) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateDataFromOntology(
      validatedCurrentOnto,
      validatedCocktailName,
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
