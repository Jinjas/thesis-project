import { NextResponse } from "next/server";
import { get_cocktails } from "@/lib/getCocktailsService";

export async function GET() {
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
