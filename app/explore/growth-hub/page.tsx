"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BrainCircuit, Lock, Unlock, Award, Play, ChevronRight, Target, CheckCircle2
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { addXp, unlockBadge } from "@/lib/gamification";
import { cn } from "@/lib/utils";
import { addNotification } from "@/lib/global-state";

// Types from Skills Page
type SkillNode = {
  id: string;
  name: string;
  description: string;
  unlockedBy: string; // career ID that triggers the unlock
  unlockCondition: string; // friendly instruction string
  xpReward: number;
  courses: { title: string; provider: string; duration: string }[];
};

type SkillBranch = {
  id: string;
  name: string;
  icon: string;
  rootName: string;
  rootDesc: string;
  nodes: SkillNode[];
};

const SKILL_BRANCHES: SkillBranch[] = [
  {
    id: "tech-science",
    name: "Tech & Science",
    icon: "🔬",
    rootName: "Logic & Analytical Foundations",
    rootDesc: "Computational paradigms, system diagnostic trees, and mathematical rigor.",
    nodes: [
      {
        id: "node-coding",
        name: "Coding & Algorithms",
        description: "Writing scalable logic loops, data structures, and debug sequences.",
        unlockedBy: "software-engineer",
        unlockCondition: "Explore the Software Engineer career page",
        xpReward: 75,
        courses: [
          { title: "CS50: Introduction to Computer Science", provider: "Harvard University", duration: "12 Weeks" },
          { title: "Python Data Structures Foundations", provider: "Google Coursera", duration: "6 Weeks" }
        ]
      },
      {
        id: "node-data",
        name: "Data Analytics",
        description: "Scrubbing dataset logs, interpreting trends, and plotting dashboards.",
        unlockedBy: "data-scientist",
        unlockCondition: "Explore the Data Scientist career page",
        xpReward: 75,
        courses: [
          { title: "Google Data Analytics Professional Certificate", provider: "Google Coursera", duration: "6 Months" }
        ]
      },
      {
        id: "node-bio",
        name: "Clinical Diagnostics",
        description: "Molecular biology, diagnostic procedures, and cellular structures.",
        unlockedBy: "doctor",
        unlockCondition: "Explore the Doctor career page",
        xpReward: 75,
        courses: [
          { title: "Introduction to Human Physiology", provider: "Duke University", duration: "10 Weeks" }
        ]
      }
    ]
  },
  {
    id: "business-lead",
    name: "Business & Leadership",
    icon: "💼",
    rootName: "Commercial & Strategic Mindset",
    rootDesc: "Market mechanics, capital margins, financial accounts, and team velocity.",
    nodes: [
      {
        id: "node-pm",
        name: "Product Operations",
        description: "Writing specs, scoping engineering logs, and aligning client targets.",
        unlockedBy: "product-manager",
        unlockCondition: "Explore the Product Manager career page",
        xpReward: 75,
        courses: [
          { title: "Product Management Foundations", provider: "AIPMM Course", duration: "4 Weeks" }
        ]
      },
      {
        id: "node-audit",
        name: "Tax & Financial Audit",
        description: "Double-entry account balances, regulatory compliance, and budget audits.",
        unlockedBy: "chartered-accountant",
        unlockCondition: "Explore the Chartered Accountant career page",
        xpReward: 75,
        courses: [
          { title: "Financial Accounting Basics", provider: "Wharton School", duration: "6 Weeks" }
        ]
      },
      {
        id: "node-startup",
        name: "Lean Startup Operations",
        description: "Pitch deck writing, bootstrapping budgets, and market interviews.",
        unlockedBy: "entrepreneur",
        unlockCondition: "Explore the Entrepreneur career page",
        xpReward: 75,
        courses: [
          { title: "How to Build a Startup MVP", provider: "YC Startup School", duration: "4 Weeks" }
        ]
      }
    ]
  },
  {
    id: "arts-design",
    name: "Arts & Design",
    icon: "🎨",
    rootName: "Creative & Visual Expression",
    rootDesc: "Aesthetic layouts, vector models, spatial geometry, and textiles.",
    nodes: [
      {
        id: "node-uiux",
        name: "UI/UX Wireframing",
        description: "Vector canvas systems, design hierarchies, and user workflows.",
        unlockedBy: "graphic-designer",
        unlockCondition: "Explore the Graphic Designer career page",
        xpReward: 75,
        courses: [
          { title: "Google UX Design Professional Certificate", provider: "Google Coursera", duration: "6 Months" }
        ]
      },
      {
        id: "node-textile",
        name: "Textile Silhouette Sketching",
        description: "Fabric weight analysis, pattern drafting, and runway collections.",
        unlockedBy: "fashion-designer",
        unlockCondition: "Explore the Fashion Designer career page",
        xpReward: 75,
        courses: [
          { title: "Introduction to Fashion Design & Draping", provider: "NIFT Open Academy", duration: "4 Weeks" }
        ]
      },
      {
        id: "node-video",
        name: "Video & Script Storytelling",
        description: "Digital layouts, lighting parameters, video cut editing, and audio sync.",
        unlockedBy: "content-creator",
        unlockCondition: "Explore the Content Creator career page",
        xpReward: 75,
        courses: [
          { title: "Creative Storytelling Masterclass", provider: "Adobe Academy", duration: "5 Weeks" }
        ]
      }
    ]
  },
  {
    id: "humanities-rel",
    name: "Humanities & Relations",
    icon: "🗣️",
    rootName: "Interpersonal & Speech Synergy",
    rootDesc: "Constitutional arguments, public rhetoric, psychological counseling, and empathy.",
    nodes: [
      {
        id: "node-public",
        name: "Presentation & Debate",
        description: "Exhaustive brief audits, courtroom rhetoric, and public debate.",
        unlockedBy: "lawyer",
        unlockCondition: "Explore the Corporate Lawyer career page",
        xpReward: 75,
        courses: [
          { title: "Rhetoric: Art of Persuasive Writing", provider: "Harvard University", duration: "8 Weeks" }
        ]
      },
      {
        id: "node-negotiate",
        name: "Negotiation & Mediation",
        description: "Settlement negotiations, contract diplomacy, and corporate alignment.",
        unlockedBy: "product-manager",
        unlockCondition: "Explore the Product Manager or Lawyer career",
        xpReward: 75,
        courses: [
          { title: "Introduction to Negotiation Rules", provider: "Yale University", duration: "6 Weeks" }
        ]
      },
      {
        id: "node-empathy",
        name: "Counseling & Pedagogy",
        description: "Active listening, child psychology, study curriculum prep.",
        unlockedBy: "psychologist",
        unlockCondition: "Explore the Psychologist career page",
        xpReward: 75,
        courses: [
          { title: "Introduction to Child Psychology", provider: "TISS Open School", duration: "8 Weeks" }
        ]
      }
    ]
  }
];

