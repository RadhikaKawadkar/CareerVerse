"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { LessonOption } from "@/components/science/lesson-option";
import { Button } from "@/components/ui/button";
import {
  getGuestProfile,
  saveScienceLessonStep,
  saveScienceQuizScore,
} from "@/lib/profile-storage";

const questions = [
  {
    id: "q1",
    prompt: "Physics helps us understand:",
    options: [
      { id: "nature", label: "Nature", correct: true },
      { id: "music", label: "Music", correct: false },
      { id: "cooking", label: "Cooking", correct: false },
    ],
  },
  {
    id: "q2",
    prompt: "Scientists usually:",
    options: [
      { id: "guess", label: "Guess randomly", correct: false },
      { id: "observe", label: "Observe and test", correct: true },
      { id: "ignore", label: "Ignore evidence", correct: false },
    ],
  },
];

export function ScienceQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    saveScienceLessonStep("quiz");
  }, [router]);

  const question = questions[currentQuestion];

  function handleSelect(id: string) {
    if (selected) return;
    setSelected(id);
  }

  function handleContinue() {
    if (!selected) return;

    const option = question.options.find((item) => item.id === selected);
    const newAnswers = [...answers, option?.correct ?? false];
    const newAnswerIds = [...answerIds, selected];

    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setAnswerIds(newAnswerIds);
      setCurrentQuestion((prev) => prev + 1);
      setSelected(null);
      return;
    }

    const finalScore = newAnswers.filter(Boolean).length;
    saveScienceQuizScore(finalScore, newAnswerIds);
    setAnswers(newAnswers);
    setAnswerIds(newAnswerIds);
    setFinished(true);
  }

  function handleGoToReflection() {
    saveScienceLessonStep("reflection");
    router.push("/explore/science/reflection");
  }

  if (finished) {
    const finalScore = answers.filter(Boolean).length;
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-sky-600">Quiz complete</p>
          <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-4xl font-bold text-foreground">
            {finalScore}/{questions.length}
          </p>
          <p className="mt-2 text-muted-foreground">
            {finalScore === questions.length
              ? "Great job - you understand the basics of how Physics works."
              : "That is normal for a first try. The lesson was about experiencing Physics, not passing a test."}
          </p>
        </div>

        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          onClick={handleGoToReflection}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Quick check</span>
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold sm:text-2xl">
          {question.prompt}
        </h1>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <LessonOption
            key={option.id}
            label={option.label}
            selected={selected === option.id}
            onSelect={() => handleSelect(option.id)}
          />
        ))}
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          disabled={!selected}
          onClick={handleContinue}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "See Score"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
