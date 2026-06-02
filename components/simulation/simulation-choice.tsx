"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SimulationChoiceProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

export function SimulationChoice({
  label,
  selected,
  onSelect,
  disabled,
}: SimulationChoiceProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex min-h-14 w-full items-center rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors duration-200",
        selected
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 shadow-md shadow-emerald-500/15"
          : "border-border bg-card shadow-sm hover:border-emerald-500/40 hover:bg-muted/50 hover:shadow-md",
        disabled && !selected && "opacity-60",
        disabled && selected && "cursor-default",
      )}
    >
      {label}
    </motion.button>
  );
}
