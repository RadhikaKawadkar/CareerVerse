"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectChip } from "@/components/onboarding/select-chip";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveGuestProfile } from "@/lib/profile-storage";
import { CAREER_PRESSURE_OPTIONS, type CareerPressure } from "@/types/profile";

export function StepPressureForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [careerPressure, setCareerPressure] = useState<CareerPressure | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (profile.onboardingCompleted) {
      router.replace("/explore");
      return;
    }
    if (!profile.firstName.trim()) {
      router.replace("/onboarding/1");
      return;
    }
    if (!profile.grade) {
      router.replace("/onboarding/2");
      return;
    }
    setFirstName(profile.firstName);
    if (profile.careerPressure) {
      setCareerPressure(profile.careerPressure);
    }
    setIsReady(true);
  }, [router]);

  const canContinue = careerPressure !== null;

  function handleContinue() {
    if (!careerPressure) return;
    saveGuestProfile({
      careerPressure,
      onboardingCompleted: true,
    });
    router.push("/explore");
  }

  if (!isReady) {
    return null;
  }

  return (
    <OnboardingShell step={3}>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">Step 3 of 3</p>
          <h1 className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
            Who&apos;s influencing your career choices?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Understanding where the pressure comes from helps us frame your exploration,{" "}
            {firstName}.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {CAREER_PRESSURE_OPTIONS.map((option) => (
              <SelectChip
                key={option.value}
                label={option.label}
                selected={careerPressure === option.value}
                onClick={() => setCareerPressure(option.value)}
                className="min-h-14 w-full justify-start px-5 text-base"
              />
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 mt-8 border-t border-border bg-background pt-4">
          <Button
            type="button"
            className="h-12 w-full shadow-md shadow-primary/20"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Start Exploring
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
