"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, GraduationCap, MapPin, Search, 
  Scale, Check, X, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";

type College = {
  id: string;
  name: string;
  category: "Engineering" | "Law" | "Medical" | "Design" | "Fashion" | "Arts" | "Commerce" | "Hotel Management" | "Psychology";
  ranking: string;
  location: string;
  courses: string[];
  fees: string;
  placements: string;
  avgSalary: string;
  entranceExams: string[];
};

const COLLEGES_DATABASE: College[] = [
  {
    id: "col-iitb",
    name: "IIT Bombay",
    category: "Engineering",
    ranking: "#1 in Engineering (NIRF)",
    location: "Mumbai, Maharashtra",
    courses: ["B.Tech Computer Science", "B.Tech Electrical", "B.Tech Aerospace"],
    fees: "₹2.2 Lakhs / year",
    placements: "96% placements",
    avgSalary: "₹21.8 LPA",
    entranceExams: ["JEE Advanced"]
  },
  {
    id: "col-nlsiu",
    name: "NLSIU Bangalore",
    category: "Law",
    ranking: "#1 in Law (NIRF)",
    location: "Bengaluru, Karnataka",
    courses: ["BA LLB (Hons)", "LLM International Trade"],
    fees: "₹2.8 Lakhs / year",
    placements: "98% placements",
    avgSalary: "₹18.0 LPA",
    entranceExams: ["CLAT"]
  },
  {
    id: "col-aiims",
    name: "AIIMS New Delhi",
    category: "Medical",
    ranking: "#1 in Medical (NIRF)",
    location: "New Delhi",
    courses: ["MBBS", "B.Sc Nursing"],
    fees: "₹1,628 / course (Subsidized)",
    placements: "100% internship placements",
    avgSalary: "₹15.5 LPA",
    entranceExams: ["NEET UG"]
  },
  {
    id: "col-nid",
    name: "NID Ahmedabad",
    category: "Design",
    ranking: "#1 in Design (India Today)",
    location: "Ahmedabad, Gujarat",
    courses: ["B.Des Product Design", "B.Des Graphic Design"],
    fees: "₹3.5 Lakhs / year",
    placements: "90% placements",
    avgSalary: "₹9.5 LPA",
    entranceExams: ["NID DAT"]
  },
  {
    id: "col-nift",
    name: "NIFT Mumbai",
    category: "Fashion",
    ranking: "Top Fashion College (Outlook)",
    location: "Mumbai, Maharashtra",
    courses: ["B.Des Fashion Design", "B.Des Fashion Communication"],
    fees: "₹2.9 Lakhs / year",
    placements: "88% placements",
    avgSalary: "₹7.2 LPA",
    entranceExams: ["NIFT GAT & CAT"]
  },
  {
    id: "col-lsr",
    name: "Lady Shri Ram College (DU)",
    category: "Arts",
    ranking: "#2 in Liberal Arts (India Today)",
    location: "New Delhi",
    courses: ["BA (Hons) English", "BA (Hons) Political Science"],
    fees: "₹20,000 / year",
    placements: "85% placements",
    avgSalary: "₹8.5 LPA",
    entranceExams: ["CUET UG"]
  },
  {
    id: "col-srcc",
    name: "SRCC New Delhi",
    category: "Commerce",
    ranking: "#1 in Commerce (NIRF)",
    location: "New Delhi",
    courses: ["B.Com (Hons)", "BA (Hons) Economics"],
    fees: "₹30,000 / year",
    placements: "94% placements",
    avgSalary: "₹10.2 LPA",
    entranceExams: ["CUET UG"]
  },
  {
    id: "col-wgsha",
    name: "WGSHA Manipal",
    category: "Hotel Management",
    ranking: "#1 in Private HM (Outlook)",
    location: "Manipal, Karnataka",
    courses: ["BHM Culinary Arts", "BHM Hotel Administration"],
    fees: "₹2.4 Lakhs / year",
    placements: "95% placements",
    avgSalary: "₹6.0 LPA",
    entranceExams: ["WGSHA Entrance Test"]
  },
  {
    id: "col-tiss",
    name: "TISS Mumbai",
    category: "Psychology",
    ranking: "Top Social Sciences Institute",
    location: "Mumbai, Maharashtra",
    courses: ["BA Social Sciences", "MA Applied Psychology"],
    fees: "₹45,000 / year",
    placements: "92% placements",
    avgSalary: "₹9.0 LPA",
    entranceExams: ["CUET UG", "CUET PG"]
  }
];

