import { NextRequest, NextResponse } from "next/server";

import { generateCocktail } from "@/lib/generatingCocktailService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { cocktailName, ingredientName, ingredientType } = body;

    if (
      cocktailName === "undefined" ||
      ingredientName === "undefined" ||
      ingredientType === "undefined"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateCocktail(
      cocktailName,
      ingredientName,
      ingredientType,
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
