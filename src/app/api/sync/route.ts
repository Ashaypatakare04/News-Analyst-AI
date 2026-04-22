import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchAndStoreNews } from "@/lib/newsapi";

export async function GET() {
  try {
    const queriesRef = collection(db, "queries");
    const snapshot = await getDocs(queriesRef);
    
    if (snapshot.empty) {
      // If no custom queries, do a default fetch
      await fetchAndStoreNews("general");
      return NextResponse.json({ message: "No queries found in 'queries' collection. Ran default 'general' sync." });
    }

    const results = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const category = data.category || "general";
      const q = data.q || undefined;
      const pageSize = data.pageSize || 20;
      
      await fetchAndStoreNews(category, q, pageSize);
      results.push({ id: doc.id, category, q });
    }

    return NextResponse.json({ 
      message: `Sync completed for ${results.length} queries.`,
      processed: results
    });
  } catch (err: any) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Sync failed", details: err.message }, { status: 500 });
  }
}
