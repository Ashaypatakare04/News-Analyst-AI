import { Layout } from "@/components/layout";
import { useState, useRef, useEffect } from "react";
import { useAskQuestion } from "@workspace/api-client-react";
import { Send, Bot, User, Loader2, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, ArticleReference } from "@workspace/api-client-react/src/generated/api.schemas";

type UIMessage = ChatMessage & {
  sources?: ArticleReference[];
};

export default function AskPage() {
  const [messages, setMessages] = useState<UIMessage[]>([
    { role: "assistant", content: "I'm AgenticNews AI. I have access to real-time global news streams. What would you like to know?" }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-16rem)]">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-serif font-bold mb-2 flex items-center justify-center gap-3">
            <Bot className="w-8 h-8 text-primary" /> Ask AI
          </h1>
          <p className="text-muted-foreground">RAG-powered intelligence across our global news database</p>
        </header>

        {/* Chat Area */}
        <div className="flex-1 bg-card border border-border/50 rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  
                  <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-secondary/50 border border-border/50 text-foreground rounded-tl-sm prose prose-invert max-w-none"
                    }`}>
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.sources.map(src => (
                          <a key={src.id} href={src.url || `/article/${src.id}`} target="_blank" rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 text-xs bg-card border border-border px-2.5 py-1.5 rounded-lg hover:border-primary/50 transition-colors text-muted-foreground hover:text-primary">
                            <LinkIcon className="w-3 h-3" />
                            {src.source}: {src.title.substring(0, 30)}...
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isPending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-secondary/50 border border-border/50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Synthesizing intelligence...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background/50 backdrop-blur-xl border-t border-border/50">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about a specific event, person, or trend..."
                disabled={isPending}
                className="w-full bg-card border border-border/80 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isPending}
                className="absolute right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-primary"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
