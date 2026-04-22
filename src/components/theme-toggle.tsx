"use client";

import { useTheme } from "next-themes";
import { Moon, Coffee, Sun, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "./motion/magnetic-button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 border border-white/5 opacity-20" />;
  }

  const isWarm = theme === "warm";

  return (
    <MagneticButton
      onClick={() => setTheme(isWarm ? "dark" : "warm")}
      className="relative w-10 h-10 glass border-white/5 flex items-center justify-center group overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full blur-xl" />
      
      <AnimatePresence mode="wait">
        {isWarm ? (
          <motion.div
            key="warm"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Zap className="w-4 h-4 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="dark"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Moon className="w-4 h-4 text-primary/60" />
          </motion.div>
        )}
      </AnimatePresence>
    </MagneticButton>
  );
}
