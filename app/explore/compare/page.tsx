"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  Bot,
  Sparkles,
  Plus,
  X,
  GraduationCap,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  Heart,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { getGuestProfile } from "@/lib/profile-storage";
import { analyzeProfile, type CareerRecommendation } from "@/lib/results-engine";
import { cn } from "@/lib/utils";
import { MotionFadeIn } from "@/components/shared/motion";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeSelectSlot, setActiveSelectSlot] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Load selected IDs from query param on mount
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const splitIds = idsParam.split(",").filter(id => CAREER_LIBRARY.some(c => c.id === id));
      setSelectedIds(splitIds.slice(0, 3)); // V13: Limit to 3 side-by-side
    } else {
      setSelectedIds(["software-engineer", "data-scientist", "product-manager"]); // default comparison (3 slots)
    }

    // Load recommendations if profile is complete
    const profile = getGuestProfile();
    if (profile.onboardingCompleted && profile.scienceCompleted && profile.sweCompleted) {
      setProfileCompleted(true);
      const res = analyzeProfile(profile);
      setRecommendations(res.careerRecommendations);
    }
  }, [searchParams]);

  // Sync URL with selected IDs
  const updateUrl = (ids: string[]) => {
    setSelectedIds(ids);
    const newParams = new URLSearchParams(searchParams.toString());
    if (ids.length > 0) {
      newParams.set("ids", ids.join(","));
    } else {
      newParams.delete("ids");
    }
    router.replace(`/explore/compare?${newParams.toString()}`);
  };

  const handleRemove = (idToRemove: string) => {
    const next = selectedIds.filter(id => id !== idToRemove);
    updateUrl(next);
  };

  const handleAdd = (idToAdd: string, slotIdx: number) => {
    const next = [...selectedIds];
    if (slotIdx < next.length) {
      next[slotIdx] = idToAdd;
    } else {
      next.push(idToAdd);
    }
    updateUrl(next);
    setActiveSelectSlot(null);
  };

  const careers = [
    CAREER_LIBRARY.find(c => c.id === selectedIds[0]),
    CAREER_LIBRARY.find(c => c.id === selectedIds[1]),
    CAREER_LIBRARY.find(c => c.id === selectedIds[2])
  ].filter((c): c is NonNullable<typeof c> => c !== undefined);

  const getMatchScore = (id: string) => {
    const match = recommendations.find(r => r.careerId === id);
    return match ? match.matchScore : null;
  };

  const availableCareers = CAREER_LIBRARY.filter(
    c => !selectedIds.includes(c.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full flex items-center justify-center">
          <Link href="/explore">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Scale className="h-3.5 w-3.5" /> Future Paths Analyst
          </div>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mt-0.5">
            Compare Career Paths
          </h1>
        </div>
      </div>

      {/* Grid Comparison Cards with mobile swiping support */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-4 px-1">
        {[0, 1, 2].map((slotIdx) => {
          const career = slotIdx === 0 ? careers[0] : slotIdx === 1 ? careers[1] : careers[2];
          const matchScore = career ? getMatchScore(career.id) : null;

          return (
            <div key={slotIdx} className="w-[280px] md:w-auto shrink-0 md:shrink snap-center space-y-4">
              {career ? (
                <div className="relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[280px]">
                  {/* Close btn */}
                  <button
                    onClick={() => handleRemove(career.id)}
                    className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex-1 space-y-3 min-w-0">
                    <div>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase",
                        career.stream === "Science" && "bg-sky-500/10 text-sky-600 border-sky-500/20 border",
                        career.stream === "Commerce" && "bg-amber-500/10 text-amber-600 border-amber-500/20 border",
                        career.stream === "Arts" && "bg-purple-500/10 text-purple-600 border-purple-500/20 border",
                        career.stream === "Vocational" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border"
                      )}>
                        {career.stream}
                      </span>
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground mt-2 truncate pr-6">
                        {career.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                        {career.shortDesc}
                      </p>
                    </div>

                    {/* Recommendation Tag */}
                    {profileCompleted && matchScore && (
                      <div className="inline-flex items-center gap-1 rounded-xl bg-primary/10 border border-primary/20 px-2.5 py-1">
                        <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-[11px] font-extrabold text-primary">
                          {matchScore}% Match
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/60 pt-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase">Salary (India Mid)</span>
                      <span className="font-bold text-foreground">{career.indiaSalary.mid}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSelectSlot(slotIdx)}
                      className="h-8 text-[11px] font-semibold text-primary hover:text-primary/80 px-2"
                    >
                      Swap <ChevronDown className="h-3 w-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative h-[280px] rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center p-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-muted-foreground">
                    <Plus className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-foreground">Add Career</p>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-normal max-w-[120px]">
                    Compare paths side-by-side.
                  </p>
                  <button
                    onClick={() => setActiveSelectSlot(slotIdx)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    aria-label="Add career slot"
                  />
                </div>
              )}

              {/* Slot-specific Dropdown List */}
              <AnimatePresence>
                {activeSelectSlot === slotIdx && (
                  <div className="relative z-20">
                    <div
                      className="fixed inset-0 bg-black/10 backdrop-blur-[1px]"
                      onClick={() => setActiveSelectSlot(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-lg p-1 space-y-0.5 z-30"
                    >
                      <p className="text-[9px] font-bold text-muted-foreground uppercase px-2.5 py-1.5 border-b border-border/50">
                        Select career to compare
                      </p>
                      {availableCareers.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleAdd(c.id, slotIdx)}
                          className="w-full text-left rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex justify-between items-center"
                        >
                          <span>{c.title}</span>
                          <span className="text-[10px] text-muted-foreground opacity-85 uppercase">{c.stream}</span>
                        </button>
                      ))}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Comparative Matrix */}
      {careers.length >= 2 ? (
        <MotionFadeIn delay={0.15} className="space-y-6">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-sm uppercase tracking-wider text-muted-foreground pt-4 border-t border-border/60">
            Side-By-Side Parameters
          </h2>

          {/* 1. BEST FOR & OUTLOOK DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careers.map((career) => (
              <div key={career.id} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
                <div className="text-xs font-black text-foreground flex items-center gap-1.5 border-b border-border pb-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>{career.title} Overview</span>
                </div>
                <div className="space-y-2.5 text-[11px] leading-relaxed">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Best For</span>
                    <p className="text-foreground mt-0.5">{career.comparisonParams.bestFor}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Typical Day</span>
                    <p className="text-foreground mt-0.5">{career.comparisonParams.typicalDay}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Future Outlook</span>
                    <p className="text-foreground mt-0.5">{career.comparisonParams.futureOutlook}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2. SALARY MATRIX (India & Global) */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground border-b border-border/40 pb-2">
              <BriefcaseBusiness className="h-4 w-4 text-primary" /> Salary Valuation Compared
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {careers.map((career) => (
                <div key={career.id} className="space-y-3">
                  <span className="text-xs font-bold text-foreground block">{career.title}</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/20 text-center">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase block">India Mid</span>
                      <span className="text-xs font-black text-primary block mt-0.5">{career.indiaSalary.mid}</span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/20 text-center">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase block">Global Mid</span>
                      <span className="text-xs font-black text-emerald-600 block mt-0.5">{career.globalSalary.mid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Annual Mid-career brackets in LPA (Indian rupee) and USD (Global dollar) scales.
            </p>
          </div>

          {/* 3. WORK LIFE BALANCE & REMOTE VIABILITY */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground border-b border-border/40 pb-2">
              <Heart className="h-4 w-4 text-primary" /> Work-Life Balance & Remote Viability
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {careers.map((career) => (
                <div key={career.id} className="space-y-3">
                  <span className="text-xs font-bold text-foreground block">{career.title}</span>
                  <div className="space-y-2.5">
                    {/* WLB Rating */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold">
                        <span className="text-muted-foreground">WLB Score:</span>
                        <span className="text-foreground font-black">{career.comparisonParams.workLifeBalance} / 10</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-sky-500"
                          style={{ width: `${career.comparisonParams.workLifeBalance * 10}%` }}
                        />
                      </div>
                    </div>
                    {/* Remote Tag */}
                    <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/20 text-xs">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Remote opportunities:</span>
                      <span className="font-extrabold text-primary flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {career.comparisonParams.remoteOpportunities}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. AI AUTOMATION THREAT */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground border-b border-border/40 pb-2">
              <Bot className="h-4 w-4 text-primary" /> AI Automation Threat & Strategy
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careers.map((career) => (
                <div key={career.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">{career.title}</span>
                    <span className={cn(
                      "font-black uppercase text-[10px]",
                      career.aiImpact.level === "Low" && "text-emerald-600",
                      career.aiImpact.level === "Medium" && "text-amber-600",
                      career.aiImpact.level === "High" && "text-red-600"
                    )}>
                      {career.aiImpact.automationRisk}% {career.aiImpact.level}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        career.aiImpact.level === "Low" && "bg-emerald-500",
                        career.aiImpact.level === "Medium" && "bg-amber-500",
                        career.aiImpact.level === "High" && "bg-red-500"
                      )}
                      style={{ width: `${career.aiImpact.automationRisk}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {career.aiImpact.summary}
                  </p>
                  <p className="text-[10px] text-primary/80 leading-relaxed italic bg-primary/5 p-2 rounded-lg border border-primary/10">
                    💡 **Strategy:** {career.aiImpact.strategy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDUCATION COST & ACCESSIBILITY */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground border-b border-border/40 pb-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Educational Pathways & Flex
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careers.map((career) => (
                <div key={career.id} className="space-y-3 text-xs">
                  <span className="font-bold text-foreground">{career.title}</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-muted/40 p-2 rounded-xl border border-border/20">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Education Cost:</span>
                      <span className={cn(
                        "font-extrabold px-2 py-0.5 rounded text-[10px]",
                        career.comparisonParams.educationCost === "Low" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                        career.comparisonParams.educationCost === "Medium" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                        career.comparisonParams.educationCost === "High" && "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>
                        {career.comparisonParams.educationCost}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/40 p-2 rounded-xl border border-border/20">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Flexibility:</span>
                      <span className="font-extrabold text-foreground">{career.comparisonParams.flexibility}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground block uppercase">Degree Paths</span>
                      <p className="text-[11px] text-foreground mt-0.5 leading-relaxed">
                        {career.degreePaths.undergrad.join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. GIG & STARTUP VIABILITY */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-foreground border-b border-border/40 pb-2">
              <Zap className="h-4 w-4 text-primary" /> Freelance & Startup Viability
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {careers.map((career) => (
                <div key={career.id} className="space-y-3">
                  <span className="font-bold text-foreground">{career.title}</span>
                  <div className="space-y-2.5 text-[11px] leading-relaxed">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground block">Freelance Viability</span>
                        <span className="font-bold text-primary">{career.freelanceOpportunities.viability}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{career.freelanceOpportunities.insights}</p>
                    </div>
                    <div className="border-t border-border/30 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground block">Startup Viability</span>
                        <span className="font-bold text-emerald-600">{career.entrepreneurshipOpportunities.viability}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{career.entrepreneurshipOpportunities.insights}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </MotionFadeIn>
      ) : (
        <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-muted/10">
          <p className="text-sm font-semibold text-foreground">Add careers to compare parameters</p>
          <p className="text-xs text-muted-foreground mt-1">Select careers from the top slots to start side-by-side analysis.</p>
        </div>
      )}
    </div>
  );
}

export default function CompareCareersPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <CompareContent />
      </Suspense>
    </AppShell>
  );
}
