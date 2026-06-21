"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Briefcase, Search, CheckCircle2 
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

type Opportunity = {
  id: string;
  title: string;
  type: "Internship" | "Competition" | "Hackathon" | "Workshop" | "Certification" | "Volunteering";
  stream: "Science" | "Commerce" | "Arts" | "Vocational" | "All";
  desc: string;
  eligibility: string;
  gradeLevel: string;
  provider: string;
};

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: "opp-google-step",
    title: "Google STEP SDE Internship",
    type: "Internship",
    stream: "Science",
    desc: "10-week developmental internship for computer science students to write production code and design APIs.",
    eligibility: "Basic coding skills in Python, Java, or C++",
    gradeLevel: "Grade 12 / College",
    provider: "Google India"
  },
  {
    id: "opp-sih",
    title: "Smart India Hackathon (School Edit)",
    type: "Hackathon",
    stream: "Science",
    desc: "A nationwide product building competition where student teams build mock software for public sector problems.",
    eligibility: "Teams of 3-6 students with school nomination",
    gradeLevel: "Grade 10 - 12",
    provider: "Ministry of Education"
  },
  {
    id: "opp-harvard-mock",
    title: "Harvard Global Mock Trial Contest",
    type: "Workshop",
    stream: "Arts",
    desc: "Simulated courtroom litigation workshop focused on legal defenses, statutory interpretations, and cross-examinations.",
    eligibility: "High verbal aptitude and interest in legal affairs",
    gradeLevel: "Grade 10 - 12",
    provider: "Harvard Student Union"
  },
  {
    id: "opp-nift-creators",
    title: "NID Young Creators Portfolio Challenge",
    type: "Competition",
    stream: "Vocational",
    desc: "Submit a 5-sketch fashion capsule or product design proposal to win a mentorship boot camp.",
    eligibility: "Open to all creative design students",
    gradeLevel: "Grade 10 - 12",
    provider: "NID Open Academy"
  },
  {
    id: "opp-finance-olympiad",
    title: "National Commerce & Finance Olympiad",
    type: "Competition",
    stream: "Commerce",
    desc: "National test assessing accounting logic, microeconomics, double-entry ledgers, and market valuation.",
    eligibility: "Students studying Commerce or Mathematics",
    gradeLevel: "Grade 11 - 12",
    provider: "Finance Education Council"
  },
  {
    id: "opp-red-cross",
    title: "Red Cross Healthcare Volunteering",
    type: "Volunteering",
    stream: "Science",
    desc: "Assist in regional health checkup clinics, medical logistics management, and basic public first-aid awareness camps.",
    eligibility: "Basic biological knowledge & empathy guidelines",
    gradeLevel: "Grade 10 - 12",
    provider: "Indian Red Cross Society"
  },
  {
    id: "opp-culinary-ihm",
    title: "IHM Pastry & Knife Skills Masterclass",
    type: "Workshop",
    stream: "Vocational",
    desc: "Weekend hands-on certification training detailing industrial kitchen safety, knife control, and plating guidelines.",
    eligibility: "Interest in culinary sciences",
    gradeLevel: "Grade 10 - 12",
    provider: "IHM Pusa"
  },
  {
    id: "opp-wharton-cert",
    title: "Wharton Business Accounting Certification",
    type: "Certification",
    stream: "Commerce",
    desc: "Online course detailing balance sheets, income statements, cash flow analytics, and lean startup margins.",
    eligibility: "General interest in finance and entrepreneurship",
    gradeLevel: "Grade 10 - College",
    provider: "Wharton Coursera"
  }
];

const STREAMS = ["All", "Science", "Commerce", "Arts", "Vocational"] as const;
const TYPES = ["All", "Internship", "Competition", "Hackathon", "Workshop", "Certification", "Volunteering"] as const;

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStream, setActiveStream] = useState<typeof STREAMS[number]>("All");
  const [activeType, setActiveType] = useState<typeof TYPES[number]>("All");
  const [appliedList, setAppliedList] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("applied-opportunities");
      if (stored) setAppliedList(JSON.parse(stored));
    } catch {}
  }, []);

  const handleApply = (id: string) => {
    if (appliedList.includes(id)) return;
    const nextList = [...appliedList, id];
    setAppliedList(nextList);
    localStorage.setItem("applied-opportunities", JSON.stringify(nextList));

    // Boost streak / explore stats slightly
    const storedStreak = localStorage.getItem("exploration-streak") || "3";
    localStorage.setItem("exploration-streak", String(parseInt(storedStreak) + 1));
  };

  const filteredOpportunities = OPPORTUNITIES_DATA.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStream = activeStream === "All" || opp.stream === activeStream;
    const matchesType = activeType === "All" || opp.type === activeType;

    return matchesSearch && matchesStream && matchesType;
  });

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Opportunities Hub
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/[0.01] to-transparent">
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
          <Briefcase className="h-5 w-5 animate-pulse" />
          <span>Internships, Contests & Certifications</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Boost your Career Readiness Score by registering for industry workshops, hackathons, and certifications. Track your submitted applications here.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search hackathons, internships, eligibility..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Filters: Stream & Type */}
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Filter by Stream</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 max-w-full scrollbar-thin">
            {STREAMS.map((st) => (
              <button
                key={st}
                onClick={() => setActiveStream(st)}
                className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-all ${
                  activeStream === st
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Filter by Opportunity Type</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-all ${
                  activeType === t
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-muted/10">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/45" />
            <p className="mt-2 text-xs font-semibold text-foreground">No opportunities match filters</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Adjust search query parameters.</p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const hasApplied = appliedList.includes(opp.id);
            return (
              <div key={opp.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                        {opp.type}
                      </span>
                      <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">
                        {opp.stream} Stream
                      </span>
                    </div>
                    
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground mt-2">
                      {opp.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Provided by {opp.provider}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApply(opp.id)}
                    className={`h-7 px-3 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                      hasApplied
                        ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-600 cursor-default"
                        : "bg-primary border-primary text-primary-foreground hover:bg-primary/95 shadow-sm"
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Applied
                      </>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opp.desc}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground">
                  <div>
                    <span className="font-bold text-foreground block">Recommended Grade:</span>
                    {opp.gradeLevel}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">Eligibility Details:</span>
                    {opp.eligibility}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
