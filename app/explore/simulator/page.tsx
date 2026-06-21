"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Activity, Play, CheckCircle2, Flame, Award, Sparkles, Compass
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CAREER_JOURNEYS } from "@/lib/journey-database";
import { cn } from "@/lib/utils";

export default function SimulationsHubPage() {
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [streak, setStreak] = useState(3);

  useEffect(() => {
    setIsClient(true);
    
    // Load unlocked endings from localStorage
    try {
      const stored = localStorage.getItem("careerverse-unlocked-endings");
      if (stored) {
        setUnlockedEndings(JSON.parse(stored));
      }
    } catch {}

    // Load streak
    const storedStreak = localStorage.getItem("exploration-streak");
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const journeys = Object.values(CAREER_JOURNEYS);

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Experience Phase</span>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold text-foreground">
              Career Journey Episodes
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
          <Activity className="h-4 w-4" />
          <span>{unlockedEndings.length} Endings Unlocked</span>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-background to-transparent space-y-2">
        <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-sm uppercase tracking-wider">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span>Immersive Story Engine Active</span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold text-foreground">
          Step into Interactive Life Episodes
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Embark on interactive life episodes from school subject selection up to senior leadership crises. Make decisions, shape your skills, and unlock alternate endings (e.g. Michelin Chef, Tech Unicorn Founder).
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Endings Unlocked</span>
            <span className="text-lg font-extrabold text-foreground">{unlockedEndings.length} Paths</span>
          </div>
          <Award className="h-8 w-8 text-amber-500 opacity-80 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Active Streak</span>
            <span className="text-lg font-extrabold text-foreground">{streak} Days</span>
          </div>
          <Flame className="h-8 w-8 text-orange-500 fill-orange-500 opacity-80" />
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Select an Episode ({journeys.length})</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {journeys.map((j) => {
            // Calculate ending completion percentage
            const totalEndings = j.endings.length;
            const unlockedForThisCareer = j.endings.filter(e => unlockedEndings.includes(e.id)).length;
            const completionPct = totalEndings > 0 ? Math.floor((unlockedForThisCareer / totalEndings) * 100) : 0;
            const isAnyCompleted = unlockedForThisCareer > 0;

            return (
              <div 
                key={j.careerId}
                className={cn(
                  "rounded-3xl border bg-card p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-primary/20 transition-all group",
                  isAnyCompleted && "border-emerald-500/25 bg-emerald-500/[0.01]"
                )}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
                      {j.stages.length} Life Stages
                    </span>
                    {isAnyCompleted && (
                      <span className="text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {completionPct}% Done
                      </span>
                    )}
                  </div>
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {j.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {j.shortDesc}
                  </p>
                </div>

                {/* Ending badges unlocked bar */}
                {totalEndings > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground">
                      <span>Endings Unlocked</span>
                      <span>{unlockedForThisCareer} / {totalEndings}</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {j.endings.map((e) => {
                        const unlocked = unlockedEndings.includes(e.id);
                        return (
                          <div 
                            key={e.id}
                            className={cn(
                              "h-7 w-7 rounded-lg border flex items-center justify-center text-sm transition-all",
                              unlocked 
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-600 scale-105 shadow-sm" 
                                : "bg-muted border-border/40 text-muted-foreground/30 opacity-40"
                            )}
                            title={unlocked ? e.title : "Locked Ending"}
                          >
                            {unlocked ? e.badge : "🔒"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Compass className="h-4 w-4" />
                    Interactive Fiction
                  </span>
                  <Link
                    href={`/explore/simulator/${j.careerId}`}
                    className={cn(
                      "h-8 px-4 font-bold rounded-xl text-[10px] flex items-center gap-1 transition-all shadow-sm",
                      isAnyCompleted 
                        ? "bg-muted hover:bg-muted/80 text-muted-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                  >
                    <Play className="h-3 w-3 fill-current" /> {isAnyCompleted ? "Replay Episode" : "Play Episode"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
