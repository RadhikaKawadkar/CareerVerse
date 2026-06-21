"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Share2, Download, Eye, EyeOff, CheckSquare, Square, 
  Award, Trophy, Target, Brain 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { getGuestProfile } from "@/lib/profile-storage";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { analyzeProfile } from "@/lib/results-engine";
import { type GuestProfile } from "@/types/profile";

type ProjectSpec = {
  careerId: string;
  careerTitle: string;
  title: string;
  desc: string;
  steps: string[];
};

const DEFAULT_PROJECTS: ProjectSpec[] = [
  {
    careerId: "software-engineer",
    careerTitle: "Software Engineer",
    title: "Full-Stack Task Manager Sandbox",
    desc: "Build a responsive web application featuring local persistence, visual labels, and clean state mutations.",
    steps: ["Define UI wireframes and grid layouts", "Implement localStorage persistence", "Code status filter states", "Audit accessibility & keyboard triggers"]
  },
  {
    careerId: "data-scientist",
    careerTitle: "Data Scientist",
    title: "Dynamic Churn Telemetry Pipeline",
    desc: "Clean raw logs from public datasets, calculate retention rates, and compile visual analysis charts.",
    steps: ["Scrub CSV files using Python/Pandas", "Formulate regressions logic", "Construct SVG data bars", "Publish findings in a notebook"]
  },
  {
    careerId: "lawyer",
    careerTitle: "Lawyer",
    title: "Mock Appellate Defense Brief",
    desc: "Draft a formal legal brief addressing contract breaches or IP infringements for a mock client dispute.",
    steps: ["Cite relevant statutory codes", "Formulate cross-examination outlines", "Draft liability defense paragraphs", "Conduct a mock defense argument"]
  },
  {
    careerId: "fashion-designer",
    careerTitle: "Fashion Designer",
    title: "Capsule Autumn-Winter Collection",
    desc: "Develop a cohesive 6-outfit collection detailing textile selection, fabrication costs, and color theory charts.",
    steps: ["Draft digital silhouette sketches", "Match fabric swatches and cost margins", "Map contrast sewing metrics", "Present a digital lookbook portfolio"]
  },
  {
    careerId: "chef",
    careerTitle: "Chef",
    title: "Signature Culinary Menu & Costing",
    desc: "Construct a 3-course menu detailing allergen alerts, plating steps, and exact wholesale supply costing.",
    steps: ["Select menu flavor profiles", "Detail molecular texture adjustments", "Calculate raw ingredient margins", "Prepare sample plates with photography"]
  },
  {
    careerId: "product-manager",
    careerTitle: "Product Manager",
    title: "Interactive PRD & Feature Roadmap",
    desc: "Compile a detailed Product Requirements Document specifying user stories, analytics parameters, and wireframe maps.",
    steps: ["Draft user persona interview summaries", "Map priority metrics in a feature chart", "Specify technical security exceptions", "Create a Figma mock prototype link"]
  }
];

type JournalEntry = {
  id: string;
  timestamp: string;
  careerId: string;
  excited: string;
  difficult: string;
  surprised: string;
  feeling: number;
};

type CareerGoal = {
  id: string;
  dreamCareerId: string;
  targetCollege: string;
  targetSkills: string[];
  targetExams: string[];
  notes: string;
  createdAt: string;
};