const CATEGORIES = [
  "All", "Engineering", "Law", "Medical", "Design", "Fashion", "Arts", "Commerce", "Hotel Management", "Psychology"
] as const;

export default function CollegeExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]>("All");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const filteredColleges = COLLEGES_DATABASE.filter((col) => {
    const matchesSearch = 
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      col.entranceExams.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "All" || col.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(cId => cId !== id));
    } else {
      if (compareIds.length >= 3) {
        // limit to 3
        setCompareIds(prev => [prev[1], prev[2], id]);
      } else {
        setCompareIds(prev => [...prev, id]);
      }
    }
  };

  const selectedCollegesToCompare = COLLEGES_DATABASE.filter(c => compareIds.includes(c.id));

  return (
    <AppShell className="space-y-6 pb-20 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          College Explorer
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-violet-500/[0.01] to-transparent">
        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
          <GraduationCap className="h-5 w-5 animate-pulse" />
          <span>College Admissions Database</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Compare elite Indian institutions across courses, tuition costings, entrance exams, and senior placement averages. Pick up to 3 colleges to compare side-by-side.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search colleges, exams, or courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Category Slider Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 transition-all ${
              activeTab === cat
                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                : "bg-card border-border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Colleges List */}
      <div className="space-y-4">
        {filteredColleges.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-muted/10">
            <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground/45" />
            <p className="mt-2 text-xs font-semibold text-foreground">No colleges matched</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Try adjusting search query filters.</p>
          </div>
        ) : (
          filteredColleges.map((col) => {
            const isComparing = compareIds.includes(col.id);
            return (
              <div key={col.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative hover:border-primary/25 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      {col.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground mt-1.5">
                      {col.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-semibold">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{col.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCompare(col.id)}
                    className={`h-7 px-3 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                      isComparing
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {isComparing ? (
                      <>
                        <Check className="h-3 w-3" /> Compare
                      </>
                    ) : (
                      "+ Compare"
                    )}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ranking:</span>
                    <span className="font-semibold text-foreground">{col.ranking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrance Exams:</span>
                    <span className="font-semibold text-primary">{col.entranceExams.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fees:</span>
                    <span className="font-semibold text-foreground">{col.fees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Placement Package:</span>
                    <span className="font-bold text-emerald-600">{col.avgSalary}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Compare Banner */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-md px-4 py-3 shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Compare Colleges</p>
              <p className="text-[10px] text-muted-foreground">
                {compareIds.length} of 3 selected
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCompareModal(true)}
              size="sm"
              className="h-8 rounded-xl text-xs font-semibold shadow-sm bg-primary text-primary-foreground"
            >
              Compare Now <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Compare Modal Overlay */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCompareModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background p-5 shadow-2xl space-y-4 animate-in scale-in duration-200">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground flex items-center gap-1.5">
                <Scale className="h-4.5 w-4.5 text-primary" /> College Comparison Side-by-Side
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="py-2 pr-2 font-bold text-muted-foreground">Parameter</th>
                    {selectedCollegesToCompare.map(c => (
                      <th key={c.id} className="py-2 px-2 font-extrabold text-foreground border-l border-border/40 max-w-[100px] truncate">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Category</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 font-semibold text-foreground border-l border-border/40">{c.category}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Ranking</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 text-foreground border-l border-border/40">{c.ranking}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Fees</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 text-foreground border-l border-border/40">{c.fees}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Avg Salary</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 font-bold text-emerald-600 border-l border-border/40">{c.avgSalary}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Exams</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 text-primary font-medium border-l border-border/40">{c.entranceExams.join(", ")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2 font-bold text-muted-foreground">Location</td>
                    {selectedCollegesToCompare.map(c => (
                      <td key={c.id} className="py-2.5 px-2 text-muted-foreground border-l border-border/40">{c.location}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <Button
              onClick={() => setShowCompareModal(false)}
              className="w-full h-10 bg-primary text-primary-foreground font-bold rounded-xl text-xs mt-2"
            >
              Close Comparison
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
