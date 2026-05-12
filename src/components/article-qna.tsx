"use client";

import { useState, useRef, useEffect } from "react";
import { useAskArticleQuestion } from "@/lib/api-client-react";
import { Send, User, Brain, Terminal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/api-client-react";

export function ArticleQnA({ articleId }: { articleId: string }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<(ChatMessage & { reasoning?: string })[]>([
    { 
      role: "assistant", 
      content: "I have analyzed this specific article. What would you like to know about it?" 
    }
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const { mutate: askQuestion, isPending } = useAskArticleQuestion({
    mutation: {
      onSuccess: (data: any) => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.answer,
          reasoning: data.reasoning
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I'm sorry, I encountered an error synthesizing the response." 
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
      articleId,
      data: {
        question: input.trim(),
        conversationHistory: messages.map(m => ({ role: m.role as "user"|"assistant", content: m.content }))
      }
    });
  };

  return (
    <div className="flex flex-col h-[600px] bento-cell neuro-beam overflow-hidden relative">
      <div className="neuro-beam-inner flex flex-col h-full">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar relative">
          <div className="space-y-12 pb-8">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-6 w-full", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 border-l border-t border-primary/20 flex items-center justify-center shrink-0 glass shadow-md font-mono rounded-sm">
                      <Brain className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                  
                  <div className={cn("flex flex-col gap-4 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                    <div className={cn(
                      "p-6 rounded-sm text-sm leading-relaxed transition-all",
                      msg.role === "user" 
                        ? "italic font-light bg-primary/10 border border-primary/20 text-right" 
                        : cn("bg-black/20 border border-white/5 prose prose-invert max-w-none text-left", theme !== "dark" && "font-serif")
                    )}>
                      {msg.role === "assistant" ? (
                        <div className="space-y-4">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <span className="text-foreground/80">{msg.content}</span>
                      )}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-10 h-10 border-r border-b border-primary/20 flex items-center justify-center shrink-0 glass font-mono rounded-sm bg-primary/5">
                      <User className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isPending && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="flex gap-6 justify-start"
                >
                  <div className="w-10 h-10 border-l border-t border-primary/20 flex items-center justify-center shrink-0 animate-pulse bg-primary/5 rounded-sm">
                    <Brain className="w-5 h-5 text-primary/40" />
                  </div>
                  <div className="glass border-white/5 p-4 flex items-center gap-4 w-48 shadow-inner italic text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary/30 rounded-sm">
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     ANALYZING...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="relative flex items-center group bg-black/40 border border-white/10 p-2 pl-6 focus-within:border-primary/40 transition-all rounded-sm shadow-inner">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ASK ABOUT THIS ARTICLE..."
              disabled={isPending}
              className="w-full bg-transparent border-none py-3 text-sm font-light focus:outline-none placeholder:text-muted-foreground/30 placeholder:uppercase placeholder:font-mono placeholder:font-bold placeholder:text-[10px] placeholder:tracking-[0.4em]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="w-12 h-12 flex items-center justify-center rounded-sm bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 disabled:hover:bg-primary/10 disabled:hover:text-primary"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
