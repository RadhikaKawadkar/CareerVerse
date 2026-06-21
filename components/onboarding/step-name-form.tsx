"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGuestProfile, saveGuestProfile } from "@/lib/profile-storage";

export function StepNameForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [isReady, setIsReady] = useState(false);

  const [showWalkthrough, setShowWalkthrough] = useState(true);

  useEffect(() => {
    const profile = getGuestProfile();
    if (profile.onboardingCompleted) {
      router.replace("/explore");
      return;
    }
    if (profile.firstName) {
      setFirstName(profile.firstName);
    }
    setIsReady(true);
  }, [router]);

  const trimmedName = firstName.trim();
  const canContinue = trimmedName.length > 0;

  function handleContinue() {
    if (!canContinue) return;
    saveGuestProfile({ firstName: trimmedName });
    router.push("/onboarding/2");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && canContinue) {
      handleContinue();
    }
  }

  if (!isReady) {
    return null;
  }

  return (
    <OnboardingShell step={1}>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          {showWalkthrough && (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2 relative overflow-hidden animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span>Quick Walkthrough Guidance</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Welcome to CareerVerse! This 3-step onboarding evaluates your grade, stream bias, and risk traits to build your initial **Career DNA**. No signup required.
              </p>
              <button
                onClick={() => setShowWalkthrough(false)}
                className="text-[10px] font-bold text-primary hover:underline block pt-1"
              >
                Dismiss Guidance &rarr;
              </button>
            </div>
          )}

          <p className="text-sm font-medium text-primary">Step 1 of 3</p>
          <h1 className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
            What should we call you?
          </h1>
          <p className="mt-3 text-muted-foreground text-xs sm:text-sm">
            No account needed — we&apos;ll use this to personalize your experience.
          </p>

          <div className="mt-8">
            <label htmlFor="firstName" className="sr-only">
              First name
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="given-name"
              autoFocus
              maxLength={40}
            />
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
