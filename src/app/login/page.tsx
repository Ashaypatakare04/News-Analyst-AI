"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ShieldCheck, ArrowLeft,
  Brain, BarChart3, Fingerprint, Mail, ArrowRight,
  Eye, Target, Info, Activity, Globe, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";

const perks = [
  { icon: Brain, label: "Autonomous synthesis of global events" },
  { icon: ShieldCheck, label: "Institutional-grade verification floor" },
  { icon: Target, label: "Strategic cross-referencing of indices" },
  { icon: Fingerprint, label: "Real-time sentient intelligence pipeline" },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
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
  const { theme } = useTheme();
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    login();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 cursor-none relative overflow-hidden">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="mesh-bg" />
        <div className="bg-noise absolute inset-0" />
      </div>

      {/* Minimal Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-12">
        <Link href="/" className="group flex items-center gap-6">
          <div className="w-12 h-12 border-l border-t border-primary/20 flex items-center justify-center group-hover:border-primary transition-all glass">
             <span className={cn("text-xl font-bold text-primary", theme !== "dark" && "font-serif")}>A</span>
          </div>
          <span className={cn(
            "font-bold text-3xl tracking-tighter text-foreground leading-none",
            theme !== "dark" && "font-serif"
          )}>
            AGENTIC<span className="text-primary/40 font-sans font-light tracking-[0.4em] ml-2 text-[11px]">INTEL</span>
          </span>
        </Link>
        <Link href="/" className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.5em] text-primary/40 hover:text-primary transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Terminal
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-10 py-24">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-32 items-center">

          {/* Institutional Context */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="hidden lg:block space-y-16"
          >
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4 group">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-live" />
                <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-primary/40 group-hover:tracking-[0.7em] transition-all">Identity Verification Required</span>
              </div>
              <h2 className={cn(
                "text-6xl md:text-8xl font-bold text-foreground leading-[0.9] tracking-tighter text-gradient",
                theme !== "dark" && "font-serif"
              )}>
                Access<br />
                <span className="italic font-light opacity-30">the intelligence.</span>
              </h2>
            </div>
            
            <p className="text-muted-foreground/60 text-xl leading-relaxed font-light max-w-lg">
              Authorized access is mandatory for full neural synthesis synchronization. Identity mapping ensures precision directive delivery across the global index.
            </p>

            <ul className="space-y-12">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-10 group cursor-default">
                  <div className="w-12 h-12 glass border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all">
                    <Icon className="w-5 h-5 text-primary opacity-20 group-hover:opacity-60 transition-opacity" />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-foreground/30 group-hover:text-foreground/70 transition-colors">{label}</span>
                </li>
              ))}
            </ul>

            <div className="pt-16 border-t border-white/5 flex items-center gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/20">
              <span className="flex items-center gap-4"><ShieldCheck className="w-4 h-4" /> Integrity Verified</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" /> 256-bit Sync</span>
            </div>
          </motion.div>

          {/* Access Terminal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <AntiGravityCard intensity={15} float={true} className="w-full max-w-xl">
              <div className="glass p-16 border-white/5 shadow-2xl relative group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                
                <div className="text-center mb-16 relative">
                  <h1 className={cn(
                    "text-4xl font-bold text-foreground mb-4 tracking-tight",
                    theme !== "dark" && "font-serif"
                  )}>Entrance Terminal</h1>
                  <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary/30">Authorize Identity Chain</p>
                </div>

                {/* OAuth Terminal Buttons */}
                <div className="space-y-6">
                  <MagneticButton
                    onClick={login}
                    disabled={isLoading}
                    className="w-full flex items-center gap-8 p-6 glass border-white/5 hover:border-primary/40 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                    ) : (
                      <>
                        <GoogleIcon className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.5em] flex-1 text-left">Sync via Google</span>
                      </>
                    )}
                  </MagneticButton>

                  <MagneticButton
                    onClick={login}
                    disabled={isLoading}
                    className="w-full flex items-center gap-8 p-6 glass border-white/5 hover:border-primary/40 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                    ) : (
                      <>
                        <GitHubIcon className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity text-foreground" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.5em] flex-1 text-left">Sync via GitHub</span>
                      </>
                    )}
                  </MagneticButton>
                </div>

                {/* Lexical Divider */}
                <div className="flex items-center gap-8 my-14 opacity-10">
                  <div className="flex-1 h-px bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em]">DIRECT PROBE</span>
                  <div className="flex-1 h-px bg-primary" />
                </div>

                {/* Lexical Pipeline Access */}
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className={cn(
                    "flex items-center gap-6 p-6 glass transition-all duration-500",
                    emailFocused ? "border-primary/40 ring-1 ring-primary/20" : "border-white/5"
                  )}>
                    <Mail className="w-5 h-5 text-primary/20 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="ACCESS@AGENTIC.INTEL"
                      className="flex-1 bg-transparent text-[12px] font-bold uppercase tracking-[0.3em] outline-none placeholder:text-muted-foreground/10 text-foreground"
                    />
                  </div>
                  <MagneticButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.6em] transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-6">
                        Incorporate <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </MagneticButton>
                </form>

                <div className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.6em] text-primary/20 hover:text-primary transition-all cursor-pointer">
                  <Link href="/home">Initialize as Anonymous Observer</Link>
                </div>

                <div className="mt-16 pt-12 border-t border-white/5 flex flex-col items-center gap-3">
                   <div className="flex items-center gap-4 text-[9px] font-bold text-primary/10 uppercase tracking-[0.7em]">
                      <Activity className="w-3 h-3" /> PERSISTENCE ACTIVE
                   </div>
                   <div className="text-[8px] font-bold text-primary/5 uppercase tracking-[0.4em]">
                     Encrypted session stream verified via RSA-4096.
                   </div>
                </div>
              </div>
            </AntiGravityCard>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 py-16 px-10 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5">
        <div className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.7em]">
            SITE-RECOGNITION: ALPHA SECTOR 
        </div>
        <div className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} AGENTIC INTEL IMPRINT.
        </div>
      </footer>
    </div>
  );
}
