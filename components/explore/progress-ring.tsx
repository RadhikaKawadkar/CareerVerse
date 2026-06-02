"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { springTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  completed: number;
  total: number;
  className?: string;
  animate?: boolean;
};

export function ProgressRing({
  completed,
  total,
  className,
  animate = true,
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  const radius = 44;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = total > 0 ? completed / total : 0;
  const strokeDashoffset = mounted ? circumference * (1 - progress) : circumference;
  const isFull = completed === total && total > 0;

  useEffect(() => {
    if (!animate) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, [animate, completed, total]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springTransition}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
    >
      <svg height={radius * 2} width={radius * 2} className="-rotate-90" aria-hidden>
        <circle
          stroke="currentColor"
          className="text-border"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          className={isFull ? "text-emerald-500" : "text-primary"}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={`${completed}-${total}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springTransition}
          className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold"
        >
          {completed}/{total}
        </motion.span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          done
        </span>
      </div>
    </motion.div>
  );
}
