import { NextResponse } from "next/server";
import { generateIntelligence } from "@/lib/ai";

export async function GET() {
  try {
    const data = await generateIntelligence();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Intelligence API Error:", error);
    return NextResponse.json({ error: "Failed to generate intelligence" }, { status: 500 });
  }
}
