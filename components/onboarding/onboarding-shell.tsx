"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { defaultTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  step: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
};

const backHrefByStep: Record<1 | 2 | 3, string> = {
  1: "/",
  2: "/onboarding/1",
  3: "/onboarding/2",
};

export function OnboardingShell({ step, children, className }: OnboardingShellProps) {
  return (
    <div className={cn("flex min-h-[calc(100vh-4rem)] flex-col", className)}>
      <div className="mb-8 flex items-center justify-between gap-2">
        <Link
          href={backHrefByStep[step]}
          className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <OnboardingProgress currentStep={step} />
        <div className="w-14" aria-hidden />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={defaultTransition}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}
