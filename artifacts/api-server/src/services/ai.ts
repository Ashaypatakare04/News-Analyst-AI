import { openai } from "@workspace/integrations-openai-ai-server";
import { db, articlesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

export async function generateSummary(articleId: number) {
  const article = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, articleId))
    .limit(1);

  if (!article[0]) throw new Error("Article not found");

  const a = article[0];

  if (a.aiSummary && a.bulletPoints && a.bulletPoints.length > 0) {
    return {
      summary: a.aiSummary,
      bulletPoints: a.bulletPoints,
      actors: a.actors ?? [],
      timeline: a.timeline ?? [],
    };
  }

  const text = `Title: ${a.title}\n\nSource: ${a.source}\n\nContent: ${a.content || a.description}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You are a senior news analyst. Analyze the article and return structured JSON:
{
  "summary": "2-3 sentence paragraph summary explaining the key story",
  "bulletPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "actors": ["Company or person 1", "Company or person 2"],
  "timeline": [{"date": "date or period", "event": "what happened at this point"}]
}

Rules:
- summary: clear, informative prose, not bullet points
- bulletPoints: distinct insights, not rephrasing the summary
- actors: companies, governments, people, organizations directly involved
- timeline: chronological order, extract from article content`,
      },
      { role: "user", content: text },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  await db
    .update(articlesTable)
    .set({
      aiSummary: result.summary,
      bulletPoints: result.bulletPoints,
      actors: result.actors,
      timeline: result.timeline,
    })
    .where(eq(articlesTable.id, articleId));

  return {
    summary: result.summary as string,
    bulletPoints: result.bulletPoints as string[],
    actors: result.actors as string[],
    timeline: result.timeline as { date: string; event: string }[],
  };
}

export async function verifyArticle(articleId: number) {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, articleId))
    .limit(1);

  if (!articles[0]) throw new Error("Article not found");

  const a = articles[0];

  const relatedArticles = await db
    .select({ title: articlesTable.title, source: articlesTable.source, url: articlesTable.url })
    .from(articlesTable)
    .limit(15);

  const relatedSources = relatedArticles.map((r) => `${r.source}: ${r.title}`).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You are a senior fact-checking journalist. Deeply analyze this article's credibility. Return JSON:
{
  "trustScore": "Low" | "Medium" | "High",
  "trustPercentage": <integer 0-100>,
  "mainClaim": "The primary verifiable claim this article makes",
  "reasoning": "2-3 sentence analysis of credibility",
  "agreementLevel": "Low" | "Medium" | "High",
  "sources": ["specific fact or claim that is corroborated"],
  "contradictions": ["specific contradiction or flag found"]
}

Trust score logic:
- High (75-100%): Reputable outlet, verifiable facts, corroborated by multiple sources, no sensationalism
- Medium (40-74%): Some unverified claims, limited corroboration, minor inconsistencies
- Low (0-39%): Unverifiable claims, single anonymous source, sensationalist language, contradictions

Agreement level:
- High: Claims align well with other indexed articles
- Medium: Partial alignment with some divergence
- Low: Claims contradict or are absent from other sources`,
      },
      {
        role: "user",
        content: `Article to verify:\nTitle: ${a.title}\nSource: ${a.source}\nContent: ${a.content || a.description}\n\nOther articles in database for cross-reference:\n${relatedSources}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  const trustDetails = {
    score: result.trustScore as string,
    reasoning: result.reasoning as string,
    sources: result.sources as string[],
    contradictions: result.contradictions as string[],
  };

  await db
    .update(articlesTable)
    .set({
      trustScore: result.trustScore,
      trustPercentage: result.trustPercentage,
      agreementLevel: result.agreementLevel,
      mainClaim: result.mainClaim,
      trustDetails,
    })
    .where(eq(articlesTable.id, articleId));

  return {
    trustScore: result.trustScore as string,
    trustPercentage: result.trustPercentage as number,
    mainClaim: result.mainClaim as string,
    reasoning: result.reasoning as string,
    agreementLevel: result.agreementLevel as string,
    sources: result.sources as string[],
    contradictions: result.contradictions as string[],
  };
}

