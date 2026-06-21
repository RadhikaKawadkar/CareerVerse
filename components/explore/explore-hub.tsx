"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  FlaskConical,
  Lock,
  Palette,
  Sparkles,
  Stethoscope,
  LogOut,
  Bookmark,
  BookmarkCheck,
  Trophy,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { ExperienceCard } from "@/components/explore/experience-card";
import { ProgressRing } from "@/components/explore/progress-ring";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { db, type DashboardData } from "@/lib/database";
import {
  getGuestProfile,
  getHubProgress,
  setExperienceStatus,
} from "@/lib/profile-storage";
import type { GuestProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

const comingSoonCards = [
  {
    title: "Commerce Stream",
    description: "Try accounting, business decisions, and market thinking before choosing Commerce.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Arts Stream",
    description: "Explore psychology, design, communication, and humanities-style thinking.",
    icon: Palette,
  },
  {
    title: "Doctor Simulation",
    description: "Step into a clinical day: patient conversations, diagnosis clues, and pressure.",
    icon: Stethoscope,
  },
];

export function ExploreHub() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [bookmarkedCareers, setBookmarkedCareers] = useState<string[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<"experiences" | "dashboard">("experiences");

  const loadProfile = useCallback(() => {
    const data = getGuestProfile();

    if (!data.onboardingCompleted || !data.firstName.trim() || !data.grade) {
      router.replace("/onboarding/1");
      return;
    }

    setProfile(data);
  }, [router]);

  useEffect(() => {
    loadProfile();

    const handleFocus = () => loadProfile();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [loadProfile]);

  // Load Dashboard/Bookmarks Data from Supabase
  useEffect(() => {
    if (!user) return;
    
    setLoadingDashboard(true);
    db.getDashboardData(user.id)
      .then((data) => {
        setDashboardData(data);
        setBookmarkedCareers((data.bookmarks || []).map((b) => b.career_name));
      })
      .catch((err) => console.error("Error loading dashboard:", err))
      .finally(() => setLoadingDashboard(false));
  }, [user, activeTab]);

  if (!profile) {
    return null;
  }

  const { scienceCompleted, sweCompleted, completedCount, bothComplete } =
    getHubProgress(profile);
  const remaining = 2 - completedCount;
  const progressMessage =
    completedCount === 0
      ? "Start with either experience. Your insight unlocks after both are complete."
      : completedCount === 1
        ? "Nice progress. One more experience will make your comparison useful."
        : "Both experiences are complete. Your insight is ready.";

  function handleScienceStart() {
    if (!profile!.scienceCompleted && profile!.scienceStatus === "not_started") {
      const updated = setExperienceStatus("science", "in_progress");
      setProfile(updated);
    }
  }

  function handleSweStart() {
    if (!profile!.sweCompleted && profile!.sweStatus === "not_started") {
      const updated = setExperienceStatus("swe", "in_progress");
      setProfile(updated);
    }
  }

  const handleToggleBookmark = async (careerName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const isBookmarked = bookmarkedCareers.includes(careerName);
    try {
      if (isBookmarked) {
        await db.removeBookmark(user.id, careerName);
        setBookmarkedCareers((prev) => prev.filter((c) => c !== careerName));
      } else {
        await db.addBookmark(user.id, careerName);
        setBookmarkedCareers((prev) => [...prev, careerName]);
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  return (
    <div className="cv-section-gap pb-4">
      {/* Header with Logout */}
      <MotionFadeIn>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">CareerVerse</p>
            <h1 className="cv-heading mt-1 text-2xl sm:text-3xl">Hi, {profile.firstName}</h1>
            <p className="mt-1 text-xs text-muted-foreground">Grade {profile.grade}</p>
          </div>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 h-9"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          )}
        </div>
      </MotionFadeIn>

      {/* Tabs Switcher */}
      {user && (
        <div className="flex border-b border-border my-2">
          <button
            type="button"
            className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === "experiences"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("experiences")}
          >
            Careers
          </button>
          <button
            type="button"
            className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === "dashboard"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            My Stats & DNA
          </button>
        </div>
      )}

      {activeTab === "experiences" ? (
        <>
          {/* Progress Ring */}
          <MotionFadeIn delay={0.08}>
            <div
              className={cn(
                "flex items-center gap-5 rounded-2xl border p-5 shadow-md transition-colors duration-300 sm:p-6",
                bothComplete
                  ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-card"
                  : "border-border bg-card",
              )}
            >
              <ProgressRing completed={completedCount} total={2} />
              <div>
                <p className="cv-heading text-base font-semibold sm:text-lg">
                  {bothComplete ? "Both experiences complete!" : "Your exploration progress"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{progressMessage}</p>
              </div>
            </div>
          </MotionFadeIn>

          <MotionFadeIn delay={0.1}>
            <div
              className={cn(
                "rounded-2xl border p-4 shadow-sm transition-all duration-300",
                completedCount === 0 && "border-primary/20 bg-primary/5",
                completedCount === 1 && "border-amber-500/25 bg-amber-500/5",
                completedCount === 2 && "border-emerald-500/25 bg-emerald-500/5 hub-success-pulse",
              )}
            >
              <p className="text-sm font-semibold">
                {completedCount === 0 && "No experiences completed yet"}
                {completedCount === 1 && "One experience completed"}
                {completedCount === 2 && "Insight unlocked"}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {completedCount === 0 &&
                  "Pick Science or Software Engineer to begin. There are no wrong answers here - just useful signals."}
                {completedCount === 1 &&
                  `You are ${remaining} experience away from seeing how your reactions compare.`}
                {completedCount === 2 &&
                  "The results page can now compare both reflections and turn them into a clear takeaway."}
              </p>
            </div>
          </MotionFadeIn>

          {/* Active Experiences */}
          <div className="space-y-5">
            <MotionFadeIn delay={0.12}>
              <h2 className="cv-heading text-lg sm:text-xl">Experience your future</h2>
            </MotionFadeIn>

            <MotionStagger className="space-y-4">
              <MotionStaggerItem className="relative">
                <ExperienceCard
                  title="Sample a Science Lesson"
                  description="Find out what Science classes actually feel like — starting with Grade 11 Physics."
                  meta="5 min · Physics · Interactive"
                  href="/explore/science/intro"
                  icon={FlaskConical}
                  completed={scienceCompleted}
                  status={profile.scienceStatus}
                  accentClass="bg-gradient-to-r from-sky-400 to-sky-500"
                  iconClass="bg-sky-500/10 text-sky-500"
                  onStart={handleScienceStart}
                  startLabel="Start Lesson"
                  reviewLabel="Review Lesson"
                />
                {user && (
                  <button
                    onClick={(e) => handleToggleBookmark("science", e)}
                    className="absolute right-6 top-10 z-20 p-2 rounded-full border border-border bg-background/80 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                    title={bookmarkedCareers.includes("science") ? "Remove Bookmark" : "Bookmark Career"}
                  >
                    {bookmarkedCareers.includes("science") ? (
                      <BookmarkCheck className="h-4.5 w-4.5 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="h-4.5 w-4.5" />
                    )}
                  </button>
                )}
              </MotionStaggerItem>

              <MotionStaggerItem className="relative">
                <ExperienceCard
                  title="Simulate: Software Engineer"
                  description="Make real workplace decisions — standups, bugs, and tradeoffs — not just coding."
                  meta="5 min · 3 workplace moments"
                  href="/explore/software-engineer/intro"
                  icon={Code2}
                  completed={sweCompleted}
                  status={profile.sweStatus}
                  accentClass="bg-gradient-to-r from-emerald-400 to-emerald-500"
                  iconClass="bg-emerald-500/10 text-emerald-500"
                  onStart={handleSweStart}
                  startLabel="Start Simulation"
                  reviewLabel="Review Simulation"
                />
                {user && (
                  <button
                    onClick={(e) => handleToggleBookmark("software-engineer", e)}
                    className="absolute right-6 top-10 z-20 p-2 rounded-full border border-border bg-background/80 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                    title={bookmarkedCareers.includes("software-engineer") ? "Remove Bookmark" : "Bookmark Career"}
                  >
                    {bookmarkedCareers.includes("software-engineer") ? (
                      <BookmarkCheck className="h-4.5 w-4.5 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="h-4.5 w-4.5" />
                    )}
                  </button>
                )}
              </MotionStaggerItem>

              {/* AI Career Coach active link */}
              <MotionStaggerItem>
                <Link
                  href="/explore/ai-mentor"
                  className="group block overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-violet-500/5 to-card p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/45 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                      <Bot className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Active AI Coach
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold leading-snug">
                    AI Career Coach
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A personalized conversational coach to compare streams, ask questions, and build your Career DNA memory.
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4 text-primary font-semibold text-sm">
                    <span>Chat with Coach</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </Link>
              </MotionStaggerItem>
            </MotionStagger>
          </div>

          {/* Unlocked Insight Callout */}
          {bothComplete ? (
            <MotionFadeIn delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-6 shadow-lg shadow-primary/10"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                      <Sparkles className="h-3 w-3" />
                      Unlocked
                    </span>
                    <h3 className="cv-heading mt-2 text-lg">Your Insight</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      See how your Science and Software Engineer experiences compare — and what they
                      reveal about your fit.
                    </p>
                    <Button asChild className="mt-5 w-full sm:w-auto">
                      <Link href="/results">
                        View My Insight
                        <Sparkles className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </MotionFadeIn>
          ) : (
            <MotionFadeIn delay={0.2}>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
                <div className="flex items-start gap-4 opacity-70">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="cv-heading text-lg text-muted-foreground">Your Insight</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Complete both experiences to unlock your personalized insight.
                    </p>
                  </div>
                </div>
                <Button disabled className="mt-5 w-full" variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Locked — {completedCount}/2 complete
                </Button>
              </div>
            </MotionFadeIn>
          )}

          {/* More Paths */}
          <div className="space-y-5">
            <MotionFadeIn delay={0.22}>
              <h2 className="cv-heading text-lg sm:text-xl">More paths coming soon</h2>
            </MotionFadeIn>

            <MotionStagger className="grid gap-3 sm:grid-cols-2">
              {comingSoonCards.map((item) => (
                <MotionStaggerItem key={item.title}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="h-full rounded-2xl border border-border/80 bg-card p-5 opacity-90 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            Coming Soon
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </div>
        </>
      ) : (
        /* Stats & DNA Tab */
        <div className="space-y-6">
          {loadingDashboard ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Bot className="h-8 w-8 animate-bounce mb-3 text-primary" />
              <p className="text-sm">Fetching your DNA and Achievements...</p>
            </div>
          ) : dashboardData ? (
            <MotionStagger className="space-y-6">
              {/* Level & XP card */}
              <MotionStaggerItem>
                <div className="cv-card-elevated p-5 bg-gradient-to-br from-primary/10 to-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Level Progress</p>
                      <h3 className="text-xl font-bold font-[family-name:var(--font-plus-jakarta)] mt-1">
                        Explorer Level {Math.floor(dashboardData.xp / 100) + 1}
                      </h3>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{dashboardData.xp % 100} / 100 XP</span>
                      <span>Next Level</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${dashboardData.xp % 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MotionStaggerItem>

              {/* Career DNA values */}
              {dashboardData.careerDna && (
                <MotionStaggerItem>
                  <div className="cv-card p-5">
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-lg mb-3 flex items-center gap-1.5">
                      <Award className="h-5 w-5 text-primary" />
                      Your Career DNA Archetype: <span className="text-primary">{dashboardData.careerDna.archetype}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Based on your simulation decisions, standup updates, and bug investigation style.
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: "Analytical Depth", val: dashboardData.careerDna.analytical },
                        { name: "Creative Problem Solving", val: dashboardData.careerDna.creativity },
                        { name: "Team Collaboration", val: dashboardData.careerDna.collaboration },
                        { name: "Risk Tolerance", val: dashboardData.careerDna.risk_tolerance },
                      ].map((dna) => (
                        <div key={dna.name} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{dna.name}</span>
                            <span>{dna.val * 10}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                              style={{ width: `${dna.val * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionStaggerItem>
              )}

              {/* Achievements Section */}
              <MotionStaggerItem>
                <div className="cv-card p-5">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-lg mb-3">
                    Unlocked Achievements ({dashboardData.achievements.length})
                  </h3>
                  {dashboardData.achievements.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No achievements unlocked yet. Finish experiences to unlock badges!</p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {dashboardData.achievements.includes("science_pioneer") && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                          <FlaskConical className="h-3.5 w-3.5" />
                          Science Pioneer
                        </span>
                      )}
                      {dashboardData.achievements.includes("swe_explorer") && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <Code2 className="h-3.5 w-3.5" />
                          SWE Explorer
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </MotionStaggerItem>

              {/* Bookmarked Careers List */}
              <MotionStaggerItem>
                <div className="cv-card p-5">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-lg mb-3">
                    Bookmarked Careers ({bookmarkedCareers.length})
                  </h3>
                  {bookmarkedCareers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No careers bookmarked yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {bookmarkedCareers.map((bm) => {
                        const isScience = bm === "science";
                        return (
                          <div key={bm} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2">
                              {isScience ? <FlaskConical className="h-4 w-4 text-sky-500" /> : <Code2 className="h-4 w-4 text-emerald-500" />}
                              <span className="text-sm font-semibold capitalize">{bm.replace("-", " ")}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleToggleBookmark(bm, e)}
                              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </MotionStaggerItem>

              {/* Recent Activity / Journal Reflections */}
              <MotionStaggerItem>
                <div className="cv-card p-5">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-lg mb-3 flex items-center gap-1.5">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Journal Activities
                  </h3>
                  {dashboardData.journalEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No journal logs or reflections saved yet. Finish a simulation to write your thoughts.</p>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.journalEntries.slice(0, 3).map((entry, idx) => (
                        <div key={entry.id || idx} className="p-3.5 rounded-xl border border-border bg-background space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-primary capitalize flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {entry.career_reference.replace("-", " ")} Reflection
                            </span>
                            <span className="text-muted-foreground">
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            &ldquo;{entry.reflection_text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </MotionStaggerItem>
            </MotionStagger>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">Unable to load dashboard. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
