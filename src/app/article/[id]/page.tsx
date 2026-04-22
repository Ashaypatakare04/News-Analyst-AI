"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Brain, ShieldCheck, Headphones, Loader2, Play,
  CircleDot, FileText, CheckCircle2, XCircle, Users,
  BarChart3, AlertTriangle, Fingerprint, Languages, Search,
  Activity, Target, ScanLine, Globe
} from "lucide-react";

import { Layout } from "@/components/layout";
import { TrustBadge } from "@/components/trust-badge";
import { getCategoryColor } from "@/components/article-card";
import {
  useGetArticle,
  useGenerateSummary as useSummarizeArticle,
  useVerifyArticle,
  useGenerateAudio,
  useTranslateArticle,
  getGetArticleQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";

type Tab = "summary" | "timeline" | "article" | "sources";

function DetailTrustMeter({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col gap-3 min-w-[140px]">
      <div className="text-4xl font-mono font-bold tabular-nums text-foreground/80 tracking-tighter">{score}%</div>
      <div className="w-full bg-white/5 h-[2px]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="h-full bg-primary shadow-[0_0_15px_hsla(var(--primary),0.5)]" 
        />
      </div>
      <div className="text-[10px] font-mono text-primary/40 font-bold uppercase tracking-[0.4em]">{label}</div>
    </div>
  );
}

export default function ArticlePage() {
  const { theme } = useTheme();
  const { id: articleId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [targetLang, setTargetLang] = useState("es");
  const [showTranslate, setShowTranslate] = useState(false);

  const { data: article, isLoading } = useGetArticle(articleId, {
    query: { enabled: !!articleId, queryKey: getGetArticleQueryKey(articleId) }
  });

  useEffect(() => {
    if (article) {
      const savedHistory = localStorage.getItem("news_history");
      let historyArr = savedHistory ? JSON.parse(savedHistory) : [];
      
      // Prevent duplicates and keep last 10
      historyArr = historyArr.filter((h: any) => h.id !== articleId);
      historyArr.unshift({
        id: articleId,
        title: article.title,
        source: article.source,
        category: article.category,
        timestamp: Date.now()
      });
      
      localStorage.setItem("news_history", JSON.stringify(historyArr.slice(0, 10)));
    }
  }, [article, articleId]);

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: getGetArticleQueryKey(articleId) });
    toast({ title: "Signal Updated", description: message });
  };
  const onError = () => toast({ title: "Analysis Failure", description: "The intelligence pipeline encountered an error.", variant: "destructive" });

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Attempt to find a premium-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Enhanced"));
    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
  };

  const sumMut = useSummarizeArticle({ mutation: { onSuccess: () => onSuccess("Intelligence synthesis complete"), onError } });
  const verMut = useVerifyArticle({ mutation: { onSuccess: () => onSuccess("Integrity verification complete"), onError } });
  const audMut = useGenerateAudio({ 
    mutation: { 
      onSuccess: (data: any) => {
        onSuccess("Audio playback initialized");
        if (data.audioUrl === "browser-tts" && data.podcastScript) {
          speak(data.podcastScript);
        }
      }, 
      onError 
    } 
  });
  const trMut = useTranslateArticle({ mutation: { onSuccess: () => { onSuccess("Lexical translation ready"); setShowTranslate(false); }, onError } });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[80vh] flex-col items-center justify-center gap-8">
          <div className="w-16 h-16 border-l border-t border-primary/40 animate-spin" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-primary/60 animate-pulse">Accessing_Neural_Record</span>
            <div className="h-[1px] w-32 bg-white/10 overflow-hidden">
               <motion.div 
                animate={{ x: ["-100%", "100%"] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/2 bg-primary/60" 
               />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-48 glass border-dashed border-white/5 mx-6">
          <AlertTriangle className="w-12 h-12 text-primary/20 mx-auto mb-8" />
          <h2 className="font-serif text-3xl font-bold mb-6">Index Entry Null</h2>
          <Link href="/home">
            <MagneticButton className="px-12 py-5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.4em]">
               Return to Global Index
            </MagneticButton>
          </Link>
        </div>
      </Layout>
    );
  }

  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop";
  const trustPct = (article as any).trustPercentage as number | undefined;
  const agreementLevel = (article as any).agreementLevel as string | undefined;
  const mainClaim = (article as any).mainClaim as string | undefined;
  const actors = (article as any).actors as string[] | undefined;

  return (
    <Layout>
      <div className="min-h-screen bg-background relative selection:bg-primary/20 cursor-none">
        
        {/* Background Decor */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="mesh-bg" />
          <div className="bg-noise absolute inset-0" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          {/* Header Metadata */}
          <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
              <Link href="/home" className="inline-flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary mb-16 transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back_to_Intelligence_Index
              </Link>
              
              <div className="flex items-center gap-6 mb-10">
                <span className={cn("px-4 py-1 glass text-[10px] font-mono font-bold uppercase tracking-[0.5em] border-primary/20", getCategoryColor(article.category))}>
                  {article.category}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-muted-foreground/40 text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
                  {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </span>
              </div>

              <h1 className={cn(
                "text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-16 text-gradient tracking-tighter shadow-sm",
                theme !== "dark" && "font-serif"
              )}>
                {article.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 pt-12 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 border-l border-t border-primary/20 flex items-center justify-center font-bold text-2xl text-primary glass",
                    theme !== "dark" && "font-serif"
                  )}>
                    {article.source.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-xs uppercase tracking-[0.4em] mb-1">{article.source}</div>
                    {article.author && <div className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-[0.2em]">{article.author}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-8">
                   <TrustBadge score={article.trustScore} className="scale-150 origin-right drop-shadow-2xl" />
                </div>
              </div>
          </div>

          {/* Feature Image - Cinematic Anti-Gravity */}
          <div className="px-6 lg:px-12 mb-24">
            <AntiGravityCard intensity={5} float={false} className="max-w-7xl mx-auto rounded-sm overflow-hidden neuro-beam shadow-prestige">
              <div className="neuro-beam-inner w-full h-[65vh] max-h-[900px] overflow-hidden">
                <img src={imageUrl} alt={article.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[3000ms] ease-out scale-100 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
              </div>
            </AntiGravityCard>
          </div>

          <div className="max-w-4xl mx-auto px-6 pb-48">
            
            {/* Executive Toolbar - Static but High-End */}
            <div className="sticky top-24 z-40 glass border-white/5 p-3 mb-20 flex items-center justify-between gap-2 overflow-x-auto shadow-2xl hide-scrollbar rounded-full">
              <div className="flex items-center gap-2 pl-2">
                <MagneticButton
                  onClick={() => sumMut.mutate({ id: articleId })}
                  disabled={sumMut.isPending}
                  className="px-6 py-3 hover:bg-white/[0.02] text-primary text-[11px] font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-3 transition-all disabled:opacity-50"
                >
                  {sumMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                  Synthesis
                </MagneticButton>

                <MagneticButton
                  onClick={() => verMut.mutate({ id: articleId })}
                  disabled={verMut.isPending}
                  className="px-6 py-3 hover:bg-white/[0.02] text-foreground text-[11px] font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-3 transition-all disabled:opacity-50"
                >
                  {verMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />}
                  Verify
                </MagneticButton>

                <MagneticButton
                  onClick={() => audMut.mutate({ id: articleId })}
                  disabled={audMut.isPending}
                  className="px-6 py-3 hover:bg-white/[0.02] text-foreground text-[11px] font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-3 transition-all disabled:opacity-50"
                >
                  {audMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary/60" /> : <Headphones className="w-3.5 h-3.5 opacity-60" />}
                  Audio_Brief
                </MagneticButton>
              </div>

              <div className="h-6 w-px bg-white/5 mx-2" />

              <div className="relative pr-2">
                <MagneticButton
                  onClick={() => setShowTranslate(!showTranslate)}
                  className="px-6 py-3 hover:bg-white/[0.02] text-foreground text-[11px] font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-3 transition-all"
                >
                  <Languages className="w-3.5 h-3.5 opacity-60" />
                  Translate
                </MagneticButton>

                <AnimatePresence>
                  {showTranslate && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute right-0 top-full mt-6 glass p-8 min-w-[280px] z-50 border-white/10"
                    >
                      <div className="text-[10px] font-mono font-bold text-primary/40 uppercase tracking-[0.5em] mb-6">Translation_Core</div>
                      <select
                        value={targetLang} onChange={e => setTargetLang(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 p-4 text-[10px] font-mono font-bold uppercase tracking-widest mb-8 outline-none appearance-none cursor-pointer text-foreground focus:border-primary/40 transition-colors"
                      >
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                      <MagneticButton
                        onClick={() => trMut.mutate({ id: articleId, data: { targetLanguage: targetLang } })}
                        disabled={trMut.isPending}
                        className="w-full bg-primary text-primary-foreground py-4 text-[10px] font-bold uppercase tracking-[0.4em]"
                      >
                        {trMut.isPending ? "Executing..." : "Authorize Pipeline"}
                      </MagneticButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Audio Section */}
            {article.audioUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mb-24 p-10 bento-cell neuro-beam flex flex-col items-center text-center gap-8 relative group"
              >
                <div className="neuro-beam-inner w-full flex flex-col items-center py-10">
                  <div className="w-20 h-20 border-l border-t border-primary/20 flex items-center justify-center text-primary mb-2 shadow-inner glass-premium">
                    <Play className="w-10 h-10 ml-2 fill-current opacity-70 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-primary/60 uppercase tracking-[0.6em]">Aural_Synthesis_Protocol_Active</div>
                  <audio controls src={article.audioUrl} className="w-full h-10 opacity-30 mt-6 grayscale invert brightness-200 contrast-125 dark:invert-0 dark:brightness-100" />
                </div>
              </motion.div>
            )}

            {/* Navigation Tabs */}
            <div className="mb-20 border-b border-white/5 flex gap-12 overflow-x-auto hide-scrollbar">
              {[
                { id: "summary", label: "Intelligence", icon: Fingerprint },
                { id: "timeline", label: "Timeline", icon: CircleDot },
                { id: "article", label: "Transcript", icon: FileText },
                { id: "sources", label: "Integrity", icon: ShieldCheck },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as Tab)}
                  className={cn(
                    "py-6 text-[11px] font-mono font-bold uppercase tracking-[0.4em] transition-all relative whitespace-nowrap",
                    activeTab === t.id ? "text-primary" : "text-muted-foreground/30 hover:text-foreground"
                  )}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="articleTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary shadow-[0_0_15px_hsla(var(--primary),0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="min-h-[600px] relative">
              <AnimatePresence mode="wait">
                {activeTab === "summary" && (
                  <motion.div key="summary" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="space-y-24">
                    {article.aiSummary ? (
                      <>
                        <div className="text-3xl md:text-5xl text-foreground font-serif leading-[1.3] italic font-light tracking-tight drop-shadow-sm">
                          "{article.aiSummary}"
                        </div>

                        {article.bulletPoints && article.bulletPoints.length > 0 && (
                          <div className="space-y-16">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-6">
                               <div className="w-12 h-px bg-primary/20" /> Core_Signals
                            </h3>
                            <div className="grid gap-12">
                              {article.bulletPoints.map((bp: string, i: number) => (
                                <div key={i} className="bento-cell neuro-beam group">
                                  <div className="neuro-beam-inner flex gap-10 p-10 transition-all hover:bg-primary/[0.02]">
                                    <span className={cn(
                                      "text-primary/10 text-6xl font-mono font-bold italic leading-none transition-colors group-hover:text-primary/40",
                                    )}>{(i+1).toString().padStart(2, '0')}</span>
                                    <span className="text-xl text-foreground/70 leading-relaxed font-light mt-2">{bp}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {actors && actors.length > 0 && (
                          <div className="space-y-12">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40">Intelligence_Nodes_Identified</h3>
                            <div className="flex flex-wrap gap-x-16 gap-y-6">
                              {actors.map((actor: string, i: number) => (
                                <motion.span 
                                  key={i} 
                                  whileHover={{ x: 5, color: "var(--primary)" }}
                                  className="text-[14px] font-mono border-b border-primary/5 pb-2 text-foreground/30 font-medium tracking-tight cursor-default transition-all"
                                >
                                  {actor}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-40 bento-cell neuro-beam flex flex-col items-center">
                        <div className="neuro-beam-inner flex flex-col items-center w-full py-20">
                          <ScanLine className="w-16 h-16 text-primary/10 mb-10 animate-pulse" />
                          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-muted-foreground/40 mb-16">Neural_Synthesis_Pipeline_Inactive</p>
                          <MagneticButton
                            onClick={() => sumMut.mutate({ id: articleId })}
                            disabled={sumMut.isPending}
                            className="px-16 py-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.5em]"
                          >
                            {sumMut.isPending ? "Executing Analysis..." : "Initialize Synthesis"}
                          </MagneticButton>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "timeline" && (
                  <motion.div key="timeline" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="py-12">
                    {article.timeline && article.timeline.length > 0 ? (
                      <div className="space-y-24 relative pl-16 border-l border-white/5">
                        {article.timeline.map((event: any, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -30 }} 
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.1 }}
                            className="relative group"
                          >
                            <div className="absolute -left-[71px] top-3 w-3 h-3 rounded-full border border-primary bg-background shadow-[0_0_15px_hsla(var(--primary),0.8)] z-10 group-hover:scale-150 transition-transform" />
                            <div className="text-[10px] font-mono font-bold text-primary/40 uppercase tracking-[0.6em] mb-4">
                               {event.date}
                            </div>
                            <div className="text-3xl font-serif font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">{event.event}</div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-40 opacity-10">
                        <CircleDot className="w-20 h-20 mx-auto mb-8" />
                        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-muted-foreground/40">Temporal Signal Missing</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "article" && (
                  <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="py-12">
                    <div className="prose prose-invert prose-2xl max-w-none text-foreground/50 leading-[1.8] font-serif columns-1 md:columns-2 gap-20 font-light">
                      {article.content.split("\n").map((paragraph: string, i: number) => (
                        paragraph.trim() && <p key={i} className="mb-12 first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:text-primary/70">{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-32 pt-16 border-t border-white/5">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40 hover:text-primary transition-all flex items-center gap-4">
                        <Globe className="w-4 h-4" /> Audit_Primary_Data_Source_Node
                      </a>
                    </div>
                  </motion.div>
                )}

                {activeTab === "sources" && (
                  <motion.div key="sources" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="space-y-24">
                    {article.trustDetails ? (
                      <>
                        <div className="flex flex-col md:flex-row items-end justify-between gap-16 border-b border-white/5 pb-16">
                          <div className="space-y-4">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40">Verification_Protocol</h3>
                            <div className="font-serif text-5xl font-bold text-foreground">Ontological Audit</div>
                          </div>
                          <div className="flex items-center gap-20">
                            {trustPct != null && (
                              <DetailTrustMeter score={trustPct} label="Base Reliability" />
                            )}
                          </div>
                        </div>

                         <div className="bento-cell neuro-beam group">
                          <div className="neuro-beam-inner p-16 flex flex-col group transition-all hover:bg-primary/[0.01]">
                             <div className="absolute top-0 right-0 p-8">
                               <Fingerprint className="w-20 h-20 text-primary/5 transition-all group-hover:text-primary/10 group-hover:scale-110" />
                             </div>
                             <div className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/30 mb-10">Neural_Claim_Validation</div>
                             <p className={cn(
                               "text-3xl md:text-4xl leading-[1.3] text-foreground/80 font-light italic",
                               theme !== "dark" && "font-serif"
                             )}>"{mainClaim}"</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                          {[
                            { label: "Consensus Agreement", val: agreementLevel, color: agreementLevel === "High" ? "text-emerald-400" : agreementLevel === "Medium" ? "text-amber-400" : "text-rose-400" },
                            { label: "Corroboration Gap", val: article.trustDetails.sources.length.toString().padStart(2, '0'), color: "text-foreground" },
                            { label: "Logical Anomalies", val: article.trustDetails.contradictions.length > 0 ? article.trustDetails.contradictions.length.toString().padStart(2, '0') : "ZERO", color: article.trustDetails.contradictions.length > 0 ? "text-rose-500" : "text-emerald-400" }
                          ].map(stat => (
                            <div key={stat.label} className="space-y-6 bento-cell p-8 group hover:bg-white/[0.01] transition-all">
                               <div className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-primary/30">{stat.label}</div>
                               <div className={cn("text-2xl font-mono font-bold tabular-nums tracking-widest", stat.color)}>{stat.val}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-12 max-w-4xl bento-cell p-12 border-white/5 bg-primary/[0.01]">
                           <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/40">Intelligence_Rationale_Trace</h4>
                           <p className="text-2xl text-foreground/60 leading-relaxed font-light italic pl-10 border-l border-primary/20">
                             {article.trustDetails.reasoning}
                           </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-24">
                          <section className="space-y-10">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-emerald-400/40 flex items-center gap-6">
                              <CheckCircle2 className="w-5 h-5" /> Supporting_Nodes
                            </h4>
                            <ul className="space-y-8">
                              {article.trustDetails.sources.map((s: string, i: number) => (
                                <li key={i} className="text-sm font-mono text-foreground/40 border-l border-emerald-500/10 pl-8 py-2 leading-relaxed font-light italic">
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </section>

                          <section className="space-y-10">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-rose-500/40 flex items-center gap-6">
                              <XCircle className="w-5 h-5" /> Contradictory_Vectors
                            </h4>
                            {article.trustDetails.contradictions.length > 0 ? (
                              <ul className="space-y-8">
                                {article.trustDetails.contradictions.map((c: string, i: number) => (
                                  <li key={i} className="text-sm font-mono text-foreground/40 border-l border-rose-500/10 pl-8 py-2 leading-relaxed font-light">
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-12 bento-cell border-emerald-500/5 text-center text-[9px] font-mono font-bold uppercase tracking-[0.6em] text-emerald-500/20">
                                Zero_Conflict_Detected
                              </div>
                            )}
                          </section>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-48 bento-cell neuro-beam flex flex-col items-center">
                        <div className="neuro-beam-inner flex flex-col items-center w-full py-20">
                          <ShieldCheck className="w-20 h-20 text-primary/10 mb-12 animate-pulse" />
                          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-muted-foreground/40 mb-20">Integrity_Matrix_Unevaluated</p>
                          <MagneticButton
                            onClick={() => verMut.mutate({ id: articleId })}
                            disabled={verMut.isPending}
                            className="px-16 py-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.5em]"
                          >
                            {verMut.isPending ? "Executing Protocol..." : "Initiate Verification"}
                          </MagneticButton>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
