import { Layout } from "@/components/layout";
import { TrustBadge } from "@/components/trust-badge";
import { getCategoryColor } from "@/components/article-card";
import {
  useGetArticle,
  useSummarizeArticle,
  useVerifyArticle,
  useGenerateAudio,
  useTranslateArticle
} from "@workspace/api-client-react";
import { format } from "date-fns";
import {
  ArrowLeft, Brain, ShieldCheck, Headphones, Languages, Loader2, Play,
  CircleDot, FileText, CheckCircle2, XCircle, Users, TrendingUp,
  BarChart3, AlertTriangle, Info
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getGetArticleQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "summary" | "timeline" | "article" | "sources";

function TrustMeter({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-rose-400";
  const barColor = score >= 75 ? "from-emerald-500 to-emerald-400" : score >= 40 ? "from-amber-500 to-amber-400" : "from-rose-500 to-rose-400";
  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <div className={cn("text-3xl font-bold tabular-nums", color)}>{score}%</div>
      <div className="w-full bg-secondary/50 rounded-full h-1.5">
        <div className={cn("h-1.5 rounded-full bg-gradient-to-r transition-all duration-1000", barColor)} style={{ width: `${score}%` }} />
      </div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [targetLang, setTargetLang] = useState("es");
  const [showTranslate, setShowTranslate] = useState(false);

  const { data: article, isLoading } = useGetArticle(articleId, {
    query: { enabled: !!articleId, queryKey: getGetArticleQueryKey(articleId) }
  });

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: getGetArticleQueryKey(articleId) });
    toast({ title: "Success", description: message });
  };
  const onError = () => toast({ title: "Error", description: "Action failed. Please try again.", variant: "destructive" });

  const sumMut = useSummarizeArticle({ mutation: { onSuccess: () => onSuccess("Summary generated"), onError } });
  const verMut = useVerifyArticle({ mutation: { onSuccess: () => onSuccess("Verification complete"), onError } });
  const audMut = useGenerateAudio({ mutation: { onSuccess: () => onSuccess("Audio generated"), onError } });
  const trMut = useTranslateArticle({ mutation: { onSuccess: () => { onSuccess("Translation complete"); setShowTranslate(false); }, onError } });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Article not found</h2>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">Return home</Link>
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
      <div className="w-full relative bg-background">
        {/* Hero */}
        <div className="relative w-full h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden">
          <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-6 transition-colors group bg-background/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-border/20 w-fit">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </Link>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={cn("px-3 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-md", getCategoryColor(article.category))}>
                  {article.category}
                </span>
                <span className="text-foreground/80 text-sm font-medium">
                  {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-foreground drop-shadow-xl">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center font-serif font-bold text-lg text-primary">
                    {article.source.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{article.source}</div>
                    {article.author && <div className="text-muted-foreground text-xs">{article.author}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Trust Panel & Actions */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card border border-border/50 rounded-2xl p-4 md:p-6 mb-10 -mt-16 relative z-10 shadow-2xl">
            <div className="flex items-center gap-5">
              {trustPct != null ? (
                <TrustMeter score={trustPct} label={`${article.trustScore ?? ""} Trust`} />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="shrink-0 p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <ShieldCheck className={cn("w-6 h-6",
                      article.trustScore === "High" ? "text-emerald-400" :
                      article.trustScore === "Medium" ? "text-amber-400" :
                      article.trustScore === "Low" ? "text-rose-400" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Trust Status</div>
                    <div className="text-lg font-bold">{article.trustScore || "Pending"}</div>
                  </div>
                </div>
              )}
              {agreementLevel && (
                <div className="hidden sm:block border-l border-border/50 pl-5">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Agreement</div>
                  <div className={cn("text-sm font-bold",
                    agreementLevel === "High" ? "text-emerald-400" :
                    agreementLevel === "Medium" ? "text-amber-400" : "text-rose-400"
                  )}>{agreementLevel}</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => sumMut.mutate({ id: articleId })}
                disabled={sumMut.isPending}
                className="shrink-0 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {sumMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                AI Summary
              </button>

              <button
                onClick={() => verMut.mutate({ id: articleId })}
                disabled={verMut.isPending}
                className="shrink-0 px-4 py-2 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {verMut.isPending ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                Verify
              </button>

              <button
                onClick={() => audMut.mutate({ id: articleId })}
                disabled={audMut.isPending}
                className="shrink-0 px-4 py-2 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {audMut.isPending ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Headphones className="w-4 h-4 text-purple-400" />}
                Audio
              </button>

              <div className="relative shrink-0">
                <button
                  onClick={() => setShowTranslate(!showTranslate)}
                  className="px-4 py-2 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Languages className="w-4 h-4 text-blue-400" />
                  Translate
                </button>

                <AnimatePresence>
                  {showTranslate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 bg-card border border-border/50 rounded-2xl shadow-2xl p-4 min-w-[220px] z-50 origin-top-right"
                    >
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Target Language</h4>
                      <select
                        value={targetLang} onChange={e => setTargetLang(e.target.value)}
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl p-2.5 text-sm mb-4 outline-none focus:border-primary/50"
                      >
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ar">Arabic</option>
                        <option value="pt">Portuguese</option>
                        <option value="ja">Japanese</option>
                      </select>
                      <button
                        onClick={() => trMut.mutate({ id: articleId, data: { targetLanguage: targetLang } })}
                        disabled={trMut.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        {trMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Start Translation"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {article.audioUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
                <Play className="w-7 h-7 ml-1 fill-current" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">AI Audio Briefing</div>
                <div className="text-lg font-semibold text-foreground mb-3">{article.title} — Overview</div>
                <audio controls src={article.audioUrl} className="w-full h-10 rounded-full outline-none [&::-webkit-media-controls-panel]:bg-secondary [&::-webkit-media-controls-panel]:text-foreground" />
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mb-8 relative">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-border/50 hide-scrollbar">
              {[
                { id: "summary", label: "AI Summary", icon: Brain },
                { id: "timeline", label: "Timeline", icon: CircleDot },
                { id: "article", label: "Full Text", icon: FileText },
                { id: "sources", label: "Verification", icon: ShieldCheck },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative text-sm md:text-base",
                    activeTab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                  )}
                >
                  <t.icon className={cn("w-4 h-4", activeTab === t.id ? "text-primary" : "opacity-70")} />
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">

              {/* Summary Tab */}
              {activeTab === "summary" && (
                <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  {article.aiSummary ? (
                    <>
                      <div className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-serif">
                        {article.aiSummary}
                      </div>

                      {article.bulletPoints && article.bulletPoints.length > 0 && (
                        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
                          <h3 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-wide text-muted-foreground">
                            <Brain className="w-4 h-4 text-primary" /> Key Points
                          </h3>
                          <ul className="space-y-4">
                            {article.bulletPoints.map((bp, i) => (
                              <li key={i} className="flex gap-4">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span className="text-base text-foreground/80 leading-relaxed">{bp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {actors && actors.length > 0 && (
                        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
                          <h3 className="text-sm font-bold mb-5 flex items-center gap-2 uppercase tracking-wide text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" /> Key Actors
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {actors.map((actor, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                                {actor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-24 border-2 border-dashed border-border/50 rounded-3xl">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium mb-2">No summary yet</p>
                      <p className="text-muted-foreground text-sm mb-6">Generate an AI-powered structured summary with key points and actors.</p>
                      <button
                        onClick={() => sumMut.mutate({ id: articleId })}
                        disabled={sumMut.isPending}
                        className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                      >
                        {sumMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        Generate AI Summary
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-6">
                  {article.timeline && article.timeline.length > 0 ? (
                    <div className="relative border-l-2 border-border/50 ml-4 md:ml-8 space-y-12 pb-8">
                      {article.timeline.map((event, i) => (
                        <div key={i} className="relative pl-8 md:pl-12">
                          <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[9px] top-1.5 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                            {event.date}
                          </div>
                          <div className="text-lg font-medium text-foreground/90 leading-snug bg-card p-5 rounded-2xl border border-border/50 shadow-sm">{event.event}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 border-2 border-dashed border-border/50 rounded-3xl">
                      <CircleDot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium mb-2">No timeline extracted</p>
                      <p className="text-muted-foreground text-sm">Generate an AI summary first — the timeline is extracted automatically.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Full Text Tab */}
              {activeTab === "article" && (
                <motion.div key="article" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="prose prose-invert prose-lg max-w-none text-foreground/80 leading-relaxed font-serif">
                    {article.content.split("\n").map((paragraph, i) => (
                      paragraph.trim() && <p key={i} className="mb-6">{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-border/50">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                      Read original at {article.source} →
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Verification Tab */}
              {activeTab === "sources" && (
                <motion.div key="sources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  {article.trustDetails ? (
                    <>
                      {/* Trust Score Header */}
                      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-border/50">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">Verification Report</h3>
                            <p className="text-muted-foreground text-sm">Cross-referenced against global credible sources.</p>
                          </div>
                          <div className="flex items-center gap-6">
                            {trustPct != null && (
                              <TrustMeter score={trustPct} label="Trust Score" />
                            )}
                            <TrustBadge score={article.trustScore} className="scale-110 md:scale-125 md:origin-right" />
                          </div>
                        </div>

                        {/* Main Claim */}
                        {mainClaim && (
                          <div className="mb-8 p-5 rounded-2xl bg-secondary/30 border border-border/50">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Claim</span>
                            </div>
                            <p className="text-foreground/90 font-medium">{mainClaim}</p>
                          </div>
                        )}

                        {/* Agreement + Stats */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-8">
                          {agreementLevel && (
                            <div className="bg-secondary/20 rounded-2xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agreement</span>
                              </div>
                              <div className={cn("text-lg font-bold",
                                agreementLevel === "High" ? "text-emerald-400" :
                                agreementLevel === "Medium" ? "text-amber-400" : "text-rose-400"
                              )}>{agreementLevel}</div>
                            </div>
                          )}
                          <div className="bg-secondary/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sources Used</span>
                            </div>
                            <div className="text-lg font-bold text-foreground">{article.trustDetails.sources.length}</div>
                          </div>
                          <div className="bg-secondary/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contradictions</span>
                            </div>
                            <div className={cn("text-lg font-bold", article.trustDetails.contradictions.length > 0 ? "text-rose-400" : "text-emerald-400")}>
                              {article.trustDetails.contradictions.length > 0 ? article.trustDetails.contradictions.length : "None"}
                            </div>
                          </div>
                        </div>

                        {/* Reasoning */}
                        <div className="mb-8">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Analysis Reasoning</h4>
                          <div className="bg-secondary/30 p-5 rounded-2xl text-base text-foreground/90 leading-relaxed">
                            {article.trustDetails.reasoning}
                          </div>
                        </div>

                        {/* Evidence + Contradictions */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 bg-emerald-400/10 px-4 py-2 rounded-xl w-fit text-sm">
                              <CheckCircle2 className="w-4 h-4" /> Evidence
                            </h4>
                            <ul className="space-y-2.5">
                              {article.trustDetails.sources.map((s, i) => (
                                <li key={i} className="flex gap-3 text-sm text-foreground/80 bg-secondary/20 p-3.5 rounded-xl border border-border/30">
                                  <span className="text-emerald-400 font-bold mt-0.5">✓</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-4 bg-rose-400/10 px-4 py-2 rounded-xl w-fit text-sm">
                              <XCircle className="w-4 h-4" /> Contradictions
                            </h4>
                            {article.trustDetails.contradictions.length > 0 ? (
                              <ul className="space-y-2.5">
                                {article.trustDetails.contradictions.map((c, i) => (
                                  <li key={i} className="flex gap-3 text-sm text-foreground/80 bg-rose-400/5 border border-rose-400/20 p-3.5 rounded-xl">
                                    <span className="text-rose-400 font-bold mt-0.5">!</span> {c}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-emerald-400/80 bg-emerald-400/5 border border-emerald-400/20 p-5 rounded-xl text-center flex flex-col items-center gap-2">
                                <CheckCircle2 className="w-7 h-7 opacity-50" />
                                <span className="font-medium">No contradictions detected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-24 border-2 border-dashed border-border/50 rounded-3xl">
                      <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium mb-2">Analysis Pending</p>
                      <p className="text-muted-foreground text-sm mb-6">Run verification to get a trust score, claim analysis, agreement level, and source cross-check.</p>
                      <button
                        onClick={() => verMut.mutate({ id: articleId })}
                        disabled={verMut.isPending}
                        className="mt-2 px-6 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-medium hover:bg-emerald-500/30 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {verMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Run Verification Engine
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
