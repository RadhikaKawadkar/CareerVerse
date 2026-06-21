"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Car, Globe, Orbit } from "lucide-react";
import { LessonProgressBar } from "@/components/science/lesson-progress-bar";
import { CareerFactCard } from "@/components/shared/career-fact-card";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveScienceLessonStep } from "@/lib/profile-storage";

const examples = [
  { icon: Orbit, text: "Distance is the total ground covered (e.g. odometer reading)." },
  { icon: Car, text: "Displacement is the straight-line shortcut from start to end with direction." },
  { icon: Globe, text: "Why self-driving cars calculate displacement to optimize GPS route planning." },
];

export function ScienceSection1() {
  const router = useRouter();

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    saveScienceLessonStep("section-1");
  }, [router]);

  function handleNext() {
    saveScienceLessonStep("section-2");
    router.push("/explore/science/section-2");
  }

  return (
    <div className="cv-section-gap">
      <LessonProgressBar current={1} total={3} />

      <MotionFadeIn>
        <div>
          <p className="text-sm font-semibold text-sky-600">Science · Physics Lesson</p>
          <h1 className="cv-heading mt-1 text-2xl sm:text-3xl">Kinematics: Describing Motion</h1>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.06}>
        <div className="cv-card-elevated p-6 space-y-4">
          <p className="text-base leading-relaxed text-foreground">
            Physics starts by mathematically defining how things move. In Grade 11, you learn to distinguish between what looks similar but is fundamentally different.
          </p>
          <div className="border-l-4 border-sky-500 pl-4 py-1 bg-sky-500/5 rounded-r-xl">
            <span className="font-bold text-sky-700">Distance vs Displacement:</span> If you run 400 meters around a circular track and land exactly where you started, your <span className="font-semibold text-foreground">Distance</span> covered is 400m, but your <span className="font-semibold text-foreground">Displacement</span> is <span className="font-semibold text-sky-600">0 meters</span> because you didn&apos;t end up away from your origin!
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Formulas are just tools to express these relationships. The core skill is visualizing the physical system before writing equations.
          </p>
        </div>
      </MotionFadeIn>

      <div>
        <p className="mb-4 text-sm font-semibold text-muted-foreground">Core concepts to visualize:</p>
        <MotionStagger className="space-y-3">
          {examples.map((example) => (
            <MotionStaggerItem key={example.text}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-card px-4 py-3.5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                  <example.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{example.text}</span>
              </motion.div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>

      <CareerFactCard
        accent="sky"
        facts={[
          "Kinematics powers GPS navigation, robotic arms, aerospace trajectories, and gaming graphics engines.",
          "A career in physics reward precision: understanding coordinate systems is the first step.",
        ]}
      />

      <div className="cv-sticky-cta">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          onClick={handleNext}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
