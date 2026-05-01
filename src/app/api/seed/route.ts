import { requireAdminSession } from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { fetchAndStoreNews } from "@/lib/newsapi";

export async function GET() {
  try {
    // 0. Security: Protect seeding route from public access
    await requireAdminSession();

    console.log("Seeding database with general news...");
    await fetchAndStoreNews("general", undefined, 10);
    return NextResponse.json({ message: "Database seeding initiated. Check your Firestore 'articles' collection shortly." });
  } catch (err: any) {
    if (err.message.includes("UNAUTHORIZED") || err.message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Seeding failed", details: err.message }, { status: 500 });
  }
}
