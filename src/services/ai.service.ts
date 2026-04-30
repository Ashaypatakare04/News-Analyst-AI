import { openai } from "@/lib/openai";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Generates embeddings for an article and stores them.
 * Call this function during data ingestion (e.g., in your cron job).
 */
export async function generateAndStoreEmbedding(articleId: string, title: string, content: string) {
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${title} ${content}`,
    });
    
    const vector = embeddingRes.data[0].embedding;
    
    // Requires Firebase Vector Extension enabled
    await adminDb.collection("articles").doc(articleId).update({
      embedding: vector
    });
  } catch (error) {
    console.error("[EMBEDDING_ERROR]", error);
  }
}

/**
 * Performs a highly scalable, semantic RAG search using Vector Math.
 */
export async function askWithVectorRAG(question: string, history: any[] = []) {
  // 1. Embed the user's question
  const queryRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const queryVector = queryRes.data[0].embedding;

  // 2. Perform Native Vector Search in Firestore (limit 5 instead of fetching 40+ docs)
  // Note: findNearest is available in latest firebase-admin with vector support
  // Ensure the database is configured to handle Vector queries.
  // @ts-ignore
  const vectorQuery = adminDb.collection("articles").findNearest("embedding", queryVector, {
    limit: 5,
    distanceMeasure: "COSINE"
  });
  
  const snaps = await vectorQuery.get();
  
  const articleContext = snaps.docs.map(doc => {
    const a = doc.data();
    return `[Article ${doc.id}] "${a.title}" | Source: ${a.source}\nSummary: ${a.aiSummary || a.description}`;
  }).join("\n\n");

  // 3. Strict Structured Output generation
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { 
        role: "system", 
        content: `You are Agentic Intel Oracle. Synthesize human-level intelligence from these sources:\n\n${articleContext}` 
      },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: question }
    ],
    // ENFORCES PERFECT JSON OUTPUT, NO BRITTLE REGEX REQUIRED
    response_format: { type: "json_object" } 
  });

  const responseText = completion.choices[0].message.content;
  if (!responseText) throw new Error("Empty response from AI");
  
  return JSON.parse(responseText);
}
