import { NextResponse } from "next/server";
import { discoverTrendingAINews } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const filters = await request.json();
    const items = await discoverTrendingAINews(filters);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Discovery failed:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
