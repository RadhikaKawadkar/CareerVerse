"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  GraduationCap,
  Lock,
  Map,
  Mic,
  PlayCircle,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { getGuestProfile, getResumePath } from "@/lib/profile-storage";
import { analyzeProfile } from "@/lib/results-engine";
import type { GuestProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

type NodeState = "completed" | "available" | "recommended" | "locked";

type JourneyNode = {
  title: string;
  description: string;
  status: string;
  state: NodeState;
  href: string;
  icon: LucideIcon;
};

type RecentActivity = {
  label: string;
  title: string;
  href: string;
  icon: LucideIcon;
};

const stateStyles: Record<NodeState, {
  accent: string;
  badge: string;
  glow: string;
  icon: string;
  line: string;
}> = {
  completed: {
    accent: "border-emerald-400/45 bg-emerald-50/75 text-emerald-700",
    badge: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
    glow: "shadow-emerald-500/10",
    icon: "bg-emerald-500 text-white",
    line: "from-emerald-300 via-sky-300 to-sky-200",
  },
  available: {
    accent: "border-sky-400/40 bg-sky-50/75 text-sky-700",
    badge: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20",
    glow: "shadow-sky-500/10",
    icon: "bg-sky-500 text-white",
    line: "from-sky-300 via-indigo-300 to-indigo-200",
  },
  recommended: {
    accent: "border-amber-400/55 bg-amber-50/80 text-amber-800",
    badge: "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/25",
    glow: "shadow-amber-500/20",
    icon: "bg-amber-400 text-slate-950",
    line: "from-amber-300 via-sky-300 to-indigo-200",
  },
  locked: {
    accent: "border-slate-200 bg-slate-100/70 text-slate-500",
    badge: "bg-slate-200/70 text-slate-500 ring-1 ring-slate-300/50",
    glow: "shadow-slate-500/5",
    icon: "bg-slate-200 text-slate-500",
    line: "from-slate-200 via-slate-200 to-slate-100",
  },
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getRecommendedCareer(profile: GuestProfile) {
  const analysis = analyzeProfile(profile);
  const dna = analysis.careerDNA;
  const hasCareerDna = profile.scienceCompleted || profile.sweCompleted || profile.scienceQuizScore !== null;

  if (!hasCareerDna) {
    return {
      hasCareerDna,
      role: "Career",
      roleplayTitle: "Voice Roleplay",
      simulationTitle: "Career Simulation",
      explorerTitle: "Career Explorer",
      roleIcon: BriefcaseBusiness,
      simulationHref: "/explore/simulator",
    };
  }

  if (dna.collaboration >= 68 && dna.analytical >= 58) {
    return {
      hasCareerDna,
      role: "Doctor",
      roleplayTitle: "Doctor Roleplay",
      simulationTitle: "Doctor Simulation",
      explorerTitle: "Medical Explorer",
      roleIcon: Stethoscope,
      simulationHref: "/explore/simulator/doctor",
    };
  }

  if (dna.creativity >= dna.analytical && dna.creativity >= 62) {
    return {
      hasCareerDna,
      role: "Designer",
      roleplayTitle: "Designer Roleplay",
      simulationTitle: "Design Simulation",
      explorerTitle: "Design Explorer",
      roleIcon: Sparkles,
      simulationHref: "/explore/simulator/ux-designer",
    };
  }

  return {
    hasCareerDna,
    role: "Software Engineer",
    roleplayTitle: "Engineer Roleplay",
    simulationTitle: "Engineering Simulation",
    explorerTitle: "Tech Career Explorer",
    roleIcon: BriefcaseBusiness,
    simulationHref: "/explore/software-engineer/intro",
  };
}

function buildJourneyNodes(profile: GuestProfile, roleplayCompleted: boolean): JourneyNode[] {
  const career = getRecommendedCareer(profile);
  const simulationComplete = profile.sweCompleted || profile.scienceCompleted;
  const roleplayState: NodeState = roleplayCompleted
    ? "completed"
    : career.hasCareerDna
      ? "recommended"
      : "available";
  const simulationState: NodeState = simulationComplete
    ? "completed"
    : roleplayCompleted || career.hasCareerDna
      ? roleplayCompleted
        ? "recommended"
        : "available"
      : "locked";
  const mentorState: NodeState = roleplayCompleted || simulationComplete ? "available" : "locked";
  const explorerState: NodeState = simulationComplete ? "recommended" : "available";
  const communityState: NodeState = simulationComplete ? "available" : "locked";
  const growthState: NodeState = simulationComplete ? "available" : "locked";

  return [
    {
      title: "Career DNA",
      description: "Decode your strengths and turn them into a sharper next move.",
      status: profile.onboardingCompleted ? "Completed" : "Available",
      state: profile.onboardingCompleted ? "completed" : "available",
      href: "/results",
      icon: Brain,
    },
    {
      title: career.roleplayTitle,
      description: `Talk to ${career.role === "Career" ? "professionals" : `${career.role.toLowerCase()} professionals`} through AI-powered voice conversations.`,
      status: roleplayState === "recommended" ? "Recommended Next Step" : roleplayState === "completed" ? "Completed" : "Available",
      state: roleplayState,
      href: "/explore/roleplay",
      icon: Mic,
    },
    {
      title: career.simulationTitle,
      description: `Experience a day in the life of ${career.role === "Career" ? "your future career" : `a ${career.role.toLowerCase()}`}.`,
      status: simulationState === "recommended" ? "Recommended Next Step" : simulationState === "completed" ? "Completed" : simulationState === "locked" ? "Locked" : "Available",
      state: simulationState,
      href: simulationState === "locked" ? "/explore" : profile.sweStatus === "in_progress" ? getResumePath("swe", profile) : career.simulationHref,
      icon: career.roleIcon,
    },
    {
      title: "AI Mentor",
      description: "Get personalized guidance and career advice for the choice ahead.",
      status: mentorState === "locked" ? "Locked" : "Available",
      state: mentorState,
      href: "/explore/ai-mentor",
      icon: Bot,
    },
    {
      title: career.explorerTitle,
      description: "Explore salaries, growth paths, education routes, and future opportunities.",
      status: explorerState === "recommended" ? "Recommended Next Step" : "Available",
      state: explorerState,
      href: "/explore/opportunities",
      icon: Map,
    },
    {
      title: "Community",
      description: "Learn with students exploring similar futures and real career stories.",
      status: communityState === "locked" ? "Locked" : "Available",
      state: communityState,
      href: "/explore/community",
      icon: Users,
    },
    {
      title: "Growth Hub",
      description: "Turn your journey into goals, skills, and momentum.",
      status: growthState === "locked" ? "Locked" : "Available",
      state: growthState,
      href: "/explore/growth-hub",
      icon: TrendingUp,
    },
  ];
}

function getRecentActivity(profile: GuestProfile): RecentActivity[] {
  const roleplayHistory = readJson<Array<{ scenarioTitle?: string; role?: string }>>("careerverse-roleplay-history", []);
  const viewedCareers = readJson<string[]>("explored-careers", []);
  const bookmarks = readJson<string[]>("careerverse-bookmarks", []);
  const lastRoleplay = roleplayHistory[0];
  const lastViewed = viewedCareers[0] || bookmarks[0];
  const lastSimulation = profile.sweStatus !== "not_started"
    ? "Software Engineer"
    : profile.scienceStatus !== "not_started"
      ? "Science Lesson"
      : null;

  return [
    {
      label: "Last Roleplay",
      title: lastRoleplay?.scenarioTitle || lastRoleplay?.role || "Start a voice session",
      href: "/explore/roleplay",
      icon: Mic,
    },
    {
      label: "Last Simulation",
      title: lastSimulation || "Try a career simulation",
      href: profile.sweStatus === "in_progress" ? getResumePath("swe", profile) : "/explore/simulator",
      icon: PlayCircle,
    },
    {
      label: "Last Career Viewed",
      title: lastViewed ? lastViewed.replaceAll("-", " ") : "Open Career Explorer",
      href: "/explore/opportunities",
      icon: Compass,
    },
  ];
}

function JourneyCard({ node }: { node: JourneyNode }) {
  const styles = stateStyles[node.state];
  const Icon = node.icon;
  const disabled = node.state === "locked";

  const content = (
    <>
      <div className="absolute inset-x-0 top-0 h-1 bg-current opacity-40" />
      <div className="flex items-start gap-4">
        <motion.div
          animate={node.state === "recommended" ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg", styles.icon)}
        >
          {node.state === "completed" ? <CheckCircle2 className="h-7 w-7" /> : node.state === "locked" ? <Lock className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-black leading-tight text-slate-950">
              {node.title}
            </h3>
            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", styles.badge)}>
              {node.status}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{node.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-extrabold">
            <span>{disabled ? "Unlock by continuing" : "Open"}</span>
            {!disabled && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
          </div>
        </div>
      </div>
    </>
  );

  const className = cn(
    "group relative w-full overflow-hidden rounded-2xl border bg-white/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:p-5 md:w-[46%]",
    styles.accent,
    styles.glow,
    disabled ? "cursor-not-allowed opacity-80" : "hover:-translate-y-1 hover:shadow-2xl",
  );

  if (disabled) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={node.href} className={className}>
      {content}
    </Link>
  );
}

export function ExploreHub() {
  const router = useRouter();
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [roleplayCompleted, setRoleplayCompleted] = useState(false);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const loadProfile = useCallback(() => {
    const data = getGuestProfile();

    if (!data.onboardingCompleted || !data.firstName.trim() || !data.grade) {
      router.replace("/onboarding/1");
      return;
    }

    const roleplayHistory = readJson<unknown[]>("careerverse-roleplay-history", []);
    setProfile(data);
    setRoleplayCompleted(roleplayHistory.length > 0);
    setRecentActivity(getRecentActivity(data));
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

  const journeyNodes = useMemo(() => {
    if (!profile) return [];
    return buildJourneyNodes(profile, roleplayCompleted);
  }, [profile, roleplayCompleted]);

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-8">
      <MotionFadeIn>
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 px-5 py-7 shadow-xl shadow-slate-200/60 backdrop-blur-xl sm:px-8 sm:py-9">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.20),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(251,191,36,0.18),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.72))]" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                CareerVerse
              </div>
              <h1 className="mt-5 font-[family-name:var(--font-plus-jakarta)] text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Hi, {profile.firstName} ??
              </h1>
              <p className="mt-3 text-base font-medium text-slate-600 sm:text-lg">
                Welcome back. Continue building your future.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Next Focus</p>
              <p className="mt-2 text-sm font-bold">
                {journeyNodes.find((node) => node.state === "recommended")?.title || "Career Journey"}
              </p>
            </div>
          </div>
        </section>
      </MotionFadeIn>

      <section className="space-y-6">
        <MotionFadeIn delay={0.05}>
          <div>
            <p className="text-sm font-bold text-primary">Career Journey</p>
            <h2 className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-2xl font-black tracking-tight text-slate-950">
              Your path through CareerVerse
            </h2>
          </div>
        </MotionFadeIn>

        <MotionStagger className="relative mx-auto flex max-w-5xl flex-col gap-5 py-2">
          {journeyNodes.map((node, index) => {
            const styles = stateStyles[node.state];
            const isLeft = index % 2 === 0;

            return (
              <MotionStaggerItem key={node.title} className="relative">
                {index < journeyNodes.length - 1 && (
                  <div
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-[calc(100%-0.25rem)] hidden h-12 w-[34%] -translate-x-1/2 md:block",
                      isLeft ? "rounded-br-[4rem] border-b-2 border-r-2" : "rounded-bl-[4rem] border-b-2 border-l-2",
                      "border-slate-200",
                    )}
                  >
                    <div className={cn("h-full w-full bg-gradient-to-b opacity-40", styles.line)} />
                  </div>
                )}

                <div className={cn("flex w-full", isLeft ? "justify-start" : "justify-end")}>
                  <JourneyCard node={node} />
                </div>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </section>

      <MotionFadeIn delay={0.18}>
        <section className="space-y-4">
          <div>
            <p className="text-sm font-bold text-primary">Continue where you left off</p>
            <h2 className="mt-1 font-[family-name:var(--font-plus-jakarta)] text-xl font-black tracking-tight text-slate-950">
              Recent activity
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                      <p className="mt-1 truncate text-sm font-black capitalize text-slate-950">{item.title}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </MotionFadeIn>
    </div>
  );
}
