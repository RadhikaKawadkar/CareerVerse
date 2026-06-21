"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Award, Star, MessageSquare, Heart, ShieldAlert, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { CAREER_JOURNEYS, type UnlockableEnding, type JourneyOption, type CareerJourney } from "@/lib/journey-database";
import { addXp, unlockBadge } from "@/lib/gamification";
import { cn } from "@/lib/utils";
import { addNotification } from "@/lib/global-state";

type JournalForm = {
  excited: string;
  difficult: string;
  surprised: string;
  feeling: number;
};

function SimulatorContent() {
  const router = useRouter();
  const params = useParams();
  const careerId = params.id as string;

  const [journey, setJourney] = useState<CareerJourney | null>(null);
  const [step, setStep] = useState<"intro" | "scenes" | "debrief" | "reflection">("intro");
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<"a" | "b" | "c" | null>(null);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  
  // Decided paths and achievements
  const [decisionsLog, setDecisionsLog] = useState<{ sceneTitle: string; choiceLabel: string; consequence: string; emotional: string }[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>("");
  const [dnaScores, setDnaScores] = useState({ analytical: 0, creativity: 0, collaboration: 0, risk: 0 });
  const [accumulatedStress, setAccumulatedStress] = useState(20);

  // Journal form states
  const [journal, setJournal] = useState<JournalForm>({
    excited: "",
    difficult: "",
    surprised: "",
    feeling: 4
  });

  useEffect(() => {
    const found = CAREER_JOURNEYS[careerId];
    if (found) {
      setJourney(found);
    } else {
      router.replace("/explore/simulator");
    }

    try {
      const stored = localStorage.getItem("careerverse-unlocked-endings");
      if (stored) {
        setUnlockedEndings(JSON.parse(stored));
      }
    } catch {}
  }, [careerId, router]);

  if (!journey) return null;

  const currentScene = journey.scenes[sceneIdx];

  const handleSelectOption = (optId: "a" | "b" | "c") => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optId);

    const option = currentScene.options.find((o: JourneyOption) => o.id === optId);
    if (!option) return;

    if (option.branchSet) {
      setCurrentBranch(option.branchSet);
    }

    setDecisionsLog(prev => [
      ...prev,
      {
        sceneTitle: currentScene.stage + " Stage",
        choiceLabel: option.label,
        consequence: option.consequence,
        emotional: option.emotionalConsequence || "Balanced response."
      }
    ]);

    setDnaScores(prev => ({
      analytical: prev.analytical + option.scores.analytical,
      creativity: prev.creativity + option.scores.creativity,
      collaboration: prev.collaboration + option.scores.collaboration,
      risk: prev.risk + option.scores.risk
    }));

    const emotText = (option.emotionalConsequence || "").toLowerCase();
    let stressInc = 5;
    if (emotText.includes("stress") || emotText.includes("panic") || emotText.includes("overwork") || emotText.includes("exhausted") || emotText.includes("burnout")) {
      stressInc = 25;
    } else if (emotText.includes("frustrated") || emotText.includes("concern") || emotText.includes("pressure")) {
      stressInc = 15;
    } else if (emotText.includes("compromise") || emotText.includes("collaborative") || emotText.includes("happy") || emotText.includes("aligned")) {
      stressInc = -10;
    }
    setAccumulatedStress(prev => Math.min(100, Math.max(10, prev + stressInc)));

    addXp(75, `Stage Action: ${currentScene.stage} Decision`);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (sceneIdx < journey.scenes.length - 1) {
      setSceneIdx(sceneIdx + 1);
    } else {
      addXp(150, `Completed Journey: ${journey.title}!`);
      unlockBadge("sim_master");

      const matchedEnding = journey.endings.find((e: UnlockableEnding) => e.requiredBranch === currentBranch) || journey.endings[0];
      const nextEndings = Array.from(new Set([...unlockedEndings, matchedEnding.id]));
      setUnlockedEndings(nextEndings);
      localStorage.setItem("careerverse-unlocked-endings", JSON.stringify(nextEndings));

      addNotification("achievement", "Achievement Unlocked", `Unlocked Ending: "${matchedEnding.title}"! (+150 XP)`);
      addNotification("quest", "Quest Completed", `You finished the workplace journey for ${journey.title}!`);

      try {
        const explored = localStorage.getItem("explored-careers") || "[]";
        const currentExplored = JSON.parse(explored);
        if (!currentExplored.includes(journey.careerId)) {
          localStorage.setItem("explored-careers", JSON.stringify([...currentExplored, journey.careerId]));
        }
      } catch {}

      setStep("debrief");
    }
  };

  const activeEnding = journey.endings.find((e: UnlockableEnding) => e.requiredBranch === currentBranch) || journey.endings[0];

  const getDemonstratedCompetencies = () => {
    const competencies: string[] = [];
    if (dnaScores.analytical >= 25) competencies.push("Statutory Precision & Logic");
    if (dnaScores.creativity >= 25) competencies.push("Conceptual Ideation & UI Curation");
    if (dnaScores.collaboration >= 25) competencies.push("Consensus & Team Diplomacy");
    if (dnaScores.risk >= 25) competencies.push("Strategic Risk Pacing");

    if (competencies.length === 0) {
      competencies.push("Adaptable Synthesis", "Critical Evaluation");
    }
    return competencies;
  };

  const competencies = getDemonstratedCompetencies();

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journal.excited.trim() && !journal.difficult.trim() && !journal.surprised.trim()) return;

    try {
      const stored = localStorage.getItem("careerverse-journal-entries") || "[]";
      const entries = JSON.parse(stored);
      
      const newEntry = {
        id: String(Date.now()),
        timestamp: new Date().toISOString(),
        careerId: journey.careerId,
        excited: journal.excited.trim() || `Unlocked ending: ${activeEnding.title}`,
        difficult: journal.difficult.trim() || "Balancing operational tradeoffs under pressure.",
        surprised: journal.surprised.trim() || "Seeing how subject streams shape specializations.",
        feeling: journal.feeling
      };

      localStorage.setItem("careerverse-journal-entries", JSON.stringify([newEntry, ...entries]));
      
      const simKey = `simulation-${journey.careerId}`;
      const simMeta = {
        completed: true,
        completedAt: new Date().toISOString(),
        fit: journal.feeling,
        stressIndex: accumulatedStress,
        decisions: decisionsLog.map(d => d.choiceLabel)
      };
      localStorage.setItem(simKey, JSON.stringify(simMeta));
      
      window.dispatchEvent(new CustomEvent("careerverse-profile-updated"));
    } catch (err) {
      console.error("Failed to save journal entry", err);
    }

    router.replace("/explore/simulator");
  };

  const currentOptionInfo = currentScene?.options.find((o: JourneyOption) => o.id === selectedOpt);

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      
      {/* 1. Episode Intro Screen */}
      {step === "intro" && (
        <MotionFadeIn className="space-y-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full flex items-center justify-center">
              <Link href="/explore/simulator">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Life Journey Episode</span>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-foreground">{journey.title}</h1>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-md">
            <div className="bg-gradient-to-br from-violet-500/10 via-primary/[0.02] to-transparent p-6 border-b border-border space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-border text-3xl shadow-sm">
                🎭
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {journey.shortDesc}
              </p>
            </div>

            <div className="p-6 border-b border-border/40 space-y-3">
              <span className="text-[9px] font-extrabold uppercase text-muted-foreground tracking-widest block">Episode stages</span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-foreground">
                {journey.stages.map((st: string, idx: number) => (
                  <span key={st} className="flex items-center gap-1.5">
                    <span className="bg-muted px-2 py-1 rounded-md border border-border/60">{st}</span>
                    {idx < journey.stages.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-[9px] font-extrabold uppercase text-muted-foreground tracking-widest block">Collect endings</span>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {journey.endings.map((e: UnlockableEnding) => {
                  const unlocked = unlockedEndings.includes(e.id);
                  return (
                    <div 
                      key={e.id}
                      className={cn(
                        "p-3 rounded-2xl border flex items-center justify-between text-xs transition-all",
                        unlocked 
                          ? "bg-amber-500/5 border-amber-500/25 text-foreground" 
                          : "bg-muted/30 border-border/40 text-muted-foreground opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{unlocked ? e.badge : "🔒"}</span>
                        <div className="text-[10px]">
                          <span className="font-bold block">{e.title}</span>
                          <span className="text-[9px] text-muted-foreground">{unlocked ? "Unlocked" : "Locked Path"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Button onClick={() => setStep("scenes")} className="w-full h-12 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-md shadow-primary/20">
            Enter Journey Episode
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </MotionFadeIn>
      )}

      {/* 2. Scenes Play Step (Immersive Visual Novel Engine) */}
      {step === "scenes" && (
        <div className="space-y-6">
          {/* Progress Timeline HUD */}
          <div className="space-y-3 bg-card p-4 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
              <span className="uppercase tracking-wider">Episode Timeline</span>
              <span>Stage {sceneIdx + 1} of {journey.scenes.length}</span>
            </div>
            
            <div className="flex items-center justify-between px-2 pt-1">
              {journey.stages.map((st: string, idx: number) => {
                const active = idx === sceneIdx;
                const completed = idx < sceneIdx;
                return (
                  <div key={st} className="flex items-center flex-1 last:flex-none">
                    <div 
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all",
                        active 
                          ? "border-primary bg-primary text-primary-foreground scale-110 shadow-sm" 
                          : completed 
                            ? "border-emerald-500 bg-emerald-500 text-white" 
                            : "border-border bg-muted text-muted-foreground/50"
                      )}
                    >
                      {completed ? "✓" : idx + 1}
                    </div>
                    {idx < journey.stages.length - 1 && (
                      <div 
                        className={cn(
                          "h-0.5 flex-1 mx-2 transition-all",
                          completed ? "bg-emerald-500" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Novel Interface */}
          <div className="space-y-6">
            
            {/* Animating Character Display + Dialogue Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`scene-${sceneIdx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Large Character Card */}
                <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-3xl shadow-md bg-gradient-to-b from-primary/[0.02] to-card relative overflow-hidden min-h-[200px]">
                  {/* Subtle decorative glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-violet-500/[0.02] pointer-events-none" />
                  
                  {/* Big Character Avatar */}
                  <div className="text-7xl mb-4 select-none filter drop-shadow-md transform hover:scale-105 transition-transform duration-200">
                    {currentScene.avatar}
                  </div>

                  {/* Character Name glassmorphic badge */}
                  <div className="bg-background/80 border border-border/80 px-4 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">
                    {currentScene.character}
                  </div>

                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-2">
                    {currentScene.stage} Phase
                  </span>

                  {/* Live Stress HUD */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/15 px-3 py-1 rounded-full shadow-sm">
                    <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
                    <span>Stress: {accumulatedStress}%</span>
                  </div>
                </div>

                {/* Speech Dialogue Bubble */}
                <div className="relative rounded-3xl bg-muted/30 border border-border/40 p-6 shadow-inner text-sm leading-relaxed text-foreground italic font-medium">
                  {/* pointer tail */}
                  <div className="absolute top-[-8px] left-[50%] -translate-x-1/2 w-4 h-4 bg-card border-t border-l border-border/40 rotate-45 transform" />
                  &ldquo;{currentScene.text}&rdquo;
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decisions Choices Grid */}
            <div className="space-y-3">
              {currentScene.options.map((opt: JourneyOption) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={selectedOpt !== null}
                  className={cn(
                    "w-full text-left rounded-2xl border p-4 text-xs leading-relaxed transition-all duration-200 shadow-sm flex items-start gap-3",
                    selectedOpt === opt.id
                      ? "border-primary bg-primary/5 font-semibold text-foreground scale-[1.01]"
                      : selectedOpt !== null
                        ? "opacity-50 border-border bg-muted/20 text-muted-foreground"
                        : "border-border bg-card hover:border-primary/30 hover:bg-primary/[0.01] hover:scale-[1.005] hover:shadow"
                  )}
                >
                  <span className="font-extrabold text-primary uppercase shrink-0 bg-primary/10 border border-primary/25 h-5 w-5 rounded-md flex items-center justify-center text-[10px]">
                    {opt.id}
                  </span>
                  <span className="pt-0.5">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Consequence Overlay */}
            <AnimatePresence>
              {selectedOpt !== null && currentOptionInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-lg bg-gradient-to-br from-violet-500/[0.02] to-transparent"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase text-primary tracking-widest border-b border-border/40 pb-2">
                    <MessageSquare className="h-4 w-4" /> Choice Consequence
                  </div>
                  
                  <div className="text-xs leading-relaxed text-foreground bg-muted/40 p-4 rounded-2xl border border-border/40">
                    &ldquo;{currentOptionInfo.consequence}&rdquo;
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Emotional Feedback */}
                    <div className="flex gap-2.5 items-start bg-rose-500/[0.02] border border-rose-500/10 p-3.5 rounded-2xl">
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-bold text-rose-600 block uppercase tracking-wider">Emotional & Team Impact</span>
                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{currentOptionInfo.emotionalConsequence}</p>
                      </div>
                    </div>

                    {/* Pro Insight */}
                    <div className="flex gap-2.5 items-start bg-primary/5 border border-primary/10 p-3.5 rounded-2xl">
                      <Sparkles className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-bold text-primary block uppercase tracking-wider">Professional Insight</span>
                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{currentOptionInfo.professionalInsight}</p>
                      </div>
                    </div>
                  </div>
                  
                  {currentOptionInfo.milestone && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-extrabold text-emerald-600">
                      <Star className="h-3.5 w-3.5 fill-emerald-600" />
                      Milestone Completed: {currentOptionInfo.milestone}
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/40 flex justify-between items-center text-[10px] font-bold text-amber-500">
                    <span>+75 XP Awarded</span>
                    <Button onClick={handleNext} size="sm" className="h-8 rounded-xl px-4 text-[10px] font-extrabold shadow-sm">
                      {sceneIdx < journey.scenes.length - 1 ? "Next Scene" : "Finish Episode"} <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 3. Ending Unlocked & Post-Simulation Scorecard Step */}
      {step === "debrief" && (
        <MotionFadeIn className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 shadow-md animate-bounce">
              <Award className="h-8 w-8" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center justify-center gap-1">
              🏆 ENDING UNLOCKED!
            </span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold text-foreground">
              {activeEnding.title}
            </h2>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4 relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-card to-transparent">
            <div className="absolute right-6 top-6 text-6xl opacity-20 select-none">
              {activeEnding.badge}
            </div>
            <span className="text-[9px] font-extrabold uppercase text-primary tracking-widest block">Ending Description</span>
            <p className="text-xs text-muted-foreground leading-relaxed pr-16 bg-muted/20 p-4 rounded-2xl border border-border/10">
              &ldquo;{activeEnding.description}&rdquo;
            </p>
          </div>

          {/* Scorecard */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground border-b border-border/40 pb-2 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Episode Scorecard & Competencies
            </h3>

            {/* Decisions Log */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Decision Log</span>
              <div className="space-y-2.5">
                {decisionsLog.map((log, idx) => (
                  <div key={idx} className="p-3 bg-muted/40 border border-border rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-primary">
                      <span>{log.sceneTitle}</span>
                      <span>Choice Made</span>
                    </div>
                    <p className="font-semibold text-foreground">&ldquo;{log.choiceLabel}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Competency Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-border/40 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Demonstrated Competencies</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {competencies.map((comp) => (
                  <span key={comp} className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-1 text-[10px] font-bold">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Stress Index Dial */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Cumulative Stress Level</span>
                <span className={cn(
                  "font-black text-xs",
                  accumulatedStress >= 70 ? "text-red-500" : accumulatedStress >= 45 ? "text-amber-500" : "text-emerald-500"
                )}>
                  {accumulatedStress}% {accumulatedStress >= 70 ? "High Stress" : accumulatedStress >= 45 ? "Moderate" : "Balanced"}
                </span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    accumulatedStress >= 70 ? "bg-red-500" : accumulatedStress >= 45 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${accumulatedStress}%` }}
                />
              </div>
            </div>

            {/* Suggested Next Careers */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Suggested Next Episodes</span>
              <div className="flex gap-2 pt-1">
                {journey.suggestedNext.map((cId: string) => {
                  const nextJ = CAREER_JOURNEYS[cId];
                  if (!nextJ) return null;
                  return (
                    <Link 
                      key={cId}
                      href={`/explore/simulator/${cId}`}
                      className="bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all"
                    >
                      Play {nextJ.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Button onClick={() => setStep("reflection")} className="w-full h-12 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-md shadow-primary/20">
            Write Reflection in Decision Journal
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </MotionFadeIn>
      )}

      {/* 4. Reflection Journal Step */}
      {step === "reflection" && (
        <MotionFadeIn className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Journal Reflection</span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
              Record Decision Journal Entry
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your reflections are automatically cataloged and feed directly into the strengths and growth analytics page.
            </p>
          </div>

          <form onSubmit={handleSaveReflection} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">What excited you about this journey?</label>
              <textarea
                value={journal.excited}
                onChange={e => setJournal(prev => ({ ...prev, excited: e.target.value }))}
                placeholder="e.g. Scaling database indexing or arguing constitutional rights..."
                className="flex min-h-[60px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">What did you find difficult or complex?</label>
              <textarea
                value={journal.difficult}
                onChange={e => setJournal(prev => ({ ...prev, difficult: e.target.value }))}
                placeholder="e.g. Dealing with SRE stress or patent infringement claims..."
                className="flex min-h-[60px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">What surprised you about the daily operations?</label>
              <textarea
                value={journal.surprised}
                onChange={e => setJournal(prev => ({ ...prev, surprised: e.target.value }))}
                placeholder="e.g. That corporate law has so many mediation settlement steps..."
                className="flex min-h-[60px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">How do you rate your overall interest in this career?</span>
                <span className="font-extrabold text-primary text-sm">{journal.feeling}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={journal.feeling}
                onChange={e => setJournal(prev => ({ ...prev, feeling: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 pt-1">
              Save Reflection & Finish Episode
            </Button>
          </form>
        </MotionFadeIn>
      )}
    </div>
  );
}

export default function CareerSimulatorPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <SimulatorContent />
      </Suspense>
    </AppShell>
  );
}
