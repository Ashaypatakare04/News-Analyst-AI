"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { apiFetch, type BriefData } from "@/lib/api";
import {
  BookOpen, Loader2, Zap, TrendingUp, Lightbulb,
  Calendar, RefreshCw, Globe, ArrowRight, Fingerprint,
  Activity, Target, ScanLine
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function BriefPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: brief, isLoading, isError, refetch, isFetching } = useQuery<BriefData>({
    queryKey: ["brief"],
    queryFn: () => apiFetch<BriefData>("/brief"),
    staleTime: 20 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = mounted ? format(new Date(), "EEEE, MMMM d, yyyy") : "-- -- --";

  return (
    <Layout>
      <div className="min-h-screen bg-background relative selection:bg-primary/20 cursor-none">
        
        {/* Background Decor */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="mesh-bg" />
          <div className="bg-noise absolute inset-0" />
        </div>

        {/* Institutional Status Bar */}
        <div className="sticky top-20 z-40 bg-background/60 backdrop-blur-md border-b border-white/[0.03] text-[9px] py-4 px-6 lg:px-8 overflow-x-auto whitespace-nowrap hide-scrollbar shadow-sm">
          <div className="flex items-center gap-12 max-w-7xl mx-auto w-full font-bold uppercase tracking-[0.4em] text-primary/40">
            <span className="text-foreground/80">{today}</span>
            <div className="flex items-center gap-10">
              <span className="flex items-center gap-3">
                <Target className="w-3.5 h-3.5 opacity-40" />
                Strategic Synthesis Active
              </span>
              <span className="flex items-center gap-3">
                <Activity className="w-3.5 h-3.5 opacity-40" /> 
                Signal Confidence: 94%
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 w-full">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="mb-24"
          >
            <div className="flex items-center gap-6 text-primary/40 text-[10px] font-bold uppercase tracking-[0.6em] mb-12">
              <div className="w-16 h-px bg-primary/20" />
              Intelligence Portfolio v4.8
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
              <div className="space-y-6">
                <h1 className={cn(
                  "text-6xl md:text-8xl font-bold text-gradient leading-[0.95] tracking-tighter",
                  mounted && theme !== "dark" && "font-serif"
                )}>
                  The <span className="italic font-light opacity-30">Executive</span> Brief
                </h1>
                <p className="text-muted-foreground/50 text-xl font-light max-w-xl leading-relaxed">
                  A high-fidelity condensation of global indices, produced via autonomous neural synthesis for strategic decision support.
                </p>
              </div>
              <MagneticButton
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-5 px-10 py-5 glass border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary"
              >
                <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                Sync Indices
              </MagneticButton>
            </div>
          </motion.header>

          {/* States Rendering */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-60 flex flex-col items-center justify-center gap-10 glass border-dashed border-white/5"
              >
                <div className="w-16 h-16 border-l border-t border-primary/40 animate-spin" />
                <div className="flex flex-col items-center gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.6em] text-primary/40 animate-pulse">Materializing Signal Matrix</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/5 italic">Synthesized via Neural Primitive v8</p>
                </div>
              </motion.div>
            ) : isError ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-48 text-center glass border-white/5"
              >
                <Globe className="w-16 h-16 text-primary/10 mx-auto mb-10" />
                <h2 className="font-serif text-3xl font-bold mb-6">Briefing Unavailable</h2>
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-muted-foreground/20 mb-16">Syncing failure across primary data nodes. Check connection.</p>
                <Link href="/home">
                  <MagneticButton className="px-16 py-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.5em]">
                    Return to Global Index
                  </MagneticButton>
                </Link>
              </motion.div>
            ) : brief ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-32"
              >
                {/* Strategic Insight - High Profile Anti-Gravity */}
                <AntiGravityCard intensity={15} float={true}>
                  <section className="relative p-16 md:p-24 glass border-primary/20 overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
                    <div className="text-[10px] font-bold uppercase tracking-[0.7em] text-primary/40 mb-12 flex items-center gap-6">
                       <ScanLine className="w-4 h-4" /> Core Synthesis
                    </div>
                    <p className={cn(
                      "text-4xl md:text-6xl font-bold text-foreground leading-[1.2] italic tracking-tight text-gradient",
                      mounted && theme !== "dark" && "font-serif"
                    )}>
                      "{brief.strategicInsight}"
                    </p>
                  </section>
                </AntiGravityCard>

                <div className="grid lg:grid-cols-2 gap-24">
                  {/* Key Events */}
                  <section className="space-y-16">
                    <h2 className={cn(
                      "text-4xl font-bold text-foreground flex items-center gap-8",
                      mounted && theme !== "dark" && "font-serif"
                    )}>
                      Institutional <span className="italic font-light opacity-30">Pulse</span>
                    </h2>
                    <div className="space-y-16 relative pl-8">
                      <div className="absolute left-0 inset-y-0 w-px bg-white/5" />
                      {brief.keyEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="flex gap-10 group relative"
                        >
                          <div className="absolute -left-[35px] top-1 w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                          <span className={cn(
                            "text-primary/10 text-5xl font-bold italic leading-none transition-colors group-hover:text-primary/40",
                            mounted && theme !== "dark" && "font-serif"
                          )}>
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          <p className="text-xl text-foreground/60 leading-relaxed font-light mt-1">
                            {event}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Emerging Signals */}
                  <section className="space-y-16">
                     <h2 className={cn(
                      "text-4xl font-bold text-foreground flex items-center gap-8",
                      mounted && theme !== "dark" && "font-serif"
                    )}>
                      Emerging <span className="italic font-light opacity-30">Vectors</span>
                    </h2>
                    <div className="p-12 glass border-white/5 space-y-16 shadow-2xl">
                      {brief.emergingSignals.map((signal, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="flex gap-10 group"
                        >
                          <div className="w-14 h-14 border-l border-t border-primary/20 flex items-center justify-center shrink-0 glass group-hover:border-primary transition-all">
                            <Zap className="w-5 h-5 text-primary/20 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-base text-foreground/50 leading-relaxed font-serif italic mt-1">
                            {signal}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="pt-32 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-16">
                  <div className="flex items-center gap-6 text-[10px] font-bold text-primary/10 uppercase tracking-[0.6em]">
                    <div className="w-2 h-2 rounded-full bg-primary/10 animate-pulse" />
                    Neural Synthetic Protocol v8.4 Active
                  </div>
                  <div className="flex items-center gap-12">
                    <Link href="/home" className="text-[11px] font-bold uppercase tracking-[0.5em] text-muted-foreground/20 hover:text-primary transition-colors">
                      Full Global Index
                    </Link>
                    <Link href="/ask">
                      <MagneticButton className="px-16 py-6 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.5em] flex items-center gap-6">
                        Consult Analyst <ArrowRight className="w-5 h-5" />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>

              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
