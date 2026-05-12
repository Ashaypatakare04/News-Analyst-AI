import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentsSnap = await adminDb
      .collection("articles")
      .doc(id)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .get();

    const comments = commentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments API GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, userId, userName, userPhotoUrl } = body;

    if (!text || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newComment = {
      text,
      userId,
      userName,
      userPhotoUrl: userPhotoUrl || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb
      .collection("articles")
      .doc(id)
      .collection("comments")
      .add(newComment);

    return NextResponse.json({ 
      comment: {
        id: docRef.id,
        ...newComment
      } 
    }, { status: 201 });
  } catch (error) {
    console.error("Comments API POST Error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
