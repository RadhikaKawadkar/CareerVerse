"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Atom, Clock, FlaskConical } from "lucide-react";
import { CareerFactCard } from "@/components/shared/career-fact-card";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveScienceLessonStep } from "@/lib/profile-storage";

export function ScienceLessonIntro() {
  const router = useRouter();

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    saveScienceLessonStep("intro");
  }, [router]);

  function handleBeginLesson() {
    saveScienceLessonStep("section-1");
    router.push("/explore/science/section-1");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-sky-500/10 via-primary/5 to-violet-500/10 p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl"
        />
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-500">
            <Atom className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          5 Minutes
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600">
          <FlaskConical className="h-3.5 w-3.5" />
          Physics
        </span>
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
          Sample a Science Lesson
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Experience what Grade 11 Physics actually feels like through real concepts, problem
          solving, and reflection.
        </p>
      </div>

      <CareerFactCard
        accent="sky"
        facts={[
          "Physics powers everything from satellites and smartphones to medical scans.",
          "Science careers often combine experiments, data, writing, and teamwork.",
        ]}
      />

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 shadow-md shadow-sky-500/25 hover:bg-sky-600"
          onClick={handleBeginLesson}
        >
          Begin Lesson
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/explore">Back to Explore</Link>
        </Button>
      </div>
    </div>
  );
}
