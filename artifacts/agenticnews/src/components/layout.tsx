import { Link, useLocation } from "wouter";
import { Newspaper, MessageSquare, Upload, Menu, X, LogIn, LogOut, User, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Top Stories", icon: Newspaper },
    { path: "/brief", label: "Daily Brief", icon: BookOpen },
    { path: "/ask", label: "Ask AI", icon: MessageSquare },
    { path: "/upload", label: "Scan News", icon: Upload },
  ];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/30">
      <div className="fixed top-0 inset-x-0 h-[2px] bg-primary z-[60]" />
      
      <header
        className={cn(
          "fixed top-[2px] inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border/60 shadow-sm py-3"
            : "bg-background/40 backdrop-blur-sm border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                alt="AgenticNews Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white transition-colors">
              Agentic<span className="text-primary font-sans font-medium">News</span>
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
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth section - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.firstName ?? "User"}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {user.firstName ?? user.email ?? "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border/50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </button>
              </Link>
            )}
          </div>

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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-4 border-b border-border/50 shadow-2xl h-fit pb-6"
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
                      "p-4 rounded-xl flex items-center gap-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="mt-4 pt-4 border-t border-border/50">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 mb-2">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.firstName ?? "User"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "User"}
                        </p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="w-full p-4 rounded-xl flex items-center gap-3 text-base font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full p-4 rounded-xl flex items-center gap-3 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <LogIn className="w-5 h-5" />
                      Sign in
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-[72px] flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-card py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
              alt="Logo" 
              className="w-5 h-5 grayscale"
            />
            <span className="font-serif font-semibold text-base tracking-tight text-foreground">AgenticNews</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            Intelligence applied to global events. © {new Date().getFullYear()} AgenticNews.
          </p>
        </div>
      </footer>
    </div>
  );
}
