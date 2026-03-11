import { Layout } from "@/components/layout";
import { useState, useRef, useEffect } from "react";
import { useAskQuestion } from "@workspace/api-client-react";
import { Send, Bot, User, Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, ArticleReference } from "@workspace/api-client-react/src/generated/api.schemas";
import { cn } from "@/lib/utils";

type UIMessage = ChatMessage & {
  sources?: ArticleReference[];
};

export default function AskPage() {
  const [messages, setMessages] = useState<UIMessage[]>([
    { role: "assistant", content: "I'm AgenticNews AI. I have access to real-time global news streams and historical archives. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const { mutate: askQuestion, isPending } = useAskQuestion({
    mutation: {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.answer,
          sources: data.sources 
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
      <div className="flex-1 flex flex-col h-[calc(100vh-74px)] max-h-screen overflow-hidden bg-background">
        
        {/* Header */}
        <header className="shrink-0 py-6 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Intelligence Engine Active
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold flex items-center justify-center gap-3">
            Ask AI Oracle
          </h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn("flex gap-4 w-full", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-card border border-primary/30 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={cn("flex flex-col gap-2 max-w-[85%] md:max-w-[75%]", msg.role === "user" ? "items-end" : "items-start")}>
                    <div className={cn(
                      "p-5 rounded-3xl text-[15px] leading-relaxed",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm shadow-md" 
                        : "bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm prose prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    )}>
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.sources.map(src => (
                          <a key={src.id} href={src.url || `/article/${src.id}`} target="_blank" rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 text-xs bg-secondary/50 border border-border/50 px-3 py-1.5 rounded-full hover:bg-secondary hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground">
                            <LinkIcon className="w-3 h-3 text-primary" />
                            {src.source}: <span className="font-medium">{src.title.substring(0, 35)}...</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isPending && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-start">
                  <div className="w-10 h-10 rounded-xl bg-card border border-primary/30 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-card border border-border/50 p-5 rounded-3xl rounded-tl-sm flex items-center gap-3 w-32 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 pb-8 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl border-t border-border/20 z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about a specific event, person, or trend..."
                disabled={isPending}
                className="w-full bg-card border border-border/80 hover:border-border rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 text-[15px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isPending}
                className="absolute right-2 w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-primary shadow-md"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-3 text-xs text-muted-foreground">
              AI can make mistakes. Verify important information.
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}