"use client";

import { motion } from "framer-motion";
import { springTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type OnboardingProgressProps = {
  currentStep: 1 | 2 | 3;
  className?: string;
};

export function OnboardingProgress({ currentStep, className }: OnboardingProgressProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label={`Step ${currentStep} of 3`}
    >
      {[1, 2, 3].map((step) => {
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <motion.div
            key={step}
            layout
            transition={springTransition}
            className={cn(
              "h-2 rounded-full",
              isActive && "bg-primary",
              isComplete && "bg-primary/50",
              !isActive && !isComplete && "bg-border",
            )}
            initial={false}
            animate={{
              width: isActive ? 32 : 8,
              opacity: isActive ? 1 : isComplete ? 0.85 : 0.6,
            }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
