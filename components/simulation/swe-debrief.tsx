"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getChoiceInsight,
  getChoiceLabel,
  getOverallInsight,
  SWE_SCENES,
} from "@/lib/swe-simulation-data";
import { getGuestProfile, saveSweSimulationStep } from "@/lib/profile-storage";
import type { SweSimulationChoices } from "@/types/profile";

export function SweDebrief() {
  const router = useRouter();
  const [choices, setChoices] = useState<SweSimulationChoices | null>(null);
  const [firstName, setFirstName] = useState("");

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

    setFirstName(profile.firstName);
    setChoices(profile.sweChoices);
    saveSweSimulationStep("debrief");
  }, [router]);

  function handleContinue() {
    saveSweSimulationStep("reflection");
    router.push("/explore/software-engineer/reflection");
  }

  if (!choices) {
    return null;
  }

  const overallInsight = getOverallInsight(choices);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">Debrief</p>
        <h1 className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
          Your day as a Software Engineer
        </h1>
        <p className="mt-3 text-muted-foreground">
          {firstName}, here is a summary of the choices you made today at BuildFlow.
        </p>
      </div>

      <div className="space-y-4">
        {SWE_SCENES.map((scene) => {
          const choiceKey = scene.sceneKey;
          const choice = choices[choiceKey];
          return (
            <div
              key={scene.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  {scene.title}
                </p>
                <span className="text-xs text-muted-foreground">{scene.time}</span>
              </div>
              <p className="mt-3 font-medium">{getChoiceLabel(choiceKey, choice)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {getChoiceInsight(choiceKey, choice)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <p className="font-[family-name:var(--font-plus-jakarta)] font-semibold text-emerald-800">
          What your choices suggest
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{overallInsight}</p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          A real SWE day also includes
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>· Writing and reviewing code with teammates</li>
          <li>· Learning new tools when projects require them</li>
          <li>· Meetings, documentation, and occasional late nights</li>
          <li>· Steady problem-solving more than genius breakthroughs</li>
        </ul>
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-emerald-600 shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
          onClick={handleContinue}
        >
          Continue to Reflection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
