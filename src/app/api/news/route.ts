import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// Initialize Rate Limiter (10 requests per 10 seconds per IP)
// Safe fallback if Upstash isn't configured yet
const ratelimit = env.UPSTASH_REDIS_REST_URL 
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
    })
  : null;

const querySchema = z.object({
  category: z.string().default("general"),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // 1. Rate Limiting
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(`ratelimit_news_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }
    }

    // 2. Input Validation
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Bad Request", details: parsed.error.flatten() }, { status: 400 });
    }
    
    const { category, pageSize, q: keyword } = parsed.data;

    // 3. Database Query
    // Note: If keyword is present, we fetch more items to allow for meaningful in-memory filtering
    const fetchLimit = keyword ? Math.min(pageSize * 3, 200) : pageSize;
    
    let queryRef: any = adminDb.collection("articles").orderBy("publishedAt", "desc").limit(fetchLimit);

    if (category !== "all" && category !== "All") {
      queryRef = adminDb.collection("articles")
        .where("category", "==", category)
        .orderBy("publishedAt", "desc")
        .limit(fetchLimit);
    }

    const snapshot = await queryRef.get();

    let articles = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // 4. In-memory Keyword Filtering (Fallback for Firestore missing full-text search)
    if (keyword) {
      const lowKeyword = keyword.toLowerCase();
      articles = articles.filter((a: any) => 
        a.title?.toLowerCase().includes(lowKeyword) || 
        a.description?.toLowerCase().includes(lowKeyword) ||
        a.content?.toLowerCase().includes(lowKeyword)
      ).slice(0, pageSize);
    }

    return NextResponse.json({ articles, total: articles.length, page: 1, pageSize });
  } catch (err: any) {
    console.error("[API_NEWS_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
