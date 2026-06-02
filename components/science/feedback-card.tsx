"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FeedbackCardProps = {
  title: string;
  message: string;
  variant?: "success" | "learn";
  className?: string;
};

export function FeedbackCard({
  title,
  message,
  variant = "learn",
  className,
}: FeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border p-5 shadow-sm",
        variant === "success" && "border-emerald-500/35 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5",
        variant === "learn" && "border-sky-500/35 bg-gradient-to-br from-sky-500/10 to-sky-500/5",
        className,
      )}
    >
      <p
        className={cn(
          "font-[family-name:var(--font-plus-jakarta)] font-semibold",
          variant === "success" && "text-emerald-700",
          variant === "learn" && "text-sky-700",
        )}
      >
        {title}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{message}</p>
    </motion.div>
  );
}
