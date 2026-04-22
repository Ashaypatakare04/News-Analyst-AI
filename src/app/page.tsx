"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, type IntelligenceData, type BriefData } from "@/lib/api";
import {
  ShieldCheck, Globe, BarChart3,
  BookOpen, Fingerprint, Search, Info,
  Activity, Zap, Brain, MousePointer2, 
  Layers, ChevronDown, CheckCircle2,
  Lock, TrendingUp, AlertCircle, Target
} from "lucide-react";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Fingerprint,
    label: "Neural Synthesis",
    desc: "Every article distilled into bullet-point intelligence through a proprietary synthesis engine.",
  },
  {
    icon: ShieldCheck,
    label: "Integrity Verification",
    desc: "Rigorous cross-referencing and contradiction detection to establish ontological truth.",
  },
  {
    icon: Search,
    label: "Analyst Retrieval",
    desc: "Consult our RAG-powered analyst for precise, source-cited answers to complex queries.",
  },
  {
    icon: BarChart3,
    label: "Executive Summary",
    desc: "Key events and emerging signals condensed for high-velocity decision making.",
  },
  {
    icon: Info,
    label: "Actor Mapping",
    desc: "Identify key actors and timelines for deeper context beyond the headlines.",
  },
  {
    icon: Globe,
    label: "Global Pipeline",
    desc: "Zero-latency translation into major global languages with lexical precision.",
  },
];

