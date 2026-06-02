"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FlaskConical,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { clearCareerVerseData, getCareerVerseData } from "@/lib/profile-storage";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ScoreBarProps = {
  label: string;
  icon: React.ReactNode;
  percentage: number;
  animate: boolean;
  accentClass: string;
  barClass: string;
};

function ScoreBar({
  label,
  icon,
  percentage,
  animate,
  accentClass,
  barClass,
}: ScoreBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accentClass)}>
            {icon}
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner">
        <motion.div
          className={cn("h-full rounded-full shadow-sm", barClass)}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${percentage}%` : "0%" }}
          transition={{ duration: 1, ease: easeOut, delay: 0.1 }}
        />
      </div>
    </div>
  );
}

function getPrimaryInsight(scienceScore: number, sweScore: number): string {
  if (scienceScore > sweScore) {
    return "You appeared more engaged with scientific thinking and structured problem solving.";
  }
  if (sweScore > scienceScore) {
    return "You appeared more engaged with practical workplace decisions and software engineering scenarios.";
  }
  return "You showed balanced interest across both experiences.";
}

export function ResultsInsight() {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  const [data, setData] = useState<{
    name: string;
    grade: number;
    quizCompleted: boolean;
    quizScore: number | null;
    scienceEnjoyment: number;
    scienceFit: number;
    simulationEnjoyment: number;
    simulationFit: number;
    scienceScore: number;
    sweScore: number;
    sciencePercent: number;
    swePercent: number;
  } | null>(null);

  useEffect(() => {
    const data = getCareerVerseData();

    if (
      !data.profile.name.trim() ||
      !data.profile.grade ||
      !data.science.completed ||
      !data.simulation.completed ||
      data.science.enjoyment === null ||
      data.science.fit === null ||
      data.simulation.enjoyment === null ||
      data.simulation.fit === null
    ) {
      router.replace("/explore");
      return;
    }

    const scienceInterest = data.science.enjoyment;
    const scienceConfidence = data.science.fit;
    const sweInterest = data.simulation.enjoyment;
    const sweConfidence = data.simulation.fit;

    const scienceScore = (scienceInterest + scienceConfidence) / 2;
    const sweScore = (sweInterest + sweConfidence) / 2;

    setData({
      name: data.profile.name,
      grade: data.profile.grade,
      quizCompleted: data.quiz.completed,
      quizScore: data.quiz.score,
      scienceEnjoyment: scienceInterest,
      scienceFit: scienceConfidence,
      simulationEnjoyment: sweInterest,
      simulationFit: sweConfidence,
      scienceScore,
      sweScore,
      sciencePercent: (scienceScore / 5) * 100,
      swePercent: (sweScore / 5) * 100,
    });

    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, [router]);

  function handleReset() {
    clearCareerVerseData();
    router.push("/onboarding/1");
  }

  function handleExploreAgain() {
    clearCareerVerseData();
    router.push("/onboarding/1");
  }

  if (!data) {
    return null;
  }

  const scienceWins = data.scienceScore > data.sweScore;
  const sweWins = data.sweScore > data.scienceScore;
  const tied = data.scienceScore === data.sweScore;
  const primaryInsight = getPrimaryInsight(data.scienceScore, data.sweScore);

  const learnedBullets = [
    "You explored a real lesson",
    "You experienced workplace decisions",
    "You reflected on your interests",
  ];

  return (
    <div className="cv-section-gap pb-8">
      <MotionFadeIn>
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Your insight
          </div>
          <h1 className="cv-heading text-2xl sm:text-3xl">
            {data.name}, here&apos;s your insight
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Grade {data.grade}</p>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.08}>
      <div className="cv-card-elevated p-6">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] font-semibold">
          Experience comparison
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on your enjoyment and fit ratings
        </p>
        <div className="mt-5 space-y-5">
          <ScoreBar
            label="Science"
            icon={<FlaskConical className="h-4 w-4 text-sky-600" />}
            percentage={data.sciencePercent}
            animate={animate}
            accentClass="bg-sky-500/10"
            barClass="bg-sky-500"
          />
          <ScoreBar
            label="Software Engineer"
            icon={<Code2 className="h-4 w-4 text-emerald-600" />}
            percentage={data.swePercent}
            animate={animate}
            accentClass="bg-emerald-500/10"
            barClass="bg-emerald-500"
          />
        </div>
      </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.14}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/12 via-violet-500/8 to-transparent p-6 shadow-md shadow-primary/10"
      >
        <h2 className="cv-heading text-lg">Primary insight</h2>
        <p className="mt-4 text-sm leading-relaxed text-foreground">
          {data.name}, {primaryInsight.charAt(0).toLowerCase() + primaryInsight.slice(1)}
        </p>
      </motion.div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.16}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="border-b border-border/80 bg-gradient-to-r from-primary/10 via-sky-500/10 to-emerald-500/10 px-6 py-4">
            <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">
              Career<span className="text-primary">Verse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Share result card</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data.name}'s career signal
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug text-foreground">
              {primaryInsight}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <p className="text-xs font-medium text-sky-700">Science</p>
                <p className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold">
                  {Math.round(data.sciencePercent)}%
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-medium text-emerald-700">Software</p>
                <p className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold">
                  {Math.round(data.swePercent)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.18}>
      <div className="cv-card p-6">
        <h2 className="cv-heading font-semibold">Experience summary</h2>
        <MotionStagger className="mt-5 space-y-3">
          {[
            `Science: enjoyment ${data.scienceEnjoyment}/5, fit ${data.scienceFit}/5`,
            `Software Engineer: enjoyment ${data.simulationEnjoyment}/5, fit ${data.simulationFit}/5`,
            data.quizCompleted && data.quizScore !== null
              ? `Science quiz completed: ${data.quizScore}/2`
              : "Science quiz not taken yet",
            ...learnedBullets,
          ].map((bullet) => (
            <MotionStaggerItem key={bullet}>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {bullet}
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
      </MotionFadeIn>

      <MotionStagger className="grid gap-4 sm:grid-cols-2">
        <MotionStaggerItem>
        <motion.div
          whileHover={{ y: -2 }}
          className={cn(
            "h-full rounded-2xl border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-lg",
            scienceWins && "border-sky-500/45 ring-2 ring-sky-500/25 shadow-sky-500/10",
            tied && "border-primary/35 ring-2 ring-primary/15",
          )}
        >
          {scienceWins && (
            <span className="mb-2 inline-block rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600">
              Stronger pull
            </span>
          )}
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-sky-500" />
            <h3 className="font-[family-name:var(--font-plus-jakarta)] font-semibold">Science</h3>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">School</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Grade 11 Science</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Degree</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Career</span>
          </div>
        </motion.div>
        </MotionStaggerItem>

        <MotionStaggerItem>
        <motion.div
          whileHover={{ y: -2 }}
          className={cn(
            "h-full rounded-2xl border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-lg",
            sweWins && "border-emerald-500/45 ring-2 ring-emerald-500/25 shadow-emerald-500/10",
            tied && "border-primary/35 ring-2 ring-primary/15",
          )}
        >
          {sweWins && (
            <span className="mb-2 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
              Stronger pull
            </span>
          )}
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-500" />
            <h3 className="font-[family-name:var(--font-plus-jakarta)] font-semibold">
              Software Engineer
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">School</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Coding</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Projects</span>
            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="rounded-lg border border-border/60 bg-muted/80 px-2.5 py-1.5 font-medium">Career</span>
          </div>
        </motion.div>
        </MotionStaggerItem>
      </MotionStagger>

      <MotionFadeIn delay={0.24}>
      <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/50 p-5 shadow-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          This experience is designed for exploration and self-reflection. It is not a definitive
          career recommendation.
        </p>
      </div>
      </MotionFadeIn>

      <div className="cv-sticky-cta space-y-3">
        <Button
          type="button"
          className="h-12 w-full shadow-md shadow-primary/20"
          onClick={handleExploreAgain}
        >
          Explore Again
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Progress
        </Button>
      </div>
    </div>
  );
}
