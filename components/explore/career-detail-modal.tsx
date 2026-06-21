"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Sparkles, AlertCircle, Bot, BookOpen, GraduationCap, CheckCircle2, Map, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CareerItem } from "@/lib/career-library";
import { getGuestProfile, getResumePath } from "@/lib/profile-storage";
import { analyzeProfile } from "@/lib/results-engine";
import { useRouter } from "next/navigation";
import { getStudentVoices } from "@/lib/student-voices";
import { getMentors } from "@/lib/mentors";
import { getCollegeDetails } from "@/lib/colleges";

type CareerDetailModalProps = {
  career: CareerItem | null;
  onClose: () => void;
};

export function CareerDetailModal({ career, onClose }: CareerDetailModalProps) {
  const router = useRouter();
  const [selectedMock, setSelectedMock] = useState<"a" | "b" | "c" | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [resumePath, setResumePath] = useState<string>("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showColleges, setShowColleges] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "dayLife" | "journey" | "myths" | "community">("overview");

  useEffect(() => {
    if (career) {
      setSelectedMock(null);
      setShowColleges(false);
      setActiveTab("overview");
      
      // Calculate match score
      try {
        const profile = getGuestProfile();
        const results = analyzeProfile(profile);
        const recommendation = results.careerRecommendations.find(r => r.careerId === career.id);
        if (recommendation) {
          setMatchScore(recommendation.matchScore);
        } else {
          setMatchScore(70); // default fallback
        }
      } catch (e) {
        console.error("Failed to compute match score", e);
        setMatchScore(72);
      }

      // Check if user has interest saved
      const stored = localStorage.getItem(`notify-${career.id}`);
      setSubscribed(!!stored);

      // Check resume path if experience is active
      if (career.simulationAvailable) {
        const profile = getGuestProfile();
        if (career.id === "software-engineer") {
          setResumePath(getResumePath("swe", profile));
        } else {
          setResumePath(`/explore/simulator/${career.id}`);
        }
      }
    }
  }, [career]);

  if (!career) return null;

  const streamColors = {
    Science: "bg-sky-500/10 text-sky-600 border-sky-500/25",
    Commerce: "bg-amber-500/10 text-amber-600 border-amber-500/25",
    Arts: "bg-purple-500/10 text-purple-600 border-purple-500/25",
    Vocational: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  };

  function handleNotifyToggle() {
    if (!career) return;
    if (subscribed) {
      localStorage.removeItem(`notify-${career.id}`);
      setSubscribed(false);
    } else {
      localStorage.setItem(`notify-${career.id}`, "true");
      setSubscribed(true);
    }
  }

  function handleStartSimulation() {
    if (!career) return;
    onClose();
    router.push(resumePath || `/explore/simulator/${career.id}`);
  }

  const currentScene = career.simulation && career.simulation[0];
  const selectedOption = currentScene?.options.find((o) => o.id === selectedMock);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-primary/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${streamColors[career.stream]}`}>
                {career.stream}
              </span>
              {matchScore !== null && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" /> {matchScore}% Match
                </span>
              )}
              {career.simulationAvailable && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  <Sparkles className="h-3 w-3" /> Active Simulation
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title & Desc */}
            <div>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold tracking-tight">
                {career.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {career.longDesc}
              </p>
            </div>

            {/* Premium Glassmorphic Tab Switcher */}
            <div className="flex border-b border-border overflow-x-auto no-scrollbar gap-2 pb-1 text-xs font-bold text-muted-foreground">
              {(
                [
                  { id: "overview", label: "Overview" },
                  { id: "dayLife", label: "Day in Life" },
                  { id: "journey", label: "Growth & Journey" },
                  { id: "myths", label: "Myths & Skills" },
                  { id: "community", label: "Community" }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 border-b-2 transition-all duration-200 shrink-0 ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-black"
                      : "border-transparent hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. OVERVIEW PANEL */}
                {activeTab === "overview" && (
                  <>
                    {/* Quick Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border bg-muted/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Growth Trend
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                          <span className="font-semibold text-foreground">{career.growthRate}</span>
                        </div>
                        <span className="mt-1 block text-xs text-muted-foreground">{career.demandLevel} Demand</span>
                      </div>

                      <div className="rounded-2xl border border-border bg-muted/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          AI Automation Risk
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Bot className={`h-5 w-5 ${career.aiImpact.level === "Low" ? "text-emerald-500" : career.aiImpact.level === "Medium" ? "text-amber-500" : "text-red-500"}`} />
                          <span className="font-semibold text-foreground">{career.aiImpact.automationRisk}%</span>
                          <span className={`text-xs font-medium uppercase ${career.aiImpact.level === "Low" ? "text-emerald-600" : career.aiImpact.level === "Medium" ? "text-amber-600" : "text-red-600"}`}>
                            {career.aiImpact.level}
                          </span>
                        </div>
                        <span className="mt-1 block text-xs text-muted-foreground">Likelihood of task automation</span>
                      </div>
                    </div>

                    {/* Salary Progression */}
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Salary Growth (Annual Indian Average)
                        </p>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Lakhs Per Annum (LPA)</span>
                      </div>

                      <div className="space-y-3 pt-1">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Fresher / Entry-Level</span>
                            <span className="text-foreground font-bold">{career.salary.entry}</span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(12, ((career.salary.entryVal || 4) / 75) * 100))}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Mid-Level Experience</span>
                            <span className="text-foreground font-bold">{career.salary.mid}</span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(25, ((career.salary.midVal || 12) / 75) * 100))}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Senior / Leadership</span>
                            <span className="text-foreground font-bold">{career.salary.senior}</span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(45, ((career.salary.seniorVal || 30) / 75) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Impact detail */}
                    <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <Bot className="h-4 w-4" /> AI Integration Summary
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {career.aiImpact.summary}
                      </p>
                      <div className="rounded-xl bg-background border border-border/60 p-3">
                        <span className="text-[11px] font-bold uppercase text-emerald-600 block">AI Coexistence Strategy</span>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {career.aiImpact.strategy}
                        </p>
                      </div>
                    </div>

                    {/* Education & Academic Pathway */}
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Academic Pathway
                      </p>
                      <div className="flex gap-3.5">
                        <div className="flex flex-col items-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="h-10 w-0.5 bg-border" />
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-5 text-sm pt-0.5">
                          <div>
                            <span className="font-semibold text-foreground">Grade 11 & 12 Selection</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{career.educationPath.highSchoolSubjects}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">College Degrees</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{career.educationPath.degrees.join(" · ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admissions Explorer */}
                    {(() => {
                      const details = getCollegeDetails(career.id);
                      return (
                        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300">
                          <button
                            onClick={() => setShowColleges(!showColleges)}
                            className="w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wider text-muted-foreground hover:bg-muted/30 transition-colors"
                          >
                            <span className="flex items-center gap-2 text-foreground font-[family-name:var(--font-plus-jakarta)] text-sm normal-case tracking-normal">
                              <GraduationCap className="h-5 w-5 text-primary" /> College & Admissions Explorer
                            </span>
                            {showColleges ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {showColleges && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="border-t border-border/60 bg-muted/10"
                              >
                                <div className="p-5 space-y-4 text-xs">
                                  <div className="space-y-1.5">
                                    <span className="font-bold text-foreground block">Top Colleges (India)</span>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                      {details.colleges.map((col) => (
                                        <span key={col} className="rounded-lg bg-card border border-border/80 px-2.5 py-1 text-foreground font-semibold shadow-sm">
                                          {col}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                                    <span className="font-bold text-foreground block">Admissions Entrance Exams</span>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                      {details.entranceExams.map((ex) => (
                                        <span key={ex} className="rounded-lg bg-primary/5 border border-primary/10 px-2.5 py-1 text-primary font-bold">
                                          {ex}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-1 pt-2 border-t border-border/40">
                                    <span className="font-bold text-foreground block">Academic Eligibility</span>
                                    <p className="text-muted-foreground leading-relaxed">{details.eligibility}</p>
                                  </div>

                                  <div className="space-y-1 pt-2 border-t border-border/40">
                                    <span className="font-bold text-foreground block">Estimated Fees</span>
                                    <p className="text-muted-foreground leading-relaxed">{details.feesRange}</p>
                                  </div>

                                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                                    <span className="font-bold text-emerald-600 block">Scholarship Opportunities</span>
                                    <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground">
                                      {details.scholarships.map((s) => (
                                        <li key={s} className="leading-relaxed">{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </>
                )}

                {/* 2. DAY IN LIFE PANEL */}
                {activeTab === "dayLife" && (
                  <>
                    {/* Day in the Life Timeline */}
                    {career.dayInTheLife && career.dayInTheLife.length > 0 && (
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Day in the Life Timeline
                        </p>
                        <div className="space-y-4 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                          {career.dayInTheLife.map((evt, idx) => (
                            <div key={idx} className="relative pl-6 space-y-1">
                              <div className="absolute left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background -translate-x-1/2 transition-colors duration-200" />
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-primary">{evt.time}</span>
                                <span className="text-xs font-bold text-foreground">{evt.activity}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {evt.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reality vs Expectation Cards */}
                    {career.realityVsExpectation && career.realityVsExpectation.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Reality vs Expectation
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {career.realityVsExpectation.map((item, idx) => (
                            <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col divide-y divide-border">
                              {/* Expectation */}
                              <div className="p-4 bg-sky-500/[0.02] border-l-4 border-l-sky-400">
                                <span className="text-[10px] font-extrabold uppercase text-sky-600 tracking-wider block mb-1">💭 Student Expectation</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.expectation}</p>
                              </div>
                              {/* Reality */}
                              <div className="p-4 bg-indigo-500/[0.02] border-l-4 border-l-indigo-500">
                                <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider block mb-1">💼 Real-World Reality</span>
                                <p className="text-xs text-foreground font-medium leading-relaxed">{item.reality}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 3. JOURNEY & GROWTH PANEL */}
                {activeTab === "journey" && (
                  <>
                    {/* Real Professional Journey */}
                    {career.realJourney && (
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm bg-gradient-to-br from-violet-500/[0.02] to-transparent">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Real Professional Journey
                        </p>
                        <p className="text-xs leading-relaxed text-foreground italic font-medium">
                          &ldquo;{career.realJourney}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Career Growth Ladder */}
                    {career.growthLadder && career.growthLadder.length > 0 && (
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Career Growth Ladder
                        </p>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                          {career.growthLadder.map((step, idx) => (
                            <div key={idx} className="relative pl-7 space-y-1 group">
                              <div className="absolute left-[11px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background -translate-x-1/2 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                                <div className="h-2 w-2 bg-primary rounded-full" />
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-foreground">{step.role}</span>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{step.experience}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Career Journey Roadmap */}
                    {career.roadmap && career.roadmap.length > 0 && (
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-primary animate-pulse" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Career Roadmap (10th to Leadership)
                          </p>
                        </div>
                        
                        <div className="space-y-5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                          {career.roadmap.map((step, idx) => (
                            <div key={idx} className="relative pl-7 space-y-1">
                              <div className="absolute left-[11px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background -translate-x-1/2 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                                  {step.stage}
                                </span>
                                <span className="text-xs font-bold text-foreground mt-0.5 block">
                                  {step.action}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {step.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 4. MYTHS & SKILLS PANEL */}
                {activeTab === "myths" && (
                  <>
                    {/* Common Misconceptions */}
                    {career.misconceptions && career.misconceptions.length > 0 && (
                      <div className="rounded-2xl border border-border bg-rose-500/[0.01] p-5 space-y-3 shadow-sm border-l-4 border-l-rose-500">
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                          Common Misconceptions
                        </p>
                        <ul className="list-disc pl-4 text-xs space-y-2 text-muted-foreground">
                          {career.misconceptions.map((mis, idx) => (
                            <li key={idx} className="leading-relaxed">{mis}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Career Myths */}
                    {career.myths && career.myths.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Myths vs Facts
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {career.myths.map((item, idx) => (
                            <div key={idx} className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm">
                              <div className="flex gap-2 items-start text-xs">
                                <span className="text-rose-500 font-extrabold shrink-0 bg-rose-500/10 h-5 w-5 rounded-md flex items-center justify-center text-[10px]">MYTH</span>
                                <span className="font-semibold text-foreground pt-0.5">{item.myth}</span>
                              </div>
                              <div className="flex gap-2 items-start text-xs border-t border-border/40 pt-2">
                                <span className="text-emerald-500 font-extrabold shrink-0 bg-emerald-500/10 h-5 w-5 rounded-md flex items-center justify-center text-[10px]">FACT</span>
                                <span className="text-muted-foreground pt-0.5 leading-relaxed">{item.fact}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills & Roles */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Job Roles you can do
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {career.typicalRoles.map((role) => (
                            <span key={role} className="rounded-lg border border-border bg-muted/30 px-2.5 py-1 text-xs text-foreground font-medium">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Hard Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {career.hardSkills.map((skill) => (
                              <span key={skill} className="rounded-md bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 text-xs text-sky-600 font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Soft Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {career.softSkills.map((skill) => (
                              <span key={skill} className="rounded-md bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Mini Scenario */}
                    {currentScene && (
                      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet-500" />
                          <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground">
                            Interactive Micro-Scenario
                          </span>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-4">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">dilemma</span>
                          <p className="text-xs font-medium leading-relaxed mt-1">{currentScene.dilemma}</p>
                        </div>

                        <div className="space-y-2">
                          {currentScene.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedMock(opt.id)}
                              disabled={selectedMock !== null}
                              className={`w-full text-left rounded-xl border p-3 text-xs leading-relaxed transition-all duration-200 ${
                                selectedMock === opt.id
                                  ? "border-violet-500 bg-violet-500/10 font-medium text-foreground shadow-sm"
                                  : selectedMock !== null
                                  ? "border-border/40 opacity-60 bg-muted/10 text-muted-foreground"
                                  : "border-border hover:border-violet-500/40 hover:bg-violet-500/5 text-foreground"
                              }`}
                            >
                              <span className="font-bold mr-2">{opt.id.toUpperCase()}.</span> {opt.label}
                            </button>
                          ))}
                        </div>

                        {selectedMock && selectedOption && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl border border-violet-200/50 bg-violet-500/5 p-4 space-y-1.5"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-violet-600">
                              <AlertCircle className="h-3.5 w-3.5" /> Professional Breakdown
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {selectedOption.insight}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* 5. COMMUNITY PANEL */}
                {activeTab === "community" && (
                  <>
                    {/* Student Voices */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold text-foreground">
                          Student Voices
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {getStudentVoices(career.id).map((voice, idx) => (
                          <div key={idx} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xl border border-indigo-100">
                                {voice.avatar}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-foreground">{voice.name}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  {voice.currentYear} • {voice.school}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4 pt-3 text-xs border-t border-border/40 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
                              <div className="relative pl-7">
                                <div className="absolute left-[11px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 -translate-x-1/2" />
                                <span className="font-bold text-indigo-600 block">Why I Chose This Career</span>
                                <p className="text-muted-foreground mt-0.5 leading-relaxed">{voice.whyChose}</p>
                              </div>
                              <div className="relative pl-7">
                                <div className="absolute left-[11px] top-1.5 h-2 w-2 rounded-full bg-rose-500 -translate-x-1/2" />
                                <span className="font-bold text-rose-500 block">Biggest Challenge</span>
                                <p className="text-muted-foreground mt-0.5 leading-relaxed">{voice.challenge}</p>
                              </div>
                              <div className="relative pl-7">
                                <div className="absolute left-[11px] top-1.5 h-2 w-2 rounded-full bg-amber-500 -translate-x-1/2" />
                                <span className="font-bold text-amber-600 block">What Nobody Tells You</span>
                                <p className="text-muted-foreground mt-0.5 leading-relaxed">{voice.nobodyTellsYou}</p>
                              </div>
                              <div className="relative pl-7 flex items-center justify-between pt-1">
                                <div className="absolute left-[11px] top-3.5 h-2 w-2 rounded-full bg-emerald-500 -translate-x-1/2" />
                                <span className="font-bold text-foreground">Would I choose it again?</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  voice.chooseAgain === "Absolutely" 
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                                    : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                                }`}>
                                  {voice.chooseAgain}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mentor Connections */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold text-foreground">
                          Connect With Someone On This Path
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {getMentors(career.id).map((mentor, idx) => (
                          <div key={idx} className="rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.02] p-5 space-y-4 relative">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
                                {mentor.avatar}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-foreground">{mentor.name}</h4>
                                <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">
                                  {mentor.role} @ {mentor.organization}
                                </p>
                              </div>
                            </div>

                            <div className="text-xs leading-relaxed text-muted-foreground pt-1">
                              <span className="font-bold text-foreground block mb-1">Career Journey Summary</span>
                              {mentor.journey}
                            </div>

                            <Button
                              disabled
                              variant="outline"
                              className="w-full h-10 border border-dashed border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/5 disabled:opacity-85 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                            >
                              <Sparkles className="h-3.5 w-3.5" /> Chat Coming Soon
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Action Footer */}
          <div className="border-t border-border bg-background px-6 py-4 flex gap-3">
            {career.simulationAvailable ? (
              <Button
                onClick={handleStartSimulation}
                className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/15"
              >
                {resumePath.includes("intro") || resumePath === `/explore/simulator/${career.id}` ? "Start Simulation" : "Resume Simulation"}
              </Button>
            ) : (
              <Button
                onClick={handleNotifyToggle}
                variant={subscribed ? "outline" : "default"}
                className={`flex-1 h-12 font-semibold rounded-xl transition-all ${
                  subscribed
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
                    : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10"
                }`}
              >
                {subscribed ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Notified!
                  </span>
                ) : (
                  "Get Notified When Simulation Releases"
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
