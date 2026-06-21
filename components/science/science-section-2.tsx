"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FeedbackCard } from "@/components/science/feedback-card";
import { LessonOption } from "@/components/science/lesson-option";
import { LessonProgressBar } from "@/components/science/lesson-progress-bar";
import { CareerFactCard } from "@/components/shared/career-fact-card";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveScienceLessonStep, getResumePath } from "@/lib/profile-storage";

const options = [
  { id: "ball", label: "Ball falls faster", correct: false },
  { id: "feather", label: "Feather falls faster", correct: false },
  { id: "together", label: "Both fall together", correct: true },
];

export function ScienceSection2() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    if (!profile.scienceCompleted) {
      const allowed = ["section-2", "section-3", "quiz", "reflection"];
      if (!profile.scienceLessonStep || !allowed.includes(profile.scienceLessonStep)) {
        router.replace(getResumePath("science", profile));
        return;
      }
    }
    saveScienceLessonStep("section-2");
  }, [router]);

  const selectedOption = options.find((option) => option.id === selected);
  const isCorrect = selectedOption?.correct ?? false;

  function handleSelect(id: string) {
    if (submitted) return;
    setSelected(id);
    setSubmitted(true);
  }

  function handleNext() {
    saveScienceLessonStep("section-3");
    router.push("/explore/science/section-3");
  }

  return (
    <div className="flex flex-col gap-6">
      <LessonProgressBar current={2} total={3} />

      <div>
        <p className="text-sm font-medium text-sky-600">Interactive · Section 2</p>
        <h1 className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
          Think Like a Scientist
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="font-medium">
          A ball and a feather are dropped inside a tall glass tube after all the air is removed.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Without air pushing against the feather, what should happen?
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
          title={isCorrect ? "Nice thinking!" : "Good guess — here's the idea"}
          message={
            isCorrect
              ? "In a vacuum, there is no air resistance. Gravity accelerates both objects equally, so they land together. Scientists often remove one confusing factor to see the real pattern."
              : "In everyday air, a feather falls slowly because air pushes against it. In a vacuum, that extra force disappears, so both objects accelerate together."
          }
          variant={isCorrect ? "success" : "learn"}
        />
      )}

      <CareerFactCard
        accent="sky"
        facts={[
          "Scientists use controlled experiments to separate what feels true from what is measurable.",
          "Many breakthroughs start with a simple question that looks obvious only after someone tests it.",
        ]}
      />

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          disabled={!submitted}
          onClick={handleNext}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
