"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface AntiGravityCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  float?: boolean;
  speed?: "slow" | "medium" | "fast";
}

export function AntiGravityCard({ 
  children, 
  className, 
  intensity = 15,
  float = true,
  speed
}: AntiGravityCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Deterministic speed to avoid hydration mismatches
  const floatClass = speed 
    ? `float-${speed}` 
    : "float-medium";

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 400,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 400,
    damping: 30
  });

  const spotlightX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]));
  const spotlightY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    mouseX.set(mouseXPos / width - 0.5);
    mouseY.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -6,
        transition: { type: "spring" as const, stiffness: 400, damping: 28 } 
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-none transition-shadow duration-500 group",
        float && floatClass,
        className
      )}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full relative">
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, hsla(var(--cursor-glow), 0.1) 0%, transparent 80%)`
            )
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
