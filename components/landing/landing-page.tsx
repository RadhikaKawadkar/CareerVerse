"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Code2, FlaskConical, Sparkles, RefreshCw, 
  LayoutDashboard, User, Gamepad2, Brain, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/landing-header";
import { MotionFadeIn, MotionStagger, MotionStaggerItem } from "@/components/shared/motion";
import { easeOut } from "@/lib/motion";
import { useState, useEffect } from "react";
import { getGuestProfile, clearGuestProfile } from "@/lib/profile-storage";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { type GuestProfile } from "@/types/profile";

const benefits = [
  {
    icon: FlaskConical,
    title: "Sample a Science Moment",
    description: "Try a short, interactive Physics moment with live observations and immediate calibration feedback.",
    accent: "from-sky-500/10 to-indigo-500/5 hover:border-sky-500/30",
    iconColor: "text-sky-500",
  },
  {
    icon: Code2,
    title: "Roleplay as a Developer",
    description: "Step into real-world software engineering scenarios. Make decisions on bug trade-offs, architecture, and sprint blockages.",
    accent: "from-emerald-500/10 to-indigo-500/5 hover:border-emerald-500/30",
    iconColor: "text-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Career DNA Insights",
    description: "See how your behavioral choices map to active fields. Receive a comprehensive match summary outlining strengths.",
    accent: "from-amber-500/10 to-indigo-500/5 hover:border-amber-500/30",
    iconColor: "text-amber-500",
  },
];

const steps = [
  { step: "01", label: "Try Stream Lessons", detail: "Sample interactive mini-curriculums to test subject compatibility." },
  { step: "02", label: "Simulate Real Careers", detail: "Take decisions with real emotional and workplace consequences." },
  { step: "03", label: "Decode Your DNA", detail: "Walk away with quantitative insights built on your simulated trials." },
];

