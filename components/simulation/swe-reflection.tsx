"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { RatingSlider } from "@/components/shared/rating-slider";
import { Button } from "@/components/ui/button";
import {
  completeSweExperience,
  getGuestProfile,
  saveSweSimulationStep,
} from "@/lib/profile-storage";

export function SweReflection() {
  const router = useRouter();
  const [interest, setInterest] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }

    if (!profile.sweChoices.scene1 || !profile.sweChoices.scene2 || !profile.sweChoices.scene3) {
      router.replace("/explore/software-engineer/scene-1");
      return;
    }

    saveSweSimulationStep("reflection");

    if (profile.sweReflection) {
      setInterest(profile.sweReflection.interest);
      setConfidence(profile.sweReflection.confidence);
    }

    setIsReady(true);
  }, [router]);

  function handleSave() {
    completeSweExperience({ interest, confidence });
    router.push("/explore");
  }

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center"
      >
        <motion.div
          initial={{ scale: 0.72, rotate: -8 }}
          animate={{ scale: [0.72, 1.08, 1], rotate: [-8, 4, 0] }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.div>
        <motion.div
          aria-hidden
          initial={{ width: "0%" }}
          animate={{ width: "76%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 h-1.5 rounded-full bg-emerald-500/30"
        />
        <p className="mt-3 font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold">
          Simulation complete!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          How did it feel to spend a day as a software engineer?
        </p>
      </motion.div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold sm:text-2xl">
          Rate your experience
        </h1>
      </div>

      <div className="space-y-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <RatingSlider
          label="Enjoyment"
          value={interest}
          onChange={setInterest}
          minLabel="Not interested"
          maxLabel="Loved it"
          accent="emerald"
        />
        <RatingSlider
          label="Fit"
          value={confidence}
          onChange={setConfidence}
          minLabel="Not confident"
          maxLabel="Very confident"
          accent="emerald"
        />
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-emerald-600 shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
          onClick={handleSave}
        >
          Save and Return to Hub
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
