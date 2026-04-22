import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type TrustScore = "Low" | "Medium" | "High" | null | undefined;

export function TrustBadge({ score, className }: { score: TrustScore; className?: string }) {
  if (!score) {
    return (
      <div className={cn("inline-flex items-center gap-2 px-3 py-1 text-muted-foreground/30 text-[8px] font-bold uppercase tracking-[0.4em] glass border-white/5", className)}>
        <ShieldQuestion className="w-3 h-3 opacity-20" />
        <span className="font-mono">PENDING_SYNC</span>
      </div>
    );
  }

  const config = {
    High: {
      color: "text-emerald-500/40",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      icon: ShieldCheck,
      label: "VERIFIED_INTEL"
    },
    Medium: {
      color: "text-amber-500/40",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
      icon: Shield,
      label: "PLAUSIBLE_NODE"
    },
    Low: {
      color: "text-rose-500/40",
      border: "border-rose-500/20",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.1)]",
      icon: ShieldAlert,
      label: "FRAGILE_SIGNAL"
    }
  }[score];

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex flex-col gap-1 items-start group/badge",
      className
    )}>
      <div className={cn(
        "flex items-center gap-2 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-700 glass",
        config.color,
        config.border,
        config.glow,
        "group-hover/badge:tracking-[0.4em] group-hover/badge:border-primary/40"
      )}>
        <Icon className="w-3 h-3" />
        <span className="font-mono">{config.label}</span>
      </div>
      <div className="flex items-center gap-1.5 px-2 text-[7px] text-muted-foreground/20 font-bold uppercase tracking-widest">
         <Activity className="w-2 h-2 animate-pulse-live" />
         Institutional Floor v8.4
      </div>
    </div>
  );
}

