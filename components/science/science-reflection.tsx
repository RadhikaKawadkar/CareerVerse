"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { RatingSlider } from "@/components/shared/rating-slider";
import { Button } from "@/components/ui/button";
import {
  completeScienceExperience,
  getGuestProfile,
  saveScienceLessonStep,
} from "@/lib/profile-storage";

export function ScienceReflection() {
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
    saveScienceLessonStep("reflection");
    if (profile.scienceReflection) {
      setInterest(profile.scienceReflection.interest);
      setConfidence(profile.scienceReflection.confidence);
    }
    setIsReady(true);
  }, [router]);

  function handleSave() {
    completeScienceExperience({ interest, confidence });
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
        <span className="cv-confetti-piece absolute left-8 top-8 h-2 w-2 rounded-sm bg-sky-400" />
        <span className="cv-confetti-piece absolute right-10 top-10 h-2 w-2 rounded-full bg-emerald-400 [animation-delay:160ms]" />
        <span className="cv-confetti-piece absolute left-1/2 top-6 h-2 w-2 rounded-sm bg-amber-400 [animation-delay:320ms]" />
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: [0.7, 1.08, 1] }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.div>
        <p className="mt-3 font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold">
          You sampled Science!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          One last step: tell us how it felt.
        </p>
      </motion.div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold sm:text-2xl">
          How much did you enjoy this experience?
        </h1>
      </div>

      <div className="space-y-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <RatingSlider
          label="Enjoyment"
          value={interest}
          onChange={setInterest}
          minLabel="Not interested"
          maxLabel="Loved it"
        />
        <RatingSlider
          label="Fit"
          value={confidence}
          onChange={setConfidence}
          minLabel="Not confident"
          maxLabel="Very confident"
        />
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          onClick={handleSave}
        >
          Save and Return to Hub
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
