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
  { icon: Orbit, text: "Predicting how a cricket ball curves after it is hit" },
  { icon: Car, text: "Understanding why seatbelts protect you during sudden stops" },
  { icon: Globe, text: "Explaining why satellites can keep circling Earth" },
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
          <p className="text-sm font-semibold text-sky-600">Science · Physics</p>
          <h1 className="cv-heading mt-1 text-2xl sm:text-3xl">What Physics Really Is</h1>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.06}>
        <div className="cv-card-elevated p-6">
          <p className="text-base leading-relaxed text-foreground">
            Physics is the habit of noticing a real event, asking why it happened, and testing
            whether your explanation holds up.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Formulas matter, but they come after the idea. First you learn to see patterns in
            motion, force, energy, and measurement.
          </p>
        </div>
      </MotionFadeIn>

      <div>
        <p className="mb-4 text-sm font-semibold text-muted-foreground">Examples of what you explore:</p>
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
          "Physics is used in sports analytics, climate models, transport safety, and space missions.",
          "A strong science path rewards curiosity and steady practice more than instant genius.",
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
