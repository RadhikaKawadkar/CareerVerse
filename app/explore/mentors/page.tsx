"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Award, Calendar, BookOpen, Briefcase, GraduationCap, 
  User, HelpCircle, Check, Search, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { CAREER_LIBRARY } from "@/lib/career-library";

type DetailedMentor = {
  id: string;
  name: string;
  careerId: string;
  role: string;
  company: string;
  college: string;
  experience: string;
  path: string;
  achievements: string[];
  advice: string;
  avatar: string;
  theme: string;
  specialties: string[];
};

const DETAILED_MENTORS: DetailedMentor[] = [
  {
    id: "m-1",
    name: "Rohit Sharma",
    careerId: "software-engineer",
    role: "SDE-2",
    company: "Google Cloud core storage team",
    college: "IIT Delhi B.Tech Computer Science",
    experience: "7+ Years in Systems Development",
    path: "IIT Delhi graduate → Interned at Microsoft → Joined Google Cloud core storage team.",
    achievements: [
      "Built Google Cloud storage compression algorithm saving 15% compute.",
      "Scales backend data pipelines serving 50M+ requests daily."
    ],
    advice: "Master data structures logic, but focus equally on writing clean, readable code that teams can debug without friction.",
    avatar: "RS",
    theme: "from-sky-500/10 to-blue-500/5 border-blue-500/20 text-blue-600",
    specialties: ["Cloud Infrastructure", "Distributed Storage", "Rust Programming"]
  },
  {
    id: "m-2",
    name: "Rohan Advani",
    careerId: "lawyer",
    role: "Senior Corporate Associate",
    company: "Khaitan & Co",
    college: "National Law School (NLS) Bangalore",
    experience: "6 Years in Corporate Law & M&A",
    path: "NLS Bangalore BA LLB → Associate at Trilegal → Specialized in startup financing and corporate mergers.",
    achievements: [
      "Orchestrated ₹400 Crore FinTech acquisition compliance auditing.",
      "Advised 20+ Series-A startups on legal regulatory guidelines."
    ],
    advice: "Learn to read between the lines. Law is not just rules; it's about evaluating human intent and managing risk thresholds.",
    avatar: "RA",
    theme: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600",
    specialties: ["Startup Financing", "Corporate Mergers", "Tech Compliance"]
  },
  {
    id: "m-3",
    name: "Meera Sen",
    careerId: "fashion-designer",
    role: "Creative Director",
    company: "Label Meera",
    college: "NIFT Delhi (B.Des Fashion Design)",
    experience: "8 Years in Sustainable Fashion",
    path: "NIFT Delhi → Assistant Designer for Sabyasachi → Launched sustainable boutique label at Lakme Fashion Week.",
    achievements: [
      "Showcased eco-mulberry collections at Lakme Fashion Week 2024.",
      "Styled 3 top Bollywood film productions with sustainable apparel."
    ],
    advice: "Fashion is a commercial trade. Focus on cost sheets, supply chain logistics, and material ethics first, sketches second.",
    avatar: "MS",
    theme: "from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-600",
    specialties: ["Sustainable Apparel", "Aesthetic Styling", "Drape Sketching"]
  },
  {
    id: "m-4",
    name: "Dr. Shreya Bose",
    careerId: "doctor",
    role: "Interventional Cardiologist",
    company: "Fortis Healthcare",
    college: "Maulana Azad Medical College (MAMC) / AIIMS Delhi",
    experience: "10+ Years in Clinical Medicine",
    path: "MBBS at MAMC → MD Internal Medicine at AIIMS → Fellowship in interventional cardiology.",
    achievements: [
      "Executed 500+ successful angioplasty surgeries under critical pressure.",
      "Authored 10 research articles in international cardiology journals."
    ],
    advice: "Academic medicine is a marathon. Protect your mental sanity and practice mindfulness to balance clinical stress.",
    avatar: "SB",
    theme: "from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-600",
    specialties: ["Angioplasty", "Clinical Therapy", "Internal Medicine"]
  },
  {
    id: "m-5",
    name: "Varun Alagh",
    careerId: "entrepreneur",
    role: "Co-Founder (YC W21)",
    company: "Lokal Delivery",
    college: "BITS Pilani (B.Tech)",
    experience: "5 Years Startup Scaling",
    path: "BITS Pilani → Product Designer at Swiggy → Raised seed round for regional logistics node.",
    achievements: [
      "Scaled local courier deliveries to 50k monthly orders in Tier-2 cities.",
      "Raised ₹15 Crore VC Seed round from global tech funds."
    ],
    advice: "Don't build in a silo. Validate your demand using WhatsApp groups or manual spreadsheets before writing any code.",
    avatar: "VA",
    theme: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600",
    specialties: ["Logistics Networks", "Venture Pitching", "Product Design"]
  },
  {
    id: "m-6",
    name: "Ananya Iyer",
    careerId: "data-scientist",
    role: "Lead ML Engineer",
    company: "Flipkart Core recommendation system",
    college: "Indian Statistical Institute (ISI) Kolkata",
    experience: "8 Years in Machine Learning",
    path: "B.Sc. Stats at ISI → Data Analyst at Mu Sigma → ML Lead at Flipkart recommendation systems.",
    achievements: [
      "Upgraded Flipkart recommendation precision by 14% using deep neural filters.",
      "Configured automated feature pipeline scrubbing for 10M+ active SKUs."
    ],
    advice: "Never trust raw dataset logs without a thorough ingestion audit. Real-world telemetry is extremely messy.",
    avatar: "AI",
    theme: "from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-600",
    specialties: ["Deep Neural Filters", "ML Ops Pipelines", "Product Recommendations"]
  },
  {
    id: "m-7",
    name: "Nikhil Kamath",
    careerId: "architect",
    role: "Principal BIM Architect",
    company: "Morphogenesis Delhi",
    college: "IIT Kharagpur B.Arch / CEPT Ahmedabad M.Arch",
    experience: "9 Years Sustainable Architecture",
    path: "B.Arch at IIT Kharagpur → M.Arch at CEPT Ahmedabad → LEED sustainability auditor.",
    achievements: [
      "Designed Net-Zero Carbon corporate parks in Bangalore, LEED Platinum certified.",
      "Awarded NDTV Design Excellence Award for sustainable public spaces."
    ],
    advice: "Learn BIM modeling tools early. Architecture is shifting rapidly toward parametric and eco-sensitive designs.",
    avatar: "NK",
    theme: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600",
    specialties: ["BIM Modeling", "LEED Sustainability", "Zero-Carbon Design"]
  },
  {
    id: "m-8",
    name: "Maya Sen",
    careerId: "graphic-designer",
    role: "Senior Visual Artist",
    company: "Zomato Brand & Advertising",
    college: "National Institute of Design (NID) Ahmedabad",
    experience: "6 Years Visual Communication",
    path: "BFA at College of Art, Delhi → Freelance logo designer → Leading Nykaa & Zomato ad vectors.",
    achievements: [
      "Designed Zomato IPL ad vector illustrations and branding overlays.",
      "Branded 15+ top direct-to-consumer startups with vector layouts."
    ],
    advice: "Your portfolio is your currency. Focus on storytelling and show the logical process behind your logo designs.",
    avatar: "MS",
    theme: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600",
    specialties: ["Visual Communication", "DTC Branding", "Vector Illustration"]
  },
  {
    id: "m-9",
    name: "CA Nilesh Shah",
    careerId: "chartered-accountant",
    role: "Auditing Partner",
    company: "Deloitte India",
    college: "R. A. Podar College of Commerce Mumbai",
    experience: "12+ Years Corporate Tax & Audit",
    path: "B.Com at Podar College → Cleared CA Finals Rank 25 → Head Partner auditing multi-national ledgers.",
    achievements: [
      "Managed compliance audits for 3 Fortune 500 tech conglomerates in India.",
      "Directs taxation advisory boards for multi-state industrial nodes."
    ],
    advice: "CA preparation requires immense discipline. Balance rote laws learning with practical case scenarios analysis.",
    avatar: "NS",
    theme: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600",
    specialties: ["Compliance Auditing", "Corporate Taxation", "Asset Ledgering"]
  },
  {
    id: "m-10",
    name: "Dr. Amit Verma",
    careerId: "psychologist",
    role: "Clinical Psychologist",
    company: "MindPeers India",
    college: "Delhi University / Tata Institute of Social Sciences (TISS)",
    experience: "7 Years Clinical Therapy",
    path: "B.A. Psych at DU → M.Sc. Counseling at TISS → Registered practitioner consulting 500+ clients.",
    achievements: [
      "Conducted 1000+ therapy hours specialized in student anxiety.",
      "Authored 4 research papers on high school competitive exam stress."
    ],
    advice: "Define strong personal boundaries. Empathy is your tool, but emotional isolation is how you protect your longevity.",
    avatar: "AV",
    theme: "from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-600",
    specialties: ["Student Anxiety", "Cognitive Diagnostics", "Supervised Therapy"]
  }
];

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("All");
  
  // Save Mentor State
  const [savedMentors, setSavedMentors] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("careerverse-saved-mentors");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const toggleSaveMentor = (mentorId: string) => {
    const updated = savedMentors.includes(mentorId)
      ? savedMentors.filter(id => id !== mentorId)
      : [...savedMentors, mentorId];
    setSavedMentors(updated);
    localStorage.setItem("careerverse-saved-mentors", JSON.stringify(updated));
  };

  // Interaction Popups
  const [bookingMentor, setBookingMentor] = useState<DetailedMentor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-06-15");
  const [selectedTime, setSelectedTime] = useState("04:00 PM");

  const [questionMentor, setQuestionMentor] = useState<DetailedMentor | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionSuccess, setQuestionSuccess] = useState(false);

  // Handle Bookings
  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingMentor(null);
    }, 2500);

    // Track interaction score increment
    const storedScore = localStorage.getItem("exploration-streak") || "3";
    localStorage.setItem("exploration-streak", String(parseInt(storedScore) + 1));
  };

  // Handle Questions
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setQuestionSuccess(true);
    setTimeout(() => {
      setQuestionSuccess(false);
      setQuestionMentor(null);
      setQuestionText("");
    }, 2500);

    // Track interaction score increment
    const storedScore = localStorage.getItem("exploration-streak") || "3";
    localStorage.setItem("exploration-streak", String(parseInt(storedScore) + 1));
  };

  const filteredMentors = DETAILED_MENTORS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.advice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCareer =
      selectedCareerId === "All" || m.careerId === selectedCareerId;

    const matchesSaved = !showSavedOnly || savedMentors.includes(m.id);

    return matchesSearch && matchesCareer && matchesSaved;
  });

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Mentor Directory
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-violet-500/[0.02] to-transparent">
        <div className="flex items-center gap-1.5 text-purple-600 font-bold text-sm">
          <Award className="h-5 w-5 animate-pulse" />
          <span>Professional Network</span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold text-foreground">
          Learn from Verified Mentors
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Read career paths, notable achievements, and professional advice. Schedule mock work calls or drop questions for customized stream guidance.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, company, or advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 shadow-sm"
          />
        </div>

        {/* Career Room Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCareerId("All")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all shrink-0 ${
              selectedCareerId === "All"
                ? "bg-purple-500 border-purple-500 text-white shadow-sm"
                : "bg-card border-border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            All Fields
          </button>
          {CAREER_LIBRARY.filter(c => DETAILED_MENTORS.some(m => m.careerId === c.id)).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all shrink-0 ${
                selectedCareerId === c.id
                  ? "bg-purple-500 border-purple-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {c.title}
            </button>
          ))}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all shrink-0 flex items-center gap-1.5 ml-auto ${
              showSavedOnly
                ? "bg-rose-500 border-rose-500 text-white shadow-sm"
                : "bg-card border-border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${showSavedOnly ? "fill-white text-white" : "text-muted-foreground"}`} />
            Saved Only
          </button>
        </div>
      </div>

      {/* Mentor Cards List */}
      <div className="space-y-5">
        {filteredMentors.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-muted/10">
            <User className="mx-auto h-8 w-8 text-muted-foreground opacity-60" />
            <p className="mt-2 text-sm font-medium text-foreground">No mentors found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          filteredMentors.map((mentor) => {
            const career = CAREER_LIBRARY.find((c) => c.id === mentor.careerId);
            return (
              <MotionFadeIn key={mentor.id}>
                <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
                  
                  {/* Save Mentor Button */}
                  <button
                    onClick={() => toggleSaveMentor(mentor.id)}
                    className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
                    title={savedMentors.includes(mentor.id) ? "Saved" : "Save Mentor"}
                  >
                    <Star className={`h-4.5 w-4.5 transition-colors ${savedMentors.includes(mentor.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground/55"}`} />
                  </button>

                  {/* Top Details */}
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${mentor.theme} flex items-center justify-center font-bold text-sm border shadow-sm`}>
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground pr-8">
                        {mentor.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                        {mentor.role} • {mentor.company}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold text-purple-600 border border-purple-500/20">
                          {career?.title || mentor.careerId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mentor.specialties.map((spec) => (
                      <span key={spec} className="rounded-lg bg-muted/65 border border-border/50 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Experience and Education */}
                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-muted-foreground border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">{mentor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">{mentor.college}</span>
                    </div>
                  </div>

                  {/* Path timeline description */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" /> Career Path
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-4 border-l-2 border-border/80">
                      {mentor.path}
                    </p>
                  </div>

                  {/* Achievements list */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-muted-foreground/50" /> Notable Highlights
                    </span>
                    <ul className="space-y-1.5 text-xs text-muted-foreground pl-4 list-disc">
                      {mentor.achievements.map((ach, idx) => (
                        <li key={idx} className="leading-snug">{ach}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Advice block */}
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-1.5 relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-primary" /> Advice for Students
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      &ldquo;{mentor.advice}&rdquo;
                    </p>
                  </div>

                  {/* CTA Actions buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <Button 
                      onClick={() => setBookingMentor(mentor)}
                      className="flex-1 h-10 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm shadow-purple-500/20"
                    >
                      <Calendar className="h-4 w-4" /> Book a Session
                    </Button>
                    <Button 
                      onClick={() => setQuestionMentor(mentor)}
                      variant="outline" 
                      className="flex-1 h-10 rounded-xl text-xs font-bold text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted gap-1.5"
                    >
                      <HelpCircle className="h-4 w-4" /> Ask a Question
                    </Button>
                  </div>
                </div>
              </MotionFadeIn>
            );
          })
        )}
      </div>

      {/* Book Session Drawer/Modal */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground">
              Book a 1:1 Video Session
            </h3>
            
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-foreground">Booking Confirmed!</p>
                <p className="text-xs text-muted-foreground">
                  Meeting link and invite has been sent to your registered email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Select your slot with **{bookingMentor.name}** ({bookingMentor.role} at {bookingMentor.company}).
                </p>

                {/* Visual Calendar Day Slots */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Select Date</label>
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {[
                      { day: "Mon", date: "15", fullDate: "2026-06-15" },
                      { day: "Tue", date: "16", fullDate: "2026-06-16" },
                      { day: "Wed", date: "17", fullDate: "2026-06-17" },
                      { day: "Thu", date: "18", fullDate: "2026-06-18" },
                      { day: "Fri", date: "19", fullDate: "2026-06-19" },
                      { day: "Sat", date: "20", fullDate: "2026-06-20" }
                    ].map((d) => (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => setSelectedDate(d.fullDate)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[50px] transition-all shrink-0 ${
                          selectedDate === d.fullDate
                            ? "bg-purple-500 border-purple-500 text-white shadow"
                            : "bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <span className="text-[9px] uppercase font-bold">{d.day}</span>
                        <span className="text-xs font-extrabold mt-1">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Time Slot Pills */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Select Time (IST)</label>
                  <div className="flex flex-wrap gap-2">
                    {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                          selectedTime === t
                            ? "bg-purple-500 border-purple-500 text-white shadow"
                            : "bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <Button type="submit" className="flex-1 h-10 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs">
                    Confirm Booking
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setBookingMentor(null)} className="h-10 px-4 rounded-xl text-xs text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Ask Question Drawer/Modal */}
      {questionMentor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground">
              Ask {questionMentor.name} a Question
            </h3>
            
            {questionSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-foreground">Question Submitted!</p>
                <p className="text-xs text-muted-foreground">
                  The mentor has been notified. You will receive an alert when they respond.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Write your query below. Keep it concise for a faster response.
                </p>

                <textarea
                  placeholder="Ask about entrance exams, work life, stream choice..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 text-foreground"
                  required
                />

                <div className="flex gap-2.5 pt-2">
                  <Button type="submit" className="flex-1 h-10 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs">
                    Submit Question
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setQuestionMentor(null)} className="h-10 px-4 rounded-xl text-xs text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
