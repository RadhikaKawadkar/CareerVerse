"use client";

import { motion, type MotionProps } from "framer-motion";
import { defaultTransition, easeOut, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionFadeInProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function MotionFadeIn({ children, className, delay = 0, ...props }: MotionFadeInProps) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ ...defaultTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function MotionStagger({ children, className }: MotionStaggerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function MotionStaggerItem({ children, className }: MotionStaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

type MotionPresenceFadeProps = {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
};

export function MotionPresenceFade({ children, className, show = true }: MotionPresenceFadeProps) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionHoverCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn("transition-shadow duration-300", className)}
    >
      {children}
    </motion.div>
  );
}