export function LandingPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [exploredList, setExploredList] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const prof = getGuestProfile();
    setProfile(prof);
    
    const storedExplored = localStorage.getItem("explored-careers");
    if (storedExplored) {
      try {
        setExploredList(JSON.parse(storedExplored));
      } catch {
        // ignore
      }
    }
  }, []);

  const isReturningUser = isClient && profile && profile.onboardingCompleted;

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-24 sm:pb-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      {/* Background gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-gradient-to-b from-primary/5 via-violet-500/2 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-violet-500/10 via-primary/5 to-orange-500/10 blur-[100px] rounded-full"
      />

      <LandingHeader />

      <main className="relative z-10">
        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {isReturningUser ? (
              <>
                <MotionFadeIn delay={0.05}>
                  <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-bold text-emerald-600 shadow-sm gap-1.5 animate-pulse">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Welcome back to your dashboard
                  </div>
                </MotionFadeIn>

                <MotionFadeIn delay={0.12}>
                  <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl leading-tight sm:text-6xl font-black tracking-tight text-slate-900">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-primary via-violet-600 to-orange-500 bg-clip-text text-transparent">
                      {profile.firstName}!
                    </span>
                  </h1>
                </MotionFadeIn>

                <MotionFadeIn delay={0.2}>
                  <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Ready to resume your path discovery? Let&apos;s check where you left off.
                  </p>
                </MotionFadeIn>

                {/* Resume / Progress status */}
                <MotionFadeIn delay={0.25} className="mt-10 mx-auto max-w-xl bg-card/60 backdrop-blur-md border border-border/80 rounded-[2rem] p-8 text-left shadow-xl space-y-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">Your Active Exploration Paths</span>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background/50 border border-border/40 rounded-2xl text-xs sm:text-sm">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">1. Physics Stream Trial</span>
                        <span className="text-[10px] text-muted-foreground block">Subject calibration & stream choice helper</span>
                      </div>
                      {profile.scienceCompleted ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">Completed</span>
                      ) : profile.scienceStatus === "in_progress" ? (
                        <Link href="/explore/science/intro" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-xl transition-all">Resume</Link>
                      ) : (
                        <Link href="/explore/science/intro" className="text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl transition-all">Start</Link>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background/50 border border-border/40 rounded-2xl text-xs sm:text-sm">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">2. Software Engineer Simulation</span>
                        <span className="text-[10px] text-muted-foreground block">Agile team workflow & logic choices</span>
                      </div>
                      {profile.sweCompleted ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">Completed</span>
                      ) : profile.sweStatus === "in_progress" ? (
                        <Link href="/explore/software-engineer/intro" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-xl transition-all">Resume</Link>
                      ) : (
                        <Link href="/explore/software-engineer/intro" className="text-xs font-bold text-muted-foreground bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl transition-all">Start</Link>
                      )}
                    </div>
                  </div>

                  {profile.scienceCompleted && profile.sweCompleted ? (
                    <div className="pt-4 border-t border-border/40">
                      <Button asChild className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/95 transition-all shadow-md shadow-primary/15">
                        <Link href="/results">
                          View Final Insights Report
                          <Sparkles className="ml-1.5 h-4.5 w-4.5 text-primary-foreground fill-primary-foreground animate-pulse" />
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </MotionFadeIn>

                {/* Explored Careers list */}
                {exploredList.length > 0 && (
                  <MotionFadeIn delay={0.3} className="mt-10 text-left max-w-xl mx-auto space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground text-center block">Recently Explored Careers</span>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      {exploredList.slice(0, 4).map((careerId) => {
                        const career = CAREER_LIBRARY.find((c) => c.id === careerId);
                        if (!career) return null;
                        return (
                          <Link
                            key={careerId}
                            href={`/explore?careerId=${careerId}`}
                            className="flex items-center justify-between p-4 bg-card/65 border border-border/60 rounded-2xl hover:border-primary/30 hover:bg-primary/[0.01] hover:scale-[1.01] transition-all group"
                          >
                            <div className="truncate">
                              <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">{career.title}</span>
                              <span className="text-[9px] text-muted-foreground block truncate mt-0.5">{career.category} • {career.stream}</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  </MotionFadeIn>
                )}

                {/* Actions for returning user */}
                <MotionFadeIn delay={0.35} className="mt-12 flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="h-12 w-full px-8 text-sm font-bold sm:w-auto rounded-2xl">
                    <Link href="/explore">
                      Go to Explore Hub
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 w-full px-8 text-sm font-bold sm:w-auto rounded-2xl">
                    <Link href="/explore/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                      View Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Are you sure you want to reset your progress and onboarding? This cannot be undone.")) {
                        clearGuestProfile();
                        window.location.reload();
                      }
                    }}
                    className="h-12 w-full text-muted-foreground hover:text-rose-600 hover:bg-rose-500/5 sm:w-auto flex items-center justify-center gap-2 rounded-2xl"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Journey
                  </Button>
                </MotionFadeIn>
              </>
            ) : (
              <>
                <MotionFadeIn delay={0.05}>
                  <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
                    Interactive Stream & Career Discovery for Grades 8-12
                  </div>
                </MotionFadeIn>

                <MotionFadeIn delay={0.12}>
                  <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl leading-tight sm:text-6xl font-black tracking-tight text-slate-950">
                    Experience your future <br />
                    <span className="bg-gradient-to-r from-primary via-violet-600 to-orange-500 bg-clip-text text-transparent">
                      before you choose it.
                    </span>
                  </h1>
                </MotionFadeIn>

                <MotionFadeIn delay={0.2}>
                  <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Step into roles. Resolve realistic challenges. Connect stream choices to professional environments—without writing code or reading lectures.
                  </p>
                </MotionFadeIn>

                <MotionFadeIn delay={0.28} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Button asChild size="lg" className="h-12 w-full px-8 text-sm font-bold sm:w-auto rounded-2xl shadow-lg shadow-primary/15">
                      <Link href="/onboarding/1">
                        Start Exploring
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Button asChild variant="outline" size="lg" className="h-12 w-full sm:w-auto rounded-2xl">
                      <a href="#how-it-works">See how it works</a>
                    </Button>
                  </motion.div>
                </MotionFadeIn>

                {/* Workflow SaaS Interactive Graphic (Inspired by n8n workflow canvas) */}
                <MotionFadeIn delay={0.35} className="mt-16 sm:mt-24">
                  <div className="relative rounded-[2.5rem] border border-border bg-card/75 backdrop-blur-md p-8 sm:p-12 shadow-2xl overflow-hidden max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-80" />
                    
                    <span className="text-[10px] font-extrabold tracking-widest text-primary uppercase block mb-8">System Architecture Flow</span>
                    
                    {/* Visual Nodes Connected by SVG lines */}
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 z-10">
                      
                      {/* Node 1: Student */}
                      <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer w-32 shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border group-hover:border-primary/40 group-hover:shadow-lg transition-all shadow-sm">
                          <User className="h-6 w-6 text-slate-700 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">1. Student Profile</span>
                        <span className="text-[9px] text-muted-foreground">Calibrate Grade & Goals</span>
                      </div>

                      <div className="h-6 w-0.5 md:h-0.5 md:w-full bg-border/80 relative flex items-center justify-center shrink-0">
                        <div className="absolute h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      </div>

                      {/* Node 2: Simulation */}
                      <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer w-32 shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border group-hover:border-violet-500/40 group-hover:shadow-lg transition-all shadow-sm">
                          <Gamepad2 className="h-6 w-6 text-slate-700 group-hover:text-violet-600 transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">2. Career Sim</span>
                        <span className="text-[9px] text-muted-foreground">Agile Sprints & Trials</span>
                      </div>

                      <div className="h-6 w-0.5 md:h-0.5 md:w-full bg-border/80 relative flex items-center justify-center shrink-0">
                        <div className="absolute h-1.5 w-1.5 rounded-full bg-violet-500 animate-ping" style={{ animationDelay: "0.2s" }} />
                      </div>

                      {/* Node 3: DNA */}
                      <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer w-32 shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border group-hover:border-emerald-500/40 group-hover:shadow-lg transition-all shadow-sm">
                          <Brain className="h-6 w-6 text-slate-700 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">3. Career DNA</span>
                        <span className="text-[9px] text-muted-foreground">Behavioral Matching</span>
                      </div>

                      <div className="h-6 w-0.5 md:h-0.5 md:w-full bg-border/80 relative flex items-center justify-center shrink-0">
                        <div className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" style={{ animationDelay: "0.4s" }} />
                      </div>

                      {/* Node 4: Mentor */}
                      <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer w-32 shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border group-hover:border-orange-500/40 group-hover:shadow-lg transition-all shadow-sm">
                          <Sparkles className="h-6 w-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">4. AI Guidance</span>
                        <span className="text-[9px] text-muted-foreground">Personalized Mentor</span>
                      </div>

                      <div className="h-6 w-0.5 md:h-0.5 md:w-full bg-border/80 relative flex items-center justify-center shrink-0">
                        <div className="absolute h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" style={{ animationDelay: "0.6s" }} />
                      </div>

                      {/* Node 5: Path */}
                      <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer w-32 shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-primary group-hover:shadow-lg transition-all shadow-sm">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">5. Career Path</span>
                        <span className="text-[9px] text-muted-foreground">Your Plan Decoded</span>
                      </div>

                    </div>
                  </div>
                </MotionFadeIn>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <MotionFadeIn>
            <div className="rounded-[2.5rem] border border-border bg-card/45 backdrop-blur-sm relative overflow-hidden p-8 sm:p-12">
              <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-primary via-violet-600 to-orange-500" />
              <div className="pl-6 sm:pl-10 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  The Problem
                </span>
                <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-slate-900 leading-snug sm:text-3xl">
                  Everyone has an opinion about your career pathway.
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base max-w-3xl">
                  But advice is cheap. What if you could test-drive those paths first? We build sandbox simulations representing standard workflows of developers, designers, and managers so you decide based on active experience.
                </p>
                <div className="mt-6 rounded-2xl border border-border/80 bg-background/50 px-5 py-4 text-xs leading-relaxed text-slate-600 max-w-2xl">
                  <strong>Example:</strong> Scoring 95% in Grade 10 results in recommendations for CSE/JEE. But do you actually enjoy debugging sprint blockers or estimating server latency? CareerVerse lets you try it before committing years.
                </div>
              </div>
            </div>
          </MotionFadeIn>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20">
          <MotionFadeIn className="mb-12 text-center space-y-2">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-black text-slate-950">How CareerVerse Works</h2>
            <p className="text-sm text-muted-foreground">Three steps. Around 15 minutes. Pure clarity.</p>
          </MotionFadeIn>

          <MotionStagger className="grid gap-6 sm:grid-cols-3">
            {steps.map((item) => (
              <MotionStaggerItem key={item.step}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-md p-8 text-center space-y-3 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-4xl font-black text-primary/25 block">{item.step}</span>
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold text-slate-900">{item.label}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                </motion.div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-24">
          <MotionFadeIn className="mb-12 text-center space-y-2">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-black text-slate-950">What You&apos;ll Experience</h2>
            <p className="text-sm text-muted-foreground">
              No forms, no grades check. Just interactive, scenario-driven choices.
            </p>
          </MotionFadeIn>

          <MotionStagger className="grid gap-6 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <MotionStaggerItem key={benefit.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-br ${benefit.accent} p-4 shadow-sm border border-border/20`}
                    >
                      <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold text-slate-900">{benefit.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28">
          <MotionFadeIn>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-violet-600 to-indigo-950 p-10 text-center shadow-xl shadow-primary/20 sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
              />
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl text-white sm:text-4xl font-black tracking-tight">
                Ready to find your path?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-white/80 sm:text-sm">
                Unlock career matching based on behavioral choices. Discover what fits you best with structured sandboxes.
              </p>
              <motion.div
                className="mt-8 inline-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-0 bg-white px-8 text-sm font-bold text-primary shadow-lg hover:bg-slate-50 transition-all rounded-2xl"
                >
                  <Link href="/onboarding/1">
                    Start Exploring
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </MotionFadeIn>
        </section>
      </main>

      <footer className="border-t border-border/60 py-12 bg-white/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black">
            Career<span className="text-primary">Verse</span>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Experience your future before you choose it. Built for grade 8-12 discovery.
          </p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareerVerse</p>
        </div>
      </footer>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: easeOut }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/90 p-4 backdrop-blur-md sm:hidden"
      >
        <Button asChild className="h-12 w-full rounded-2xl">
          <Link href={isReturningUser ? "/explore" : "/onboarding/1"}>
            {isReturningUser ? "Go to Explore Hub" : "Start Exploring"}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
