"use client";
import { Layout } from "@/components/layout";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileImage, Loader2, RefreshCcw, FileText, Target, Brain, ScanLine, ArrowRight, ShieldCheck, Fingerprint, Activity } from "lucide-react";
import { useUploadArticle } from "@/lib/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadResponse } from "@/lib/api-client-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { AntiGravityCard } from "@/components/motion/anti-gravity-card";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function UploadPage() {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const { mutate: upload, isPending } = useUploadArticle({
    mutation: {
      onSuccess: (data: UploadResponse) => setResult(data)
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const handleAnalyze = () => {
    if (file) {
      upload({ data: { image: file } });
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background relative selection:bg-primary/20 cursor-none overflow-hidden">
        
        {/* Background Decor */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="mesh-bg" />
          <div className="bg-noise absolute inset-0" />
        </div>

        {/* Institutional Status Bar */}
        <div className="sticky top-20 z-40 bg-background/60 backdrop-blur-md border-b border-white/[0.03] text-[9px] py-4 px-6 lg:px-8 overflow-x-auto whitespace-nowrap hide-scrollbar shadow-sm">
          <div className="flex items-center gap-12 max-w-7xl mx-auto w-full font-bold uppercase tracking-[0.4em] text-primary/40">
            <span className="flex items-center gap-3">
              <ScanLine className="w-3.5 h-3.5 opacity-40 animate-pulse-live" />
              Vision Synthesis Pipeline: ACTIVE
            </span>
            <span className="flex items-center gap-3 opacity-20">
              OCR Engine: Institutional Grade v8
            </span>
            <div className="flex items-center gap-3 ml-auto">
               <Activity className="w-3 h-3 text-primary animate-pulse-live" />
               Live Sync
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
          <header className="mb-24">
            <div className="flex items-center gap-6 text-primary/40 text-[10px] font-bold uppercase tracking-[0.6em] mb-12">
              <div className="w-16 h-px bg-primary/20" />
              Media Digitalization Directives
            </div>
            <h1 className={cn(
              "text-6xl md:text-8xl font-bold text-gradient leading-[0.9] tracking-tighter mb-10",
              theme !== "dark" && "font-serif"
            )}>
              Data <span className="italic font-light opacity-30">Intake</span>
            </h1>
            <p className="text-muted-foreground/50 text-xl font-light max-w-2xl leading-relaxed">
              Consolidate physical records into the global intelligence matrix. High-fidelity neural vision engine for analogue media extraction.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            
            {/* Left Column - Terminal Upload */}
            <div className="space-y-16">
              <AntiGravityCard intensity={10} float={false}>
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "glass border-white/5 p-16 text-center cursor-pointer transition-all duration-700 relative group/dropzone shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center",
                    isDragActive ? "border-primary/40 bg-primary/[0.02]" : "hover:border-primary/20 hover:bg-white/[0.01]"
                  )}
                >
                  <input {...getInputProps()} />
                  
                  {/* Decorative Accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-primary/20 group-hover/dropzone:border-primary transition-colors" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-primary/20 group-hover/dropzone:border-primary transition-colors" />

                  <AnimatePresence mode="wait">
                    {preview ? (
                      <motion.div 
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="relative aspect-square w-full grayscale group-hover/dropzone:grayscale-0 transition-all duration-1000 overflow-hidden shadow-2xl border border-white/5"
                      >
                        <img src={preview} alt="Analogue preview" className="w-full h-full object-cover scale-100 group-hover/dropzone:scale-105 transition-transform duration-[2000ms]" />
                        
                        {/* Scanning Line */}
                        {isPending && (
                          <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_20px_hsla(var(--primary),0.8)] z-20"
                          />
                        )}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/dropzone:opacity-100 transition-opacity" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-20 h-20 border-l border-t border-primary/20 flex items-center justify-center mb-12 group-hover/dropzone:border-primary transition-colors glass">
                          <UploadIcon className="w-8 h-8 text-primary/30 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] text-foreground/50 mb-6">Initialize Intake Protocol</h3>
                        <p className="text-muted-foreground/30 text-[10px] font-bold tracking-[0.4em] uppercase">Materialize physical media here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AntiGravityCard>

              <AnimatePresence>
                {file && !result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="flex gap-8"
                  >
                    <MagneticButton
                      onClick={handleAnalyze}
                      disabled={isPending}
                      className="flex-1 bg-primary text-primary-foreground py-6 text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center gap-6"
                    >
                      {isPending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Bitstream</>
                      ) : (
                        <>Incorporate Analogue Data <ArrowRight className="w-5 h-5" /></>
                      )}
                    </MagneticButton>
                    <MagneticButton
                      onClick={handleReset}
                      disabled={isPending}
                      className="px-10 border border-white/5 glass text-primary/40 hover:text-primary transition-all"
                      aria-label="Reset Terminal"
                    >
                      <RefreshCcw className={cn("w-5 h-5", isPending && "animate-spin")} />
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Extraction Matrix */}
            <div className="h-full">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="space-y-16"
                  >
                    <AntiGravityCard intensity={15} float={true} speed="slow">
                      <div className="p-12 glass border-primary/20 bg-primary/[0.02] shadow-2xl group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                        <div className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 mb-10 flex items-center gap-6">
                          <Brain className="w-5 h-5" /> Neural Synthesis Summary
                        </div>
                        <p className={cn(
                          "text-3xl font-bold text-foreground leading-[1.3] italic tracking-tight text-gradient",
                          theme !== "dark" && "font-serif"
                        )}>
                          "{result.summary}"
                        </p>
                      </div>
                    </AntiGravityCard>

                    <div className="p-12 glass border-white/5 shadow-2xl space-y-16">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] mb-12 text-primary/40 flex items-center gap-6">
                        <Target className="w-5 h-5" /> Extracted Strategic Nodes
                      </h3>
                      <ul className="space-y-12">
                        {result.bulletPoints.map((point, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-10 group"
                          >
                            <span className={cn(
                              "text-primary/10 text-4xl font-bold italic leading-none transition-colors group-hover:text-primary/50",
                              theme !== "dark" && "font-serif"
                            )}>
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="text-xl text-foreground/60 leading-relaxed font-light mt-1">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-12 glass border-white/5 bg-black/20 shadow-inner group/transcript">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.6em] mb-10 text-foreground/20 flex items-center gap-6 group-hover/transcript:text-primary/40 transition-colors">
                        <FileText className="w-5 h-5" /> Raw Digital Imprint
                      </h3>
                      <div className="text-xs font-mono leading-relaxed text-muted-foreground/30 h-64 overflow-y-auto hide-scrollbar whitespace-pre-wrap font-light tracking-widest italic border-l border-white/5 pl-8">
                        {result.extractedText}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-24 glass border-dashed border-white/5 opacity-20 grayscale"
                  >
                    <Fingerprint className="w-20 h-20 mb-12 text-primary/20 animate-pulse" />
                    <h3 className="text-[12px] font-bold uppercase tracking-[0.7em] mb-6">Awaiting Signal Synchronization</h3>
                    <p className="text-muted-foreground text-base font-light leading-relaxed max-w-sm tracking-tight italic">
                      The extraction matrix is currently idle. Initialize a media digitalization scan to populate this terminal.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
