"use client";
import "./local-storage-proxy";

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
};

export const BADGES: Badge[] = [
  { id: "first_career", name: "Career Rookie", icon: "🌱", description: "Explored your very first career path" },
  { id: "sim_master", name: "Simulation Hero", icon: "🎮", description: "Completed a story-based job simulation" },
  { id: "quest_complete", name: "Quest Conqueror", icon: "🏆", description: "Successfully finished a Career Quest" },
  { id: "skill_unlocked", name: "Skill Seeker", icon: "⚡", description: "Unlocked a node in the interactive Skill Tree" },
  { id: "dna_master", name: "Self Analyst", icon: "🧬", description: "Completed Career DNA analysis" },
  { id: "mentor_talk", name: "Networker", icon: "🤝", description: "Visited a Mentor profile or booked a session" }
];

export function getXp(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("careerverse-xp") || "0");
}

export function getLevel(): number {
  const xp = getXp();
  return Math.floor(xp / 400) + 1; // 400 XP per level
}

export function getStreak(): number {
  if (typeof window === "undefined") return 3;
  return Number(localStorage.getItem("exploration-streak") || "3");
}

export function getBadges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("careerverse-badges") || "[\"first_career\"]");
  } catch {
    return ["first_career"];
  }
}

export function getExplorerRank(): string {
  const level = getLevel();
  if (level <= 1) return "Novice";
  if (level === 2) return "Pathfinder";
  if (level === 3) return "Vanguard";
  if (level === 4) return "Master Scout";
  return "Future Architect";
}

export function addXp(amount: number, reason: string): { gained: number; oldLevel: number; newLevel: number; leveledUp: boolean } {
  if (typeof window === "undefined") return { gained: 0, oldLevel: 1, newLevel: 1, leveledUp: false };

  const currentXp = getXp();
  const nextXp = currentXp + amount;
  localStorage.setItem("careerverse-xp", String(nextXp));

  const oldLevel = Math.floor(currentXp / 400) + 1;
  const newLevel = Math.floor(nextXp / 400) + 1;
  const leveledUp = newLevel > oldLevel;

  // Dispatch custom event for global overlay
  const event = new CustomEvent("careerverse-xp-gained", {
    detail: {
      amount,
      reason,
      oldLevel,
      newLevel,
      leveledUp,
      totalXp: nextXp
    }
  });
  window.dispatchEvent(event);

  return { gained: amount, oldLevel, newLevel, leveledUp };
}

export function unlockBadge(badgeId: string): boolean {
  if (typeof window === "undefined") return false;
  const currentBadges = getBadges();
  if (currentBadges.includes(badgeId)) return false;

  const nextBadges = [...currentBadges, badgeId];
  localStorage.setItem("careerverse-badges", JSON.stringify(nextBadges));

  // Add 100 XP as a reward for unlocking a badge!
  addXp(100, `Earned Badge: ${BADGES.find(b => b.id === badgeId)?.name || badgeId}`);

  return true;
}
