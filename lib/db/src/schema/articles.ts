import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  content: text("content").notNull().default(""),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  author: text("author"),
  publishedAt: text("published_at").notNull(),
  category: text("category").notNull().default("general"),
  aiSummary: text("ai_summary"),
  bulletPoints: jsonb("bullet_points").$type<string[]>(),
  actors: jsonb("actors").$type<string[]>(),
  timeline: jsonb("timeline").$type<{ date: string; event: string }[]>(),
  trustScore: text("trust_score"),
  trustPercentage: integer("trust_percentage"),
  agreementLevel: text("agreement_level"),
  mainClaim: text("main_claim"),
  trustDetails: jsonb("trust_details").$type<{
    score: string;
    reasoning: string;
    sources: string[];
    contradictions: string[];
  }>(),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articlesTable).omit({ id: true, createdAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;
