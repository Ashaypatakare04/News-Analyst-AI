"use client";
import { Layout } from "@/components/layout";
import { useState, useRef, useEffect } from "react";
import { useAskQuestion } from "@/lib/api-client-react";
import { Send, Bot, User, Loader2, Link as LinkIcon, Sparkles, Activity, Terminal, Brain, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, ArticleReference } from "@/lib/api-client-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";

type UIMessage = ChatMessage & {
  sources?: ArticleReference[];
  reasoning?: string;
};

export default function AskPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<UIMessage[]>([
    { 
      role: "assistant", 
      content: "Agentic Intel Analyst at your service. I have synthesized data from global news streams and historical archives. How may I assist your inquiry today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const { mutate: askQuestion, isPending } = useAskQuestion({
    mutation: {
      onSuccess: (data: any) => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.answer,
          sources: data.sources,
          reasoning: data.reasoning
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I'm sorry, I encountered an error retrieving that information." 
        }]);
      }
    }
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newHistory = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(newHistory);
    setInput("");

    askQuestion({
      data: {
        question: input.trim(),
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
      }
    });
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)] max-h-screen overflow-hidden bg-background relative selection:bg-primary/20 cursor-none">
        
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="mesh-bg" />
          <div className="bg-noise absolute inset-0" />
        </div>

        {/* Header */}
        <header className="relative z-10 shrink-0 py-12 px-10 border-b border-white/5 bg-background/40 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="flex items-center gap-6 text-primary/40 text-[10px] font-mono font-bold uppercase tracking-[0.6em] mb-8">
            <div className="w-12 h-px bg-primary/20" />
            <Activity className="w-4 h-4 animate-pulse-live" />
            Probe_Protocol_Active
            <div className="w-12 h-px bg-primary/20" />
          </div>
          <h1 className={cn(
            "text-5xl md:text-7xl font-bold text-gradient tracking-tighter",
            theme !== "dark" && "font-serif"
          )}>
            Inquiry <span className="italic font-light opacity-50">Terminal</span>
          </h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-16 md:px-12 hide-scrollbar relative">
          <div className="max-w-5xl mx-auto space-y-24 pb-32 relative z-10">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className={cn("flex gap-10 w-full", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className={cn(
                      "w-14 h-14 border-l border-t border-primary/20 flex items-center justify-center shrink-0 glass shadow-2xl font-mono",
                    )}>
                      <span className="text-primary font-bold text-2xl">A</span>
                    </div>
                  )}
                  
                  <div className={cn("flex flex-col gap-8 max-w-[85%] md:max-w-[75%]", msg.role === "user" ? "items-end" : "items-start")}>
                    <div className={cn(
                      "neuro-beam relative rounded-sm overflow-hidden shadow-prestige w-full",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}>
                      <div className={cn(
                        "neuro-beam-inner p-10 text-lg leading-relaxed transition-all",
                        msg.role === "user" 
                          ? "italic font-light bg-primary/[0.03]" 
                          : cn("prose prose-invert max-w-none", theme !== "dark" && "font-serif")
                      )}>
                        {msg.role === "assistant" ? (
                          <div className="space-y-6">
                             {msg.reasoning && (
                               <div className="mb-10 p-8 bg-black/40 border-l border-primary/30 rounded-sm shadow-inner">
                                 <div className="flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-primary/40 mb-6">
                                   <Brain className="w-3.5 h-3.5" /> Internal_Synthesis_Logic
                                 </div>
                                 <div className="text-[12px] font-mono italic text-foreground/40 leading-relaxed">
                                   {msg.reasoning}
                                 </div>
                               </div>
                             )}
                             <div className="flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-primary/30 mb-10">
                                <Terminal className="w-3.5 h-3.5" /> Synthesis_Output
                             </div>
                             <div className="text-foreground/90 font-light text-base md:text-lg">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                             </div>
                          </div>
                        ) : (
                          <span className="text-foreground/80">{msg.content}</span>
                        )}
                      </div>
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-6 mt-4">
                        {msg.sources.map(src => (
                          <Link 
                            key={src.id} 
                            href={src.url || `/article/${src.id}`}
                            className="glass py-2 px-4 inline-flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-primary/30 hover:text-primary hover:border-primary/20 transition-all group"
                          >
                            <Brain className="w-3 h-3 group-hover:scale-125 transition-transform" />
                            {src.source} <span className="opacity-10 font-normal">[{src.id.substring(0, 4)}]</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-14 h-14 border-r border-b border-white/10 flex items-center justify-center shrink-0 glass font-mono">
                      <User className="w-6 h-6 text-primary/20" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isPending && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="flex gap-10 justify-start"
                >
                  <div className="w-14 h-14 border-l border-t border-primary/20 flex items-center justify-center shrink-0 animate-pulse bg-primary/5">
                    <Brain className="w-6 h-6 text-primary/40" />
                  </div>
                  <div className="glass border-white/5 p-10 flex items-center gap-6 w-80 shadow-inner italic text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-primary/30">
                     <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                     Analyzing_Vectors_Node_42...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="relative z-20 shrink-0 p-10 md:p-16 border-t border-white/10 bg-background/90 backdrop-blur-3xl shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
          <div className="max-w-5xl mx-auto">
            <div className="relative mb-8 flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.6em] text-primary/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              INTELLIGENCE_INTERFACE_STANDBY
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center group bg-white/[0.01] border border-white/10 p-6 focus-within:border-primary/40 focus-within:bg-white/[0.03] transition-all duration-700 shadow-prestige overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000" />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="QUERY_NEURAL_PIPELINE..."
                disabled={isPending}
                className="w-full bg-transparent border-none py-6 pr-32 text-2xl font-light tracking-tight focus:outline-none transition-all placeholder:text-muted-foreground/10 placeholder:uppercase placeholder:font-mono placeholder:font-bold placeholder:text-[11px] placeholder:tracking-[0.6em]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isPending}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-all disabled:opacity-5 group"
              >
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] hidden md:block opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap">EXECUTE_COMMAND</span>
                   <div className="w-14 h-14 flex items-center justify-center border border-primary/20 rounded-full group-hover:border-primary/60 transition-all bg-primary/5">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </div>
                </div>
              </button>
            </form>
            <div className="mt-12 flex items-center justify-between opacity-20">
               <div className="text-[9px] font-mono font-bold uppercase tracking-[0.7em] flex items-center gap-4">
                  <Activity className="w-3.5 h-3.5" /> CORE: agentic_intel_v2.1
               </div>
               <div className="text-[9px] font-mono font-bold uppercase tracking-[0.7em]">ENCRYPTION: RSA_4096_ACTIVE</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
