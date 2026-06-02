"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Code2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGuestProfile, saveSweSimulationStep } from "@/lib/profile-storage";

export function SweIntro() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const profile = getGuestProfile();
    if (!profile.onboardingCompleted) {
      router.replace("/onboarding/1");
      return;
    }
    setFirstName(profile.firstName);
    saveSweSimulationStep("intro");
  }, [router]);

  function handleStart() {
    saveSweSimulationStep("scene-1");
    router.push("/explore/software-engineer/scene-1");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/10 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-8 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl"
        />
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Code2 className="h-10 w-10" />
          </div>
          <p className="mt-4 text-sm font-medium text-emerald-300">Junior Developer @ BuildFlow</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          5 Minutes
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
          <Users className="h-3.5 w-3.5" />
          3 workplace moments
        </span>
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight sm:text-3xl">
          Simulate: Software Engineer
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {firstName ? `${firstName}, you're` : "You're"} a junior developer at a small startup.
          No coding keyboard needed — just real decisions from a typical workday.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Today you will face:</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Morning standup with your team
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            A production bug report from users
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            A deadline tradeoff before a demo
          </li>
        </ul>
      </div>

      <div className="sticky bottom-0 mt-2 border-t border-border bg-background pt-4">
        <Button
          type="button"
          className="h-12 w-full bg-emerald-600 shadow-md shadow-emerald-500/25 hover:bg-emerald-700"
          onClick={handleStart}
        >
          Start Simulation
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/explore">Back to Explore</Link>
        </Button>
      </div>
    </div>
  );
}
