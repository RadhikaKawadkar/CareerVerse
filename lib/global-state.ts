"use client";

import { migrateGuestToUserKeys } from "./local-storage-proxy";
import { useEffect, useState, useCallback } from "react";
import { getGuestProfile, saveGuestProfile } from "./profile-storage";
import { analyzeProfile } from "./results-engine";
import { CAREER_LIBRARY } from "./career-library";
import { getXp, getLevel, getStreak, getExplorerRank, getBadges } from "./gamification";
import { supabase } from "./supabase";
import { 
  saveProfile as dbSaveProfile, 
  saveCareerDNA as dbSaveDNA,
  saveBookmark as dbSaveBookmark,
  saveJournalEntry as dbSaveJournalEntry,
  saveQuestProgress as dbSaveQuestProgress,
  saveSkillProgress as dbSaveSkillProgress,
  getProfile as dbGetProfile,
  getCareerDNA as dbGetDNA,
  getSimulations as dbGetSimulations,
  getJournalEntries as dbGetJournalEntries,
  getBookmarks as dbGetBookmarks,
  getQuestProgress as dbGetQuestProgress,
  getSkillProgress as dbGetSkillProgress
} from "./supabase-service";
import { migrateLocalDataToSupabase } from "./supabase-migration";

export type CareerVerseNotification = {
  id: string;
  type: "achievement" | "mentor" | "quest" | "skill" | "recommendation";
  title: string;
  message: string;
  timestamp: string; // ISO
  read: boolean;
};

export type QuestProgress = {
  active: string[];
  completed: string[];
  milestones: string[];
};

export type JournalReflection = {
  id: string;
  timestamp: string; // ISO
  careerId: string;
  excited: string;
  difficult: string;
  surprised: string;
  feeling: number;
};

export type UnifiedProfileV12 = {
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
  interests: string[];
  personalitySignals: string[];
  favoriteCareers: string[]; // bookmarks
  questProgress: QuestProgress;
  journalReflections: JournalReflection[];
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

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ----------------- NOTIFICATIONS API -----------------
export function getNotifications(): CareerVerseNotification[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem("careerverse-notifications") || "[]");
  } catch {
    return [];
  }
}

export function addNotification(
  type: CareerVerseNotification["type"],
  title: string,
  message: string
): CareerVerseNotification {
  const newNotif: CareerVerseNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  if (isBrowser()) {
    try {
      const current = getNotifications();
      const next = [newNotif, ...current].slice(0, 30); // Keep last 30
      localStorage.setItem("careerverse-notifications", JSON.stringify(next));

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("careerverse-notification-added", { detail: newNotif })
      );
    } catch (e) {
      console.error("Failed to save notification", e);
    }
  }

  return newNotif;
}

export function markNotificationsAsRead(): void {
  if (!isBrowser()) return;
  try {
    const current = getNotifications();
    const next = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem("careerverse-notifications", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("careerverse-notifications-updated"));
  } catch (e) {
    console.error("Failed to mark notifications read", e);
  }
}

export function clearNotifications(): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem("careerverse-notifications", "[]");
    window.dispatchEvent(new CustomEvent("careerverse-notifications-updated"));
  } catch (e) {
    console.error("Failed to clear notifications", e);
  }
}

