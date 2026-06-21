"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BookOpen, ChevronRight, Play, 
  RefreshCw, Scale, Award, Rocket, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";

type StoryScene = {
  stage: string;
  milestone: string;
  scenario: string;
  options: {
    id: "a" | "b";
    label: string;
    result: string;
    type: string;
  }[];
};

type Story = {
  id: string;
  title: string;
  tagline: string;
  theme: string;
  icon: React.ReactNode;
  accent: string;
  scenes: StoryScene[];
};

const STORIES: Story[] = [
  {
    id: "lawyer",
    title: "A Day in the Life of a Lawyer",
    tagline: "Navigate high-stakes court preparation, client proposals, and compliance audits.",
    theme: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
    icon: <Scale className="h-6 w-6" />,
    accent: "indigo",
    scenes: [
      {
        stage: "9:00 AM • Court Lobby",
        milestone: "The Missing Signature",
        scenario: "You arrive at court for an urgent injunction hearing, but notice your client's petition is missing a required corporate seal signature.",
        options: [
          {
            id: "a",
            label: "Draft a formal adjournment petition and request a later slot.",
            result: "The judge grants the delay, but the opposing counsel uses this time to execute their transaction, harming your client's leverage.",
            type: "Pragmatic / Safe"
          },
          {
            id: "b",
            label: "Call the registrar directly and argue that the electronic scan is sufficient.",
            result: "The registrar accepts the digital validation. You proceed to argue the hearing successfully and secure the immediate injunction!",
            type: "Bold Maverick"
          }
        ]
      },
      {
        stage: "2:00 PM • Conference Room",
        milestone: "The Settlement Proposal",
        scenario: "The opposing tech giant offers a ₹50 Lakh out-of-court settlement. Your client wants to accept, but you suspect a trial would set a landmark precedent.",
        options: [
          {
            id: "a",
            label: "Respect the client's financial anxiety and sign the settlement.",
            result: "Your client leaves with guaranteed cash, but the system continues unregulated, missing a huge public policy shift.",
            type: "Client-First Diplomat"
          },
          {
            id: "b",
            label: "Expose corporate audit logs to push the client toward a public trial.",
            result: "Your client agrees. After a intense trial, you win the landmark case, setting an industry-wide privacy policy precedent!",
            type: "Public Advocate"
          }
        ]
      },
      {
        stage: "7:00 PM • Office Desks",
        milestone: "The Compliance Audit",
        scenario: "You are auditing a client's 500-page corporate acquisition file. It's late and you find a minor undisclosed liability clause.",
        options: [
          {
            id: "a",
            label: "Stay overnight to investigate the exact liability extent.",
            result: "You trace the liability to an off-shore account, saving your client from a subsequent ₹10 Crore federal tax penalty.",
            type: "Systems Auditor"
          },
          {
            id: "b",
            label: "Delegate the audit verification to a junior associate.",
            result: "The associate overlooks the liability. The merger closes, but a tax audit discovery months later leads to massive regulatory fines.",
            type: "Routine Delegator"
          }
        ]
      }
    ]
  },
  {
    id: "fashion",
    title: "A Week as a Fashion Designer",
    tagline: "Balancing design aesthetics, strict manufacturing budgets, and runway deadlines.",
    theme: "bg-pink-500/10 border-pink-500/20 text-pink-600",
    icon: <Award className="h-6 w-6" />,
    accent: "pink",
    scenes: [
      {
        stage: "Day 1 • Design Studio",
        milestone: "The Material Dilemma",
        scenario: "Your sketch for the Lakme Fashion Week show features pure mulberry silk, but the cost per meter exceeds your collection budget by 40%.",
        options: [
          {
            id: "a",
            label: "Substitute the silk with a premium recycled polyester-satin blend.",
            result: "Costs drop by half, keeping you within budget. The fabric drapes well, but lacks the organic texture of real silk.",
            type: "Commercial realist"
          },
          {
            id: "b",
            label: "Simplify the design silhouettes to use less yardage of pure silk.",
            result: "You retain the premium silk texture, but the simplified design loses some runway drama.",
            type: "Aesthetic purist"
          }
        ]
      },
      {
        stage: "Day 3 • Factory Floor",
        milestone: "The Production Delay",
        scenario: "Your local dye house suffers a power grid outage, delaying your custom indigo fabric print by 3 critical days.",
        options: [
          {
            id: "a",
            label: "Pay double to route printing to a backup facility in Delhi.",
            result: "You keep the schedule intact, but the emergency spend wipes out your initial marketing budget.",
            type: "Schedule-First Executor"
          },
          {
            id: "b",
            label: "Delay the launch preview and release a teaser campaign instead.",
            result: "The teaser builds online curiosity, but buyers are frustrated that order books are closed.",
            type: "Marketing Opportunist"
          }
        ]
      },
      {
        stage: "Day 5 • The Runway",
        milestone: "The Creative Statement",
        scenario: "It is showtime. Opposing designers play safe with traditional styles. You must decide on the final showstopper look.",
        options: [
          {
            id: "a",
            label: "Showcase a highly commercial traditional lehenga.",
            result: "Buyers place immediate wholesale orders, securing solid cash flow but neutral press coverage.",
            type: "Sales Optimist"
          },
          {
            id: "b",
            label: "Launch an avant-garde sustainable-wear made from ocean plastics.",
            result: "The press goes wild, naming you the 'Innovative Designer of the Year'. Orders follow from premium global boutiques!",
            type: "Sustainable Pioneer"
          }
        ]
      }
    ]
  },
  {
    id: "founder",
    title: "From Grade 10 to Startup Founder",
    tagline: "Experience stream selection, validation testing, and seed funding pitches.",
    theme: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    icon: <Rocket className="h-6 w-6" />,
    accent: "emerald",
    scenes: [
      {
        stage: "Grade 10 • Stream Selection",
        milestone: "The Foundation Path",
        scenario: "You are planning your high school subjects. You want to build a tech startup eventually.",
        options: [
          {
            id: "a",
            label: "Take Science (PCM) to master coding logic and data science math.",
            result: "You build deep technical roots. You can write custom ML systems yourself, but have to learn marketing on the fly.",
            type: "Technical Architect"
          },
          {
            id: "b",
            label: "Take Commerce/Arts to focus on accounting, economics, and pitch writing.",
            result: "You easily master cash flow ledgers and sales storytelling, but must hire external developers to build your code.",
            type: "Business Strategist"
          }
        ]
      },
      {
        stage: "College • Product MVP",
        milestone: "Market Validation",
        scenario: "You have an idea for a local courier logistics app. You need to validate the demand.",
        options: [
          {
            id: "a",
            label: "Spend 4 months building a fully featured Android app in private.",
            result: "You launch a robust app, but realize customers actually prefer a simple WhatsApp coordinate flow.",
            type: "Developer Purist"
          },
          {
            id: "b",
            label: "Launch a WhatsApp group pilot with local shops within 2 days.",
            result: "You process 100 deliveries manually in a week. You prove the demand immediately with zero code budget!",
            type: "Lean Operator"
          }
        ]
      },
      {
        stage: "Post-Grad • VC Pitch",
        milestone: "The Valuation Choice",
        scenario: "Your startup cash is running out. A venture capitalist offers ₹40 Lakhs for a massive 30% equity cut.",
        options: [
          {
            id: "a",
            label: "Accept the funding to secure runway and hire engineers.",
            result: "The business survives, but you lose strategic control. The VC pushes for aggressive quarterly growth targets.",
            type: "Capital Leverager"
          },
          {
            id: "b",
            label: "Reject the offer, and fund operations by doing freelance consulting.",
            result: "You keep 100% control and bootstrap slowly, growing organically based on actual customer revenues.",
            type: "Bootstrapped Maverick"
          }
        ]
      }
    ]
  }
];

