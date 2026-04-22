"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, MessageSquare, Upload, Menu, X, LogIn, LogOut, User, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { GlowCursor } from "./motion/glow-cursor";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const navItems = [
    { path: "/home", label: "Global Intel", icon: Newspaper },
    { path: "/brief", label: "Executive Brief", icon: BookOpen },
    { path: "/ask", label: "Consult Analyst", icon: MessageSquare },
    { path: "/upload", label: "Data Input", icon: Upload },
  ];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/20 overflow-x-hidden cursor-none">
      <GlowCursor />
      {/* Refractive Lens Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.035), transparent 80%)`
        }}
      />
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] bg-noise opacity-[0.03] mix-blend-overlay" />
      <div className="fixed top-0 inset-x-0 h-[1px] bg-primary/20 z-[60]" />
      
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-700 border-b",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-white/10 shadow-sm py-4"
            : "bg-transparent border-transparent py-8"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-6 group">
            <div className="relative w-10 h-10 flex items-center justify-center border-l border-t border-primary/20 group-hover:border-primary transition-all duration-700">
              <span className="font-serif text-xl font-bold text-primary">A</span>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-serif font-bold text-2xl tracking-tighter text-foreground leading-none">
                AGENTIC<span className="text-primary/40 font-sans font-light tracking-[0.4em] ml-3 text-xs">INTEL</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-1000">Institutional Grade</span>
            </div>
          </Link>


          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative py-1 text-[13px] font-bold uppercase tracking-[0.5em] transition-all duration-500",
                    isActive
                      ? "text-primary border-b border-primary/60"
                      : "text-muted-foreground/50 hover:text-foreground hover:tracking-[0.6em]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth section - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {isLoading ? (
              <div className="w-4 h-4 border-l border-primary/40 animate-spin" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-8">
                 <Link href="/profile" className="flex items-center gap-3 group/user cursor-pointer">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 group-hover/user:bg-primary transition-colors duration-500" />
                   <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-foreground group-hover/user:text-primary group-hover/user:tracking-[0.3em] transition-all duration-500">
                    {(user as any).firstName ?? user.email ?? "Operator"}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors"
                >
                  Terminate
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="px-8 py-2.5 border border-primary/30 text-primary text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-primary/5 transition-all shadow-prestige">
                  Access Terminal
                </button>
              </Link>
            )}
            <div className="pl-6 border-l border-border/20">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
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
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="mt-4 pt-4 border-t border-border/50">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-secondary/40 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                          {(user as any).firstName ?? "Operator"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="w-full p-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terminate Session
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full p-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      Access Terminal
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

      <footer className="border-t border-white/5 bg-background/40 py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 group cursor-default">
            <span className="font-serif font-bold text-sm tracking-[0.6em] text-foreground uppercase">Agentic Intel Imprint</span>
            <div className="w-16 h-px bg-primary/20 group-hover:w-32 transition-all duration-1000" />
            <div className="text-[10px] font-bold tracking-[0.8em] text-primary/60 uppercase">Global Directive v9.4</div>
          </div>
          <p className="text-muted-foreground/60 text-xs tracking-[0.4em] text-center uppercase font-light max-w-xl leading-loose italic">
            Institutional synthesis for the post-information age.
            <br />
            Data mapping at planetary scale. Integrity verified via RSA-4096.
            <br />
            © {new Date().getFullYear()} AGENTIC INTEL IMPRINT.
          </p>
        </div>
      </footer>

    </div>
  );
}
