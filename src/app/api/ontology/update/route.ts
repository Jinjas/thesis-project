import { NextRequest, NextResponse } from "next/server";

import { generateOntoAndVizFromOntology } from "@/lib/ontologyService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { ingredientName, ingredientType, active, currentOnto } = body;

    if (
      ingredientName === "undefined" ||
      ingredientType === "undefined" ||
      typeof active !== "boolean" ||
      typeof currentOnto !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateOntoAndVizFromOntology(
      ingredientName,
      ingredientType,
      active,
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