export default function StoryPage() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<"a" | "b" | null>(null);
  const [storyAnswers, setStoryAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  function handleStartStory(story: Story) {
    setActiveStory(story);
    setSceneIdx(0);
    setSelectedOpt(null);
    setStoryAnswers([]);
    setCompleted(false);
  }

  function handleSelectOption(optId: "a" | "b", choiceType: string) {
    if (selectedOpt !== null) return;
    setSelectedOpt(optId);
    setStoryAnswers(prev => [...prev, choiceType]);
  }

  function handleNext() {
    setSelectedOpt(null);
    if (activeStory && sceneIdx < activeStory.scenes.length - 1) {
      setSceneIdx(sceneIdx + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleExit() {
    setActiveStory(null);
  }

  return (
    <AppShell className="space-y-6 pb-20">
      {!activeStory ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
              Career Story Mode
            </h1>
            <div className="w-9 h-9" aria-hidden />
          </div>

          {/* Intro Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Immersive Roleplay Journeys</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Step into high-fidelity roleplay timelines. Experience daily pressures, make critical decisions, and review the professional outcomes of your choices.
            </p>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {STORIES.map(story => (
              <div 
                key={story.id} 
                className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border ${story.theme}`}>
                    {story.icon}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground">
                      {story.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">
                      {story.tagline}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleStartStory(story)}
                  className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-xl text-xs gap-1.5"
                >
                  <Play className="h-4 w-4 fill-primary-foreground" /> Begin Journey
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Header in Story */}
          <div className="flex items-center justify-between">
            <button onClick={handleExit} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold truncate max-w-[200px]">
              {activeStory.title}
            </h1>
            <div className="w-9 h-9" aria-hidden />
          </div>

          {!completed ? (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Milestone {sceneIdx + 1} of 3</span>
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${activeStory.accent}-500 transition-all duration-300`} 
                    style={{ 
                      width: `${((sceneIdx + 1) / 3) * 100}%`,
                      backgroundColor: activeStory.accent === "indigo" ? "#6366f1" : activeStory.accent === "pink" ? "#ec4899" : "#10b981"
                    }}
                  />
                </div>
              </div>

              {/* Scene Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                    {activeStory.scenes[sceneIdx].stage}
                  </span>
                  <h2 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground mt-1">
                    {activeStory.scenes[sceneIdx].milestone}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {activeStory.scenes[sceneIdx].scenario}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {activeStory.scenes[sceneIdx].options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id, opt.type)}
                      className={`w-full text-left rounded-2xl border p-4 text-xs leading-relaxed transition-all duration-200 ${
                        selectedOpt === opt.id
                          ? "border-primary bg-primary/5 font-semibold text-foreground shadow-sm shadow-primary/5"
                          : selectedOpt !== null
                            ? "opacity-55 border-border bg-muted/20 text-muted-foreground"
                            : "border-border hover:border-primary/30 hover:bg-primary/[0.01]"
                      }`}
                    >
                      <span className="font-bold text-primary mr-2 uppercase">{opt.id}.</span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Scenario Outcome Result */}
                {selectedOpt !== null && (
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-1">
                    <span className="text-[9px] font-bold uppercase text-primary tracking-wider block">Decision Consequence</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activeStory.scenes[sceneIdx].options.find(o => o.id === selectedOpt)?.result}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Action Button */}
              {selectedOpt !== null && (
                <Button onClick={handleNext} className="w-full h-12 rounded-xl font-bold text-xs shadow-md shadow-primary/20">
                  {sceneIdx < 2 ? "Proceed to Next Milestone" : "View Final Timeline Outcome"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Final Story Debrief Screen */}
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
                  Story Journey Completed!
                </h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You have navigated the timeline successfully. Here is your style output.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Your Core Decision Path</span>
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-primary mt-1">
                    {storyAnswers[2] || "Innovative Leader"}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                    Your sequence of decisions reveals a strong alignment with **{storyAnswers[2]}** methods. Throughout the milestones, you balanced constraints using **{storyAnswers[0]}** foundations and **{storyAnswers[1]}** tactics.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/40 text-xs">
                  <span className="font-bold text-foreground block">Milestone Highlights</span>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Milestone 1 choice:</span>
                      <span className="font-semibold text-foreground">{storyAnswers[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milestone 2 choice:</span>
                      <span className="font-semibold text-foreground">{storyAnswers[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milestone 3 choice:</span>
                      <span className="font-semibold text-foreground">{storyAnswers[2]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Button onClick={() => handleStartStory(activeStory)} className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-xl text-xs gap-1.5 shadow-md shadow-primary/20">
                  <RefreshCw className="h-4 w-4" /> Restart Story
                </Button>
                <Button onClick={handleExit} variant="outline" className="h-12 px-6 rounded-xl text-xs text-muted-foreground">
                  Exit Story Mode
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
