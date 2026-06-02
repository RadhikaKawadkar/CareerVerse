"use client";

import { motion } from "framer-motion";

type ReactionBubbleProps = {
  from: string;
  message: string;
};

export function ReactionBubble({ from, message }: ReactionBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-card p-5 shadow-md shadow-emerald-500/5"
    >
      <div className="absolute -left-1 top-5 h-3 w-3 rotate-45 border-b border-l border-emerald-500/25 bg-emerald-500/10" />
      <p className="text-xs font-semibold text-emerald-700">{from}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{message}</p>
    </motion.div>
  );
}
