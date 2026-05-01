import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snap = await adminDb.collection("articles").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: snap.id,
      ...snap.data(),
    });
  } catch (error) {
    console.error("Article API Error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
