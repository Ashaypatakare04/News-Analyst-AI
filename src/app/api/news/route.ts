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
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
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
    
    const { category, pageSize } = parsed.data;

    // 3. Database Query (Using Admin SDK securely)
    let q: any = adminDb.collection("articles").orderBy("publishedAt", "desc").limit(pageSize);

    if (category !== "all" && category !== "All") {
      q = adminDb.collection("articles")
        .where("category", "==", category)
        .orderBy("publishedAt", "desc")
        .limit(pageSize);
    }

    // Explicitly NO try/catch around get() to force missing index errors to surface in server logs
    const snapshot = await q.get();

    const articles = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ articles, total: articles.length, page: 1, pageSize });
  } catch (err: any) {
    console.error("[API_NEWS_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
