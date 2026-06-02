"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FeedbackCard } from "@/components/science/feedback-card";
import { LessonOption } from "@/components/science/lesson-option";
import { LessonProgressBar } from "@/components/science/lesson-progress-bar";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveScienceLessonStep } from "@/lib/profile-storage";

const options = [
  { id: "3", label: "3 m/s", correct: false },
  { id: "5", label: "5 m/s", correct: true },
  { id: "10", label: "10 m/s", correct: false },
];

export function ScienceSection3() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    saveScienceLessonStep("section-3");
  }, [router]);

  const selectedOption = options.find((option) => option.id === selected);
  const isCorrect = selectedOption?.correct ?? false;

  function handleSelect(id: string) {
    if (submitted) return;
    setSelected(id);
    setSubmitted(true);
  }

  function handleContinue() {
    saveScienceLessonStep("quiz");
    router.push("/explore/science/quiz");
  }

  return (
    <div className="flex flex-col gap-6">
      <LessonProgressBar current={3} total={3} />

      <div>
        <p className="text-sm font-medium text-sky-600">Problem solving · Section 3</p>
        <h1 className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
          Problem Solving in Physics
        </h1>
      </div>

      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Scenario</p>
        <p className="mt-2 font-medium leading-relaxed">
          During a school sports day, a bicycle covers 20 meters in 4 seconds on a straight track.
          What is its average speed?
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Hint: speed = distance divided by time
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <LessonOption
            key={option.id}
            label={option.label}
            selected={selected === option.id}
            onSelect={() => handleSelect(option.id)}
            showResult={submitted}
            isCorrect={option.correct}
            disabled={submitted}
          />
        ))}
      </div>

      {submitted && (
        <FeedbackCard
          title={isCorrect ? "You got it!" : "Let's walk through it"}
          message={
            isCorrect
              ? "Speed = 20 m divided by 4 s = 5 m/s. This is typical Physics work: take a real situation, choose the right relationship, and check whether the answer makes sense."
              : "Divide distance by time: 20 divided by 4 = 5 m/s. The useful skill is learning the steps and checking your thinking, not guessing instantly."
          }
          variant={isCorrect ? "success" : "learn"}
        />
      )}

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          disabled={!submitted}
          onClick={handleContinue}
        >
          Continue to Quiz
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
