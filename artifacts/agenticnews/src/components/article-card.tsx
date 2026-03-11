import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Sparkles, Clock, Globe } from "lucide-react";
import { TrustBadge } from "./trust-badge";
import type { Article } from "@workspace/api-client-react/src/generated/api.schemas";

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  // Fallback image if not provided
  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col"
    >
      <Link href={`/article/${article.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-secondary">
        <img 
          src={imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold uppercase tracking-wider">
            {article.category}
          </span>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <TrustBadge score={article.trustScore} />
        </div>
      </Link>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 font-medium">
          <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {article.source}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
        </div>
        
        <Link href={`/article/${article.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-xl font-serif font-bold leading-tight mb-2 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {article.description}
        </p>
        
        {article.aiSummary && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mt-auto">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-1 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> AI Insight
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2">
              {article.aiSummary}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
