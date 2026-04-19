import { NextResponse } from "next/server";
import { generateBrandMascot } from "@/lib/gemini";

export async function POST() {
  try {
    const url = await generateBrandMascot();
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Mascot generation failed:", error);
    return NextResponse.json({ error: "Mascot generation failed" }, { status: 500 });
  }
}
