import { NextRequest, NextResponse } from "next/server";

import { generateOntoAndVizFromOntology } from "@/lib/ontologyService";
import {
  enforceRateLimit,
  enforceWriteApiKey,
  parseBoolean,
  parseJsonBody,
  validateIngredientType,
  validateName,
  validateTextField,
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

    const { ingredientName, ingredientType, active, currentOnto } =
      parsedBody.data;
    const validatedIngredientName = validateName(ingredientName);
    const validatedIngredientType = validateIngredientType(ingredientType);
    const validatedActive = parseBoolean(active);
    const validatedCurrentOnto = validateTextField(currentOnto, 200_000);

    if (
      !validatedIngredientName ||
      !validatedIngredientType ||
      validatedActive === null ||
      !validatedCurrentOnto
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateOntoAndVizFromOntology(
      validatedIngredientName,
      validatedIngredientType,
      validatedActive,
      validatedCurrentOnto,
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
