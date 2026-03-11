import { Layout } from "@/components/layout";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Loader2, RefreshCcw, FileText, Target, Brain } from "lucide-react";
import { useUploadArticle } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadResponse } from "@workspace/api-client-react/src/generated/api.schemas";

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
      setResult(null); // reset result
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 flex items-center justify-center gap-3">
            <Upload className="w-8 h-8 text-primary" /> Scan Newspaper
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload a photo of any physical newspaper article. Our AI will extract the text, analyze the content, and generate intelligent summaries.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Col: Upload & Preview */}
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : 
                file ? "border-border/50 bg-secondary/20" : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input {...getInputProps()} />
              
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="relative aspect-[3/4] max-h-[400px] w-full mx-auto rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <p className="text-white font-medium drop-shadow-md">Click or drag to replace</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <FileImage className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Drop your image here</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Supports JPG, PNG, and WebP up to 10MB</p>
                    <span className="bg-background border border-border px-6 py-2.5 rounded-full text-sm font-medium hover:text-primary transition-colors shadow-sm">
                      Browse Files
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {file && !result && (
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing AI OCR...</>
                  ) : (
                    <><Brain className="w-5 h-5" /> Analyze Article</>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isPending}
                  className="px-6 bg-secondary hover:bg-secondary/80 text-foreground py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                  aria-label="Reset"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Col: Results */}
          <div className="lg:border-l lg:border-border/50 lg:pl-8">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Target className="w-32 h-32" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-primary">
                    <Brain className="w-5 h-5" /> AI Summary
                  </h3>
                  <p className="text-foreground/80 leading-relaxed relative z-10">{result.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" /> Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {result.bulletPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/50">
                        <span className="text-primary">•</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" /> Extracted OCR Text
                  </h3>
                  <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 max-h-60 overflow-y-auto font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.extractedText}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-transparent lg:border-border/50 rounded-3xl opacity-50">
                <Brain className="w-16 h-16 mb-6 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Awaiting Analysis</h3>
                <p className="text-muted-foreground max-w-sm">Upload an image and run the analysis to view intelligent extraction results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