export default function StudentPortfolioPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [simsCompletedList, setSimsCompletedList] = useState<string[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [goalsList, setGoalsList] = useState<CareerGoal[]>([]);
  
  // Custom states
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);
  const [projectStatus, setProjectStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsClient(true);
    const prof = getGuestProfile();
    setProfile(prof);

    // Bookmarks
    try {
      const stored = localStorage.getItem("careerverse-bookmarks");
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}

    // Goals
    try {
      const stored = localStorage.getItem("careerverse-career-goals");
      if (stored) setGoalsList(JSON.parse(stored));
    } catch {}

    // Journal
    try {
      const stored = localStorage.getItem("careerverse-journal-entries");
      if (stored) setJournalEntries(JSON.parse(stored));
    } catch {}

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

    // Load visibility
    const storedVis = localStorage.getItem("careerverse-portfolio-visibility");
    if (storedVis !== null) {
      setIsPublic(storedVis === "public");
    }

    // Load projects status
    try {
      const storedProj = localStorage.getItem("careerverse-portfolio-projects-status");
      if (storedProj) setProjectStatus(JSON.parse(storedProj));
    } catch {}
  }, []);

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Analyze profile metrics
  const results = analyzeProfile(profile);
  const dna = results.careerDNA;
  const archetype = results.archetype;

  // Calculate readiness score
  const uniqueViews = bookmarks.length + 1; // mock factor
  const rawReadiness = 40 + Math.min(30, uniqueViews * 5) + Math.min(20, simsCompletedList.length * 10) + Math.min(10, journalEntries.length * 5);
  const readinessScore = Math.min(98, rawReadiness);

  // Total XP
  const xpPoints = 250 + Math.min(500, uniqueViews * 50) + Math.min(600, simsCompletedList.length * 150) + Math.min(400, journalEntries.length * 100) + (goalsList.length > 0 ? 200 : 0);

  // Toggle portfolio visibility
  const handleToggleVisibility = () => {
    const nextVis = !isPublic;
    setIsPublic(nextVis);
    localStorage.setItem("careerverse-portfolio-visibility", nextVis ? "public" : "private");
  };

  // Copy portfolio simulated link
  const handleShare = () => {
    const fakeLink = `${window.location.origin}/explore/portfolio/share/${profile.firstName.toLowerCase()}-${profile.grade}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Toggle project step
  const handleToggleStep = (stepKey: string) => {
    const nextStatus = { ...projectStatus, [stepKey]: !projectStatus[stepKey] };
    setProjectStatus(nextStatus);
    localStorage.setItem("careerverse-portfolio-projects-status", JSON.stringify(nextStatus));
  };

  // Filter project suggestions based on bookmarks, or fallback to default
  const activeProjectSpecs = DEFAULT_PROJECTS.filter(p => 
    bookmarks.includes(p.careerId) || p.careerId === "software-engineer" || p.careerId === "data-scientist"
  ).slice(0, 3);

  // Simple downloadable resume representation
  const handleDownloadResume = () => {
    const textLines = [
      `==========================================`,
      `  CAREERVERSE E-PORTFOLIO: ${profile.firstName.toUpperCase()} `,
      `  Grade ${profile.grade} Student Profile`,
      `==========================================`,
      `\n[ACADEMIC DETAILS]`,
      `- Grade Level: Grade ${profile.grade}`,
      `- Stream Focus: ${results.careerRecommendations[0]?.stream || "Science / Technology"}`,
      `- Portfolio Status: ${isPublic ? "Public Access Enabled" : "Private Archive"}`,
      `- Career Readiness Index: ${readinessScore}%`,
      `- Accumulated Exploration XP: ${xpPoints} Points`,
      `\n[CAREER DNA SUMMARY]`,
      `- Archetype: ${archetype.name} (${archetype.badge})`,
      `- Description: ${archetype.description}`,
      `- Analytical Thinking: ${dna.analytical}%`,
      `- Creativity / Design: ${dna.creativity}%`,
      `- Collaboration / Sync: ${dna.collaboration}%`,
      `- Risk Tolerance / Autonomy: ${dna.riskTolerance}%`,
      `\n[TOP STRENGTHS]`,
      ...dna.strengths.map((s: string) => `- ${s}`),
      `\n[TARGET MILESTONES]`,
      ...goalsList.map((g: CareerGoal) => {
        const title = CAREER_LIBRARY.find(c => c.id === g.dreamCareerId)?.title || g.dreamCareerId;
        return `- Dream Career: ${title}\n  - Target College: ${g.targetCollege}\n  - Core Skills: ${g.targetSkills.join(", ")}\n  - Entrance Exams: ${g.targetExams.join(", ")}`;
      }),
      `\n[COMPLETED WORKPLACE SIMULATIONS]`,
      ...simsCompletedList.map(id => `- ${CAREER_LIBRARY.find(c => c.id === id)?.title || id} Workspace Simulator`),
      `\n[DECISION REFLECTION ENTRIES]`,
      `- Total reflections logged: ${journalEntries.length}`,
      `\n------------------------------------------`,
      `Generated via CareerVerse AI Coach Engine.`,
      `Date: ${new Date().toLocaleDateString()}`
    ].join("\n");

    const blob = new Blob([textLines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.firstName}_Career_Portfolio_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Student E-Portfolio
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Profile Info & Visibility */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-violet-500/[0.01] to-transparent">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {archetype.name}
            </span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-extrabold text-foreground mt-1">
              {profile.firstName}
            </h2>
            <p className="text-xs text-muted-foreground">
              Grade {profile.grade} Student
            </p>
          </div>

          <button
            onClick={handleToggleVisibility}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            {isPublic ? (
              <>
                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-semibold">Public</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 text-rose-500" />
                <span className="font-semibold">Private</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-border/40">
          <Button 
            onClick={handleShare}
            className="flex-1 h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl text-xs gap-1.5 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Copied Link!" : "Share Profile"}
          </Button>

          <Button 
            onClick={handleDownloadResume}
            variant="outline"
            className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/80 text-foreground hover:bg-muted/30"
          >
            <Download className="h-3.5 w-3.5" />
            Resume TXT
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Readiness Index</span>
          <span className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold mt-1.5 text-primary">{readinessScore}%</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Ecosystem XP</span>
          <span className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold mt-1.5 text-emerald-600">{xpPoints} XP</span>
        </div>
      </div>

      {/* Dynamic Milestones Section */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-border/40 pb-3">
          <Target className="h-4.5 w-4.5 text-primary" />
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground">
            Target Milestones
          </h3>
        </div>

        {goalsList.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No goals set yet. Visit the Goal Planner to establish targets.</p>
        ) : (
          <div className="space-y-4">
            {goalsList.map((g, idx) => {
              const car = CAREER_LIBRARY.find(c => c.id === g.dreamCareerId);
              return (
                <div key={idx} className="space-y-2 text-xs">
                  <span className="font-extrabold text-foreground block">{car?.title || g.dreamCareerId} Path</span>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/60 rounded-xl p-3">
                    <div>
                      <span className="font-bold text-foreground block">Target College:</span>
                      {g.targetCollege}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Entrance Exams:</span>
                      {g.targetExams.join(", ") || "None"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Career Portfolio Projects Section */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-border/40 pb-3">
          <Brain className="h-4.5 w-4.5 text-pink-500" />
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground">
            Ecosystem Portfolio Projects
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete practical sandbox assignments corresponding to your target career paths. Track your task checkmarks here.
        </p>

        <div className="space-y-5 pt-1">
          {activeProjectSpecs.map((proj, pIdx) => (
            <div key={pIdx} className="border border-border/60 rounded-2xl p-4 bg-muted/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-pink-500/10 text-pink-600 border border-pink-500/20 px-2 py-0.5 rounded-full font-bold">
                  {proj.careerTitle}
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">PROJECT</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{proj.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{proj.desc}</p>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                {proj.steps.map((step, sIdx) => {
                  const key = `proj-${proj.careerId}-${sIdx}`;
                  const done = !!projectStatus[key];
                  return (
                    <button
                      key={sIdx}
                      onClick={() => handleToggleStep(key)}
                      className="w-full flex items-start gap-2.5 text-left text-[11px] text-muted-foreground hover:text-foreground transition-all"
                    >
                      {done ? (
                        <CheckSquare className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                      )}
                      <span className={done ? "line-through text-muted-foreground/60" : ""}>{step}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Experiences */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-border/40 pb-3">
          <Trophy className="h-4.5 w-4.5 text-amber-500" />
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground">
            Experience Log & Badges
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Completed Simulations:</span>
            <span className="font-semibold text-foreground">{simsCompletedList.length}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Reflections Logged:</span>
            <span className="font-semibold text-foreground">{journalEntries.length}</span>
          </div>
        </div>

        {/* Mini Badges row */}
        {simsCompletedList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {simsCompletedList.map((id) => (
              <span key={id} className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="h-3 w-3" /> {CAREER_LIBRARY.find(c => c.id === id)?.title || id} Pro
              </span>
            ))}
          </div>
        )}
      </div>

    </AppShell>
  );
}
