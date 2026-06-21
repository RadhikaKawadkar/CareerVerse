"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, TrendingUp, Sparkles, Globe, Laptop, 
  Search, BarChart3 
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";

type IndustryTrend = {
  id: string;
  name: string;
  stream: string;
  growthRate: number; // percentage
  aiAutomationRisk: number; // percentage
  remoteWorkIndex: number; // 1-5
  globalOpportunityIndex: number; // 1-5
  demandLevel: "High" | "Medium" | "Critical";
  outlookDescription: string;
};

const INDUSTRY_TRENDS: IndustryTrend[] = [
  {
    id: "trend-1",
    name: "Data Science & AI Engineering",
    stream: "Science",
    growthRate: 28,
    aiAutomationRisk: 15,
    remoteWorkIndex: 5,
    globalOpportunityIndex: 5,
    demandLevel: "Critical",
    outlookDescription: "Generative AI creates coding assistants, but systems architecture, model tuning, and data safety compliance still require human supervision."
  },
  {
    id: "trend-2",
    name: "Corporate & M&A Law",
    stream: "Arts",
    growthRate: 14,
    aiAutomationRisk: 22,
    remoteWorkIndex: 2,
    globalOpportunityIndex: 4,
    demandLevel: "High",
    outlookDescription: "AI automates routine contract drafting, but high-stakes courtroom litigation, stakeholder negotiation, and ethical policy design are fully resilient."
  },
  {
    id: "trend-3",
    name: "Sustainable Architecture",
    stream: "Science",
    growthRate: 18,
    aiAutomationRisk: 12,
    remoteWorkIndex: 3,
    globalOpportunityIndex: 5,
    demandLevel: "High",
    outlookDescription: "Global focus on carbon neutral frameworks drives massive demand for eco-certified LEED designers capable of structural remodeling."
  },
  {
    id: "trend-4",
    name: "Clinical Therapy & Psychiatry",
    stream: "Arts",
    growthRate: 22,
    aiAutomationRisk: 5,
    remoteWorkIndex: 4,
    globalOpportunityIndex: 4,
    demandLevel: "Critical",
    outlookDescription: "Completely immune to automation. Empathy-centric counseling, developmental diagnostics, and student anxiety resolution are growing rapidly."
  },
  {
    id: "trend-5",
    name: "FinTech & Wealth Management",
    stream: "Commerce",
    growthRate: 16,
    aiAutomationRisk: 25,
    remoteWorkIndex: 4,
    globalOpportunityIndex: 4,
    demandLevel: "High",
    outlookDescription: "Algorithmic pipelines handle trading sheets, but custom portfolio allocation and corporate taxation advisory remain heavily human-driven."
  },
  {
    id: "trend-6",
    name: "UX/UI Brand Design",
    stream: "Arts",
    growthRate: 20,
    aiAutomationRisk: 30,
    remoteWorkIndex: 5,
    globalOpportunityIndex: 5,
    demandLevel: "High",
    outlookDescription: "AI asset generation speeds up canvas layouts drafting, but customized branding logic and customer-journey mapping require human intuition."
  }
];

export default function FutureTrendsPage() {
  const [activeTab, setActiveTab] = useState<"growth" | "ai" | "remote">("growth");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrends = INDUSTRY_TRENDS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Future Trends Center
        </h1>
        <div className="w-9 h-9" aria-hidden />
      </div>

      {/* Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-violet-500/[0.02] to-transparent">
        <div className="flex items-center gap-1.5 text-orange-600 font-bold text-sm">
          <TrendingUp className="h-5 w-5 animate-pulse" />
          <span>Future of Work Analytics</span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold text-foreground">
          Identify High-Demand Fields
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Audit telemetry metrics for YoY Growth rates, remote work flexibility index, and AI automation resilience. Prepare for careers aligning with the global market expansion.
        </p>
      </div>

      {/* Segmented Controls */}
      <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60">
        <button
          onClick={() => setActiveTab("growth")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === "growth"
              ? "bg-background text-orange-600 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Industry Growth
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === "ai"
              ? "bg-background text-orange-600 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          AI Automation Risk
        </button>
        <button
          onClick={() => setActiveTab("remote")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === "remote"
              ? "bg-background text-orange-600 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Remote & Global Flex
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter trends by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 shadow-sm"
        />
      </div>

      {/* Visual Chart Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5 text-orange-500" />
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">
              {activeTab === "growth" && "YoY Growth Rate (India Index)"}
              {activeTab === "ai" && "AI Automation Risk Metrics"}
              {activeTab === "remote" && "Remote Work Flexibility (1-5)"}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">2026 Forecast</span>
        </div>

        {/* Dynamic Chart Visual */}
        <div className="space-y-4">
          {filteredTrends.map((trend) => {
            let value = 0;
            let displayVal = "";
            let color = "bg-orange-500";

            if (activeTab === "growth") {
              value = (trend.growthRate / 35) * 100;
              displayVal = `+${trend.growthRate}% YoY`;
              color = "bg-emerald-500";
            } else if (activeTab === "ai") {
              value = trend.aiAutomationRisk;
              displayVal = `${trend.aiAutomationRisk}% Risk`;
              color = trend.aiAutomationRisk > 25 ? "bg-red-500" : "bg-sky-500";
            } else {
              value = (trend.remoteWorkIndex / 5) * 100;
              displayVal = `${trend.remoteWorkIndex}/5 Flex`;
              color = "bg-violet-500";
            }

            return (
              <div key={trend.id} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">{trend.name}</span>
                  <span className="font-extrabold">{displayVal}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Details Cards */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Detailed Forecast Cards</span>
        
        {filteredTrends.map((trend) => (
          <MotionFadeIn key={trend.id}>
            <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-orange-500/20 transition-all duration-200">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                    trend.stream === "Science" && "bg-sky-500/10 text-sky-600" ||
                    trend.stream === "Commerce" && "bg-amber-500/10 text-amber-600" ||
                    "bg-purple-500/10 text-purple-600"
                  }`}>
                    {trend.stream} Stream
                  </span>
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground mt-1.5">
                    {trend.name}
                  </h4>
                </div>
                
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  trend.demandLevel === "Critical"
                    ? "bg-red-500/10 border-red-500/20 text-red-600"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                }`}>
                  {trend.demandLevel} Demand
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {trend.outlookDescription}
              </p>

              {/* Sub Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-border/40 text-center text-xs">
                
                {/* AI Impact */}
                <div className="rounded-xl bg-muted/40 p-2.5 border border-border/40 space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block">AI Threat</span>
                  <div className="flex items-center justify-center gap-1 font-extrabold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                    <span>{trend.aiAutomationRisk}%</span>
                  </div>
                </div>

                {/* Remote Flex */}
                <div className="rounded-xl bg-muted/40 p-2.5 border border-border/40 space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block">Remote Flex</span>
                  <div className="flex items-center justify-center gap-1 font-extrabold text-foreground">
                    <Laptop className="h-3.5 w-3.5 text-violet-500" />
                    <span>{trend.remoteWorkIndex}/5</span>
                  </div>
                </div>

                {/* Global Opportunity */}
                <div className="rounded-xl bg-muted/40 p-2.5 border border-border/40 space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block">Global Reach</span>
                  <div className="flex items-center justify-center gap-1 font-extrabold text-foreground">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{trend.globalOpportunityIndex}/5</span>
                  </div>
                </div>

              </div>
            </div>
          </MotionFadeIn>
        ))}
      </div>
    </AppShell>
  );
}
