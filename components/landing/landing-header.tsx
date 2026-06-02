"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { defaultTransition } from "@/lib/motion";

export function LandingHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={defaultTransition}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          Career<span className="text-primary">Verse</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#benefits"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Benefits
          </a>
        </nav>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button asChild size="sm" className="shadow-md shadow-primary/20">
            <Link href="/onboarding/1">Start Exploring</Link>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
