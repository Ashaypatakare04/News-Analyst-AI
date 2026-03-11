import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { ArticleCard, getCategoryColor } from "@/components/article-card";
import { useGetNews, useGetCategories } from "@workspace/api-client-react";
import { Loader2, Search, Brain, TrendingUp, Sparkles, ShieldCheck, Activity, ArrowRight, ArrowRightCircle } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { TrustBadge } from "@/components/trust-badge";
import { cn } from "@/lib/utils";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 500), []);

  const { data: categoriesData } = useGetCategories();
  const { data: newsData, isLoading } = useGetNews({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    q: debouncedSearch || undefined,
    pageSize: 13 // 1 for hero, 12 for grid
  });

  const categories = ["All", ...(categoriesData?.categories || [])];
  
  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  
  const featuredArticle = newsData?.articles?.[0];
  const gridArticles = newsData?.articles?.slice(1) || [];

  const trendingTopics = [
    "Artificial Intelligence",
    "Global Markets",
    "Climate Tech",
    "Space Exploration",
    "Cybersecurity"
  ];

  return (
    <Layout>
      {/* Top Stats Bar */}
      <div className="bg-secondary/30 border-b border-border/50 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex items-center gap-6 max-w-7xl mx-auto w-full">
          <span className="font-semibold text-muted-foreground">{today}</span>
          <div className="flex items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-primary" /> {newsData?.totalResults || 0} articles indexed</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Verified</span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Live Engine
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Main Content (2/3) */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-8">
            
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center bg-card rounded-3xl border border-border/50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : featuredArticle ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[21/9] lg:aspect-[16/9] border border-border/50 shadow-2xl block hover:border-primary/50 transition-colors"
              >
                <img 
                  src={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop"} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={cn("px-3 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-md", getCategoryColor(featuredArticle.category))}>
                      {featuredArticle.category}
                    </span>
                    <TrustBadge score={featuredArticle.trustScore} />
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight max-w-3xl drop-shadow-md">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl line-clamp-2 md:line-clamp-3">
                    {featuredArticle.description}
                  </p>
                  
                  <div className="flex items-center justify-between max-w-3xl">
                    <div className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                      <span>{featuredArticle.source}</span>
                      <span className="text-border">•</span>
                      <span>{format(new Date(featuredArticle.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <Link href={`/article/${featuredArticle.id}`} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all hover:gap-3 group/btn">
                      Read & Analyze <ArrowRightCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Grid */}
            {!isLoading && gridArticles.length > 0 && (
              <>
                <div className="flex items-center justify-between mt-4 mb-2">
                  <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Latest Intelligence
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {gridArticles.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))}
                </div>
                
                <div className="pt-8 pb-12 flex justify-center">
                  <button className="px-8 py-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground font-medium border border-border/50 transition-all hover:border-primary/30 flex items-center gap-2">
                    Load more stories <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
            
            {!isLoading && gridArticles.length === 0 && !featuredArticle && (
              <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium mb-2">No articles found</p>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              </div>
            )}

          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="w-full lg:w-1/3 space-y-8 lg:sticky lg:top-[90px] h-fit self-start">
            
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search intel..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                value={searchQuery}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            {/* AI Digest Card */}
            <Link href="/ask" className="block bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-6 group hover:border-primary/40 transition-colors relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
              <Brain className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                Ask the AI Oracle <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our RAG-powered intelligence engine to synthesize today's global news.
              </p>
              <div className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Start conversation <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Categories */}
            <div className="bg-card border border-border/50 rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border",
                      selectedCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground hover:border-border"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-card border border-border/50 rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                Trending Topics
              </h3>
              <ul className="space-y-4">
                {trendingTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-3 group cursor-pointer">
                    <span className="w-6 h-6 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-xs font-bold group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                      {topic}
                    </span>
                    {i < 2 && (
                      <span className="relative flex h-1.5 w-1.5 ml-auto">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}