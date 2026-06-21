"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle2, ChevronRight, RefreshCw, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { getGuestProfile } from "@/lib/profile-storage";
import { analyzeProfile } from "@/lib/results-engine";
import { type GuestProfile } from "@/types/profile";

type ChoiceOption = {
  id: "a" | "b";
  label: string;
  explanation: string;
  dnaFactor: string;
};

type DecisionScenario = {
  id: string;
  category: string;
  dilemma: string;
  options: ChoiceOption[];
};

const DECISION_SCENARIOS: DecisionScenario[] = [
  {
    id: "dec-1",
    category: "Science vs Commerce",
    dilemma: "You are selecting your stream for Grade 11. You love coding logic, but you are concerned about the high academic pressure of Physics-Chemistry-Math (PCM).",
    options: [
      {
        id: "a",
        label: "Select Science (PCM) to secure traditional B.Tech Computer Science eligibility.",
        explanation: "This is the most direct technical route. It aligns with analytical rigor, but introduces heavy competitive exam pressure (JEE).",
        dnaFactor: "Analytical Rigor"
      },
      {
        id: "b",
        label: "Select Commerce with Math to learn accounting, business, and study BCA/B.Sc. IT.",
        explanation: "A pragmatic commercial route. It allows you to build sales, marketing, and accounting logic, and maintains coding eligibility via BCA degrees with lower stress.",
        dnaFactor: "Commercial Pragmatism"
      }
    ]
  },
  {
    id: "dec-2",
    category: "Job vs Startup",
    dilemma: "You have graduated. You receive a secure corporate SDE job offer at a major tech giant, alongside an invitation to join an early-stage incubator startup.",
    options: [
      {
        id: "a",
        label: "Accept the secure corporate job to establish stability and brand credentials.",
        explanation: "Ensures solid initial cash flow, structured mentoring, and corporate credibility on your resume. Low risk, high structure.",
        dnaFactor: "Stability & Structure"
      },
      {
        id: "b",
        label: "Join the incubator startup to obtain rapid full-stack ownership and equity.",
        explanation: "High-risk, high-autonomy decision. You will learn sales, product, and code deployment within a high-velocity sandbox. High risk, high reward.",
        dnaFactor: "Autonomy & Risk Appetite"
      }
    ]
  },
  {
    id: "dec-3",
    category: "Government vs Private",
    dilemma: "You are evaluating long-term career environments. You can prepare for civil services exams (UPSC/IAS) or enter high-growth private corporate consulting.",
    options: [
      {
        id: "a",
        label: "Prepare for UPSC to manage public policies, district administrations, and obtain national service authority.",
        explanation: "Premium public service status. Offers massive societal impact and job security, but has a highly competitive selection rate and structured bureaucratic pacing.",
        dnaFactor: "Societal Impact & Security"
      },
      {
        id: "b",
        label: "Enter private consulting to work on global strategy bids and startup exits.",
        explanation: "Agile private corporate environment. High merit-based promotion pacing, high remote work flex, and direct corporate revenue alignment.",
        dnaFactor: "Merit-Based Growth"
      }
    ]
  },
  {
    id: "dec-4",
    category: "India vs Abroad",
    dilemma: "You receive an opportunity to pursue a Master's degree in Germany with high international job prospects, or stay in India to join a domestic tech unicorn.",
    options: [
      {
        id: "a",
        label: "Relocate abroad to experience global diversity and international standards.",
        explanation: "Exposes you to cross-border networks and global currencies. High independence demand, requires adapting to multicultural work ethics.",
        dnaFactor: "Global Autonomy"
      },
      {
        id: "b",
        label: "Stay in India to lead products in the fastest-growing domestic consumer market.",
        explanation: "Leverages India's massive digitization wave. Rapid domestic career velocity and close proximity to family, targeting the next billion consumers.",
        dnaFactor: "Domestic Market Velocity"
      }
    ]
  }
];

