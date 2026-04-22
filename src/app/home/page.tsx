"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { ArticleCard, getCategoryColor } from "@/components/article-card";
import { useGetNews, useGetCategories } from "@/lib/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, type IntelligenceData, type TrendingData } from "@/lib/api";
import {
  Loader2, Search, Brain, TrendingUp, ShieldCheck,
  Activity, ArrowRight, Target, BarChart3,
  BookOpen, TrendingDown, Fingerprint, Eye, ScanLine
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { TrustBadge } from "@/components/trust-badge";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
};

export default function Home() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 500), []);

  const { data: categoriesData } = useGetCategories();
  const { data: newsData, isLoading } = useGetNews({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    q: debouncedSearch || undefined,
    pageSize: 13,
  });

  const { data: intelligence, isLoading: intelligenceLoading } = useQuery<IntelligenceData>({
    queryKey: ["intelligence"],
    queryFn: () => apiFetch<IntelligenceData>("/intelligence"),
    staleTime: 25 * 60 * 1000,
    retry: 1,
  });

  const { data: trendingData, isLoading: trendingLoading } = useQuery<TrendingData>({
    queryKey: ["trending"],
    queryFn: () => apiFetch<TrendingData>("/trending"),
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  const categories = ["All", ...(categoriesData?.categories || [])];
  const today = mounted ? format(new Date(), "EEEE, MMMM d, yyyy") : "-- -- --";
  const featuredArticle = newsData?.articles?.[0];
  const gridArticles = newsData?.articles?.slice(1) || [];

  return (
    <Layout>
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="mesh-bg opacity-10" />
      </div>

      {/* Institutional Status Bar - Bloomberg/Palantir Benchmark */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.08] text-xs py-5 px-8 overflow-hidden shadow-2xl">
        <div className="max-w-[1800px] mx-auto flex items-center gap-16 font-bold uppercase tracking-[0.4em]">
          <div className="flex items-center gap-4 text-foreground border-r border-white/20 pr-12 min-w-max">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span>OPERATIONAL // {today}</span>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <motion.div 
               animate={{ x: [0, -2000] }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="flex items-center gap-24 whitespace-nowrap text-primary/40"
            >
               {[1,2].map((_, i) => (
                 <div key={i} className="flex items-center gap-24">
                    <span className="flex items-center gap-4"><Activity className="w-3.5 h-3.5" /> FEED: SYNTHESIZING_VECTORS_8.4</span>
                    <span className="flex items-center gap-4"><Target className="w-3.5 h-3.5" /> SIGNAL: VOLATILITY_CORRELATION_CONFIRMED</span>
                    <span className="flex items-center gap-4"><ShieldCheck className="w-3.5 h-3.5" /> PARITY: institutional_integrity_verified_rsa4096</span>
                    <span className="flex items-center gap-4"><ScanLine className="w-3.5 h-3.5" /> TRACE: geopolitical_node_active</span>
                 </div>
               ))}
            </motion.div>
          </div>

          <div className="flex items-center gap-12 text-primary/20 min-w-max border-l border-white/10 pl-12 font-mono">
            <span>LATENCY: 14MS</span>
            <span>NODES: 1,482</span>
            <span>UPTIME: 99.998%</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 w-full relative z-10 flex flex-col gap-12">
        
        {/* Top Header & Search Control Bento */}
        <div className="bento-grid">
          <header className="col-span-12 lg:col-span-8 bento-cell neuro-beam p-12">
            <div className="neuro-beam-inner">
              <div className="flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40 mb-8">
                <Brain className="w-3.5 h-3.5" /> Neural_Index_Active
              </div>
              <h1 className={cn(
                "text-5xl md:text-8xl font-bold tracking-tighter text-foreground leading-[0.9] mb-8",
                mounted && theme !== "dark" && "font-serif"
              )}>
                Intelligence <span className="italic font-light opacity-30">Archive</span>
              </h1>
              <p className="text-muted-foreground/40 text-lg font-light tracking-tight max-w-2xl leading-relaxed">
                Synthesizing planetary signals into precision directives. Primary tactical feed active for neural synchronization.
              </p>
            </div>
          </header>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bento-cell neuro-beam p-8 h-full flex flex-col justify-center">
              <div className="neuro-beam-inner">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="PROBE_INDEX..."
                    onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value); }}
                    value={searchQuery}
                    className="w-full bg-transparent border-b border-primary/20 pb-4 pr-12 text-lg font-light tracking-tight focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/10 placeholder:uppercase placeholder:font-mono placeholder:font-bold placeholder:text-[10px] placeholder:tracking-[0.5em]"
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "text-[9px] font-mono font-bold uppercase tracking-[0.3em] transition-all px-3 py-1 border border-white/5 rounded-full hover:border-primary/40",
                        selectedCategory === cat ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground/40"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content Bento */}
        <div className="bento-grid">
          {/* Featured Article */}
          <div className="col-span-12 lg:col-span-8">
            {isLoading ? (
              <div className="h-[600px] bento-cell flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-l border-t border-primary/40 animate-spin" />
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40">Accessing Article Matrix...</p>
              </div>
            ) : featuredArticle ? (
              <ArticleCard 
                article={featuredArticle} 
                index={0} 
                speed="slow" 
              />
            ) : null}
          </div>

          {/* Intelligence Synthesis Console */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bento-cell neuro-beam h-full p-12 bg-primary/[0.01] flex flex-col group/intel"
            >
              <div className="neuro-beam-inner flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-[0.5em] text-primary/60">
                    <Activity className="w-4 h-4 animate-pulse-live" /> Console_Status
                  </div>
                  <div className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Operational
                  </div>
                </div>

                {intelligenceLoading ? (
                  <div className="py-24 text-center">
                    <div className="w-8 h-8 border-b border-primary/40 animate-spin mx-auto mb-6" />
                  </div>
                ) : intelligence ? (
                  <div className="space-y-10 flex-1 flex flex-col">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-primary/30">Primary_Vector</div>
                    <p className={cn(
                      "text-4xl font-bold text-foreground leading-tight tracking-tighter italic",
                      mounted && theme !== "dark" && "font-serif"
                    )}>
                      {intelligence.topSignal}
                    </p>
                    <p className="text-sm text-muted-foreground/50 leading-relaxed font-light italic border-l border-primary/20 pl-8 mb-12">
                      "{intelligence.keyInsight}"
                    </p>
                    
                    <div className="mt-auto space-y-6">
                      <div className="flex items-end justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary/40">Signal_Integrity</span>
                        <span className="text-3xl font-mono font-bold text-foreground">{intelligence.confidence}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${intelligence.confidence}%` }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                          className="h-full bg-primary shadow-[0_0_20px_hsla(var(--primary),0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Secondary Feed Bento Grid */}
        <div className="bento-grid">
          {/* Main Index Grid */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-12">
            {!isLoading && gridArticles.length > 0 && (
              <div className="grid grid-cols-2 gap-12">
                {gridArticles.map((article, i) => (
                  <div key={article.id} className={cn("col-span-2", i % 3 === 2 ? "md:col-span-2" : "md:col-span-1")}>
                    <ArticleCard 
                      article={article} 
                      index={i + 1} 
                      speed={i % 2 === 0 ? "slow" : "medium"} 
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-8">
              <MagneticButton className="px-12 py-5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-[0.5em] hover:bg-white/[0.02]">
                Materialize_Further_Indices
              </MagneticButton>
            </div>
          </div>

          {/* Institutional Sidebar Bento Cells */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
            {/* High-Intensity Signals */}
            <div className="bento-cell neuro-beam p-10 flex flex-col gap-10">
              <div className="neuro-beam-inner flex flex-col gap-10">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/30 flex items-center gap-4">
                  <Brain className="w-3.5 h-3.5" /> High_Intensity_Signals
                </h3>
                {trendingLoading ? (
                  <div className="space-y-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-sm" />)}
                  </div>
                ) : trendingData?.topics?.length ? (
                  <ul className="space-y-8">
                    {trendingData.topics?.slice(0, 5).map((topic: any, i: number) => (
                      <li key={i} className="flex items-start gap-6 group cursor-none">
                        <span className="font-mono text-xl text-primary/10 group-hover:text-primary transition-colors">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex-1 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/60 group-hover:text-primary transition-all">
                            {topic.topic}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="h-[2px] flex-1 bg-white/5 group-hover:bg-primary/20 transition-all" />
                            <span className="text-[9px] font-mono text-primary/30 uppercase">{topic.count} VDR</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {/* Quick Access Portal */}
            <div className="bento-cell neuro-beam p-10 bg-primary/[0.02]">
              <div className="neuro-beam-inner space-y-8">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40">Terminal_Access</div>
                <div className="flex flex-col gap-4">
                  <Link href="/ask" className="group flex items-center justify-between p-6 glass border-white/5 hover:border-primary/20 transition-all">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Direct_Inquiry</span>
                      <span className="text-[9px] text-muted-foreground/40 font-light">Initialize Neural Probe</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary/40 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="/brief" className="group flex items-center justify-between p-6 glass border-white/5 hover:border-primary/20 transition-all">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Executive_Brief</span>
                      <span className="text-[9px] text-muted-foreground/40 font-light">Global Synthesis Recap</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary/40 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
