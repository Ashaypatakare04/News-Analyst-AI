import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Brain, ShieldCheck, Mic, Languages, MessageSquare,
  Zap, ArrowRight, Sparkles, Globe, BarChart3,
  TrendingUp, BookOpen, Upload, ChevronRight, Target
} from "lucide-react";

const features = [
  {
    icon: Brain,
    color: "text-primary bg-primary/10 border-primary/20",
    label: "AI Summaries",
    desc: "Every article distilled into bullet-point intelligence in seconds — no fluff, just signal.",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    label: "Fact Verification",
    desc: "Dynamic trust scores with source cross-referencing, agreement levels, and contradiction detection.",
  },
  {
    icon: MessageSquare,
    color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    label: "Ask AI Oracle",
    desc: "Chat with a RAG-powered analyst that synthesizes all indexed articles to answer your questions.",
  },
  {
    icon: BarChart3,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    label: "Daily Intelligence Brief",
    desc: "3 key events, 2 emerging signals, 1 strategic insight — curated by AI every morning.",
  },
  {
    icon: Mic,
    color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    label: "Audio Briefings",
    desc: "Listen to AI-narrated article summaries hands-free while commuting or working.",
  },
  {
    icon: Languages,
    color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    label: "Real-time Translation",
    desc: "Read any article in Spanish, French, German, Chinese, Arabic and more instantly.",
  },
];

const stats = [
  { value: "49+", label: "Articles indexed" },
  { value: "6", label: "AI capabilities" },
  { value: "88%", label: "Avg confidence score" },
  { value: "Live", label: "News engine" },
];

const sampleIntelligence = {
  signal: "Iran conflict threatens global energy",
  insight: "Escalation around the Strait of Hormuz is rapidly translating into systemic energy and logistics disruption, raising the risk of sustained inflation.",
  confidence: 88,
};

export default function LandingPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-violet-500 to-primary" />

      {/* Nav */}
      <header className="sticky top-[2px] z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white">
              Agentic<span className="text-primary font-sans font-medium">News</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/home" className="hover:text-foreground transition-colors">Headlines</Link>
            <Link href="/brief" className="hover:text-foreground transition-colors">Daily Brief</Link>
            <Link href="/ask" className="hover:text-foreground transition-colors">Ask AI</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/home" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/login">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                Sign in <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              AI-Powered News Intelligence — Live
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
              The news,{" "}
              <span className="relative inline-block">
                <span className="text-primary italic">understood.</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/50 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </h1>

            <p className="text-muted-foreground text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              AgenticNews uses advanced AI to summarize, fact-check, translate, and synthesize
              global news — so you spend less time reading and more time knowing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <button className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/home">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-border/60 text-foreground/80 font-medium text-base hover:bg-secondary/40 hover:text-foreground transition-all">
                  Browse Headlines
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/40 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/40">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex flex-col items-center py-6 px-4 text-center"
            >
              <span className="text-3xl font-bold text-foreground mb-1">{s.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Intelligence Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Live Intelligence, Right Now
            </h2>
            <p className="text-muted-foreground text-lg">
              A live preview of today's AI-generated intelligence signal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden shadow-2xl shadow-primary/5"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/20">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">Today's Intelligence</h3>
                <p className="text-xs text-muted-foreground">AI-generated signal · Updated live</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                </span>
                Live
              </div>
            </div>

            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Signal</span>
                </div>
                <p className="text-base font-bold text-foreground leading-snug">{sampleIntelligence.signal}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Insight</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{sampleIntelligence.insight}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confidence</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{sampleIntelligence.confidence}%</div>
                <div className="w-full bg-secondary/50 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary/70 w-[88%]" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Based on 20 sources</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Sign in to get live, personalized intelligence</p>
              <Link href="/login">
                <button className="text-xs text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Get access <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Every AI tool you need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AgenticNews isn't a news reader — it's an intelligence platform built around AI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1.5">{label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg">From raw headlines to deep intelligence in four steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Globe, step: "01", label: "Live Fetch", desc: "NewsAPI delivers breaking headlines across 8 categories in real time." },
              { icon: Brain, step: "02", label: "AI Analysis", desc: "GPT generates structured summaries, actors, timelines, and key points." },
              { icon: ShieldCheck, step: "03", label: "Fact Check", desc: "Cross-reference logic produces a numeric trust score and agreement level." },
              { icon: TrendingUp, step: "04", label: "Intelligence", desc: "AI synthesizes all signals into the daily brief, trending topics, and key insights." },
            ].map(({ icon: Icon, step, label, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/60 tracking-widest">STEP {step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-5" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Start reading smarter today
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Free to use. No subscription. Just AI-powered news intelligence at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <button className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/25">
                    Sign in with Replit
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/home">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-border/60 text-muted-foreground font-medium hover:text-foreground hover:bg-secondary/30 transition-all">
                    <BookOpen className="w-4 h-4" />
                    Browse headlines
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 opacity-70">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-serif font-semibold text-sm text-foreground">AgenticNews</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/home" className="hover:text-foreground transition-colors">Headlines</Link>
            <Link href="/brief" className="hover:text-foreground transition-colors">Daily Brief</Link>
            <Link href="/ask" className="hover:text-foreground transition-colors">Ask AI</Link>
            <Link href="/upload" className="hover:text-foreground transition-colors">Scan News</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgenticNews — Intelligence applied to global events.
          </p>
        </div>
      </footer>
    </div>
  );
}
