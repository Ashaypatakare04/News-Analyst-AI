import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { ArticleCard } from "@/components/article-card";
import { useGetNews, useGetCategories } from "@workspace/api-client-react";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Will implement inline here or use simple timeout

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

  const handleSearch = debounce((val: string) => setDebouncedSearch(val), 500);

  const { data: categoriesData } = useGetCategories();
  const { data: newsData, isLoading } = useGetNews({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    q: debouncedSearch || undefined,
    pageSize: 12
  });

  const categories = ["All", ...(categoriesData?.categories || [])];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="py-12 md:py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Intelligence Engine Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 max-w-4xl"
          >
            Understand the world with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Agentic Precision</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            AI-driven summarization, automated fact-checking, and chronological timelines to cut through the noise of modern media.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-full max-w-lg"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search trending topics..."
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              value={searchQuery}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-card border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground shadow-lg"
            />
          </motion.div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-2 mask-edges">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-foreground text-background shadow-md"
                    : "bg-card text-muted-foreground border border-border/50 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* News Grid */}
        <section>
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : newsData?.articles?.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium">No articles found.</p>
              <p>Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData?.articles?.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
