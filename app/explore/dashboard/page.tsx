"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Trophy, Brain, ChevronRight, Sparkles, CheckCircle2, Target, Flame
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { MotionFadeIn } from "@/components/shared/motion";
import { getGuestProfile, getResumePath } from "@/lib/profile-storage";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { analyzeProfile } from "@/lib/results-engine";
import { type GuestProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { useGlobalProfile } from "@/lib/global-state";

export default function DashboardPage() {
  const { profile: globalProfile } = useGlobalProfile();
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);

  // States for calculated stats
  const [exploredCount, setExploredCount] = useState(0);
  const [simulationsCount, setSimulationsCount] = useState(0);
  const [reflectionsCount, setReflectionsCount] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentBadge, setRecentBadge] = useState<{ name: string; icon: string; desc: string } | null>(null);
  const [continueJourney, setContinueJourney] = useState<{ title: string; desc: string; href: string; label: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
    const prof = getGuestProfile();
    setGuestProfile(prof);

    // 1. Calculate explorations
    let expCount = 0;
    let exploredList: string[] = [];
    try {
      const stored = localStorage.getItem("explored-careers");
      if (stored) {
        exploredList = JSON.parse(stored);
        expCount = exploredList.length;
        setExploredCount(expCount);
      }
    } catch {}

    // 2. Calculate completed simulations
    let simsCount = 0;
    const completedSims: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("simulation-")) {
        try {
          const simData = JSON.parse(localStorage.getItem(key) || "{}");
          if (simData.completed) {
            simsCount++;
            completedSims.push(key.replace("simulation-", ""));
          }
        } catch {}
      }
    }
    setSimulationsCount(simsCount);

    // 3. Calculate reflections
    let refCount = 0;
    let reflectionsList: unknown[] = [];
    try {
      const stored = localStorage.getItem("careerverse-journal-entries");
      if (stored) {
        reflectionsList = JSON.parse(stored);
        refCount = reflectionsList.length;
        setReflectionsCount(refCount);
      }
    } catch {}

    // 6. Bookmarks
    let bookmarkList: string[] = [];
    try {
      const stored = localStorage.getItem("careerverse-bookmarks");
      if (stored) {
        bookmarkList = JSON.parse(stored);
        setBookmarks(bookmarkList);
      }
    } catch {}

    // 7. Recent Achievement (Latest Badge)
    try {
      const storedBadges = localStorage.getItem("careerverse-badges") || "[]";
      const badgeIds = JSON.parse(storedBadges);
      if (badgeIds.length > 0) {
        const latestId = badgeIds[badgeIds.length - 1];
        const badgeMeta: Record<string, { name: string; icon: string; desc: string }> = {
          first_career: { name: "Career Rookie", icon: "🌱", desc: "Explored your very first career path" },
          sim_master: { name: "Simulation Hero", icon: "🎮", desc: "Completed a story-based job simulation" },
          quest_complete: { name: "Quest Conqueror", icon: "🏆", desc: "Successfully finished a Career Quest" },
          skill_unlocked: { name: "Skill Seeker", icon: "⚡", desc: "Unlocked a node in the interactive Skill Tree" },
          dna_master: { name: "Self Analyst", icon: "🧬", desc: "Completed Career DNA analysis" },
          mentor_talk: { name: "Networker", icon: "🤝", desc: "Visited a Mentor profile or booked a session" }
        };
        const activeB = badgeMeta[latestId] || { name: "Explorer", icon: "🏆", desc: "Decoded career paths" };
        setRecentBadge(activeB);
      } else {
        setRecentBadge({ name: "Career Rookie", icon: "🌱", desc: "Explore your first career path to unlock!" });
      }
    } catch {
      setRecentBadge({ name: "Career Rookie", icon: "🌱", desc: "Explore your first career path to unlock!" });
    }

    // 8. Continue journey card
    const isScienceIn = prof.scienceStatus === "in_progress";
    const isSweIn = prof.sweStatus === "in_progress";
    
    if (isScienceIn) {
      setContinueJourney({
        title: "Grade 11 Physics Lesson",
        desc: "Kinematics & subject stream compatibility",
        href: getResumePath("science", prof),
        label: "Resume Lesson"
      });
    } else if (isSweIn) {
      setContinueJourney({
        title: "Software Engineer Simulator",
        desc: "Agile sprints and codebase design conflicts",
        href: getResumePath("swe", prof),
        label: "Resume Simulation"
      });
    } else {
      setContinueJourney({
        title: "Explore Career Library",
        desc: "Check out details of high-growth paths",
        href: "/explore?view=all",
        label: "Go Explorer"
      });
    }
  }, []);

  if (!isClient || !guestProfile || !globalProfile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Get Top 3 matches
  const results = analyzeProfile(guestProfile);
  const topMatches = results.careerRecommendations.slice(0, 3);
  const archetype = results.archetype;

  // Active Quest (milestone checkboxes for first bookmarked career)
  const firstBookmarkedId = bookmarks.length > 0 ? bookmarks[0] : "software-engineer";
  const firstBookmarkedCareer = CAREER_LIBRARY.find(c => c.id === firstBookmarkedId) || CAREER_LIBRARY[0];
  
  // Dynamic milestones completion
  const questExplored = exploredCount > 0;
  const questSimmed = simulationsCount > 0;
  const questReflected = reflectionsCount > 0;

  // AI Mentor personalized advice
  const getAiMentorAdvice = () => {
    if (archetype.name === "Builder") {
      return "Based on your technical orientation, you consistently prioritize systems efficiency. Try looking into high-demand Cloud Architectures or Product Operations next.";
    }
    if (archetype.name === "Creator") {
      return "Your designs lean towards visual alignment and storytelling. You excel at user empathy. Make sure to check out UI/UX Design or Brand Strategy directions.";
    }
    return "You display an excellent multidisciplinary explorer style. Continue running active workplace scenarios to gather further behavioral fit checkpoints.";
  };

  const currentLevelXp = globalProfile.xp % 400;
  const progressPct = Math.min(100, Math.floor((currentLevelXp / 400) * 100));

  return (
    <AppShell className="pb-24 animate-in fade-in duration-300">
      {/* Welcome header */}
      <MotionFadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Student Center</p>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-slate-900 mt-0.5">
                Hi, {globalProfile.name}
              </h1>
            </div>
          </div>
        </div>
      </MotionFadeIn>

      {/* Main Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Col Span 7) - Continue Journey, Active Quest, AI Suggestion */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Continue Journey Card */}
          {continueJourney && (
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-violet-500/[0.03] to-transparent hover:border-primary/20">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-primary tracking-widest block">Resume Exploration</span>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-black text-slate-900">
                  {continueJourney.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {continueJourney.desc}
                </p>
              </div>
              <Button asChild size="sm" className="rounded-xl h-10 px-5 font-bold shadow-sm hover:scale-[1.02] transition-all self-end sm:self-auto">
                <Link href={continueJourney.href}>
                  {continueJourney.label} <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Active Career Quest Checklists */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-5 hover:shadow-md transition-all duration-300">
            {bookmarks.length === 0 ? (
              <div className="space-y-4 text-center py-8">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-xl font-bold">
                    🎯
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-950 uppercase tracking-wider">
                    No Active Quest
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Bookmark your favorite careers in the Explore Hub to start custom quests and track milestones.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="rounded-xl border-pink-500/30 text-pink-600 hover:bg-pink-500/5 hover:border-pink-500 transition-colors">
                  <Link href="/explore">
                    Browse Careers
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4.5 w-4.5 text-pink-500" />
                    <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xs font-black text-slate-800 uppercase tracking-widest">
                      Active Career Quest
                    </h2>
                  </div>
                  <span className="text-[9px] bg-pink-500/10 text-pink-600 border border-pink-500/20 px-3 py-1 rounded-full font-bold uppercase">
                    {firstBookmarkedCareer.title}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3.5 p-3.5 bg-background/60 border border-border/40 rounded-2xl text-xs">
                    <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600">
                      {questExplored ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : "1"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={cn("font-bold text-slate-800 block", questExplored && "line-through opacity-60")}>Explore Career Details</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">View salary projections and demand levels in the library.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-background/60 border border-border/40 rounded-2xl text-xs">
                    <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600">
                      {questSimmed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : "2"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={cn("font-bold text-slate-800 block", questSimmed && "line-through opacity-60")}>Complete Story Simulation</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Make branching decisions and experience character dialogues.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-background/60 border border-border/40 rounded-2xl text-xs">
                    <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600">
                      {questReflected ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : "3"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={cn("font-bold text-slate-800 block", questReflected && "line-through opacity-60")}>Log Journal Reflection</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Save your learnings inside your journal diary.</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Mentor Suggestion */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3 bg-gradient-to-br from-indigo-500/[0.03] to-transparent hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
              <span>AI Mentor Recommendation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 p-4 rounded-2xl border border-border/10">
              &ldquo;{getAiMentorAdvice()}&rdquo;
            </p>
          </div>

        </div>

        {/* Right Column (Col Span 5) - XP Progress HUD, Top Matches, Recent Achievement */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Relocated XP & Level Status Card */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold border-b border-border/40 pb-3">
              <span className="text-primary uppercase tracking-widest text-[10px]">Your Level Status</span>
              <span className="text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full font-bold">Lvl {globalProfile.level}</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Progress to next Level</span>
                <span className="font-bold text-slate-800">{currentLevelXp}/400 XP</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-violet-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5 border-t border-border/20 mt-1">
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                  <Flame className="h-4.5 w-4.5 fill-orange-500 text-orange-500" />
                  {globalProfile.streak} Day Streak
                </span>
                <span>{400 - currentLevelXp} XP remaining</span>
              </div>
            </div>
          </div>

          {/* Top 3 Career Matches */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Brain className="h-4.5 w-4.5 text-indigo-500" />
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xs font-black text-slate-800 uppercase tracking-widest">
                Top Career Matches
              </h2>
            </div>

            <div className="space-y-3">
              {topMatches.map((rec, idx) => (
                <Link 
                  key={rec.careerId} 
                  href={`/explore?careerId=${rec.careerId}`}
                  className="flex items-center justify-between p-3.5 bg-background/60 border border-border/40 rounded-2xl hover:border-primary/25 hover:bg-primary/[0.02] hover:scale-[1.01] transition-all group"
                >
                  <div className="truncate pr-4">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors block">
                      {idx + 1}. {rec.careerTitle}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                      {rec.explanation.split(".")[0]}.
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-extrabold shrink-0">
                    {rec.matchScore}% Match
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Achievement (badge card) */}
          {recentBadge && (
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Trophy className="h-4.5 w-4.5 text-amber-500" />
                <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xs font-black text-slate-800 uppercase tracking-widest">
                  Recent Achievement
                </h2>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md text-2xl">
                  {recentBadge.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{recentBadge.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {recentBadge.desc}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