export default function LandingPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: intelligence } = useQuery<IntelligenceData>({
    queryKey: ["intelligence"],
    queryFn: () => apiFetch<IntelligenceData>("/intelligence"),
  });

  const { data: brief } = useQuery<BriefData>({
    queryKey: ["brief"],
    queryFn: () => apiFetch<BriefData>("/brief"),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router]);



  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 cursor-none relative font-sans text-editorial">
      
      {/* Background Persistence Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-noise absolute inset-0 z-10" />
      </div>

      {/* Nav Overlay */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/20 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-8 group">
             <div className="w-10 h-10 flex items-center justify-center border-l border-t border-primary/10 group-hover:border-primary/40 transition-all duration-1000 glass">
              <span className="font-serif text-xl font-bold text-primary/80">A</span>
            </div>
            <span className={cn(
              "font-bold text-xl tracking-tighter text-foreground/90",
              mounted && theme !== "dark" && "font-serif"
            )}>
              AGENTIC<span className="text-primary/30 font-sans font-light tracking-[0.4em] ml-3 text-[10px]">INTEL</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30">
            <Link href="/home" className="hover:text-primary/60 transition-all duration-500">Neural Index</Link>
            <Link href="/brief" className="hover:text-primary/60 transition-all duration-500">Briefing</Link>
            <Link href="/ask" className="hover:text-primary/60 transition-all duration-500">Consult</Link>
          </nav>
          <div className="flex items-center gap-8">
            <Link href="/login">
              <MagneticButton className="px-10 py-3.5 bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-[0.5em]">
                Initialize
              </MagneticButton>
            </Link>
          </div>
        </div>
      </header>

      {/* 01: The Dawn (Hero) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-48 px-8 lg:px-16 z-10 overflow-hidden">
        <div className="mesh-bg opacity-20 dark:opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-6 mb-12 group cursor-none">
            <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse-live" />
            <span className="text-primary/40 text-[9px] font-bold uppercase tracking-[0.6em]">
              Neural Pipeline v8.4 Refined
            </span>
          </div>

          <h1 className={cn(
            "text-6xl sm:text-8xl md:text-9xl font-medium leading-[0.9] mb-16 tracking-tighter text-gradient pb-6",
            mounted && theme !== "dark" && "font-serif"
          )}>
            Complexity,<br />
            <span className="italic font-light text-foreground/20">unveiled.</span>
          </h1>

          <p className="text-foreground/45 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-light mb-20 tracking-tight text-editorial">
            The world's most sophisticated neural synthesis platform. Distilling planetary-scale data into precision executive intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-10 items-center justify-center">
            <Link href="/login">
              <MagneticButton className="px-14 py-7 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.6em]">
                Start Your Session
              </MagneticButton>
            </Link>
            <Link href="/home" className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30 hover:text-primary/60 transition-all duration-700">
              <Globe className="w-4 h-4 opacity-40" /> Global Intel Index
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"
        >
           <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Scroll</span>
           <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* 02: The Void (Problem) */}
      <section className="relative py-80 px-8 lg:px-16 z-20 bg-black/20 backdrop-blur-3xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-32 items-center">
           <div className="lg:col-span-6 space-y-12">
              <span className="text-prestige">01 // The Obstacle</span>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-[1.1]">
                Information without <br />
                <span className="text-foreground/30">Intelligence.</span>
              </h2>
              <p className="text-foreground/45 text-lg leading-relaxed font-light text-editorial max-w-xl">
                We live in an age of data abundance but a famine of truth. Headlines are noise, context is lost, and the signals that matter are buried under planetary-scale clutter.
              </p>
              <div className="flex flex-col gap-6 pt-12">
                 {[
                   { icon: AlertCircle, text: "Noise overload desensitizes critical judgment." },
                   { icon: Lock, text: "Verification is slow, costly, and error-prone." },
                   { icon: TrendingUp, text: "Strategic blindness due to scattered data points." }
                 ].map((item, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="flex items-center gap-6"
                   >
                     <item.icon className="w-4 h-4 text-primary/30" />
                     <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">{item.text}</span>
                   </motion.div>
                 ))}
              </div>
           </div>
           
           <div className="lg:col-span-6 relative aspect-square flex items-center justify-center opacity-40 grayscale pointer-events-none">
              {/* Cluttered Data Visual */}
              <div className="absolute inset-0 flex flex-wrap gap-4 items-center justify-center blur-[2px]">
                 {Array.from({ length: 40 }).map((_, i) => (
                   <div key={i} className="w-16 h-1 px-2 border border-white/5 opacity-10" />
                 ))}
              </div>
              <div className="w-64 h-64 border border-white/5 rounded-full flex items-center justify-center animate-pulse-slow">
                 <div className="w-32 h-32 border border-white/5 rounded-full" />
              </div>
           </div>
        </div>
      </section>

      {/* 03: The Synthesis (Solution) */}
      <section className="relative py-80 px-8 lg:px-16 z-20">
         <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center space-y-12">
              <span className="text-prestige">02 // The Synthesis</span>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[1.1] max-w-4xl mx-auto">
                Neural synthesis for the <br />
                <span className="text-primary/60 italic font-light">post-information age.</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-32 relative">
               {/* Left Visual: The Lens */}
               <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <AntiGravityCard intensity={4} speed="medium" className="glass p-20 aspect-video flex flex-col justify-center items-center gap-12 border-white/[0.03]">
                     <div className="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-1000 group-hover:border-primary/60 group-hover:scale-110">
                        <Brain className="w-8 h-8 text-primary shadow-[0_0_20px_hsla(var(--primary),0.5)]" />
                     </div>
                     <div className="text-center space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40">Vector_Neutralization_Active</div>
                        <div className="h-[1px] w-48 bg-primary/10 mx-auto" />
                     </div>
                  </AntiGravityCard>
               </div>

               {/* Right Copy */}
               <div className="flex flex-col justify-center space-y-12">
                  <h3 className="text-3xl font-medium tracking-tight">One platform. Definitive truth.</h3>
                  <p className="text-foreground/45 text-lg leading-relaxed font-light text-editorial">
                    Agentic Intel doesn't just aggregate; it synthesizes. Our neural pipeline cross-references global signals in real-time, detecting contradictions and establishing a definitive ontological map for every event.
                  </p>
                  <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Input</h4>
                        <p className="text-xs text-foreground/40 uppercase tracking-[0.2em] leading-relaxed">Billions of unstructured data points daily.</p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Output</h4>
                        <p className="text-xs text-foreground/40 uppercase tracking-[0.2em] leading-relaxed">Precision intelligence with 99.4% verification.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 04: The Engine (Features) */}
      <section className="relative py-80 px-8 lg:px-16 z-20 overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-32">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="space-y-8">
                 <span className="text-prestige">03 // The System Engine</span>
                 <h2 className="text-5xl md:text-6xl font-medium tracking-tighter">Tools of the<br />modern analyst.</h2>
              </div>
              <p className="text-foreground/40 text-lg max-w-md font-light text-editorial">
                Sophisticated architecture designed for high-velocity executive decision making.
              </p>
           </div>

           <div className="bento-grid gap-16">
            {features.map((f, i) => (
              <AntiGravityCard 
                key={f.label} 
                float={false}
                intensity={3}
                className={cn(
                  "bento-cell h-full",
                  i === 0 || i === 3 ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4",
                  i === 4 || i === 5 ? "md:col-span-6" : ""
                )}
              >
                <div className="neuro-beam p-14 h-full flex flex-col group">
                  <div className="w-14 h-14 border-l border-t border-primary/10 flex items-center justify-center mb-12 group-hover:border-primary/40 transition-all duration-1000 glass">
                    <f.icon className="w-5 h-5 text-primary/20 group-hover:text-primary/60 transition-colors duration-1000" />
                  </div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.6em] mb-8 text-primary/30 group-hover:text-primary/60 transition-all duration-1000">
                    {f.label}
                  </h3>
                  <p className="text-base text-foreground/40 leading-relaxed font-light group-hover:text-foreground/80 transition-colors duration-1000 text-editorial">
                    {f.desc}
                  </p>
                  
                  <div className="mt-auto pt-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="text-[8px] font-mono text-primary/10 uppercase tracking-[0.3em]">Module_Node_{i.toString().padStart(2, '0')}</div>
                    <div className="w-16 h-[1px] bg-primary/10" />
                  </div>
                </div>
              </AntiGravityCard>
            ))}
          </div>
        </div>
      </section>

      {/* 05: The Standard (Differentiation) */}
      <section className="relative py-80 px-8 lg:px-16 z-20">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <div className="order-2 lg:order-1 relative group">
               <div className="absolute inset-0 bg-primary/5 rounded-sm blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
               <AntiGravityCard intensity={6} speed="slow" className="glass p-20 border-white/[0.03] space-y-16">
                  <div className="flex items-center gap-6">
                    <ShieldCheck className="w-6 h-6 text-primary/60" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-foreground/40">Institutional Integrity Protocol</span>
                  </div>
                  <div className="space-y-10">
                     {[
                       { label: "Accuracy Rate", value: "99.4%" },
                       { label: "Neural Latency", value: "< 140ms" },
                       { label: "Actor Mapping", value: "Real-time" }
                     ].map((stat, i) => (
                       <div key={i} className="flex items-end justify-between border-b border-white/[0.03] pb-6">
                          <span className="text-xs uppercase tracking-[0.2em] text-foreground/30 font-light">{stat.label}</span>
                          <span className="text-2xl font-medium text-foreground/80">{stat.value}</span>
                       </div>
                     ))}
                  </div>
                  <div className="flex items-center gap-4 text-emerald-500/60 text-[9px] font-bold uppercase tracking-[0.4em]">
                     <CheckCircle2 className="w-3 h-3" /> System Verified by Palantir-Class Engine
                  </div>
               </AntiGravityCard>
            </div>

            <div className="order-1 lg:order-2 space-y-12">
               <span className="text-prestige">04 // The Competitive Edge</span>
               <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-[1.1]">
                Institutional grade.<br />
                <span className="text-foreground/30 font-light italic">By design.</span>
              </h2>
              <p className="text-foreground/45 text-lg leading-relaxed font-light text-editorial max-w-xl">
                We don't settle for "good enough" AI. Our pipeline is built for zero-fail environments where intelligence isn't an option—it's a requirement.
              </p>
              <ul className="space-y-8 pt-8 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">
                 <li className="flex items-center gap-6">
                    <Layers className="w-4 h-4" /> Multi-layered Consensus Logic
                 </li>
                 <li className="flex items-center gap-6">
                    <Lock className="w-4 h-4" /> End-to-End Cryptographic Sourcing
                 </li>
                 <li className="flex items-center gap-6">
                    <Target className="w-4 h-4" /> Direct-to-Signal Intelligence
                 </li>
              </ul>
            </div>
         </div>
      </section>

      {/* 06: Access (CTA) */}
      <section className="relative py-80 px-8 lg:px-16 z-30 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass p-32 border-white/[0.03] relative overflow-hidden group shadow-prestige"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[3000ms]" />
            
            <Zap className="w-12 h-12 text-primary/10 mx-auto mb-16" />
            
            <h2 className={cn(
              "text-5xl md:text-8xl font-medium mb-16 tracking-tighter text-foreground/90 leading-[0.9]",
              mounted && theme !== "dark" && "font-serif"
            )}>
              Begin your<br />
              <span className="italic font-light text-foreground/30">synthesis.</span>
            </h2>
            
            <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/20 mb-24 px-12 leading-relaxed">
              Institutional Grade • Neural Synthesis • Ontological Truth
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-16 relative z-10">
              <Link href="/login">
                <MagneticButton className="px-20 py-8 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-[0.7em]">
                  Initialize Access
                </MagneticButton>
              </Link>
              <Link href="/home" className="text-foreground/30 hover:text-primary/60 text-[10px] font-bold uppercase tracking-[0.7em] transition-all duration-1000">
                Browse Neural Index
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Refined */}
      <footer className="relative pt-32 pb-64 px-12 border-t border-white/[0.03] z-10 bg-background/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
          <div className="flex items-center gap-8 opacity-30 grayscale group cursor-default">
            <div className="w-12 h-12 border-l border-t border-primary/10 group-hover:border-primary/40 transition-all duration-1000 flex items-center justify-center glass">
              <span className="font-serif text-lg font-bold text-primary/80">A</span>
            </div>
            <span className={cn(
              "font-bold text-xs tracking-[0.8em] text-foreground/80",
              mounted && theme !== "dark" && "font-serif"
            )}>AGENTIC<span className="text-primary/40 font-sans font-light ml-3 text-[10px]">INTEL</span></span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-20 text-[11px] font-bold uppercase tracking-[0.6em] text-foreground/20 text-editorial">
            <Link href="/home" className="hover:text-primary/60 transition-all duration-1000">Neural Index</Link>
            <Link href="/brief" className="hover:text-primary/60 transition-all duration-1000">Directed Synthesis</Link>
            <Link href="/ask" className="hover:text-primary/60 transition-all duration-1000">Analyst Hub</Link>
          </div>
          <p className="text-[9px] text-foreground/15 uppercase tracking-[0.6em] font-light">
            © {new Date().getFullYear()} AGENTIC INTEL IMPRINT. 
          </p>
        </div>
      </footer>
    </div>
  );
}