// Types from Goals Page
type Milestone = {
  id: string;
  name: string;
  xpReward: number;
  completed: boolean;
  link: string;
  linkText: string;
};

type Quest = {
  id: string;
  careerId: string;
  title: string;
  tagline: string;
  badgeName: string;
  badgeIcon: string;
  xpReward: number;
  milestones: Milestone[];
};

export default function GrowthHubPage() {
  const [isClient, setIsClient] = useState(false);
  
  // Skills tree states
  const [activeBranchId, setActiveBranchId] = useState("tech-science");
  const [exploredCareers, setExploredCareers] = useState<string[]>([]);
  const [claimedSkills, setClaimedSkills] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  // Quests/Goals states
  const [quests, setQuests] = useState<Quest[]>([]);
  const [claimedXpMilestones, setClaimedXpMilestones] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Load local storage states
    let exploredList: string[] = [];
    let bookmarksList: string[] = [];
    let readStoriesList: string[] = [];
    
    try {
      const explored = localStorage.getItem("explored-careers");
      if (explored) {
        exploredList = JSON.parse(explored);
        setExploredCareers(exploredList);
      }
      const claimed = localStorage.getItem("careerverse-claimed-skills");
      if (claimed) {
        setClaimedSkills(JSON.parse(claimed));
      }
      const claimedMilestones = localStorage.getItem("careerverse-claimed-milestones");
      if (claimedMilestones) {
        setClaimedXpMilestones(JSON.parse(claimedMilestones));
      }
      const completed = localStorage.getItem("careerverse-completed-quests");
      if (completed) {
        setCompletedQuests(JSON.parse(completed));
      }
      
      const storedBookmarks = localStorage.getItem("careerverse-bookmarks") || "[]";
      const storedReadStories = localStorage.getItem("careerverse-read-stories") || "[]";
      bookmarksList = JSON.parse(storedBookmarks);
      readStoriesList = JSON.parse(storedReadStories);
    } catch {}

    // Check completed simulations
    const simsCompletedList: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("simulation-")) {
        try {
          const simData = JSON.parse(localStorage.getItem(key) || "{}");
          if (simData.completed) {
            simsCompletedList.push(key.replace("simulation-", ""));
          }
        } catch {}
      }
    }

    // Default quests setup
    const defaultQuests: Quest[] = [
      {
        id: "quest-swe",
        careerId: "software-engineer",
        title: "Software Engineer Quest",
        tagline: "Master clean code syntax, algorithms, and agile sprints.",
        badgeName: "Binary Architect",
        badgeIcon: "💻",
        xpReward: 500,
        milestones: [
          {
            id: "swe-m1",
            name: "Bookmark & Explore Software Engineer details",
            xpReward: 100,
            completed: exploredList.includes("software-engineer") || bookmarksList.includes("software-engineer"),
            link: "/explore",
            linkText: "Go to Explorer"
          },
          {
            id: "swe-m2",
            name: "Complete Software Engineer story simulation",
            xpReward: 150,
            completed: simsCompletedList.includes("software-engineer"),
            link: "/explore/simulator/software-engineer",
            linkText: "Start Simulation"
          },
          {
            id: "swe-m3",
            name: "Review Rahul Mehta's student story in community",
            xpReward: 100,
            completed: readStoriesList.includes("software-engineer"),
            link: "/explore/community",
            linkText: "Read Story"
          },
          {
            id: "swe-m4",
            name: "Audit coding competencies in the Skill Tree",
            xpReward: 150,
            completed: exploredList.includes("software-engineer"),
            link: "/explore/growth-hub",
            linkText: "Unlock Node"
          }
        ]
      },
      {
        id: "quest-lawyer",
        careerId: "lawyer",
        title: "Corporate Lawyer Quest",
        tagline: "Analyze legal precedents and argue cases in moot courts.",
        badgeName: "Legal Vanguard",
        badgeIcon: "⚖️",
        xpReward: 500,
        milestones: [
          {
            id: "law-m1",
            name: "Bookmark & Explore Corporate Lawyer details",
            xpReward: 100,
            completed: exploredList.includes("lawyer") || bookmarksList.includes("lawyer"),
            link: "/explore",
            linkText: "Go to Explorer"
          },
          {
            id: "law-m2",
            name: "Execute Lawyer story simulation in court lobby",
            xpReward: 150,
            completed: simsCompletedList.includes("lawyer"),
            link: "/explore/simulator/lawyer",
            linkText: "Start Simulation"
          },
          {
            id: "law-m3",
            name: "Read Meera Nair's National Law School advice",
            xpReward: 100,
            completed: readStoriesList.includes("lawyer"),
            link: "/explore/community",
            linkText: "Read Story"
          },
          {
            id: "law-m4",
            name: "Examine legal fees & placements in Colleges",
            xpReward: 150,
            completed: true,
            link: "/explore/colleges",
            linkText: "Open Colleges"
          }
        ]
      },
      {
        id: "quest-fashion",
        careerId: "fashion-designer",
        title: "Fashion Designer Quest",
        tagline: "Design textile silhouettes and launch runway collections.",
        badgeName: "Aesthetic Visionary",
        badgeIcon: "🎨",
        xpReward: 500,
        milestones: [
          {
            id: "fas-m1",
            name: "Bookmark & Explore Fashion Designer details",
            xpReward: 100,
            completed: exploredList.includes("fashion-designer") || bookmarksList.includes("fashion-designer"),
            link: "/explore",
            linkText: "Go to Explorer"
          },
          {
            id: "fas-m2",
            name: "Execute Fashion Designer runway launch simulation",
            xpReward: 150,
            completed: simsCompletedList.includes("fashion-designer"),
            link: "/explore/simulator/fashion-designer",
            linkText: "Start Simulation"
          },
          {
            id: "fas-m3",
            name: "Read Priya Varma's design struggles voice card",
            xpReward: 100,
            completed: readStoriesList.includes("fashion-designer"),
            link: "/explore/community",
            linkText: "Read Story"
          },
          {
            id: "fas-m4",
            name: "Sketch a custom project layout for Portfolio",
            xpReward: 150,
            completed: true,
            link: "/explore/portfolio",
            linkText: "Open Portfolio"
          }
        ]
      }
    ];

    setQuests(defaultQuests);
  }, []);

  const handleClaimSkillXp = (node: SkillNode) => {
    if (claimedSkills.includes(node.id)) return;

    const nextClaimed = [...claimedSkills, node.id];
    setClaimedSkills(nextClaimed);
    localStorage.setItem("careerverse-claimed-skills", JSON.stringify(nextClaimed));

    // Award XP
    addXp(node.xpReward, `Unlocked Skill Node: ${node.name}`);
    unlockBadge("skill_unlocked");
    addNotification("skill", "Skill Unlocked", `You claimed the "${node.name}" skill node (+${node.xpReward} XP)!`);
  };

  const handleClaimMilestoneXp = (questId: string, milestoneId: string, amount: number, name: string) => {
    if (claimedXpMilestones.includes(milestoneId)) return;

    const nextClaimed = [...claimedXpMilestones, milestoneId];
    setClaimedXpMilestones(nextClaimed);
    localStorage.setItem("careerverse-claimed-milestones", JSON.stringify(nextClaimed));

    // Award XP
    addXp(amount, `Milestone: ${name}`);

    // Check if all milestones are completed & claimed
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      const allMilestonesClaimed = quest.milestones.every(m => 
        m.id === milestoneId ? true : claimedXpMilestones.includes(m.id)
      );

      if (allMilestonesClaimed && !completedQuests.includes(questId)) {
        const nextCompleted = [...completedQuests, questId];
        setCompletedQuests(nextCompleted);
        localStorage.setItem("careerverse-completed-quests", JSON.stringify(nextCompleted));

        // Award Quest completion bonus XP!
        setTimeout(() => {
          addXp(quest.xpReward, `QUEST COMPLETE: ${quest.title}!`);
          unlockBadge("quest_complete");
        }, 1500);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const activeBranch = SKILL_BRANCHES.find(b => b.id === activeBranchId) || SKILL_BRANCHES[0];

  return (
    <AppShell className="pb-24">
      {/* Header */}
      <MotionFadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Growth & Evolution</p>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-foreground mt-0.5">
                Career Growth Hub
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-600">
              <BrainCircuit className="h-4 w-4" />
              <span>{claimedSkills.length} Skills Unlocked</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 text-xs font-bold text-pink-600">
              <Target className="h-4 w-4" />
              <span>{completedQuests.length} Quests Done</span>
            </div>
          </div>
        </div>
      </MotionFadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Skill Tree Node (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <BrainCircuit className="h-5 w-5 text-indigo-500" />
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-foreground uppercase tracking-wider">
                Skill Evolution Tree
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore careers in the library or complete simulations to unlock new skill tree branches and claim verified Academy courses.
            </p>

            {/* Horizontal Stream Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SKILL_BRANCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBranchId(b.id);
                    setSelectedNode(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0",
                    activeBranchId === b.id
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <span className="text-sm">{b.icon}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>

            {/* Branch Root Info */}
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-2">
              <span className="text-[9px] font-extrabold uppercase text-primary tracking-widest block">Branch Core Paradigms</span>
              <h3 className="font-bold text-xs text-foreground">{activeBranch.rootName}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{activeBranch.rootDesc}</p>
            </div>

            {/* Connecting lines representation */}
            <div className="flex justify-center h-4 pointer-events-none">
              <div className="w-0.5 h-full bg-border border-dashed border-l" />
            </div>

            {/* Nodes Grid */}
            <div className="grid gap-3.5 sm:grid-cols-3">
              {activeBranch.nodes.map((node) => {
                const isUnlocked = exploredCareers.includes(node.unlockedBy);
                const isClaimed = claimedSkills.includes(node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={cn(
                      "cursor-pointer rounded-2xl border p-4 shadow-sm flex flex-col items-center text-center justify-between gap-3 transition-all relative hover:scale-[1.02]",
                      isUnlocked
                        ? isClaimed
                          ? "border-emerald-500/30 bg-emerald-500/[0.01] hover:border-emerald-500/50"
                          : "border-primary/30 bg-primary/[0.01] hover:border-primary/50 animate-pulse-slow"
                        : "border-border bg-muted/10 opacity-70"
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted border border-border">
                      {isUnlocked ? (
                        <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-foreground leading-snug">{node.name}</h4>
                      <span className="text-[8px] text-muted-foreground block mt-1">
                        {isUnlocked ? "Unlocked!" : "Locked"}
                      </span>
                    </div>

                    <span className="text-[9px] text-primary font-bold flex items-center gap-0.5 mt-1">
                      +{node.xpReward} XP <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Node detail display panel */}
            {selectedNode && (
              <MotionFadeIn key={selectedNode.id}>
                <div className="rounded-2xl border border-border bg-card p-4 space-y-4 bg-gradient-to-br from-muted/10 to-transparent">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-extrabold uppercase text-primary tracking-widest block">Selected Competency</span>
                      <h3 className="font-bold text-xs text-foreground mt-0.5">{selectedNode.name}</h3>
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                      <Award className="h-3.5 w-3.5" /> +{selectedNode.xpReward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {selectedNode.description}
                  </p>

                  <div className="p-3 bg-muted/40 border border-border/50 rounded-xl text-[11px] flex justify-between items-center gap-3">
                    <span className="text-muted-foreground">Requirement: {selectedNode.unlockCondition}</span>
                    {exploredCareers.includes(selectedNode.unlockedBy) ? (
                      claimedSkills.includes(selectedNode.id) ? (
                        <span className="text-[9px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-extrabold uppercase">Claimed</span>
                      ) : (
                        <button
                          onClick={() => handleClaimSkillXp(selectedNode)}
                          className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-[9px] transition-all shadow-sm"
                        >
                          Claim XP
                        </button>
                      )
                    ) : (
                      <Link
                        href="/explore"
                        className="h-7 px-3 border border-border text-foreground font-bold rounded-lg text-[9px] hover:bg-muted flex items-center gap-0.5"
                      >
                        Go Explorer
                      </Link>
                    )}
                  </div>

                  {/* Certified courses */}
                  <div className="space-y-2">
                    <span className="text-[8px] font-extrabold uppercase text-muted-foreground tracking-wider block">Recommended Certified Courses</span>
                    {selectedNode.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl text-[11px]">
                        <div>
                          <span className="font-bold text-foreground block">{course.title}</span>
                          <span className="text-[9px] text-muted-foreground block">{course.provider} &bull; {course.duration}</span>
                        </div>
                        <a
                          href="https://www.coursera.org"
                          target="_blank"
                          rel="noreferrer"
                          className="h-6 px-2.5 border border-primary/20 text-primary text-[9px] font-bold rounded-lg flex items-center gap-0.5 hover:bg-primary/5 transition-all"
                        >
                          <Play className="h-2.5 w-2.5 fill-primary" /> View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionFadeIn>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Career Quests checklist (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Target className="h-5 w-5 text-pink-500" />
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-foreground uppercase tracking-wider">
                Career Quests
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Activate career quests by bookmarking options in the Explorer, then execute milestones to claim massive quest completion XP bonuses.
            </p>

            <div className="space-y-4">
              {quests.map((quest) => {
                const completedCount = quest.milestones.filter(m => m.completed).length;
                const totalCount = quest.milestones.length;
                const pct = Math.floor((completedCount / totalCount) * 100);
                const isQuestFinished = completedQuests.includes(quest.id);

                return (
                  <div 
                    key={quest.id} 
                    className={cn(
                      "rounded-2xl border p-4 space-y-4 transition-all relative overflow-hidden",
                      isQuestFinished ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-border/80 bg-card hover:border-border/100"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] bg-pink-500/10 text-pink-600 border border-pink-500/20 px-2.5 py-0.5 rounded font-extrabold uppercase">
                          Quest Active
                        </span>
                        <h3 className="font-bold text-xs text-foreground mt-2">{quest.title}</h3>
                      </div>
                      <span className="text-lg">{quest.badgeIcon}</span>
                    </div>

                    {/* Progress slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                        <span>Milestones Completed</span>
                        <span>{completedCount}/{totalCount} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-300", isQuestFinished ? "bg-emerald-500" : "bg-primary")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestone rows */}
                    <div className="space-y-2 pt-1">
                      {quest.milestones.map((m) => {
                        const isClaimed = claimedXpMilestones.includes(m.id);
                        return (
                          <div 
                            key={m.id} 
                            className={cn(
                              "flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border text-[11px] gap-2",
                              m.completed
                                ? isClaimed 
                                  ? "bg-emerald-500/[0.01] border-emerald-500/10 text-muted-foreground opacity-90"
                                  : "bg-primary/[0.01] border-primary/10 text-foreground"
                                : "bg-muted/10 border-border/30 text-muted-foreground opacity-60"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0">
                                {m.completed ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <span className="h-3.5 w-3.5 rounded-full border border-border inline-block" />
                                )}
                              </span>
                              <div>
                                <span className={cn("font-medium block", m.completed && isClaimed && "line-through opacity-60")}>
                                  {m.name}
                                </span>
                                <span className="text-[9px] text-amber-600 font-extrabold mt-0.5 block">+{m.xpReward} XP</span>
                              </div>
                            </div>

                            <div className="shrink-0 self-end sm:self-center">
                              {m.completed ? (
                                !isClaimed ? (
                                  <button
                                    onClick={() => handleClaimMilestoneXp(quest.id, m.id, m.xpReward, m.name)}
                                    className="h-6 px-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-[9px] shadow-sm transition-all"
                                  >
                                    Claim +{m.xpReward} XP
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Claimed</span>
                                )
                              ) : (
                                <Link 
                                  href={m.link}
                                  className="h-6 px-2.5 border border-border hover:border-primary text-foreground font-bold rounded-lg text-[9px] flex items-center gap-0.5 hover:bg-primary/5 transition-all"
                                >
                                  {m.linkText} <ChevronRight className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
