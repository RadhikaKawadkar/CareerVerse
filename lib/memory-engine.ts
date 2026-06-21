"use client";

import { getXp, getLevel, getStreak, getExplorerRank, getBadges } from "@/lib/gamification";
import { getGuestProfile, saveGuestProfile } from "@/lib/profile-storage";
import { analyzeProfile, type AnalysisResult } from "@/lib/results-engine";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { CAREER_JOURNEYS } from "@/lib/journey-database";

export type UnifiedProfile = {
  name: string;
  grade: number | null;
  xp: number;
  level: number;
  streak: number;
  rank: string;
  badges: string[];
  exploredCareers: string[];
  completedSimulations: string[];
  unlockedEndings: string[];
  unlockedSkills: string[];
  goals: string[]; // career IDs
  journalCount: number;
  dna: {
    analytical: number;
    creativity: number;
    collaboration: number;
    risk: number;
    workStyle: string;
    learningStyle: string;
    communicationScore: number;
    creativityScore: number;
    leadershipScore: number;
    analyticalScore: number;
    confidenceScore: number;
    decisionPatterns: string[];
    strengthClusters: string[];
    growthHistory: { label: string; analytical: number; creativity: number; leadership: number }[];
  };
};

export function getUnifiedProfile(): UnifiedProfile {
  if (typeof window === "undefined") {
    return {
      name: "Student", grade: 10, xp: 0, level: 1, streak: 3, rank: "Novice", badges: [],
      exploredCareers: [], completedSimulations: [], unlockedEndings: [], unlockedSkills: [],
      goals: [], journalCount: 0,
      dna: { 
        analytical: 50, creativity: 50, collaboration: 50, risk: 50, workStyle: "Balanced", learningStyle: "Visual",
        communicationScore: 50, creativityScore: 50, leadershipScore: 50, analyticalScore: 50, confidenceScore: 75,
        decisionPatterns: ["Exploring options"], strengthClusters: [], growthHistory: []
      }
    };
  }

  // Fetch basic profile
  const basicProfile = getGuestProfile();
  let analysisResult: AnalysisResult | null = null;
  try {
    analysisResult = analyzeProfile(basicProfile);
  } catch {}

  // Fetch list of explored careers
  let explored: string[] = [];
  try {
    explored = JSON.parse(localStorage.getItem("explored-careers") || "[]");
  } catch {}

  // Fetch completed simulations
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

  // Fetch unlocked endings
  let endings: string[] = [];
  try {
    endings = JSON.parse(localStorage.getItem("careerverse-unlocked-endings") || "[]");
  } catch {}

  // Fetch unlocked skills
  let skills: string[] = [];
  try {
    skills = JSON.parse(localStorage.getItem("careerverse-claimed-skills") || "[]");
  } catch {}

  // Fetch goals
  const goalsList: string[] = [];
  try {
    const claimedQuests = localStorage.getItem("careerverse-claimed-milestones") || "[]";
    const questsProgress = JSON.parse(claimedQuests);
    // extract career ids from milestones (swe-m1, law-m1, fas-m1)
    if (questsProgress.some((q: string) => q.startsWith("swe"))) goalsList.push("software-engineer");
    if (questsProgress.some((q: string) => q.startsWith("law"))) goalsList.push("lawyer");
    if (questsProgress.some((q: string) => q.startsWith("fas"))) goalsList.push("fashion-designer");
  } catch {}

  // Fetch journal entries
  let journalCount = 0;
  try {
    const journalEntries = JSON.parse(localStorage.getItem("careerverse-journal-entries") || "[]");
    journalCount = journalEntries.length;
  } catch {}

  // Build DNA scores
  const dna = {
    analytical: analysisResult?.careerDNA?.analytical || 55,
    creativity: analysisResult?.careerDNA?.creativity || 55,
    collaboration: analysisResult?.careerDNA?.collaboration || 55,
    risk: analysisResult?.careerDNA?.riskTolerance || 55,
    workStyle: analysisResult?.careerDNA?.workStyle || "Analytical Architect",
    learningStyle: analysisResult?.careerDNA?.learningStyle || "Kinesthetic",
    communicationScore: analysisResult?.careerDNA?.communicationScore || 55,
    creativityScore: analysisResult?.careerDNA?.creativityScore || 55,
    leadershipScore: analysisResult?.careerDNA?.leadershipScore || 55,
    analyticalScore: analysisResult?.careerDNA?.analyticalScore || 55,
    confidenceScore: analysisResult?.careerDNA?.confidenceScore || 75,
    decisionPatterns: analysisResult?.careerDNA?.decisionPatterns || ["Exploring options"],
    strengthClusters: analysisResult?.careerDNA?.strengthClusters || [],
    growthHistory: analysisResult?.careerDNA?.growthHistory || []
  };

  const resultProfile = {
    name: basicProfile.firstName || "Student",
    grade: basicProfile.grade,
    xp: getXp(),
    level: getLevel(),
    streak: getStreak(),
    rank: getExplorerRank(),
    badges: getBadges(),
    exploredCareers: explored,
    completedSimulations: completedSims,
    unlockedEndings: endings,
    unlockedSkills: skills,
    goals: goalsList,
    journalCount,
    dna
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("careerverse-unified-profile", JSON.stringify(resultProfile));
  }

  return resultProfile;
}

