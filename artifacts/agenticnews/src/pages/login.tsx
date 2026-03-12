import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import {
  Globe, ShieldCheck, Zap, Sparkles, ArrowLeft,
  Brain, BarChart3, MessageSquare, Mail, ArrowRight,
} from "lucide-react";

const perks = [
  { icon: Brain, label: "AI summaries & key points on every article" },
  { icon: ShieldCheck, label: "Trust scores with source cross-referencing" },
  { icon: BarChart3, label: "Daily intelligence brief curated by AI" },
  { icon: MessageSquare, label: "Ask AI Oracle — RAG-powered news Q&A" },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    login();
  }

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

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — perks (desktop only) */}
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
            <div className="mt-10 pt-8 border-t border-border/40 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant access
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Always free
              </div>
            </div>
          </motion.div>

          {/* Right — auth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-2xl shadow-black/50">

                {/* Header */}
                <div className="text-center mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-xl font-bold text-white mb-1">Welcome to AgenticNews</h1>
                  <p className="text-muted-foreground text-sm">Choose how you'd like to sign in</p>
                </div>

                {/* OAuth buttons */}
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={login}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200/20 shadow-sm"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
                    ) : (
                      <>
                        <GoogleIcon className="w-5 h-5 shrink-0" />
                        <span className="text-[14px] font-semibold text-gray-700 flex-1 text-center">Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* GitHub */}
                  <button
                    onClick={login}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#24292f] hover:bg-[#2f363d] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 shadow-sm"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      <>
                        <GitHubIcon className="w-5 h-5 text-white shrink-0" />
                        <span className="text-[14px] font-semibold text-white flex-1 text-center">Continue with GitHub</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-xs text-muted-foreground/60 font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                {/* Email form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border bg-secondary/20 transition-all duration-150 ${emailFocused ? "border-primary/60 ring-2 ring-primary/10" : "border-border/50"}`}>
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        Continue with Email
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-xs text-muted-foreground/60">or</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                {/* Browse without account */}
                <Link href="/home">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30 font-medium text-sm transition-all">
                    Browse without an account
                  </button>
                </Link>

                <p className="text-center text-[11px] text-muted-foreground/50 mt-5 leading-relaxed">
                  By continuing, you agree to our Terms of Service.<br />
                  Your data is never sold or shared.
                </p>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-5 mt-4 text-xs text-muted-foreground">
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

      <footer className="border-t border-border/40 py-5 text-center">
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} AgenticNews — Intelligence applied to global events.
        </p>
      </footer>
    </div>
  );
}
