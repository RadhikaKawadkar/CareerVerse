"use client";

import Link from "next/link";
import { 
  ArrowLeft, Compass, Users, Sparkles, MessageSquare, 
  Star, HelpCircle 
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";

const FUTURE_FEATURES = [
  {
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    title: "Vetted Mentor Network",
    description: "Scheduled 1-on-1 virtual chat office hours with verified professionals working at leading companies like Google, Fortis, and Khaitan & Co.",
    badge: "Coming Q3"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-pink-500" />,
    title: "Real Student Conversations",
    description: "Peer-to-peer discussion message board threads organized by specific stream paths. Ask questions, validate choices, and share study strategies.",
    badge: "Beta Phase"
  },
  {
    icon: <Star className="h-6 w-6 text-amber-500" />,
    title: "Alumni Stories",
    description: "Deep dive video timelines tracing exactly how previous high school students chose their colleges, prepped for entrance exams, and landed internships.",
    badge: "In Production"
  },
  {
    icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
    title: "AI Career Coach v2",
    description: "An intelligent, real-time voice counselor that conducts mock placement interviews and provides audio feedback on your communication style.",
    badge: "R&D Lab"
  },
  {
    icon: <Compass className="h-6 w-6 text-sky-500" />,
    title: "Community Group Challenges",
    description: "Join weekly mini projects (like designing a mockup landing page, pitching a mock startup model, or analyzing a legal scenario case) with other students.",
    badge: "Releasing Soon"
  }
];

export default function FutureVisionPage() {
  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Future Vision Center
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Hero */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-primary/5 via-violet-500/[0.02] to-transparent">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
          <Compass className="h-5 w-5 text-primary animate-pulse" />
          <span>Intelligent Career Discovery Hub</span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-extrabold text-foreground">
          What is next for CareerVerse?
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We are building more than a static catalog. Our vision is to create an interconnected community of students, mentors, and resources to remove career anxiety. Here is what is currently in active development.
        </p>
      </div>

      {/* Feature Timeline Grid */}
      <div className="space-y-4 pt-2">
        {FUTURE_FEATURES.map((feat, idx) => (
          <MotionFadeIn key={idx} delay={idx * 0.05}>
            <div className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-primary/20 transition-all duration-200 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/60 border border-border flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground">
                      {feat.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  {feat.badge}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </div>
          </MotionFadeIn>
        ))}
      </div>

      {/* Community Question */}
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-6 text-center space-y-3">
        <HelpCircle className="h-8 w-8 text-muted-foreground/45 mx-auto" />
        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground">
          Have an idea for a feature?
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          We love listening to student feedback. If you want us to add a specific simulation or stream lesson, click below to tell us!
        </p>
        <a 
          href="mailto:features@careerverse.app?subject=CareerVerse Feedback"
          className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
        >
          Submit Suggestion
        </a>
      </div>
    </AppShell>
  );
}
