import { NextRequest, NextResponse } from "next/server";
import { get_cocktails } from "@/lib/getCocktailsService";
import { enforceRateLimit } from "@/lib/apiSecurity";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit(req, "ontology-get-cocktails");
  if (rateLimited) return rateLimited;

  try {
    const result = await get_cocktails();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get cocktails error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
