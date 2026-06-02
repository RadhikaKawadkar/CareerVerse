"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CareerFactCardProps = {
  facts: string[];
  accent?: "sky" | "emerald" | "primary";
  className?: string;
};

export function CareerFactCard({
  facts,
  accent = "primary",
  className,
}: CareerFactCardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (facts.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % facts.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [facts.length]);

  const colorClass =
    accent === "sky"
      ? "border-sky-500/25 bg-sky-500/5 text-sky-700"
      : accent === "emerald"
        ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-700"
        : "border-primary/25 bg-primary/5 text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("rounded-2xl border p-4 shadow-sm", colorClass, className)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 shadow-sm">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider">Career fact</p>
          <motion.p
            key={facts[index]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1.5 text-sm leading-relaxed text-foreground"
          >
            {facts[index]}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
