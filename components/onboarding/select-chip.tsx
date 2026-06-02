"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SelectChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

export function SelectChip({ label, selected, onClick, className }: SelectChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: selected ? 1 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex min-h-12 items-center justify-center rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors duration-200",
        selected
          ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/15"
          : "border-border bg-card text-foreground shadow-sm hover:border-primary/40 hover:bg-muted/60 hover:shadow-md",
        className,
      )}
    >
      {label}
    </motion.button>
  );
}
