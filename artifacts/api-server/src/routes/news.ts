import { Router, type IRouter } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetNewsQueryParams,
  GetArticleParams,
  SummarizeArticleParams,
  VerifyArticleParams,
  GenerateAudioParams,
  TranslateArticleParams,
  TranslateArticleBody,
} from "@workspace/api-zod";
import { fetchAndStoreNews, getArticlesFromDb } from "../services/newsapi.js";
import {
  generateSummary,
  verifyArticle,
  generateAudioForArticle,
  translateArticle,
} from "../services/ai.js";

const router: IRouter = Router();

const CATEGORIES = [
  "all",
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

router.get("/categories", (_req, res) => {
  res.json({ categories: CATEGORIES });
});

router.get("/news", async (req, res) => {
  try {
    const parsed = GetNewsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const category = (params.category as string) || "general";
    const q = params.q as string | undefined;
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 20;

    await fetchAndStoreNews(category === "all" ? "general" : category);

    const result = await getArticlesFromDb(category, q, page, pageSize);

    const articles = result.articles.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      imageUrl: a.imageUrl,
      source: a.source,
      author: a.author,
      publishedAt: a.publishedAt,
      category: a.category,
      aiSummary: a.aiSummary,
      bulletPoints: a.bulletPoints,
      timeline: a.timeline,
      trustScore: a.trustScore,
      trustDetails: a.trustDetails,
      audioUrl: a.audioUrl,
      createdAt: a.createdAt.toISOString(),
    }));

    res.json({
      articles,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

router.get("/news/:id", async (req, res) => {
  try {
    const parsed = GetArticleParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, parsed.data.id))
      .limit(1);

    if (!articles[0]) {
      return res.status(404).json({ error: "Article not found" });
    }

    const a = articles[0];
    res.json({
      id: a.id,
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      imageUrl: a.imageUrl,
      source: a.source,
      author: a.author,
      publishedAt: a.publishedAt,
      category: a.category,
      aiSummary: a.aiSummary,
      bulletPoints: a.bulletPoints,
      timeline: a.timeline,
      trustScore: a.trustScore,
      trustDetails: a.trustDetails,
      audioUrl: a.audioUrl,
      createdAt: a.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get article" });
  }
});

router.post("/news/:id/summarize", async (req, res) => {
  try {
    const parsed = SummarizeArticleParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid article ID" });
    }
    const result = await generateSummary(parsed.data.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/news/:id/verify", async (req, res) => {
  try {
    const parsed = VerifyArticleParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid article ID" });
    }
    const result = await verifyArticle(parsed.data.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify article" });
  }
});

router.post("/news/:id/audio", async (req, res) => {
  try {
    const parsed = GenerateAudioParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid article ID" });
    }
    const result = await generateAudioForArticle(parsed.data.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

router.post("/news/:id/translate", async (req, res) => {
  try {
    const paramsParsed = TranslateArticleParams.safeParse({ id: Number(req.params.id) });
    const bodyParsed = TranslateArticleBody.safeParse(req.body);

    if (!paramsParsed.success || !bodyParsed.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const result = await translateArticle(
      paramsParsed.data.id,
      bodyParsed.data.targetLanguage
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to translate article" });
  }
});

export default router;
