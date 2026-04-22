const BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export interface IntelligenceData {
  topSignal: string;
  keyInsight: string;
  confidence: number;
  sourcesAnalyzed: number;
  generatedAt: string;
}

export interface TrendingTopic {
  rank: number;
  topic: string;
  count: number;
  trend: "up" | "stable";
}

export interface TrendingData {
  topics: TrendingTopic[];
  generatedAt: string;
}

export interface BriefData {
  keyEvents: string[];
  emergingSignals: string[];
  strategicInsight: string;
  generatedAt: string;
}