export default function DecisionSimulatorPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<"a" | "b" | null>(null);
  const [choicesLog, setChoicesLog] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProfile(getGuestProfile());
  }, []);

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const results = analyzeProfile(profile);
  const dna = results.careerDNA;
  const currentScene = DECISION_SCENARIOS[sceneIdx];

  const handleSelectOption = (optId: "a" | "b", factor: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optId);
    setChoicesLog(prev => [...prev, factor]);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (sceneIdx < DECISION_SCENARIOS.length - 1) {
      setSceneIdx(sceneIdx + 1);
    } else {
      setCompleted(true);
      
      // Increment XP points in localStorage
      const storedStreak = localStorage.getItem("exploration-streak") || "3";
      localStorage.setItem("exploration-streak", String(parseInt(storedStreak) + 1));
    }
  };

  const handleRestart = () => {
    setSceneIdx(0);
    setSelectedOpt(null);
    setChoicesLog([]);
    setCompleted(false);
  };

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold truncate max-w-[200px]">
          Decision Simulator
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Scenario {sceneIdx + 1} of 4</span>
            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300" 
                style={{ width: `${((sceneIdx + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Dilemma Scene Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
                {currentScene.category}
              </span>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground mt-1.5 leading-snug">
                The Career Trade-off
              </h2>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {currentScene.dilemma}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentScene.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.dnaFactor)}
                  className={`w-full text-left rounded-2xl border p-4 text-xs leading-relaxed transition-all duration-200 ${
                    selectedOpt === opt.id
                      ? "border-orange-500 bg-orange-500/5 font-semibold text-foreground shadow-sm shadow-orange-500/5"
                      : selectedOpt !== null
                        ? "opacity-55 border-border bg-muted/20 text-muted-foreground"
                        : "border-border hover:border-orange-500/30 hover:bg-orange-500/[0.01]"
                  }`}
                >
                  <span className="font-bold text-orange-600 mr-2 uppercase">{opt.id}.</span>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Personalized Explanation Reveal */}
            {selectedOpt !== null && (
              <MotionFadeIn>
                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-1.5 relative overflow-hidden">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                    <Info className="h-3.5 w-3.5" /> Career Impact Analysis
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentScene.options.find(o => o.id === selectedOpt)?.explanation}
                  </p>
                  
                  {/* Connect to Career DNA */}
                  <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground leading-relaxed">
                    Your profile highlights **{dna.workStyle}** with **{dna.learningStyle}**. This choice tests your alignment with **{currentScene.options.find(o => o.id === selectedOpt)?.dnaFactor}**.
                  </div>
                </div>
              </MotionFadeIn>
            )}
          </div>

          {/* Action Trigger Button */}
          {selectedOpt !== null && (
            <Button onClick={handleNext} className="w-full h-12 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20">
              {sceneIdx < 3 ? "Proceed to Next Scenario" : "Compile Strategy Report"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Final Debrief Screen */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
              Simulation Completed!
            </h2>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your decision sequences have been audited. Here is your strategy profile.
            </p>
          </div>

          {/* Report Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Your Strategy Archetype</span>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-orange-600 mt-1">
                {choicesLog[1] === "Autonomy & Risk Appetite" ? "Independent Trailblazer" : "Structured Growth Catalyst"}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                Throughout the simulation, you balanced technical constraints with **{choicesLog[0]}** foundations and **{choicesLog[1]}** tactics. Your choices indicate a drive toward **{choicesLog[2]}** environment parameters.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/40 text-xs">
              <span className="font-bold text-foreground block">Decision Log Highlights</span>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Stream Preference:</span>
                  <span className="font-semibold text-foreground">{choicesLog[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Company Ownership:</span>
                  <span className="font-semibold text-foreground">{choicesLog[1]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Environment:</span>
                  <span className="font-semibold text-foreground">{choicesLog[2]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geography Bias:</span>
                  <span className="font-semibold text-foreground">{choicesLog[3]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-2.5">
            <Button onClick={handleRestart} className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs gap-1.5 shadow-md shadow-orange-500/20">
              <RefreshCw className="h-4 w-4" /> Restart Simulator
            </Button>
            <Button asChild variant="outline" className="h-12 px-6 rounded-xl text-xs text-muted-foreground">
              <Link href="/explore">
                Exit Simulator
              </Link>
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
