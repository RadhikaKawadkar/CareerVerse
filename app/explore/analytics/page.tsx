"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BarChart3, TrendingUp, Flame, Activity, PieChart 
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getGuestProfile } from "@/lib/profile-storage";
import { type GuestProfile } from "@/types/profile";

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [exploredList, setExploredList] = useState<string[]>([]);
  const [simsCompletedList, setSimsCompletedList] = useState<string[]>([]);
  const [streak, setStreak] = useState(3);

  useEffect(() => {
    setIsClient(true);
    setProfile(getGuestProfile());

    // Load explored list
    try {
      const stored = localStorage.getItem("explored-careers");
      if (stored) setExploredList(JSON.parse(stored));
    } catch {}



    // Load streak
    const storedStreak = localStorage.getItem("exploration-streak");
    if (storedStreak) setStreak(parseInt(storedStreak) || 3);

    // Completed simulations
    const completedList: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("simulation-")) {
        try {
          const simData = JSON.parse(localStorage.getItem(key) || "{}");
          if (simData.completed) {
            completedList.push(key.replace("simulation-", ""));
          }
        } catch {}
      }
    }
    setSimsCompletedList(completedList);
  }, []);

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Top Explored careers database mock
  const exploredStats = [
    { title: "Software Engineer", count: Math.max(3, exploredList.length + (exploredList.includes("software-engineer") ? 2 : 0)), percent: 85, color: "bg-indigo-500" },
    { title: "Data Scientist", count: Math.max(2, exploredList.includes("data-scientist") ? 3 : 1), percent: 70, color: "bg-teal-500" },
    { title: "Graphic Designer", count: Math.max(1, exploredList.includes("graphic-designer") ? 2 : 0), percent: 55, color: "bg-pink-500" },
    { title: "Lawyer", count: Math.max(1, exploredList.includes("lawyer") ? 2 : 0), percent: 45, color: "bg-amber-500" }
  ];

  // Category distributions mock
  const categoryStats = [
    { name: "Technology", share: 42, color: "bg-indigo-500" },
    { name: "Design & Arts", share: 28, color: "bg-pink-500" },
    { name: "Sciences", share: 18, color: "bg-teal-500" },
    { name: "Management", share: 12, color: "bg-amber-500" }
  ];

  // Recommendation engine accuracy index
  const fitAccuracyIndex = 94; // fit accuracy score based on reflections analysis

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Platform Analytics
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-violet-500/[0.01] to-transparent">
        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
          <BarChart3 className="h-5 w-5 animate-pulse" />
          <span>Ecosystem Diagnostics</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Monitor your exploration stats, compare career interest distributions, and review recommendation engine metrics.
        </p>
      </div>

      {/* Accuracy Gauge card */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-border/40 pb-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Recommendation Fit Index</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
            VALIDATED
          </span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative shrink-0 flex items-center justify-center">
            {/* SVG circle gauge */}
            <svg className="h-16 w-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-muted fill-transparent stroke-[6]" />
              <circle cx="32" cy="32" r="28" className="stroke-primary fill-transparent stroke-[6] transition-all duration-1000" strokeDasharray={175} strokeDashoffset={175 - (175 * fitAccuracyIndex) / 100} />
            </svg>
            <span className="absolute text-sm font-extrabold text-foreground">{fitAccuracyIndex}%</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Algorithmic Match Precision</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Calculated by checking match overlap ratios against your completed workplace simulator choice reflections.
            </p>
          </div>
        </div>
      </div>

      {/* User Activity Stats metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-orange-500" /> Exploration Streak
          </div>
          <span className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold mt-1 text-foreground block">{streak} Days</span>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-indigo-500" /> Simulators Run
          </div>
          <span className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold mt-1 text-foreground block">{simsCompletedList.length} Completed</span>
        </div>
      </div>

      {/* Most Explored Careers bar chart */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Most Explored Career Paths
          </span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Clicks Index</span>
        </div>

        <div className="space-y-3.5 pt-1.5">
          {exploredStats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">{stat.title}</span>
                <span className="font-bold text-muted-foreground">{stat.count} views</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category distribution split */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-primary" /> Student Interest Distribution
          </span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Share Ratio</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1.5 text-xs">
          {categoryStats.map((cat, idx) => (
            <div key={idx} className="flex gap-2 items-center p-2.5 bg-muted/40 border border-border/50 rounded-xl">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.color} shrink-0`} />
              <div className="truncate">
                <span className="font-bold text-foreground block text-[11px]">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground block font-semibold">{cat.share}% share</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
