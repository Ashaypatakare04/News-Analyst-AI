import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Sparkles, Clock, Globe } from "lucide-react";
import { TrustBadge } from "./trust-badge";
import type { Article } from "@workspace/api-client-react/src/generated/api.schemas";
import { cn } from "@/lib/utils";

export function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    "Technology": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Health": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "Business": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    "Politics": "text-purple-400 bg-purple-400/10 border-purple-400/20",
    "Science": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    "Sports": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "Entertainment": "text-pink-400 bg-pink-400/10 border-pink-400/20",
  };
  return map[category] || "text-zinc-300 bg-zinc-500/10 border-zinc-500/20";
}

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-300 hover:-translate-y-1 h-full"
    >
      <Link href={`/article/${article.id}`} className="block relative aspect-[16/10] overflow-hidden bg-secondary">
        <img 
          src={imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md", getCategoryColor(article.category))}>
            {article.category}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {article.source}</span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(article.publishedAt), 'MMM d, yy')}</span>
          </div>
          <TrustBadge score={article.trustScore} />
        </div>
        
        <Link href={`/article/${article.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-xl font-serif font-bold leading-snug mb-2 line-clamp-3 text-foreground">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {article.description}
        </p>
        
        {article.aiSummary && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-auto relative overflow-hidden group-hover:bg-primary/10 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
            <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold mb-1 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> AI Quick Insight
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
              {article.aiSummary}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}