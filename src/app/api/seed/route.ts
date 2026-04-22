import { NextResponse } from "next/server";
import { fetchAndStoreNews } from "@/lib/newsapi";

export async function GET() {
  try {
    console.log("Seeding database with general news...");
    await fetchAndStoreNews("general", undefined, 10);
    return NextResponse.json({ message: "Database seeding initiated. Check your Firestore 'articles' collection shortly." });
  } catch (err: any) {
    return NextResponse.json({ error: "Seeding failed", details: err.message }, { status: 500 });
  }
}
