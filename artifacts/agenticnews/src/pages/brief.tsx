import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { apiFetch, type BriefData } from "@/lib/api";
import {
  BookOpen, Loader2, Zap, TrendingUp, Lightbulb,
  Calendar, RefreshCw, Globe, ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function BriefPage() {
  const { data: brief, isLoading, isError, refetch, isFetching } = useQuery<BriefData>({
    queryKey: ["brief"],
    queryFn: () => apiFetch<BriefData>("/brief"),
    staleTime: 20 * 60 * 1000,
    retry: 1,
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
            </span>
            Daily Intelligence Brief
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-2">
                Today's Brief
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(), "EEEE, MMMM d, yyyy")}
                {brief?.generatedAt && (
                  <span className="text-muted-foreground/60">
                    · Updated {format(new Date(brief.generatedAt), "h:mm a")}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
            <p className="text-muted-foreground font-medium">Generating your intelligence brief...</p>
            <p className="text-xs text-muted-foreground/60">Analyzing all indexed articles</p>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-3xl">
            <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium mb-2">Brief unavailable</p>
            <p className="text-sm text-muted-foreground mb-6">Make sure articles are indexed before generating a brief.</p>
            <Link href="/home">
              <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Browse articles first
              </button>
            </Link>
          </div>
        )}

        {/* Content */}
        {brief && !isLoading && (
          <div className="space-y-6">

            {/* Key Events */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-border/60 bg-card overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/20">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Key Global Events</h2>
                  <p className="text-xs text-muted-foreground">3 major stories shaping today</p>
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {brief.keyEvents.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-4 px-6 py-5"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-[15px]">{event}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Emerging Signals */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-500/15 bg-amber-500/5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Emerging Signals</h2>
                  <p className="text-xs text-muted-foreground">Trends worth watching closely</p>
                </div>
              </div>
              <div className="divide-y divide-amber-500/10">
                {brief.emergingSignals.map((signal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    className="flex items-start gap-4 px-6 py-5"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-[15px]">{signal}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Strategic Insight */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Strategic Insight</h2>
                  <p className="text-xs text-muted-foreground">The big picture for today</p>
                </div>
              </div>
              <p className="text-lg text-foreground/90 leading-relaxed font-serif italic border-l-2 border-emerald-500/40 pl-5">
                "{brief.strategicInsight}"
              </p>
            </motion.div>

            {/* Footer actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Link href="/home" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  <BookOpen className="w-4 h-4" /> Browse Full Stories
                </button>
              </Link>
              <Link href="/ask" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border/60 text-foreground font-medium hover:bg-secondary/40 transition-colors">
                  Ask AI Oracle <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