export async function generateAudioForArticle(articleId: number) {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, articleId))
    .limit(1);

  if (!articles[0]) throw new Error("Article not found");

  const a = articles[0];
  const text = a.aiSummary || a.description || a.content.substring(0, 500);

  const podcastScript = `Welcome to AgenticNews. Here's today's story: ${a.title}. ${text}. Reported by ${a.source}. That's all for this story.`;

  const audioResponse = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: podcastScript,
  });

  const buffer = Buffer.from(await audioResponse.arrayBuffer());
  const base64Audio = buffer.toString("base64");
  const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

  await db
    .update(articlesTable)
    .set({ audioUrl })
    .where(eq(articlesTable.id, articleId));

  return { audioUrl, message: "Audio generated successfully" };
}

export async function translateArticle(
  articleId: number,
  targetLanguage: string
) {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, articleId))
    .limit(1);

  if (!articles[0]) throw new Error("Article not found");

  const a = articles[0];

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `Translate the given article to ${targetLanguage}. Return JSON:
{"translatedTitle": "...", "translatedContent": "...", "language": "${targetLanguage}"}`,
      },
      {
        role: "user",
        content: `Title: ${a.title}\nContent: ${a.content || a.description}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return {
    translatedTitle: result.translatedTitle as string,
    translatedContent: result.translatedContent as string,
    language: targetLanguage,
  };
}

export async function askWithRAG(
  question: string,
  conversationHistory: { role: string; content: string }[] = []
) {
  const allArticles = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      description: articlesTable.description,
      source: articlesTable.source,
      url: articlesTable.url,
      aiSummary: articlesTable.aiSummary,
      category: articlesTable.category,
      trustScore: articlesTable.trustScore,
    })
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt))
    .limit(40);

  const keywords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const scored = allArticles.map(a => {
    const text = `${a.title} ${a.description} ${a.aiSummary ?? ""}`.toLowerCase();
    const score = keywords.reduce((s, kw) => s + (text.includes(kw) ? 1 : 0), 0);
    return { ...a, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  const topArticles = scored.slice(0, 10);

  const articleContext = topArticles
    .map(
      (a) =>
        `[Article ${a.id}] "${a.title}" | Source: ${a.source} | Category: ${a.category} | Trust: ${a.trustScore ?? "unverified"}\nSummary: ${a.aiSummary || a.description}`
    )
    .join("\n\n");

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `You are AgenticNews AI Oracle — an expert intelligence analyst with access to a curated database of current news articles. 
Answer questions with depth, cite your sources, and highlight confidence levels.

Available articles (most relevant to the question):
${articleContext}

Return JSON:
{
  "answer": "comprehensive, well-reasoned answer citing articles by their IDs in brackets e.g. [Article 3]",
  "sourceIds": [array of article IDs cited],
  "confidence": <integer 0-100>,
  "followUpQuestions": ["suggested follow-up question 1", "suggested follow-up question 2"]
}`,
    },
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: question },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  const sourceIds: number[] = result.sourceIds || [];

  const sources = allArticles
    .filter((a) => sourceIds.includes(a.id))
    .map((a) => ({
      id: a.id,
      title: a.title,
      source: a.source,
      url: a.url,
    }));

  return {
    answer: result.answer as string,
    sources,
    confidence: result.confidence as number,
    followUpQuestions: result.followUpQuestions as string[],
  };
}

export async function analyzeUploadedArticle(imageBase64: string, mimeType: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are analyzing a newspaper or article image. First extract all the text you can see (OCR), then provide analysis. Return JSON:
{
  "extractedText": "all text found in the image",
  "summary": "2-3 sentence summary",
  "bulletPoints": ["key point 1", "key point 2", "key point 3"],
  "insights": "deeper analysis, context, and implications of this article"
}`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return {
    extractedText: result.extractedText as string,
    summary: result.summary as string,
    bulletPoints: result.bulletPoints as string[],
    insights: result.insights as string,
  };
}

let intelligenceCache: { data: IntelligenceData; generatedAt: number } | null = null;
const INTELLIGENCE_CACHE_TTL = 30 * 60 * 1000;

interface IntelligenceData {
  topSignal: string;
  keyInsight: string;
  confidence: number;
  sourcesAnalyzed: number;
  generatedAt: string;
}

