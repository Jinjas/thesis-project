import { NextRequest, NextResponse } from "next/server";

import { updateIngredientOnOntology } from "@/lib/updateOntologyIngredService";
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

    const data = parsedBody.data as Record<string, unknown>;

    const onto = data["onto"] as unknown;
    const newIngredientName = data["newIngredientName"] as unknown;
    const newIngredientType = data["newIngredientType"] as unknown;
    const prevIngredientName = data["prevIngredientName"] as unknown;
    const prevIngredientType = data["prevIngredientType"] as unknown;

    const validatedNewIngredientName = validateName(newIngredientName);
    const validatedNewIngredientType =
      validateIngredientType(newIngredientType);
    const validatedPrevName = validateName(prevIngredientName);
    const validatedPrevType = validateIngredientType(prevIngredientType);
    const validatedCurrentOnto = validateTextField(onto, 200_000);

    if (
      !validatedNewIngredientName ||
      !validatedNewIngredientType ||
      !validatedPrevName ||
      !validatedPrevType ||
      !validatedCurrentOnto
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await updateIngredientOnOntology(
      validatedNewIngredientName,
      validatedNewIngredientType,
      validatedPrevName,
      validatedPrevType,
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
