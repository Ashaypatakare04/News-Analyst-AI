import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleRef = doc(db, "articles", id);
    const snap = await getDoc(articleRef);

    if (!snap.exists()) {
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
