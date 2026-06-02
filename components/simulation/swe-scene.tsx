"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MotionFadeIn } from "@/components/shared/motion";
import { ReactionBubble } from "@/components/simulation/reaction-bubble";
import { defaultTransition } from "@/lib/motion";
import { SceneProgressBar } from "@/components/simulation/scene-progress-bar";
import { SimulationChoice } from "@/components/simulation/simulation-choice";
import { Button } from "@/components/ui/button";
import { getSceneById, type SweSceneData } from "@/lib/swe-simulation-data";
import {
  getGuestProfile,
  saveSweChoice,
  saveSweSimulationStep,
} from "@/lib/profile-storage";
import type { SweSceneChoice } from "@/types/profile";

type SweSceneProps = {
  sceneId: SweSceneData["id"];
};

export function SweScene({ sceneId }: SweSceneProps) {
  const router = useRouter();
  const scene = getSceneById(sceneId);
  const [selected, setSelected] = useState<SweSceneChoice | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reaction, setReaction] = useState<{ from: string; message: string } | null>(null);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }

    if (sceneId === "scene-2" && !profile.sweChoices.scene1) {
      router.replace("/explore/software-engineer/scene-1");
      return;
    }
    if (sceneId === "scene-3" && !profile.sweChoices.scene2) {
      router.replace("/explore/software-engineer/scene-2");
      return;
    }

    saveSweSimulationStep(sceneId);

    const existing = profile.sweChoices[scene.sceneKey];
    if (existing) {
      const option = scene.choices.find((item) => item.id === existing);
      if (option) {
        setSelected(existing);
        setSubmitted(true);
        setReaction({ from: option.reactionFrom, message: option.reaction });
      }
    }
  }, [router, scene, sceneId, scene.sceneKey]);

  function handleSelect(choiceId: SweSceneChoice) {
    if (submitted) return;

    const option = scene.choices.find((item) => item.id === choiceId);
    if (!option) return;

    setSelected(choiceId);
    setSubmitted(true);
    setReaction({ from: option.reactionFrom, message: option.reaction });
    saveSweChoice(scene.sceneKey, choiceId);
  }

  function handleContinue() {
    router.push(scene.nextPath);
  }

  return (
    <motion.div
      key={sceneId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={defaultTransition}
      className="cv-section-gap"
    >
      <SceneProgressBar current={scene.moment} total={3} />

      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2.5 text-center text-xs font-medium text-emerald-300 shadow-md">
        {scene.time} · BuildFlow
      </div>

      <MotionFadeIn>
        <div>
          <p className="text-sm font-semibold text-emerald-600">Scene {scene.moment}</p>
          <h1 className="cv-heading mt-1 text-2xl sm:text-3xl">{scene.title}</h1>
        </div>
      </MotionFadeIn>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl"
        />
        <p className="relative text-base leading-relaxed text-slate-100">{scene.story}</p>
        <p className="relative mt-5 text-sm font-semibold text-emerald-300">{scene.prompt}</p>
      </div>

      <div className="space-y-3">
        {scene.choices.map((option) => (
          <SimulationChoice
            key={option.id}
            label={option.label}
            selected={selected === option.id}
            onSelect={() => handleSelect(option.id)}
            disabled={submitted}
          />
        ))}
      </div>

      {submitted && reaction && (
        <ReactionBubble from={reaction.from} message={reaction.message} />
      )}

      <div className="cv-sticky-cta">
        <Button
          type="button"
          className="h-12 w-full bg-emerald-600 shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
          disabled={!submitted}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
