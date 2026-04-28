"use client";
import { cn } from "@/lib/utils";

export function ArticleSkeleton({ isFeatured = false }: { isFeatured?: boolean }) {
  return (
    <div className={cn(
      "bento-cell skeleton-gemini",
      isFeatured ? "h-[600px]" : "h-[450px]"
    )}>
      <div className="p-8 md:p-12 h-full flex flex-col gap-6">
        <div className="w-24 h-4 bg-primary/10 rounded-full" />
        <div className="flex-1 space-y-4">
          <div className="w-3/4 h-12 bg-white/5 rounded-sm" />
          <div className="w-1/2 h-8 bg-white/5 rounded-sm" />
        </div>
        <div className="mt-auto flex gap-4">
          <div className="w-20 h-6 bg-white/5 rounded-full" />
          <div className="w-32 h-6 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ConsoleSkeleton() {
  return (
    <div className="bento-cell skeleton-gemini h-full p-12">
      <div className="flex flex-col h-full gap-12">
        <div className="flex justify-between">
          <div className="w-32 h-4 bg-primary/20 rounded-full" />
          <div className="w-16 h-4 bg-emerald-500/10 rounded-full" />
        </div>
        <div className="space-y-8 flex-1">
          <div className="w-24 h-3 bg-primary/10 rounded-full" />
          <div className="w-full h-24 bg-white/5 rounded-sm" />
          <div className="w-3/4 h-12 bg-white/5 rounded-sm italic" />
        </div>
        <div className="h-10 w-full bg-white/5 rounded-sm" />
      </div>
    </div>
  );
}

export function SignalsSkeleton() {
  return (
    <div className="bento-cell skeleton-gemini p-10 space-y-10">
      <div className="w-40 h-4 bg-primary/20 rounded-full mb-8" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-6 items-center">
          <div className="w-10 h-10 bg-primary/5 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 bg-white/5 rounded-sm" />
            <div className="w-full h-1 bg-white/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BriefSkeleton() {
  return (
    <div className="space-y-32">
      <div className="skeleton-gemini p-24 border border-primary/20">
        <div className="w-32 h-4 bg-primary/20 rounded-full mb-12" />
        <div className="w-full h-24 bg-white/5 rounded-sm" />
      </div>
      <div className="grid lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <div className="w-48 h-8 bg-white/5 rounded-sm mb-16" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-8">
              <div className="w-12 h-12 bg-primary/10 rounded-sm shrink-0" />
              <div className="w-full h-16 bg-white/5 rounded-sm" />
            </div>
          ))}
        </div>
        <div className="skeleton-gemini p-12 space-y-12 h-fit">
          <div className="w-48 h-8 bg-white/5 rounded-sm" />
          {[1, 2].map(i => (
             <div key={i} className="flex gap-8">
               <div className="w-14 h-14 bg-primary/10 rounded-sm shrink-0" />
               <div className="w-full h-16 bg-white/5 rounded-sm" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
