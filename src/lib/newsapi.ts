import axios from "axios";
import { db } from "./firebase";
import { collection, query, where, limit, getDocs, setDoc, doc, orderBy } from "firebase/firestore";
import { generateSummary } from "./ai/index"; // updated path

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

export async function fetchAndStoreNews(category = "general", q?: string, pageSize = 20) {
  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY not set — returning stored articles only");
    return;
  }

  try {
    const params: any = {
      apiKey: NEWS_API_KEY,
      pageSize,
      language: "en",
    };

    if (q) {
      params.q = q;
    } else {
      params.category = category;
    }

    const endpoint = q ? `${NEWS_API_BASE}/everything` : `${NEWS_API_BASE}/top-headlines`;

    const response = await axios.get(endpoint, { params });

    const articles: NewsApiArticle[] = response.data.articles || [];
    const newIds: string[] = [];

    const articlesRef = collection(db, "articles");

    for (const a of articles) {
      if (!a.title || a.title === "[Removed]") continue;

      // Check if URL exists
      const q = query(articlesRef, where("url", "==", a.url), limit(1));
      const existing = await getDocs(q);

      if (!existing.empty) continue;

      // Make a simple hash/id for document
      const docId = btoa(unescape(encodeURIComponent(a.url))).replace(/[=/+]/g, '').substring(0, 20);

      const insert = {
        title: a.title,
        description: a.description || "",
        content: a.content || a.description || "",
        url: a.url,
        imageUrl: a.urlToImage,
        source: a.source?.name || "Unknown",
        author: a.author,
        publishedAt: a.publishedAt,
        category,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(articlesRef, docId), insert, { merge: true });
      newIds.push(docId);
    }

    if (newIds.length > 0) {
      console.log(`Auto-summarizing ${newIds.length} new article(s)...`);
      for (const id of newIds.slice(0, 5)) {
        generateSummary(id).catch((err) =>
          console.warn(`Auto-summarize failed for article ${id}:`, err?.message)
        );
      }
    }
  } catch (err) {
    console.error("NewsAPI error:", err);
  }
}

export async function getArticlesFromDb(
  category?: string,
  qParam?: string,
  page = 1,
  pageSize = 20
) {
  // Simple version without full pagination logic for NoSQL
  const articlesRef = collection(db, "articles");
  let queries: any[] = [limit(pageSize), orderBy("createdAt", "desc")];

  if (category && category !== "all" && category !== "All") {
    queries.push(where("category", "==", category));
  }

  const q = query(articlesRef, ...queries);
  const results = await getDocs(q);
  
  const articles = results.docs.map(d => ({ id: d.id, ...d.data() }));

  // Basic in-memory pseudo-search for Firestore (since full text search requires Algolia/Elastic)
  const filtered = qParam 
    ? articles.filter((a: any) => 
        (a.title?.toLowerCase().includes(qParam.toLowerCase()) || 
         a.description?.toLowerCase().includes(qParam.toLowerCase()))
      )
    : articles;

  return {
    articles: filtered,
    total: filtered.length, // approximation
    page,
    pageSize,
  };
}
