"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useGetComments, usePostComment, Comment } from "@/lib/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Loader2, UserCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ArticleComments({ articleId }: { articleId: string }) {
  const { user, login } = useAuth();
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetComments(articleId);
  const postCommentMut = usePostComment({
    mutation: {
      onSuccess: () => {
        setNewComment("");
        queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    postCommentMut.mutate({
      articleId,
      data: {
        text: newComment,
        userId: user.uid,
        userName: user.displayName || "Anonymous Analyst",
        userPhotoUrl: user.photoURL
      }
    });
  };

  const comments = data?.comments || [];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32 border-t border-white/5 relative z-10 mt-16">
      <div className="flex items-center gap-6 mb-16">
        <MessageSquare className="w-6 h-6 text-primary/40" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Discourse</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/10 to-transparent" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary/40">
          {comments.length} Entries
        </span>
      </div>

      {user ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 bento-cell neuro-beam p-1"
          onSubmit={handleSubmit}
        >
          <div className="neuro-beam-inner p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="w-12 h-12 rounded-sm border border-primary/20 opacity-80" />
            ) : (
              <div className="w-12 h-12 rounded-sm border border-primary/20 bg-primary/5 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6 text-primary/40" />
              </div>
            )}
            <div className="flex-1 w-full">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Contribute your analysis..."
                className="w-full bg-transparent border-b border-white/10 pb-4 text-sm font-mono text-foreground focus:outline-none focus:border-primary/40 transition-colors resize-none placeholder:text-muted-foreground/30 min-h-[80px]"
              />
              <div className="flex justify-between items-center mt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-primary/30">
                  Posting as <span className="text-primary/60">{user.displayName || "Anonymous Analyst"}</span>
                </span>
                <MagneticButton 
                  disabled={!newComment.trim() || postCommentMut.isPending}
                  className="px-8 py-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 disabled:opacity-50"
                  type="submit"
                >
                  {postCommentMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit
                </MagneticButton>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <div className="mb-24 p-12 text-center bento-cell glass border-dashed border-white/5 flex flex-col items-center">
          <UserCircle2 className="w-10 h-10 text-primary/20 mb-6" />
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.4em] text-foreground/40 mb-8">
            Authentication Required to Contribute
          </p>
          <MagneticButton onClick={login} className="px-8 py-4 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-primary hover:text-primary-foreground transition-all">
            Authorize Identity
          </MagneticButton>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 skeleton-gemini opacity-30 rounded-sm" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-12">
          <AnimatePresence>
            {comments.map((comment: Comment, index: number) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6 group"
              >
                <div className="pt-2">
                  {comment.userPhotoUrl ? (
                    <img src={comment.userPhotoUrl} alt={comment.userName} className="w-10 h-10 rounded-sm border border-white/5 opacity-60 grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-10 h-10 rounded-sm border border-white/5 bg-white/5 flex items-center justify-center opacity-60">
                      <UserCircle2 className="w-5 h-5 text-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 bento-cell p-6 hover:bg-white/[0.02] transition-colors border-l-2 border-transparent group-hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/70">
                      {comment.userName}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-light text-foreground/60 leading-relaxed font-serif">
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 opacity-30">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-foreground">Zero Entries Recorded</p>
        </div>
      )}
    </div>
  );
}
