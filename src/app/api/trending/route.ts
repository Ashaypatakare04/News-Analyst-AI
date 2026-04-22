import { NextResponse } from "next/server";
import { generateTrending } from "@/lib/ai";

export async function GET() {
  try {
    const data = await generateTrending();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Trending API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trending topics" }, { status: 500 });
  }
}
