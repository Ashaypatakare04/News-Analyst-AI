import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit, orderBy, where } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const pageSize = Number(searchParams.get("pageSize")) || 20;

    const newsRef = collection(db, "articles");
    let q = query(newsRef, orderBy("publishedAt", "desc"), limit(pageSize));

    if (category !== "all" && category !== "All") {
      q = query(newsRef, where("category", "==", category), orderBy("publishedAt", "desc"), limit(pageSize));
    }

    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
    } catch (err: any) {
      if (err.code === "failed-precondition" || err.message?.includes("index")) {
        console.warn("Firestore index error — falling back to unindexed query");
        // Fallback: remove ordering to avoid index requirement if index is missing
        const fallbackQ = query(newsRef, limit(pageSize));
        querySnapshot = await getDocs(fallbackQ);
      } else {
        throw err;
      }
    }

    let articles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // AUTO-SYNC: If database is empty, trigger a background fetch
    if (articles.length === 0 && (category === "all" || category === "All" || category === "general")) {
      const { fetchAndStoreNews } = await import("@/lib/newsapi");
      // Run sync in background (not awaiting to avoid blocking the first response)
      fetchAndStoreNews(category === "All" ? "general" : category).catch(e => console.error("Auto-sync failed:", e));
    }

    return NextResponse.json({
      articles,
      total: articles.length,
      page: 1,
      pageSize,
    });
  } catch (err: any) {
    console.error("Failed to fetch news:", err);
    const isIndexError = err.message?.includes("index") || err.code === "failed-precondition";
    return NextResponse.json({ 
      error: "Failed to fetch news", 
      details: err.message,
      isIndexError
    }, { status: 500 });
  }
}
