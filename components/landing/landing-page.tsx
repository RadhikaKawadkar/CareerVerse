"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/landing-header";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { easeOut } from "@/lib/motion";

const benefits = [
  {
    icon: FlaskConical,
    title: "Sample a Science lesson",
    description:
      "Try a short Physics moment with observation, prediction, and feedback.",
    accent: "from-sky-500/10 to-sky-500/5",
    iconColor: "text-sky-500",
  },
  {
    icon: Code2,
    title: "Simulate life as a Software Engineer",
    description:
      "Make realistic workplace decisions about blockers, bugs, and product tradeoffs.",
    accent: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Get a personalized insight",
    description:
      "See how your experiences compare and leave with clarity about what genuinely fits you.",
    accent: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
];

const steps = [
  { step: "01", label: "Try", detail: "Sample a stream lesson" },
  { step: "02", label: "Feel", detail: "Simulate a real career" },
  { step: "03", label: "Understand", detail: "Get your insight" },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-24 sm:pb-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-primary/8 via-violet-500/5 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-48 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
      />

      <LandingHeader />

      <main>
        <section className="relative mx-auto max-w-5xl px-5 pb-20 pt-14 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <MotionFadeIn delay={0.05}>
              <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
                For students in grades 8-12
              </div>
            </MotionFadeIn>

            <MotionFadeIn delay={0.12}>
              <h1 className="cv-heading text-4xl leading-tight sm:text-5xl sm:leading-[1.12]">
                Experience your future{" "}
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  before you choose it.
                </span>
              </h1>
            </MotionFadeIn>

            <MotionFadeIn delay={0.2}>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Try real stream lessons, simulate careers, and discover what genuinely fits you
                before making life-changing decisions.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.28} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button asChild size="lg" className="h-12 w-full px-8 text-base sm:w-auto">
                  <Link href="/onboarding/1">
                    Start Exploring
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button asChild variant="outline" size="lg" className="h-12 w-full sm:w-auto">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </motion.div>
            </MotionFadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-20">
          <MotionFadeIn>
            <div className="cv-card-elevated relative overflow-hidden p-6 sm:p-10">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-violet-500" />
              <div className="pl-5 sm:pl-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  The problem
                </p>
                <p className="mt-4 cv-heading text-xl leading-snug sm:text-2xl">
                  Everyone has an opinion about your future. Parents, teachers, relatives.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  But have you actually experienced the path they are recommending?
                </p>
                <div className="mt-7 rounded-xl border border-border/60 bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  Scored 98% in Grade 10? Everyone says Science, JEE, Computer Science - but do
                  you know what those actually involve?
                </div>
              </div>
            </div>
          </MotionFadeIn>
        </section>

        <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-20">
          <MotionFadeIn className="mb-10 text-center">
            <h2 className="cv-heading text-2xl sm:text-3xl">How CareerVerse works</h2>
            <p className="mt-3 text-muted-foreground">Three steps. About 15 minutes. Real clarity.</p>
          </MotionFadeIn>

          <MotionStagger className="grid gap-5 sm:grid-cols-3">
            {steps.map((item) => (
              <MotionStaggerItem key={item.step}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="cv-card-elevated h-full p-7 text-center"
                >
                  <span className="cv-heading text-3xl text-primary/30">{item.step}</span>
                  <p className="mt-3 cv-heading text-lg">{item.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                </motion.div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </section>

        <section id="benefits" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-24">
          <MotionFadeIn className="mb-10 text-center">
            <h2 className="cv-heading text-2xl sm:text-3xl">What you&apos;ll experience</h2>
            <p className="mt-3 text-muted-foreground">
              No signup required. No wrong answers. Just honest exploration.
            </p>
          </MotionFadeIn>

          <MotionStagger className="grid gap-6 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <MotionStaggerItem key={benefit.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="cv-card-elevated h-full p-7"
                >
                  <div
                    className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${benefit.accent} p-3.5 shadow-sm`}
                  >
                    <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="cv-heading text-lg">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-28">
          <MotionFadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-violet-600 p-10 text-center shadow-xl shadow-primary/25 sm:p-14">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              />
              <h2 className="cv-heading text-2xl text-white sm:text-3xl">
                Ready to explore your future?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85">
                Take 15 minutes to try before you choose. Your path should feel like yours - not
                someone else&apos;s advice.
              </p>
              <motion.div
                className="mt-10 inline-block"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-0 bg-white px-8 text-base text-primary shadow-lg hover:bg-white/95"
                >
                  <Link href="/onboarding/1">
                    Start Exploring
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </MotionFadeIn>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold">
            Career<span className="text-primary">Verse</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Experience your future before you choose it.
          </p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareerVerse</p>
        </div>
      </footer>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: easeOut }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 p-4 backdrop-blur-lg sm:hidden"
      >
        <Button asChild className="h-12 w-full">
          <Link href="/onboarding/1">
            Start Exploring
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
