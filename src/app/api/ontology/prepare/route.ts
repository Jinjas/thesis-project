import { NextRequest, NextResponse } from "next/server";

import { generateDataFromOntology } from "@/lib/generatingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { currentOnto } = body;

    if (typeof currentOnto !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await generateDataFromOntology(currentOnto);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ontology update error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
