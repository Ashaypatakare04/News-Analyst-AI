import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Globe, ShieldCheck, Zap, Sparkles, ArrowLeft, LogIn,
  Brain, BarChart3, MessageSquare
} from "lucide-react";

const perks = [
  { icon: Brain, label: "AI summaries & key points on every article" },
  { icon: ShieldCheck, label: "Trust scores with source cross-referencing" },
  { icon: BarChart3, label: "Daily intelligence brief curated by AI" },
  { icon: MessageSquare, label: "Ask AI Oracle — RAG-powered news Q&A" },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-violet-500 to-primary" />

      {/* Minimal nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <Globe className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-white">
            Agentic<span className="text-primary font-sans font-medium">News</span>
          </span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </header>

      {/* Main — two-column on large, stacked on mobile */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — perks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> AI Intelligence Platform
            </div>

            <h2 className="font-serif text-4xl font-bold text-white leading-tight mb-5">
              Intelligence,<br />
              <span className="text-primary italic">delivered.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Sign in to unlock the full AgenticNews experience — real-time summaries, fact-checking, audio briefings, and more.
            </p>

            <ul className="space-y-4">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-border/40 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure login
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant access
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Always free
              </div>
            </div>
          </motion.div>

          {/* Right — sign-in card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              {/* Card */}
              <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-2xl shadow-black/50">

                {/* Logo mark */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 shadow-inner">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1.5">Sign in</h1>
                  <p className="text-muted-foreground text-sm text-center">
                    Access AI-powered news intelligence
                  </p>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={login}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Continue with Replit
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground/60">or</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Browse without signing in */}
                <Link href="/home">
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-border/60 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/40 font-medium text-sm transition-all duration-150">
                    Browse without an account
                  </button>
                </Link>

                <p className="text-center text-xs text-muted-foreground/60 mt-6 leading-relaxed">
                  By signing in you agree to our terms.<br />
                  Your data is never sold or shared.
                </p>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-5 mt-5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Free
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} AgenticNews — Intelligence applied to global events.
        </p>
      </footer>
    </div>
  );
}
