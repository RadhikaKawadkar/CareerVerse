"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SelectChip } from "@/components/onboarding/select-chip";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveGuestProfile } from "@/lib/profile-storage";
import { GRADE_OPTIONS } from "@/types/profile";

export function StepGradeForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.firstName.trim()) {
      router.replace("/onboarding/1");
      return;
    }
    setFirstName(profile.firstName);
    if (profile.grade) {
      setGrade(profile.grade);
    }
    setIsReady(true);
  }, [router]);

  const canContinue = grade !== null;

  function handleContinue() {
    if (grade === null) return;
    saveGuestProfile({ grade });
    router.push("/onboarding/3");
  }

  if (!isReady) {
    return null;
  }

  return (
    <OnboardingShell step={2}>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">Step 2 of 3</p>
          <h1 className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
            What grade are you in, {firstName}?
          </h1>
          <p className="mt-3 text-muted-foreground">
            This helps us explain streams and careers at the right level.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {GRADE_OPTIONS.map((option) => (
              <SelectChip
                key={option}
                label={String(option)}
                selected={grade === option}
                onClick={() => setGrade(option)}
                className="aspect-square min-h-16 text-lg font-semibold"
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
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
