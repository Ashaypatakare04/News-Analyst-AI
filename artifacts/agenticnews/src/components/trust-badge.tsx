import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "./layout";

type TrustScore = "Low" | "Medium" | "High" | null | undefined;

export function TrustBadge({ score, className }: { score: TrustScore; className?: string }) {
  if (!score) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-muted-foreground text-[11px] font-semibold border border-border/60 bg-secondary/40 backdrop-blur-md", className)}>
        <ShieldQuestion className="w-3 h-3" />
        <span>UNVERIFIED</span>
      </div>
    );
  }

  const config = {
    High: {
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      icon: ShieldCheck,
    },
    Medium: {
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      icon: Shield,
    },
    Low: {
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/20",
      icon: ShieldAlert,
    }
  }[score];

  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors", config.bg, config.color, config.border, "border", className)}>
      <Icon className="w-3 h-3" />
      <span>{score} TRUST</span>
    </div>
  );
}