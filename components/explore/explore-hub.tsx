"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  FlaskConical,
  Lock,
  Palette,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { ExperienceCard } from "@/components/explore/experience-card";
import { ProgressRing } from "@/components/explore/progress-ring";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import {
  getGuestProfile,
  getHubProgress,
  setExperienceStatus,
} from "@/lib/profile-storage";
import type { GuestProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

const comingSoonCards = [
  {
    title: "Commerce Stream",
    description: "Try accounting, business decisions, and market thinking before choosing Commerce.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Arts Stream",
    description: "Explore psychology, design, communication, and humanities-style thinking.",
    icon: Palette,
  },
  {
    title: "Doctor Simulation",
    description: "Step into a clinical day: patient conversations, diagnosis clues, and pressure.",
    icon: Stethoscope,
  },
  {
    title: "AI Career Coach",
    description: "A guided coach that helps you compare paths and plan your next experiment.",
    icon: Bot,
  },
];

export function ExploreHub() {
  const router = useRouter();
  const [profile, setProfile] = useState<GuestProfile | null>(null);

  const loadProfile = useCallback(() => {
    const data = getGuestProfile();

    if (!data.onboardingCompleted || !data.firstName.trim() || !data.grade) {
      router.replace("/onboarding/1");
      return;
    }

    setProfile(data);
  }, [router]);

  useEffect(() => {
    loadProfile();

    const handleFocus = () => loadProfile();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [loadProfile]);

  if (!profile) {
    return null;
  }

  const { scienceCompleted, sweCompleted, completedCount, bothComplete } =
    getHubProgress(profile);
  const remaining = 2 - completedCount;
  const progressMessage =
    completedCount === 0
      ? "Start with either experience. Your insight unlocks after both are complete."
      : completedCount === 1
        ? "Nice progress. One more experience will make your comparison useful."
        : "Both experiences are complete. Your insight is ready.";

  function handleScienceStart() {
    if (!profile!.scienceCompleted && profile!.scienceStatus === "not_started") {
      const updated = setExperienceStatus("science", "in_progress");
      setProfile(updated);
    }
  }

  function handleSweStart() {
    if (!profile!.sweCompleted && profile!.sweStatus === "not_started") {
      const updated = setExperienceStatus("swe", "in_progress");
      setProfile(updated);
    }
  }

  return (
    <div className="cv-section-gap pb-4">
      <MotionFadeIn>
        <div>
          <p className="text-sm font-semibold text-primary">CareerVerse</p>
          <h1 className="cv-heading mt-1 text-2xl sm:text-3xl">Hi, {profile.firstName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Grade {profile.grade}</p>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.08}>
        <div
          className={cn(
            "flex items-center gap-5 rounded-2xl border p-5 shadow-md transition-colors duration-300 sm:p-6",
            bothComplete
              ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-card"
              : "border-border bg-card",
          )}
        >
          <ProgressRing completed={completedCount} total={2} />
          <div>
            <p className="cv-heading text-base font-semibold sm:text-lg">
              {bothComplete ? "Both experiences complete!" : "Your exploration progress"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{progressMessage}</p>
          </div>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.1}>
        <div
          className={cn(
            "rounded-2xl border p-4 shadow-sm transition-all duration-300",
            completedCount === 0 && "border-primary/20 bg-primary/5",
            completedCount === 1 && "border-amber-500/25 bg-amber-500/5",
            completedCount === 2 && "border-emerald-500/25 bg-emerald-500/5 hub-success-pulse",
          )}
        >
          <p className="text-sm font-semibold">
            {completedCount === 0 && "No experiences completed yet"}
            {completedCount === 1 && "One experience completed"}
            {completedCount === 2 && "Insight unlocked"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {completedCount === 0 &&
              "Pick Science or Software Engineer to begin. There are no wrong answers here - just useful signals."}
            {completedCount === 1 &&
              `You are ${remaining} experience away from seeing how your reactions compare.`}
            {completedCount === 2 &&
              "The results page can now compare both reflections and turn them into a clear takeaway."}
          </p>
        </div>
      </MotionFadeIn>

      <div className="space-y-5">
        <MotionFadeIn delay={0.12}>
          <h2 className="cv-heading text-lg sm:text-xl">Experience your future</h2>
        </MotionFadeIn>

        <MotionStagger className="space-y-4">
          <MotionStaggerItem>
            <ExperienceCard
              title="Sample a Science Lesson"
              description="Find out what Science classes actually feel like — starting with Grade 11 Physics."
              meta="5 min · Physics · Interactive"
              href="/explore/science/intro"
              icon={FlaskConical}
              completed={scienceCompleted}
              accentClass="bg-gradient-to-r from-sky-400 to-sky-500"
              iconClass="bg-sky-500/10 text-sky-500"
              onStart={handleScienceStart}
              startLabel="Start Lesson"
              reviewLabel="Review Lesson"
            />
          </MotionStaggerItem>

          <MotionStaggerItem>
            <ExperienceCard
              title="Simulate: Software Engineer"
              description="Make real workplace decisions — standups, bugs, and tradeoffs — not just coding."
              meta="5 min · 3 workplace moments"
              href="/explore/software-engineer/intro"
              icon={Code2}
              completed={sweCompleted}
              accentClass="bg-gradient-to-r from-emerald-400 to-emerald-500"
              iconClass="bg-emerald-500/10 text-emerald-500"
              onStart={handleSweStart}
              startLabel="Start Simulation"
              reviewLabel="Review Simulation"
            />
          </MotionStaggerItem>
        </MotionStagger>
      </div>

      {bothComplete ? (
        <MotionFadeIn delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-6 shadow-lg shadow-primary/10"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <div className="flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  <Sparkles className="h-3 w-3" />
                  Unlocked
                </span>
                <h3 className="cv-heading mt-2 text-lg">Your Insight</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  See how your Science and Software Engineer experiences compare — and what they
                  reveal about your fit.
                </p>
                <Button asChild className="mt-5 w-full sm:w-auto">
                  <Link href="/results">
                    View My Insight
                    <Sparkles className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </MotionFadeIn>
      ) : (
        <MotionFadeIn delay={0.2}>
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
            <div className="flex items-start gap-4 opacity-70">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="cv-heading text-lg text-muted-foreground">Your Insight</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete both experiences to unlock your personalized insight.
                </p>
              </div>
            </div>
            <Button disabled className="mt-5 w-full" variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Locked — {completedCount}/2 complete
            </Button>
          </div>
        </MotionFadeIn>
      )}

      <div className="space-y-5">
        <MotionFadeIn delay={0.22}>
          <h2 className="cv-heading text-lg sm:text-xl">More paths coming soon</h2>
        </MotionFadeIn>

        <MotionStagger className="grid gap-3 sm:grid-cols-2">
          {comingSoonCards.map((item) => (
            <MotionStaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="h-full rounded-2xl border border-border/80 bg-card p-5 opacity-90 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold">
                        {item.title}
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </div>
  );
}