export async function generateIntelligence(): Promise<IntelligenceData> {
  if (intelligenceCache && Date.now() - intelligenceCache.generatedAt < INTELLIGENCE_CACHE_TTL) {
    return intelligenceCache.data;
  }

  const articles = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      description: articlesTable.description,
      source: articlesTable.source,
      category: articlesTable.category,
      aiSummary: articlesTable.aiSummary,
    })
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt))
    .limit(20);

  if (articles.length === 0) {
    return {
      topSignal: "No data yet",
      keyInsight: "Fetch some articles to generate intelligence.",
      confidence: 0,
      sourcesAnalyzed: 0,
      generatedAt: new Date().toISOString(),
    };
  }

  const articleList = articles
    .map((a) => `- [${a.source}] ${a.title}: ${a.aiSummary || a.description}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [
      {
        role: "system",
        content: `You are an intelligence analyst. Analyze the provided news headlines and generate a strategic intelligence brief. Return JSON:
{
  "topSignal": "3-6 word label for the dominant global topic/trend",
  "keyInsight": "1-2 sentence strategic insight about what this means for the world",
  "confidence": <integer 50-95 representing confidence based on source diversity and agreement>
}`,
      },
      {
        role: "user",
        content: `Today's news articles:\n${articleList}\n\nGenerate the top intelligence signal.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  const data: IntelligenceData = {
    topSignal: result.topSignal as string,
    keyInsight: result.keyInsight as string,
    confidence: result.confidence as number,
    sourcesAnalyzed: articles.length,
    generatedAt: new Date().toISOString(),
  };

  intelligenceCache = { data, generatedAt: Date.now() };
  return data;
}

let trendingCache: { data: TrendingData; generatedAt: number } | null = null;
const TRENDING_CACHE_TTL = 20 * 60 * 1000;

interface TrendingData {
  topics: { rank: number; topic: string; count: number; trend: "up" | "stable" }[];
  generatedAt: string;
}

export async function generateTrending(): Promise<TrendingData> {
  if (trendingCache && Date.now() - trendingCache.generatedAt < TRENDING_CACHE_TTL) {
    return trendingCache.data;
  }

  const articles = await db
    .select({ title: articlesTable.title, category: articlesTable.category })
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt))
    .limit(30);

  if (articles.length === 0) {
    const fallback: TrendingData = {
      topics: [
        { rank: 1, topic: "Artificial Intelligence", count: 5, trend: "up" },
        { rank: 2, topic: "Global Markets", count: 4, trend: "up" },
        { rank: 3, topic: "Climate Technology", count: 3, trend: "stable" },
        { rank: 4, topic: "Cybersecurity", count: 2, trend: "stable" },
        { rank: 5, topic: "Space Exploration", count: 2, trend: "stable" },
      ],
      generatedAt: new Date().toISOString(),
    };
    return fallback;
  }

  const titles = articles.map((a) => a.title).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `Analyze these news headlines and extract the top 5 trending topics. Return JSON:
{
  "topics": [
    {"rank": 1, "topic": "Short topic label (2-4 words)", "count": <estimated article count>, "trend": "up" | "stable"},
    ...
  ]
}
Focus on substantive topics, not generic words. Rank by frequency and significance.`,
      },
      { role: "user", content: titles },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  const data: TrendingData = {
    topics: result.topics || [],
    generatedAt: new Date().toISOString(),
  };

  trendingCache = { data, generatedAt: Date.now() };
  return data;
}

export async function generateDailyBrief() {
  const articles = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      description: articlesTable.description,
      source: articlesTable.source,
      category: articlesTable.category,
      aiSummary: articlesTable.aiSummary,
      trustScore: articlesTable.trustScore,
    })
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt))
    .limit(25);

  if (articles.length === 0) {
    return {
      keyEvents: ["No articles indexed yet"],
      emergingSignals: ["Fetch news to populate the brief"],
      strategicInsight: "Add news articles to generate your daily intelligence brief.",
      generatedAt: new Date().toISOString(),
    };
  }

  const articleList = articles
    .map((a) => `[${a.category}] ${a.source}: ${a.title} — ${a.aiSummary || a.description}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `You are a senior intelligence analyst producing a daily brief for executives. Return JSON:
{
  "keyEvents": ["3 key global events as concise sentences, 1 per item"],
  "emergingSignals": ["2 emerging trends or signals worth watching, 1 per item"],
  "strategicInsight": "1-2 sentence high-level strategic insight about what today's news means for the broader global landscape"
}`,
      },
      {
        role: "user",
        content: `Today's news:\n${articleList}\n\nGenerate the daily intelligence brief.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  return {
    keyEvents: result.keyEvents as string[],
    emergingSignals: result.emergingSignals as string[],
    strategicInsight: result.strategicInsight as string,
    generatedAt: new Date().toISOString(),
  };
}
