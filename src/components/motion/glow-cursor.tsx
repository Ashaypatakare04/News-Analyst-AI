"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function GlowCursor() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 450, damping: 50 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[9999] rounded-full mix-blend-screen overflow-hidden"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        background: isDark 
          ? "radial-gradient(circle, hsla(255, 100%, 75%, 0.15) 0%, transparent 70%)"
          : "radial-gradient(circle, hsla(43, 33%, 45%, 0.1) 0%, transparent 70%)"
      }}
    />
  );
}
