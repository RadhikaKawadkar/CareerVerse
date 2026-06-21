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
  getResumePath,
} from "@/lib/profile-storage";

const questions = [
  {
    id: "q1",
    prompt: "A car drives 5 km East, then turns and drives 5 km West. What is its final displacement?",
    options: [
      { id: "10km", label: "10 km", correct: false },
      { id: "0km", label: "0 km (ended where it started)", correct: true },
      { id: "5km", label: "5 km West", correct: false },
    ],
  },
  {
    id: "q2",
    prompt: "In a perfect vacuum (no air resistance), a heavy bowling ball and a light feather are dropped simultaneously. Which lands first?",
    options: [
      { id: "ball", label: "The heavy bowling ball", correct: false },
      { id: "both", label: "Both land at the exact same time", correct: true },
      { id: "feather", label: "The light feather", correct: false },
    ],
  },
  {
    id: "q3",
    prompt: "A drone accelerates from rest (0 m/s) to a speed of 30 m/s in 6 seconds. What is its acceleration rate?",
    options: [
      { id: "5ms", label: "5 m/s²", correct: true },
      { id: "180ms", label: "180 m/s²", correct: false },
      { id: "6ms", label: "6 m/s²", correct: false },
    ],
  },
  {
    id: "q4",
    prompt: "If a spaceship maintains a constant speed of 100 m/s while flying in a perfect circle in space, is it accelerating?",
    options: [
      { id: "no_const", label: "No, because its speed is constant.", correct: false },
      { id: "yes_dir", label: "Yes, because its direction of motion is constantly changing.", correct: true },
      { id: "no_straight", label: "No, acceleration only happens when speeding up in a straight line.", correct: false },
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
    if (!profile.scienceCompleted) {
      const allowed = ["quiz", "reflection"];
      if (!profile.scienceLessonStep || !allowed.includes(profile.scienceLessonStep)) {
        router.replace(getResumePath("science", profile));
        return;
      }
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
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Quiz complete</p>
          <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-4xl font-bold text-foreground">
            {finalScore}/{questions.length}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {finalScore === questions.length
              ? "Flawless score! You have an outstanding grasp of kinematics, vector displacements, and acceleration dynamics."
              : `You scored ${finalScore}/${questions.length}. Physics is all about developing the logical intuition to analyze forces and motions over time.`}
          </p>
        </div>

        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          onClick={handleGoToReflection}
        >
          Continue to Reflection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-semibold text-sky-600">Kinematics Check</span>
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold sm:text-2xl leading-snug">
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