export type CompatibilityResult = {
  score: number;
  reasoning: string;
};

export function getCareerCompatibility(careerId: string): CompatibilityResult {
  const profile = getUnifiedProfile();
  
  // Find career details in library
  const career = CAREER_LIBRARY.find(c => c.id === careerId);
  const journey = CAREER_JOURNEYS[careerId];
  if (!career && !journey) return { score: 50, reasoning: "Insufficent profile metrics to evaluate fit." };

  const title = career ? career.title : (journey ? journey.title : careerId);
  const stream = career ? career.stream : "Science";

  // Base score from DNA alignment
  let score = 60;
  const { analytical, creativity, collaboration, risk } = profile.dna;

  if (stream === "Science") {
    score += Math.floor((analytical - 50) * 0.4);
  } else if (stream === "Arts") {
    score += Math.floor((creativity - 50) * 0.4);
  } else if (stream === "Commerce") {
    score += Math.floor((collaboration - 50) * 0.3) + Math.floor((analytical - 50) * 0.1);
  } else {
    score += Math.floor((risk - 50) * 0.3) + Math.floor((creativity - 50) * 0.1);
  }

  // Adjustments based on user behavior
  const isGoal = profile.goals.includes(careerId);
  const isSimCompleted = profile.completedSimulations.includes(careerId);
  const isExplored = profile.exploredCareers.includes(careerId);

  if (isGoal) score += 10;
  if (isSimCompleted) score += 12;
  if (isExplored) score += 5;

  // Clamp score
  score = Math.max(35, Math.min(98, score));

  // Generate personalized reasoning
  let reasoning = "";
  if (score >= 85) {
    reasoning = `Your dominant ${profile.dna.workStyle} DNA aligns perfectly with ${title}. `;
    if (isSimCompleted) {
      reasoning += `Your choices during the workplace simulation demonstrated high competency in operational challenges. `;
    } else {
      reasoning += `Completing this career's journey simulation is highly recommended to finalize your calibration. `;
    }
    if (isGoal) {
      reasoning += `You have active preparation quests set for this path.`;
    }
  } else if (score >= 70) {
    reasoning = `You show moderate alignment with ${title}. Your ${profile.dna.learningStyle} learning style is compatible with the academic degrees, though your DNA highlights a stronger affinity for other streams.`;
  } else {
    reasoning = `Your DNA traits indicate a lower natural preference for ${title}. Your strengths are more aligned with paths requiring higher ${analytical > creativity ? "analytical problem solving" : "creative expression"}.`;
  }

  return { score, reasoning };
}

export type DynamicRecommendations = {
  recommendedNext: { id: string; title: string; reasoning: string };
  similarCareers: { id: string; title: string; score: number }[];
  unexpectedMatch: { id: string; title: string; reasoning: string };
};

