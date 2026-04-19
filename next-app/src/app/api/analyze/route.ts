import { NextResponse } from "next/server";
import { getMarketAnalysis } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { ideaDescription } = await request.json();
    const result = await getMarketAnalysis(ideaDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Market analysis failed:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
