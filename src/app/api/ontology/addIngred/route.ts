import { NextRequest, NextResponse } from "next/server";

import { addIngredientService } from "@/lib/addIngredService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { ingredientName, ingredientType, currentOnto } = body;

    if (
      ingredientName === "undefined" ||
      ingredientType === "undefined" ||
      typeof currentOnto !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await addIngredientService(
      ingredientName,
      ingredientType,
      currentOnto,
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
