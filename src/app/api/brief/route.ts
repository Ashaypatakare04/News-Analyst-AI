import { NextResponse } from "next/server";
import { generateDailyBrief } from "@/lib/ai";

export async function GET() {
  try {
    const data = await generateDailyBrief();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Daily Brief Error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily brief" },
      { status: 500 }
    );
  }
}
