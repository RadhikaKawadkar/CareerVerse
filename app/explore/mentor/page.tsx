"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Send, Bot, User, Lightbulb 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/layout/app-shell";
import { getGuestProfile } from "@/lib/profile-storage";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { analyzeProfile } from "@/lib/results-engine";
import { type GuestProfile } from "@/types/profile";

type Message = {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: Date;
};

const SUGGESTED_PROMPTS = [
  "Should I take Science if I enjoy coding?",
  "Can I become a lawyer through Arts?",
  "What if my parents want Engineering but I don't?",
  "What does a Fashion Designer actually do daily?"
];

export default function AIMentorPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    const prof = getGuestProfile();
    setProfile(prof);

    // Initial greeting
    const name = prof.firstName || "Explorer";
    setMessages([
      {
        id: "welcome",
        sender: "mentor",
        text: `Hello ${name}! I am your AI Career Mentor. I have evaluated your Onboarding inputs and your Career DNA. Ask me any questions about choosing streams, handling academic pressure, college options, or the daily realities of different careers!`,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Load profile stats
  const results = analyzeProfile(profile);
  const dna = results.careerDNA;
  const archetype = results.archetype;
  const recommendations = results.careerRecommendations;

  // Bookmarks
  let bookmarks: string[] = [];
  try {
    const stored = localStorage.getItem("careerverse-bookmarks");
    if (stored) bookmarks = JSON.parse(stored);
  } catch {}

  // Completed Simulations
  const completedSims: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("simulation-")) {
      try {
        const simData = JSON.parse(localStorage.getItem(key) || "{}");
        if (simData.completed) {
          completedSims.push(key.replace("simulation-", ""));
        }
      } catch {}
    }
  }

  function getMentorResponse(question: string): string {
    const q = question.toLowerCase();
    const name = profile?.firstName || "there";
    const grade = profile?.grade || "your grade";
    const pressure = profile?.careerPressure || "myself";
    
    const pressureLabelMap: Record<string, string> = {
      parents: "parents",
      teachers: "teachers",
      friends: "friends",
      "social-media": "social media",
      myself: "yourself",
      "not-sure": "expectations"
    };
    const pressureSource = pressureLabelMap[pressure] || "others";

    if (q.includes("parent") || q.includes("pressure") || (q.includes("engineering") && q.includes("want"))) {
      return `Hey ${name}, navigating expectations from others is one of the toughest parts of being in Grade ${grade}. During onboarding, you indicated that you feel pressure primarily from **${pressureSource}**.

When ${pressureSource === "yourself" ? "you" : "your " + pressureSource} push for traditional paths like Engineering, it usually comes from a place of seeking stability. However, your Career DNA reveals that you score **${dna.creativity}% in Creativity** and **${dna.riskTolerance}% in Risk Tolerance**. This indicates a high drive for creative autonomy. 

**My Advice:** Don't start with a conflict. Try a bridge strategy: suggest doing a dual-track exploration. Show them the tangible roadmaps we reviewed on CareerVerse (like how Product Managers, UI/UX designers, or entrepreneurs combine technical skills with design). If you are looking to build, tell them: *'I want to build real systems, and exploring a design or business pathway is how I can apply this engineering logic practically.'*`;
    }

    if (q.includes("science") && (q.includes("coding") || q.includes("code") || q.includes("computer"))) {
      const sweFinished = completedSims.includes("software-engineer") || profile?.sweCompleted;
      return `Great question, ${name}! If you enjoy coding, taking Science (specifically Physics and Mathematics - PCM) in Grade 11 & 12 is the most direct pathway to traditional computer science degrees (B.Tech/BE) in India. Your **Analytical DNA is at ${dna.analytical}%**, which strongly matches the logical constraints of coding.

${sweFinished ? "Since you've successfully completed the Software Engineer simulation on CareerVerse, you've experienced firsthand that coding involves systems architecture, debugging tradeoffs, and team sprints." : "Try completing the Software Engineer simulation on the Explore Hub to feel what daily code deployment actually involves."}

**Alternative Pathways:** If Science feels too grinding, you can also take Commerce with Mathematics or even Arts with Computer Science/Informatics Practices. This keeps you eligible for BCA + MCA degrees, B.Sc. in IT, or design-focused frontend engineering roles. Your logical score shows you can handle the code, so choose the stream that lets you maintain a strong academic score without burning out.`;
    }

    if (q.includes("lawyer") || q.includes("law") || q.includes("arts")) {
      return `Absolutely, ${name}! In fact, entering law through the Humanities/Arts stream is highly traditional and offers a massive advantage in reading comprehension, critical writing, and sociological analysis.

Your **Collaboration/Leadership DNA is at ${dna.collaboration}%**, and your **Analytical score is ${dna.analytical}%**. Law requires intense reading (auditing 500-page case files) and logical argumentation.

**Roadmap:** 
1. **Grade 11 & 12:** Focus on History, Political Science, Legal Studies, or Economics.
2. **Exams:** Crack CLAT (Common Law Admission Test) or LSAT.
3. **College:** Pursue a 5-year integrated BA LLB program from top National Law Universities (like NLSIU Bangalore or NALSAR Hyderabad).
It's a premium, high-impact career that perfectly accommodates an Arts background.`;
    }

    if (q.includes("fashion") || q.includes("designer") || q.includes("do daily")) {
      return `Fashion Design is a high-growth creative business, ${name}. Your **Creativity DNA is at ${dna.creativity}%**, which matches the artistic demands of sketching, fabric selection, and draping.

**Daily Life of a Fashion Designer:**
- **Morning (9:00 AM - 11:30 AM):** Sketching initial mood boards, auditing fabric swatches, and color palettes.
- **Afternoon (12:00 PM - 3:30 PM):** Auditing material costs and working with patterns, sourcing local manufacturers who can execute within tight budgets.
- **Evening (4:00 PM - 6:00 PM):** Conducting fitting sessions, coordinating production timelines, and preparing marketing campaigns for collections.

**Path:** Prepare for NIFT or NID entrance exams (GAT & CAT). Remember, fashion is commercial: you spend 60% of your time on cost sheets, supply grids, and vendor management, and 40% on sketching!`;
    }

    // Default matching
    const topRec = recommendations[0] ? recommendations[0].careerTitle : "Software Engineer";
    return `Hi ${name}! As a **${archetype.name}** Archetype, you are naturally geared toward paths requiring **${archetype.badge.toLowerCase()}**. Your top recommended career match is **${topRec}**.

Your profile shows:
- **Strengths:** ${dna.strengths.slice(0, 2).join(", ")}
- **Work Style:** ${dna.workStyle}
- **Interests Saved:** ${bookmarks.length > 0 ? bookmarks.map(id => CAREER_LIBRARY.find(c => c.id === id)?.title || id).join(", ") : "General exploration"}

Ask me about stream selections, entrance exams, or day-in-the-life realities of any career like Lawyer, Architect, Pilot, or Content Creator! I'll break it down using your DNA metrics.`;
  }

  function handleSend(text: string) {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getMentorResponse(text);
      const mentorMsg: Message = {
        id: String(Date.now() + 1),
        sender: "mentor",
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <AppShell className="max-w-lg flex flex-col h-screen py-4 px-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 shrink-0">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-1.5">
          <Bot className="h-5 w-5 text-primary" />
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">
            AI Career Mentor
          </h1>
        </div>
        <div className="w-9 h-9" aria-hidden /> {/* Spacer */}
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
              msg.sender === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted border border-border/80 text-muted-foreground"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
            </div>
            
            <div className={`rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm" 
                : "bg-card border border-border/60 text-foreground rounded-tl-none shadow-sm"
            }`}>
              {msg.text.split("\n\n").map((para, pIdx) => (
                <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
                  {para.split("\n").map((line, lIdx) => (
                    <span key={lIdx} className="block mt-0.5">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="h-8 w-8 shrink-0 rounded-full bg-muted border border-border/80 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="rounded-2xl p-4 bg-card border border-border/60 text-muted-foreground rounded-tl-none shadow-sm flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Block */}
      {messages.length === 1 && (
        <div className="p-3 bg-muted/30 border border-border/50 rounded-2xl mb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Suggested Questions
          </div>
          <div className="grid gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/20 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Footer */}
      <div className="pt-2 border-t border-border shrink-0 bg-background flex gap-2">
        <Input
          placeholder="Ask about stream choice, exams, or colleges..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend(inputVal)}
          className="h-11 rounded-xl bg-card border-border/85 text-xs"
        />
        <Button 
          onClick={() => handleSend(inputVal)}
          className="h-11 w-11 rounded-xl p-0 shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </AppShell>
  );
}