export function getDynamicRecommendations(): DynamicRecommendations {
  const profile = getUnifiedProfile();
  
  // Find highest scoring careers
  const scoredCareers = CAREER_LIBRARY.map(c => ({
    id: c.id,
    title: c.title,
    score: getCareerCompatibility(c.id).score
  })).sort((a, b) => b.score - a.score);

  // Recommended next: Highest scoring unexplored career!
  const unexplored = scoredCareers.filter(c => !profile.exploredCareers.includes(c.id));
  const nextTarget = unexplored.length > 0 ? unexplored[0] : scoredCareers[0];

  const nextReasoning = `Based on your ${profile.dna.workStyle} archetype and ${profile.dna.learningStyle} learning style, exploring ${nextTarget.title} will unlock valuable complementary skills in your interactive tree.`;

  // Similar: Top 3 similar careers (excluding current next target)
  const similar = scoredCareers
    .filter(c => c.id !== nextTarget.id)
    .slice(0, 3);

  // Unexpected match: A career with a moderate score from a different stream, showcasing adaptability!
  const currentStream = CAREER_LIBRARY.find(c => c.id === nextTarget.id)?.stream || "Science";
  const differentStreamCareers = CAREER_LIBRARY.filter(c => c.stream !== currentStream);
  
  const unexpectedScored = differentStreamCareers.map(c => ({
    id: c.id,
    title: c.title,
    score: getCareerCompatibility(c.id).score
  })).sort((a, b) => b.score - a.score);

  const unexpectedTarget = unexpectedScored.length > 0 ? unexpectedScored[0] : scoredCareers[scoredCareers.length - 1];
  const unexpectedReasoning = `Though in a different stream, your decisions show high adaptability in ${profile.dna.risk > 60 ? "taking calculated risks" : "collaborating across groups"}, making ${unexpectedTarget.title} an intriguing match.`;

  return {
    recommendedNext: { id: nextTarget.id, title: nextTarget.title, reasoning: nextReasoning },
    similarCareers: similar,
    unexpectedMatch: { id: unexpectedTarget.id, title: unexpectedTarget.title, reasoning: unexpectedReasoning }
  };
}

export function syncUnifiedProfile(): UnifiedProfile {
  const profile = getUnifiedProfile();
  if (typeof window !== "undefined") {
    localStorage.setItem("careerverse-unified-profile", JSON.stringify(profile));
  }
  return profile;
}

export function saveUnifiedProfile(updates: Partial<UnifiedProfile>): UnifiedProfile {
  if (typeof window === "undefined") return getUnifiedProfile();
  
  const current = getUnifiedProfile();
  const next = { ...current, ...updates };

  // Write basic profile updates back to profile-storage.ts
  const basic = getGuestProfile();
  if (updates.name !== undefined) basic.firstName = updates.name;
  if (updates.grade !== undefined) basic.grade = updates.grade;
  saveGuestProfile(basic);

  // Sync other localStorage keys for backwards compatibility
  if (updates.exploredCareers !== undefined) {
    localStorage.setItem("explored-careers", JSON.stringify(updates.exploredCareers));
  }
  if (updates.unlockedEndings !== undefined) {
    localStorage.setItem("careerverse-unlocked-endings", JSON.stringify(updates.unlockedEndings));
  }
  if (updates.unlockedSkills !== undefined) {
    localStorage.setItem("careerverse-claimed-skills", JSON.stringify(updates.unlockedSkills));
  }
  if (updates.goals !== undefined) {
    // Sync quest milestones
    const milestones = updates.goals.map(g => {
      if (g === "software-engineer") return "swe-m1";
      if (g === "lawyer") return "law-m1";
      if (g === "fashion-designer") return "fas-m1";
      return `${g.substring(0,3)}-m1`;
    });
    localStorage.setItem("careerverse-claimed-milestones", JSON.stringify(milestones));
  }
  
  // Save the full unified object
  localStorage.setItem("careerverse-unified-profile", JSON.stringify(next));
  return next;
}