export function getUnreadNotificationsCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// ----------------- CENTRAL PROFILE ENGINE -----------------
export function getUnifiedProfileV12(): UnifiedProfileV12 {
  const defaultProfile: UnifiedProfileV12 = {
    name: "Student",
    grade: 10,
    xp: 0,
    level: 1,
    streak: 3,
    rank: "Novice",
    badges: [],
    exploredCareers: [],
    completedSimulations: [],
    unlockedEndings: [],
    unlockedSkills: [],
    goals: [],
    journalCount: 0,
    interests: ["Technology", "Science"],
    personalitySignals: ["Explorer"],
    favoriteCareers: [],
    questProgress: { active: [], completed: [], milestones: [] },
    journalReflections: [],
    dna: {
      analytical: 50,
      creativity: 50,
      collaboration: 50,
      risk: 50,
      workStyle: "Balanced",
      learningStyle: "Visual",
      communicationScore: 50,
      creativityScore: 50,
      leadershipScore: 50,
      analyticalScore: 50,
      confidenceScore: 75,
      decisionPatterns: ["Exploring options"],
      strengthClusters: [],
      growthHistory: [],
    },
  };

  if (!isBrowser()) {
    return defaultProfile;
  }

  // Fetch basic profile
  const basicProfile = getGuestProfile();
  let analysisResult = null;
  try {
    analysisResult = analyzeProfile(basicProfile);
  } catch {}

  // Explored
  let explored: string[] = [];
  try {
    explored = JSON.parse(localStorage.getItem("explored-careers") || "[]");
  } catch {}

  // Bookmarks / Favorites
  let favoriteCareers: string[] = [];
  try {
    favoriteCareers = JSON.parse(localStorage.getItem("careerverse-bookmarks") || "[]");
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

  // Endings
  let endings: string[] = [];
  try {
    endings = JSON.parse(localStorage.getItem("careerverse-unlocked-endings") || "[]");
  } catch {}

  // Skills
  let skills: string[] = [];
  try {
    skills = JSON.parse(localStorage.getItem("careerverse-claimed-skills") || "[]");
  } catch {}

  // Journal entries
  let reflections: JournalReflection[] = [];
  try {
    reflections = JSON.parse(localStorage.getItem("careerverse-journal-entries") || "[]");
  } catch {}

  // Quests & Milestones
  let activeQuests: string[] = [];
  let completedQuests: string[] = [];
  let milestones: string[] = [];
  try {
    milestones = JSON.parse(localStorage.getItem("careerverse-claimed-milestones") || "[]");
    completedQuests = JSON.parse(localStorage.getItem("careerverse-completed-quests") || "[]");
  } catch {}

  // Build goals list compatible with earlier version
  const goalsList: string[] = [];
  if (milestones.some((q: string) => q.startsWith("swe"))) goalsList.push("software-engineer");
  if (milestones.some((q: string) => q.startsWith("law"))) goalsList.push("lawyer");
  if (milestones.some((q: string) => q.startsWith("fas"))) goalsList.push("fashion-designer");
  // Active quests are careers you have favorited or set milestones for but haven't fully completed simulations for
  activeQuests = favoriteCareers.filter((id) => !completedSims.includes(id));

  // DNA
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
    growthHistory: analysisResult?.careerDNA?.growthHistory || [],
  };

  // Derive interests
  const interests: string[] = [];
  if (analysisResult?.careerDNA?.interests) {
    interests.push(...analysisResult.careerDNA.interests);
  } else {
    // defaults based on grade / subject selection
    if (basicProfile.grade === 11 || basicProfile.grade === 12) {
      interests.push("Academic Deepening", "Entrance Prep");
    }
    if (completedSims.length > 0) {
      completedSims.forEach((id) => {
        const car = CAREER_LIBRARY.find((c) => c.id === id);
        if (car && !interests.includes(car.category)) {
          interests.push(car.category);
        }
      });
    }
  }
  if (interests.length === 0) {
    interests.push("Technology", "Design", "Research");
  }

  // Personality Signals
  const personalitySignals = [...dna.decisionPatterns];
  if (dna.analytical > 65 && !personalitySignals.includes("Analyst")) personalitySignals.push("Analyst");
  if (dna.creativity > 65 && !personalitySignals.includes("Creator")) personalitySignals.push("Creator");
  if (dna.collaboration > 65 && !personalitySignals.includes("Leader")) personalitySignals.push("Leader");
  if (dna.risk > 60 && !personalitySignals.includes("Innovator")) personalitySignals.push("Innovator");

  const resultProfile: UnifiedProfileV12 = {
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
    journalCount: reflections.length,
    interests,
    personalitySignals,
    favoriteCareers,
    questProgress: {
      active: activeQuests,
      completed: completedQuests,
      milestones,
    },
    journalReflections: reflections,
    dna,
  };

  localStorage.setItem("careerverse-unified-profile", JSON.stringify(resultProfile));
  return resultProfile;
}

