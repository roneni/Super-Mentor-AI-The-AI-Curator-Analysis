import { NextResponse } from "next/server";
import { refineCuratedContent } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const rawItem = await request.json();
    const refined = await refineCuratedContent(rawItem);
    return NextResponse.json(refined);
  } catch (error) {
    console.error("Refinement failed:", error);
    return NextResponse.json({ error: "Refinement failed" }, { status: 500 });
  }
}
