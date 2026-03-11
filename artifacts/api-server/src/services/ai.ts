import { openai } from "@workspace/integrations-openai-ai-server";
import { db, articlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function generateSummary(articleId: number) {
  const article = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id, articleId))
    .limit(1);

  if (!article[0]) throw new Error("Article not found");

  const a = article[0];
  const text = `Title: ${a.title}\n\nSource: ${a.source}\n\nContent: ${a.content || a.description}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You are a news analyst. Summarize the article and extract key information. Return JSON with this exact structure:
{
  "summary": "2-3 sentence summary",
  "bulletPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "timeline": [{"date": "date string", "event": "what happened"}]
}`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");

  await db
    .update(articlesTable)
    .set({
      aiSummary: result.summary,
      bulletPoints: result.bulletPoints,
      timeline: result.timeline,
    })
    .where(eq(articlesTable.id, articleId));

  return {
    summary: result.summary as string,
    bulletPoints: result.bulletPoints as string[],
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
    .limit(10);

  const relatedSources = relatedArticles.map((r) => `${r.source}: ${r.title}`).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You are a fact-checking journalist. Analyze this article's credibility. Return JSON:
{
  "trustScore": "Low" | "Medium" | "High",
  "reasoning": "explanation of trust score",
  "sources": ["source1", "source2"],
  "contradictions": ["contradiction1"] 
}

Trust score criteria:
- High: From reputable outlet, verifiable facts, multiple sources
- Medium: Some unverified claims, single source
- Low: Sensationalist, unverified, contradictory info`,
      },
      {
        role: "user",
        content: `Article to verify:\nTitle: ${a.title}\nSource: ${a.source}\nContent: ${a.content || a.description}\n\nOther articles in database:\n${relatedSources}`,
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
      trustDetails,
    })
    .where(eq(articlesTable.id, articleId));

  return {
    trustScore: result.trustScore as string,
    reasoning: result.reasoning as string,
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
      content: articlesTable.content,
    })
    .from(articlesTable)
    .limit(30);

  const articleContext = allArticles
    .map(
      (a) =>
        `[Article ${a.id}] Title: ${a.title} | Source: ${a.source} | ${a.description}`
    )
    .join("\n");

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `You are an AI news assistant with access to a database of current news articles. Answer questions based on the provided articles. Always cite your sources by article ID.

Available articles:
${articleContext}

Return a JSON object:
{"answer": "your detailed answer citing articles", "sourceIds": [1, 2, 3]}`,
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
