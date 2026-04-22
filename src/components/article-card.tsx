import Link from "next/link";
import { format } from "date-fns";
import { Brain } from "lucide-react";
import { useTheme } from "next-themes";
import { TrustBadge } from "./trust-badge";
import { type Article } from "@/lib/api-client-react";
import { cn } from "@/lib/utils";
import { AntiGravityCard } from "./motion/anti-gravity-card";

export function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    "Technology": "text-primary/60 border-primary/20",
    "Health": "text-primary/60 border-primary/20",
    "Business": "text-primary/60 border-primary/20",
    "Politics": "text-primary/60 border-primary/20",
    "Science": "text-primary/60 border-primary/20",
    "Sports": "text-primary/60 border-primary/20",
    "Entertainment": "text-primary/60 border-primary/20",
  };
  return map[category] || "text-primary/60 border-primary/20";
}

export function ArticleCard({ article, index = 0, speed }: { article: Article; index?: number; speed?: "slow" | "medium" | "fast" }) {
  const { theme } = useTheme();
  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop";

  return (
    <AntiGravityCard speed={speed} className="w-full h-full neuro-beam rounded-sm overflow-hidden">
      <div className="neuro-beam-inner p-8 group flex flex-col gap-8 h-full">
        {/* Image Area */}
        <Link href={`/article/${article.id}`} className="block relative aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-prestige">
          <img 
            src={imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="absolute top-6 left-6">
            <TrustBadge score={article.trustScore} className="scale-90" />
          </div>
          
          {/* Index Counter */}
          <div className="absolute bottom-4 right-6 font-mono text-[10px] text-white/40 group-hover:text-primary transition-colors">
            Ref: {(index + 1).toString().padStart(2, '0')}
          </div>
        </Link>
        
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-center justify-between">
            <span className={cn("text-[10px] font-mono font-bold uppercase tracking-[0.4em] transition-colors", getCategoryColor(article.category))}>
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
              <span className="text-foreground/60">{article.source}</span>
              <div className="w-1 h-3 bg-white/5" />
              <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          <Link href={`/article/${article.id}`} className="block group/title">
            <h3 className={cn(
              "text-xl font-bold leading-tight text-foreground transition-all group-hover/title:text-primary tracking-tight",
              theme !== "dark" && "font-serif text-2xl"
            )}>
              {article.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground/50 text-xs leading-relaxed font-light line-clamp-3">
            {article.description}
          </p>

          {article.aiSummary && (
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4 bg-white/[0.01] -mx-8 -mb-8 p-8 border-t border-white/5 group-hover:bg-primary/[0.02] transition-colors">
              <div className="text-primary/40 text-[9px] font-mono font-bold uppercase tracking-[0.5em] flex items-center gap-3">
                <Brain className="w-3 h-3" /> Synthesis_Output
              </div>
              <p className="text-[12px] text-foreground/50 leading-relaxed font-light italic">
                "{article.aiSummary}"
              </p>
            </div>
          )}
        </div>
      </div>
    </AntiGravityCard>
  );
}
