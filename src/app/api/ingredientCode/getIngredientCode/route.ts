import { NextRequest, NextResponse } from "next/server";

import { getIngredientCode } from "@/lib/getIngredientCode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { ingredientName, ingredientType } = body;

    if (ingredientName === "undefined" || ingredientType === "undefined") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await getIngredientCode(ingredientName, ingredientType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ontology update error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
