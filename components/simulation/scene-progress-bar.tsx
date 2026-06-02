"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SceneProgressBarProps = {
  current: number;
  total: number;
  className?: string;
};

export function SceneProgressBar({ current, total, className }: SceneProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(progress), 80);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>Moment {current} of {total}</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
