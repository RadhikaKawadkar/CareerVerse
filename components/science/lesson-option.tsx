"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LessonOptionProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
};

export function LessonOption({
  label,
  selected,
  onSelect,
  showResult,
  isCorrect,
  disabled,
}: LessonOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      animate={selected ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "flex min-h-14 w-full items-center rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
        !showResult && selected && "border-sky-500 bg-sky-500/10 text-sky-700",
        !showResult && !selected && "border-border bg-card shadow-sm hover:border-sky-500/30 hover:bg-muted/50 hover:shadow-md",
        showResult && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700",
        showResult && !isCorrect && selected && "border-amber-500 bg-amber-500/10 text-amber-800",
        showResult && !isCorrect && !selected && "border-border bg-muted/30 opacity-60",
        disabled && "cursor-default",
      )}
    >
      {label}
    </motion.button>
  );
}
