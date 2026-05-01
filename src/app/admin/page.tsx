"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { useGetNews, useClearIntelligenceCache, useAdminDeleteArticle } from "@/lib/api-client-react";
import { ShieldAlert, Trash2, RefreshCcw, Activity, ShieldCheck, Database, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Debounce helper
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: newsData, isLoading: newsLoading, refetch } = useGetNews({ 
    q: debouncedSearch || undefined, 
    pageSize: 100 
  });
  
  const { mutate: clearCache, isPending: isClearing } = useClearIntelligenceCache();
  const { mutate: deleteArticle, isPending: isDeleting } = useAdminDeleteArticle();

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (!isAdmin) router.push("/home");
    }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || !isAdmin) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Activity className="animate-spin text-red-500 w-8 h-8" />
        </div>
      </Layout>
    );
  }

  const handleClearCache = () => {
    if (!user) return;
    if (confirm("Are you sure you want to clear the global cache? This will force a re-analysis on the next user visit.")) {
      clearCache(undefined, {
        onSuccess: () => alert("Cache purged successfully."),
        onError: (err: any) => alert(err.message)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    if (confirm("DANGER: Are you sure you want to permanently delete this article from the database?")) {
      deleteArticle({ articleId: id }, {
        onSuccess: () => {
          refetch();
        },
        onError: (err: any) => alert(err.message)
      });
    }
  };

  // Robust date formatting helper
  const formatDateSafe = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, 'MMM d');
    } catch (e) {
      return "Error";
    }
  };

  return (
    <Layout>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 mix-blend-screen bg-red-950/20">
        <div className="mesh-bg opacity-20 filter hue-rotate-[160deg]" />
      </div>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 w-full relative z-10 flex flex-col gap-12">
        <header className="bento-cell neuro-beam p-8 border-red-500/20">
          <div className="neuro-beam-inner flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-red-500 mb-4">
                <ShieldAlert className="w-4 h-4 animate-pulse" /> Admin Access Active
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-foreground">
                Admin <span className="italic font-light opacity-30 text-red-500">Dashboard</span>
              </h1>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleClearCache}
                disabled={isClearing}
                className="flex items-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-sm text-xs font-mono uppercase tracking-widest text-red-400 transition-colors"
              >
                <RefreshCcw className={`w-4 h-4 ${isClearing ? 'animate-spin' : ''}`} />
                {isClearing ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-cell p-8 border-white/5 flex flex-col gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">Admin Status</span>
            <div className="flex items-center gap-3 text-emerald-500 font-mono text-xl"><ShieldCheck className="w-5 h-5" /> Verified</div>
            <span className="text-xs text-muted-foreground/50">{user?.email}</span>
          </div>
          <div className="bento-cell p-8 border-white/5 flex flex-col gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">Database Records</span>
            <div className="flex items-center gap-3 text-white font-mono text-xl">
              {newsLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5 text-primary/60" />}
              {newsData?.articles?.length || 0} Articles
            </div>
            <span className="text-xs text-muted-foreground/50">Active in index</span>
          </div>
        </div>

        <div className="bento-cell p-8 border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
             <h2 className="text-lg font-mono uppercase tracking-widest text-white/60">Article Database</h2>
             <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Search index..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                />
                <Search className={cn("absolute right-0 top-0 w-4 h-4 transition-colors", newsLoading ? "text-red-500 animate-spin" : "text-white/20")} />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm min-w-[600px]">
              <thead className="text-[10px] uppercase tracking-[0.3em] text-white/30 border-b border-white/10">
                <tr>
                  <th className="pb-4 font-normal">ID / Title</th>
                  <th className="pb-4 font-normal">Source</th>
                  <th className="pb-4 font-normal">Date</th>
                  <th className="pb-4 font-normal">Trust</th>
                  <th className="pb-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {newsData?.articles?.map(article => (
                  <tr key={article.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-white/80 font-sans font-bold line-clamp-1">{article.title}</span>
                        <span className="text-[9px] text-white/30">{article.id}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white/50 text-xs uppercase tracking-wider">{article.source}</td>
                    <td className="py-4 text-white/50 text-xs">{formatDateSafe(article.publishedAt)}</td>
                    <td className="py-4 text-white/50 text-xs">{article.trustScore || "Pending"}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting}
                        className="text-red-500/50 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
