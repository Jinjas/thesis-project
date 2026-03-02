import { NextRequest, NextResponse } from "next/server";

import { setIngredientCode } from "@/lib/setIngredientCode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { ingredientName, newOnto } = body;

    if (ingredientName === "undefined" || typeof newOnto !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await setIngredientCode(ingredientName, newOnto);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ontology update error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
