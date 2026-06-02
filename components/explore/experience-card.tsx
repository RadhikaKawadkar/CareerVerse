"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ExperienceCardProps = {
  title: string;
  description: string;
  meta: string;
  href: string;
  icon: LucideIcon;
  completed: boolean;
  accentClass: string;
  iconClass: string;
  onStart: () => void;
  startLabel: string;
  reviewLabel: string;
};

export function ExperienceCard({
  title,
  description,
  meta,
  href,
  icon: Icon,
  completed,
  accentClass,
  iconClass,
  onStart,
  startLabel,
  reviewLabel,
}: ExperienceCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        href={href}
        onClick={onStart}
        className={cn(
          "group block overflow-hidden rounded-2xl border bg-card shadow-md transition-all duration-300",
          "hover:shadow-xl",
          completed
            ? "border-emerald-500/35 shadow-emerald-500/10"
            : "border-border hover:border-primary/25",
        )}
      >
        <div className={cn("h-1.5 w-full", accentClass)} />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm",
                iconClass,
              )}
            >
              <Icon className="h-5 w-5" />
              {completed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
                >
                  <CheckCircle2 className="h-3 w-3" />
                </motion.span>
              )}
            </div>
            <motion.span
              layout
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                completed
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {completed && <CheckCircle2 className="h-3 w-3" />}
              {completed ? "Completed" : "Not Started"}
            </motion.span>
          </div>

          <h3 className="mt-5 font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <p className="mt-2.5 text-xs font-medium text-muted-foreground/80">{meta}</p>

          <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
            <span
              className={cn(
                "text-sm font-semibold",
                completed ? "text-emerald-600" : "text-primary",
              )}
            >
              {completed ? reviewLabel : startLabel}
            </span>
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-transform duration-200 group-hover:translate-x-1",
                completed ? "text-emerald-600" : "text-primary",
              )}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
