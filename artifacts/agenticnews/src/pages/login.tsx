import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Newspaper,
  Sparkles,
  ShieldCheck,
  Mic,
  Languages,
  MessageSquare,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    label: "AI Summaries",
    desc: "Key points extracted in seconds",
  },
  {
    icon: ShieldCheck,
    label: "Fact Checking",
    desc: "Trust scores on every article",
  },
  {
    icon: Mic,
    label: "Audio Briefings",
    desc: "Listen to news hands-free",
  },
  {
    icon: Languages,
    label: "Translations",
    desc: "Read in any language",
  },
  {
    icon: MessageSquare,
    label: "Ask AI Oracle",
    desc: "Chat with a RAG-powered AI",
  },
  {
    icon: Zap,
    label: "Live Feed",
    desc: "Breaking stories in real time",
  },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-primary" />

      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <Newspaper className="w-4 h-4 text-primary" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-white">
            Agentic<span className="text-primary font-sans font-medium">News</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Browse without signing in
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">

          {/* Left — value prop */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered News Intelligence
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              The news,{" "}
              <span className="text-primary italic">understood.</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              AgenticNews uses cutting-edge AI to summarize, fact-check, translate, and
              explain the stories that matter — so you read smarter, not longer.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — sign-in card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-sm">
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-2xl shadow-black/40">
                {/* Card header */}
                <div className="text-center mb-8">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Newspaper className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                  <p className="text-muted-foreground text-sm">
                    Sign in to unlock all AI features
                  </p>
                </div>

                {/* Sign in button */}
                <button
                  onClick={login}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Continue with Replit
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Browse link */}
                <Link href="/">
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/40 font-medium text-sm transition-all duration-150">
                    <Newspaper className="w-4 h-4" />
                    Browse headlines
                  </button>
                </Link>

                {/* Fine print */}
                <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
                  By signing in you agree to our terms of service.
                  <br />
                  Your data is never sold or shared.
                </p>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Secure login
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Instant access
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI-powered
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AgenticNews — Intelligence applied to global events.
        </p>
      </footer>
    </div>
  );
}