export async function syncProfileFromSupabase(userId: string) {
  if (!isBrowser() || !supabase) return;
  try {
    const [
      dbProfile, 
      , 
      dbSims, 
      dbJournal, 
      dbBookmarks, 
      dbQuests, 
      dbSkills
    ] = await Promise.all([
      dbGetProfile(userId),
      dbGetDNA(userId),
      dbGetSimulations(userId),
      dbGetJournalEntries(userId),
      dbGetBookmarks(userId),
      dbGetQuestProgress(userId),
      dbGetSkillProgress(userId),
    ]);

    if (!dbProfile) return;

    // Update basic profile
    const basic = getGuestProfile();
    if (dbProfile.name) basic.firstName = dbProfile.name;
    if (dbProfile.grade) basic.grade = dbProfile.grade;
    saveGuestProfile(basic);

    // Update explored careers
    if (dbProfile.explored_careers) {
      localStorage.setItem("explored-careers", JSON.stringify(dbProfile.explored_careers));
    }

    // Update bookmarks
    const bookmarkIds = dbBookmarks.map(b => b.career_id);
    localStorage.setItem("careerverse-bookmarks", JSON.stringify(bookmarkIds));

    // Update achievements / badges
    if (dbProfile.badges) {
      localStorage.setItem("careerverse-claimed-badges", JSON.stringify(dbProfile.badges));
    }

    // Update journal entries
    const mappedJournal = dbJournal.map(j => ({
      id: j.id,
      timestamp: j.timestamp,
      careerId: j.career_id,
      excited: j.excited || "",
      difficult: j.difficult || "",
      surprised: j.surprised || "",
      feeling: j.feeling || 3,
    }));
    localStorage.setItem("careerverse-journal-entries", JSON.stringify(mappedJournal));

    // Update simulations
    dbSims.forEach(sim => {
      localStorage.setItem(`simulation-${sim.career_id}`, JSON.stringify({
        completed: sim.completed,
        currentSceneIndex: sim.current_scene_index,
        choices: sim.choices,
      }));
    });

    // Update quest progress
    if (dbQuests) {
      localStorage.setItem("careerverse-claimed-milestones", JSON.stringify(dbQuests.milestones || []));
      localStorage.setItem("careerverse-completed-quests", JSON.stringify(dbQuests.completed || []));
    }

    // Update skill progress
    if (dbSkills) {
      localStorage.setItem("careerverse-claimed-skills", JSON.stringify(dbSkills.unlocked_skills || []));
    }

    // Dispatch reload
    window.dispatchEvent(new CustomEvent("careerverse-profile-updated"));
  } catch (e) {
    console.error("Failed to sync from Supabase:", e);
  }
}

