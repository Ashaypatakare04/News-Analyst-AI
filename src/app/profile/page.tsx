"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Settings, Bookmark, Clock, 
  LogOut, ChevronRight, Globe, Bell, 
  Target, Fingerprint, Activity
} from "lucide-react";

import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = ["general", "business", "technology", "science", "health", "sports", "entertainment"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState<string[]>(["general", "technology"]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("news_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setPreferences(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearHistory = () => {
    localStorage.removeItem("news_history");
    setHistory([]);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-48 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Identity */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary/40 text-[10px] font-bold uppercase tracking-[0.5em]">
                <Fingerprint className="w-4 h-4" /> Personnel Access Terminal
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gradient leading-none">
                Intelligence Profile
              </h1>
              <p className="text-muted-foreground/40 text-sm font-medium tracking-tight">
                Institutional ID: <span className="text-foreground/60">{user?.email || "ANONYMOUS_SESSION"}</span>
              </p>
            </div>
            
            <MagneticButton 
              onClick={logout}
              className="px-10 py-4 glass border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Terminate Session
            </MagneticButton>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Preferences */}
            <div className="lg:col-span-1 space-y-12">
              <section className="space-y-8 glass p-10 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Settings className="w-16 h-16" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-4">
                   Operational Filters
                </h3>
                <p className="text-xs text-muted-foreground/40 leading-relaxed font-medium mb-4">
                  Define your primary sectors of interest. These signals prioritize within your neural feed.
                </p>
                <div className="flex flex-wrap gap-3">
                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all",
                        preferences.includes(cat) 
                          ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsla(var(--primary),0.3)]" 
                          : "glass text-muted-foreground/40 hover:text-foreground hover:border-white/10"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6 glass p-10 border-white/5 opacity-50 cursor-not-allowed">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-4">
                  <Shield className="w-3.5 h-3.5" /> Clearances
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-muted-foreground/40">Verified Status</span>
                      <span className="text-emerald-400">Level 04</span>
                   </div>
                   <div className="h-[2px] w-full bg-white/5">
                      <div className="h-full w-3/4 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                   </div>
                </div>
              </section>
            </div>

            {/* Right Column: History & Saved */}
            <div className="lg:col-span-2 space-y-12">
               
               <section className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-4">
                      <Clock className="w-3.5 h-3.5" /> Intelligence Archive
                    </h3>
                    <button 
                      onClick={clearHistory}
                      className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20 hover:text-rose-500 transition-colors"
                    >
                      Purge History
                    </button>
                  </div>

                  {history.length > 0 ? (
                    <div className="grid gap-6">
                      {history.map((item, i) => (
                        <Link key={i} href={`/article/${item.id}`}>
                           <AntiGravityCard intensity={5} float={false}>
                              <div className="glass p-8 border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/60">{item.category}</span>
                                    <span className="text-muted-foreground/20">•</span>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">{item.source}</span>
                                  </div>
                                  <h4 className="text-lg font-bold tracking-tight text-foreground/80 group-hover:text-primary transition-colors">{item.title}</h4>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                              </div>
                           </AntiGravityCard>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 glass border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                       <Activity className="w-12 h-12 mb-6 animate-pulse" />
                       <p className="text-[10px] font-bold uppercase tracking-[0.6em]">No Signals Archived</p>
                    </div>
                  )}
               </section>

               <section className="space-y-10 opacity-40">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-4">
                    <Bookmark className="w-3.5 h-3.5" /> Saved Priority Signals
                  </h3>
                  <div className="py-16 glass border-white/5 flex flex-col items-center justify-center text-center">
                     <Target className="w-10 h-10 mb-6" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Feature Under Development</p>
                  </div>
               </section>

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
