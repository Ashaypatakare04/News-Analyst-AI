import { Layout } from "@/components/layout";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Loader2, RefreshCcw, FileText, Target, Brain, ScanLine } from "lucide-react";
import { useUploadArticle } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadResponse } from "@workspace/api-client-react/src/generated/api.schemas";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const { mutate: upload, isPending } = useUploadArticle({
    mutation: {
      onSuccess: (data) => setResult(data)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-lg shadow-primary/5 border border-primary/20">
            <ScanLine className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            Digitize Physical Media
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Upload a photo of any newspaper clipping. Our Vision AI will extract the text, analyze the content, and integrate it into the intelligence engine.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Col: Upload & Preview */}
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden relative",
                isDragActive ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_30px_rgba(37,99,235,0.15)]" : 
                file ? "border-border/50 bg-card shadow-lg" : "border-border/60 hover:border-primary/50 bg-card hover:bg-secondary/20"
              )}
            >
              <input {...getInputProps()} />
              
              {isDragActive && (
                <div className="absolute inset-0 border-4 border-primary rounded-[2rem] animate-pulse pointer-events-none" />
              )}
              
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="relative aspect-[3/4] md:aspect-square max-h-[500px] w-full mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                  >
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <div className="bg-background/80 text-foreground px-6 py-3 rounded-full font-semibold border border-border shadow-xl">
                        Click or drag to replace
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="py-20 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-8 shadow-inner border border-border/50">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Drop newspaper scan here</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-lg">High-resolution JPG, PNG, or WebP</p>
                    <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-base font-bold transition-colors shadow-lg">
                      Browse Files
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {file && !result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isPending ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> Processing Vision AI...</>
                    ) : (
                      <><Brain className="w-6 h-6 group-hover:scale-110 transition-transform" /> Analyze Content</>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isPending}
                    className="w-16 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 border border-border/50"
                    aria-label="Reset"
                  >
                    <RefreshCcw className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Col: Results */}
          <div className="lg:pl-6 h-full">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 bg-primary/5 w-40 h-40 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary uppercase tracking-wider text-sm">
                      <Brain className="w-5 h-5" /> AI Synthesis
                    </h3>
                    <p className="text-foreground/90 leading-relaxed text-lg relative z-10 font-serif">
                      {result.summary}
                    </p>
                  </div>

                  <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-emerald-400">
                      <Target className="w-5 h-5" /> Key Extraction Points
                    </h3>
                    <ul className="space-y-4">
                      {result.bulletPoints.map((point, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          <span className="text-foreground/80 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-purple-400">
                      <FileText className="w-5 h-5" /> Raw OCR Text
                    </h3>
                    <div className="bg-background rounded-2xl p-6 h-64 overflow-y-auto font-mono text-sm text-muted-foreground whitespace-pre-wrap border border-border/50 custom-scrollbar">
                      {result.extractedText}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/30 rounded-[2rem] bg-secondary/10"
                >
                  <Brain className="w-20 h-20 mb-6 text-muted-foreground/30" />
                  <h3 className="text-2xl font-bold mb-3 text-foreground/50">Awaiting Analysis</h3>
                  <p className="text-muted-foreground max-w-sm text-lg">
                    Upload an image and run the vision engine to view intelligent extraction results here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}