export function saveUnifiedProfileV12(updates: Partial<UnifiedProfileV12>): UnifiedProfileV12 {
  if (!isBrowser()) return getUnifiedProfileV12();

  const current = getUnifiedProfileV12();
  const next = { ...current, ...updates };

  // Write basic profile updates back to profile-storage
  const basic = getGuestProfile();
  if (updates.name !== undefined) basic.firstName = updates.name;
  if (updates.grade !== undefined) basic.grade = updates.grade;
  saveGuestProfile(basic);

  // Sync other localStorage keys for compatibility
  if (updates.exploredCareers !== undefined) {
    localStorage.setItem("explored-careers", JSON.stringify(updates.exploredCareers));
  }
  if (updates.unlockedEndings !== undefined) {
    localStorage.setItem("careerverse-unlocked-endings", JSON.stringify(updates.unlockedEndings));
  }
  if (updates.unlockedSkills !== undefined) {
    localStorage.setItem("careerverse-claimed-skills", JSON.stringify(updates.unlockedSkills));
  }
  if (updates.favoriteCareers !== undefined) {
    localStorage.setItem("careerverse-bookmarks", JSON.stringify(updates.favoriteCareers));
  }
  if (updates.journalReflections !== undefined) {
    localStorage.setItem("careerverse-journal-entries", JSON.stringify(updates.journalReflections));
  }
  if (updates.questProgress !== undefined) {
    localStorage.setItem(
      "careerverse-claimed-milestones",
      JSON.stringify(updates.questProgress.milestones)
    );
    localStorage.setItem(
      "careerverse-completed-quests",
      JSON.stringify(updates.questProgress.completed)
    );
  }

  localStorage.setItem("careerverse-unified-profile", JSON.stringify(next));

  // Save to Supabase asynchronously if configured and logged in
  if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userId = session.user.id;
        
        if (updates.name !== undefined || updates.grade !== undefined || updates.xp !== undefined || updates.level !== undefined || updates.streak !== undefined || updates.rank !== undefined || updates.badges !== undefined || updates.interests !== undefined || updates.personalitySignals !== undefined) {
          dbSaveProfile(userId, next);
        }
        if (updates.dna !== undefined) {
          dbSaveDNA(userId, updates.dna);
        }
        if (updates.favoriteCareers !== undefined) {
          // Sync bookmarks
          updates.favoriteCareers.forEach(cid => {
            dbSaveBookmark(userId, cid, true);
          });
        }
        if (updates.journalReflections !== undefined) {
          updates.journalReflections.forEach(j => {
            dbSaveJournalEntry(userId, j);
          });
        }
        if (updates.questProgress !== undefined) {
          dbSaveQuestProgress(
            userId,
            updates.questProgress.active || [],
            updates.questProgress.completed || [],
            updates.questProgress.milestones || []
          );
        }
        if (updates.unlockedSkills !== undefined) {
          dbSaveSkillProgress(userId, updates.unlockedSkills);
        }
      }
    });
  }

  // Dispatch global updates event
  window.dispatchEvent(new CustomEvent("careerverse-profile-updated"));

  return next;
}

// ----------------- REACT HOOKS -----------------
export function useGlobalProfile() {
  const [profile, setProfile] = useState<UnifiedProfileV12 | null>(null);

  const reload = useCallback(() => {
    setProfile(getUnifiedProfileV12());
  }, []);

  useEffect(() => {
    reload();

    const handleUpdate = () => {
      reload();
    };

    window.addEventListener("careerverse-profile-updated", handleUpdate);
    window.addEventListener("careerverse-xp-gained", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          localStorage.setItem("careerverse-active-user-id", session.user.id);
          migrateGuestToUserKeys(session.user.id);
          await migrateLocalDataToSupabase(session.user.id);
          await syncProfileFromSupabase(session.user.id);
        } else {
          localStorage.removeItem("careerverse-active-user-id");
        }
        reload();
      });
      authSubscription = subscription;
    }

    return () => {
      window.removeEventListener("careerverse-profile-updated", handleUpdate);
      window.removeEventListener("careerverse-xp-gained", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [reload]);

  const updateProfile = (updates: Partial<UnifiedProfileV12>) => {
    const result = saveUnifiedProfileV12(updates);
    setProfile(result);
    return result;
  };

  return { profile, reload, updateProfile };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<CareerVerseNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const reload = useCallback(() => {
    const list = getNotifications();
    setNotifications(list);
    setUnreadCount(list.filter((n) => !n.read).length);
  }, []);

  useEffect(() => {
    reload();

    const handleUpdate = () => {
      reload();
    };

    window.addEventListener("careerverse-notification-added", handleUpdate);
    window.addEventListener("careerverse-notifications-updated", handleUpdate);

    return () => {
      window.removeEventListener("careerverse-notification-added", handleUpdate);
      window.removeEventListener("careerverse-notifications-updated", handleUpdate);
    };
  }, [reload]);

  const triggerNotification = (
    type: CareerVerseNotification["type"],
    title: string,
    message: string
  ) => {
    addNotification(type, title, message);
  };

  const markAllRead = () => {
    markNotificationsAsRead();
    reload();
  };

  const clearAll = () => {
    clearNotifications();
    reload();
  };

  return { notifications, unreadCount, triggerNotification, markAllRead, clearAll };
}
