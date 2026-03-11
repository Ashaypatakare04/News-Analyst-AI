import { Link, useLocation } from "wouter";
import { Newspaper, MessageSquare, Upload, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Top Stories", icon: Newspaper },
    { path: "/ask", label: "Ask AI", icon: MessageSquare },
    { path: "/upload", label: "Scan News", icon: Upload },
  ];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/30">
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "glass-panel border-border/50 py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                alt="AgenticNews Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Agentic<span className="text-primary font-sans font-light">News</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-4"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "p-4 rounded-xl flex items-center gap-3 text-lg font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-card py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
              alt="Logo" 
              className="w-6 h-6 grayscale"
            />
            <span className="font-serif font-semibold text-lg tracking-tight">AgenticNews</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            Intelligence applied to global events. © {new Date().getFullYear()} AgenticNews.
          </p>
        </div>
      </footer>
    </div>
  );
}
