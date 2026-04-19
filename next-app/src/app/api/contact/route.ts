import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Log contact submissions server-side for now
    // TODO: Wire to email service or database for production
    console.log("[Contact Form Submission]", {
      name: body.name,
      email: body.email,
      plan: body.plan,
      message: body.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
