import { Layout } from "@/components/layout";
import { TrustBadge } from "@/components/trust-badge";
import { 
  useGetArticle, 
  useSummarizeArticle, 
  useVerifyArticle, 
  useGenerateAudio, 
  useTranslateArticle 
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { 
  ArrowLeft, Brain, ShieldCheck, Headphones, Languages, Loader2, Play, CircleDot, FileText, CheckCircle2, XCircle
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getGetArticleQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type Tab = "summary" | "timeline" | "article" | "sources";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [targetLang, setTargetLang] = useState("es");
  const [showTranslate, setShowTranslate] = useState(false);

  const { data: article, isLoading } = useGetArticle(articleId);

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

  {/* default image if missing */}
  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to top stories
        </Link>

        {/* Hero Section */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <TrustBadge score={article.trustScore} />
            <span className="text-muted-foreground text-sm font-medium">
              {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              By <span className="text-foreground">{article.author || article.source}</span>
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border/50 shadow-lg">
              <button 
                onClick={() => sumMut.mutate({ id: articleId })}
                disabled={sumMut.isPending}
                className="p-2 md:px-4 md:py-2 rounded-lg hover:bg-secondary text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {sumMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4 text-primary" />}
                <span className="hidden md:inline">Summarize</span>
              </button>
              
              <div className="w-px h-6 bg-border/50" />
              
              <button 
                onClick={() => verMut.mutate({ id: articleId })}
                disabled={verMut.isPending}
                className="p-2 md:px-4 md:py-2 rounded-lg hover:bg-secondary text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {verMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span className="hidden md:inline">Verify</span>
              </button>

              <div className="w-px h-6 bg-border/50" />
              
              <button 
                onClick={() => audMut.mutate({ id: articleId })}
                disabled={audMut.isPending}
                className="p-2 md:px-4 md:py-2 rounded-lg hover:bg-secondary text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {audMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Headphones className="w-4 h-4 text-purple-400" />}
                <span className="hidden md:inline">Listen</span>
              </button>

              <div className="w-px h-6 bg-border/50" />

              <div className="relative">
                <button 
                  onClick={() => setShowTranslate(!showTranslate)}
                  className="p-2 md:px-4 md:py-2 rounded-lg hover:bg-secondary text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Languages className="w-4 h-4 text-blue-400" />
                  <span className="hidden md:inline">Translate</span>
                </button>
                
                <AnimatePresence>
                  {showTranslate && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl p-3 min-w-[200px] z-10"
                    >
                      <select 
                        value={targetLang} onChange={e => setTargetLang(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg p-2 text-sm mb-3"
                      >
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                      <button
                        onClick={() => trMut.mutate({ id: articleId, data: { targetLanguage: targetLang } })}
                        disabled={trMut.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {trMut.isPending ? "Translating..." : "Translate"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
          
          {article.audioUrl && (
            <div className="mt-6 bg-secondary/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4">
              <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                <Play className="w-5 h-5 ml-1" />
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">AI Podcast Summary</div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-primary w-1/3 h-full rounded-full" />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Content Tabs */}
        <div className="mb-8 border-b border-border/50 flex overflow-x-auto scrollbar-hide">
          {[
            { id: "summary", label: "AI Summary", icon: Brain },
            { id: "timeline", label: "Timeline", icon: CircleDot },
            { id: "article", label: "Full Article", icon: FileText },
            { id: "sources", label: "Verification", icon: ShieldCheck },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === t.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "summary" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {article.aiSummary ? (
                <>
                  <div className="prose prose-invert prose-lg max-w-none text-foreground/90 leading-relaxed font-serif">
                    {article.aiSummary}
                  </div>
                  {article.bulletPoints && article.bulletPoints.length > 0 && (
                    <div className="bg-secondary/20 border border-border/50 rounded-2xl p-6 md:p-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" /> Key Insights
                      </h3>
                      <ul className="space-y-3">
                        {article.bulletPoints.map((bp, i) => (
                          <li key={i} className="flex gap-3 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span className="leading-relaxed">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No summary available</p>
                  <button 
                    onClick={() => sumMut.mutate({ id: articleId })}
                    className="text-primary hover:underline font-medium"
                  >
                    Generate one now
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
              {article.timeline && article.timeline.length > 0 ? (
                <div className="relative border-l-2 border-border ml-4 md:ml-6 space-y-10">
                  {article.timeline.map((event, i) => (
                    <div key={i} className="relative pl-8 md:pl-10">
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 ring-4 ring-background" />
                      <div className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">{event.date}</div>
                      <div className="text-lg font-medium text-foreground/90">{event.event}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
                  <CircleDot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No timeline extracted</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "article" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="prose prose-invert prose-lg max-w-none text-foreground/80 leading-relaxed font-serif">
                {article.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "sources" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {article.trustDetails ? (
                <>
                  <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                      <TrustBadge score={article.trustScore} className="scale-125 origin-left" />
                      <p className="text-muted-foreground font-medium text-lg">Detailed Verification Report</p>
                    </div>
                    
                    <h4 className="text-xl font-bold mb-3">Reasoning</h4>
                    <p className="text-muted-foreground leading-relaxed mb-8">{article.trustDetails.reasoning}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                          <CheckCircle2 className="w-5 h-5" /> Corroborating Sources
                        </h4>
                        <ul className="space-y-3">
                          {article.trustDetails.sources.map((s, i) => (
                            <li key={i} className="flex gap-2 text-sm text-foreground/80 bg-secondary/30 p-3 rounded-xl border border-border/50">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-4">
                          <XCircle className="w-5 h-5" /> Contradictions / Flags
                        </h4>
                        {article.trustDetails.contradictions.length > 0 ? (
                          <ul className="space-y-3">
                            {article.trustDetails.contradictions.map((c, i) => (
                              <li key={i} className="flex gap-2 text-sm text-foreground/80 bg-rose-400/5 border border-rose-400/20 p-3 rounded-xl">
                                • {c}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl text-center italic">
                            No major contradictions found across verified sources.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
                  <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Not verified yet</p>
                  <button 
                    onClick={() => verMut.mutate({ id: articleId })}
                    className="text-primary hover:underline font-medium"
                  >
                    Run verification engine
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
