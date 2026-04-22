"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  generateSummary, 
  verifyArticle, 
  generateDailyBrief, 
  askWithRAG, 
  analyzeUploadedArticle 
} from "./ai";

// Hooks
export function useGetNews(args?: { category?: string; q?: string; pageSize?: number }) {
  return useQuery<{ articles: Article[]; total: number }>({
    queryKey: ["news", args],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (args?.category) params.append("category", args.category);
      if (args?.q) params.append("q", args.q);
      if (args?.pageSize) params.append("pageSize", args.pageSize.toString());
      
      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    }
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // For now we'll return a robust set of categories used in the app
      // In a more advanced version, we could fetch distinct categories from Firestore
      return {
        categories: [
          "Politics", "Technology", "Economy", "Health", "Science", 
          "Climate", "Security", "Culture", "Sports"
        ]
      };
    }
  });
}
export function useGetArticle(id: string | number, options?: { query?: any }): any { 
  return useQuery<Article>({
    queryKey: getGetArticleQueryKey(id),
    queryFn: () => fetch(`/api/articles/${id}`).then(res => res.json()),
    ...options?.query
  }); 
}

export function useAskQuestion(options?: { mutation?: any }) { 
  return useMutation({
    mutationFn: async ({ data }: { data: { question: string, conversationHistory?: ChatMessage[] } }) => {
      const response = await askWithRAG(data.question, data.conversationHistory);
      return response;
    },
    ...options?.mutation
  }); 
}

export function useUploadImage(options?: { mutation?: any }) {
  return { mutate: (args: { image: File }) => {}, isPending: false };
}

export function useGetBrief() { 
  return useQuery({
    queryKey: ["brief"],
    queryFn: async () => {
      return generateDailyBrief();
    }
  }); 
}

export function useGenerateAudio(options?: { mutation?: any }) { 
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) => {
      const { generateAudioForArticle } = await import("./ai");
      return generateAudioForArticle(id.toString());
    },
    ...options?.mutation
  }); 
}
export function useTranslateArticle(options?: { mutation?: any }) { return { mutate: (args: { id: string | number, data: { targetLanguage: string } }) => {}, isPending: false }; }

export function useGenerateSummary(options?: { mutation?: any }) { 
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) => {
      return generateSummary(id.toString());
    },
    ...options?.mutation
  }); 
}

export function useVerifyArticle(options: any) { 
  return useMutation({
    mutationFn: async ({ id }: { id: string | number }) => {
      return verifyArticle(id.toString());
    },
    ...options?.mutation
  }); 
}

export function useUploadArticle(options: any) { 
  return useMutation({
    mutationFn: async ({ data }: { data: { image: File } }) => {
      // Convert File to Base64 to send to Server Action
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // expected format: data:image/png;base64,... - we need just the base64 part
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(data.image);
      const base64 = await base64Promise;
      
      const response = await analyzeUploadedArticle(base64, data.image.type);
      return response as unknown as UploadResponse;
    },
    ...options?.mutation
  }); 
}

export const getGetArticleQueryKey = (id?: string | number) => ["article", id];
export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  source: string;
  category: string;
  publishedAt: string;
  trustScore: "Low" | "Medium" | "High";
  trustPercentage?: number;
  aiSummary?: string;
  bulletPoints?: string[];
  actors?: string[];
  timeline?: { date: string; event: string }[];
}
export interface ChatMessage { role: "user" | "assistant"; content: string; }
export interface ArticleReference { id: string; title: string; source: string; url: string; }
export interface UploadResponse { summary: string; bulletPoints: string[]; extractedText: string; insights?: string; }
