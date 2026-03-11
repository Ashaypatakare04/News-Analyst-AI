import axios from "axios";
import { db, articlesTable } from "@workspace/db";
import { eq, desc, like, or, sql } from "drizzle-orm";
import type { InsertArticle } from "@workspace/db";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE = "https://newsapi.org/v2";

interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  author: string | null;
  publishedAt: string;
}

export async function fetchAndStoreNews(category = "general", pageSize = 20) {
  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY not set — returning stored articles only");
    return;
  }

  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category,
        pageSize,
        language: "en",
      },
    });

    const articles: NewsApiArticle[] = response.data.articles || [];

    for (const a of articles) {
      if (!a.title || a.title === "[Removed]") continue;

      const existing = await db
        .select({ id: articlesTable.id })
        .from(articlesTable)
        .where(eq(articlesTable.url, a.url))
        .limit(1);

      if (existing.length > 0) continue;

      const insert: InsertArticle = {
        title: a.title,
        description: a.description || "",
        content: a.content || a.description || "",
        url: a.url,
        imageUrl: a.urlToImage,
        source: a.source?.name || "Unknown",
        author: a.author,
        publishedAt: a.publishedAt,
        category,
      };

      await db.insert(articlesTable).values(insert).onConflictDoNothing();
    }
  } catch (err) {
    console.error("NewsAPI error:", err);
  }
}

export async function getArticlesFromDb(
  category?: string,
  q?: string,
  page = 1,
  pageSize = 20
) {
  const offset = (page - 1) * pageSize;

  let query = db.select().from(articlesTable);

  const conditions = [];
  if (category && category !== "all") {
    conditions.push(eq(articlesTable.category, category));
  }
  if (q) {
    conditions.push(
      or(
        like(articlesTable.title, `%${q}%`),
        like(articlesTable.description, `%${q}%`)
      )
    );
  }

  const results = await db
    .select()
    .from(articlesTable)
    .where(conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`) : undefined)
    .orderBy(desc(articlesTable.createdAt))
    .limit(pageSize)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(articlesTable)
    .where(conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`) : undefined);

  return {
    articles: results,
    total: Number(countResult[0]?.count ?? 0),
    page,
    pageSize,
  };
}
