/* eslint-disable @typescript-eslint/no-explicit-any */
import "./local-storage-proxy";
import {
  DEFAULT_CAREERVERSE_DATA,
  DEFAULT_GUEST_PROFILE,
  DEFAULT_SWE_CHOICES,
  type CareerVerseData,
  type ExperienceStatus,
  type GuestProfile,
  type ScienceLessonStep,
  type ScienceReflection,
  type SweReflection,
  type SweSceneChoice,
  type SweSimulationStep,
} from "@/types/profile";
import { db, formatSupabaseError } from "./database";
import { supabase } from "./supabase";

const STORAGE_KEY = "careerverse-data";
const LEGACY_STORAGE_KEY = "careerverse-guest-profile";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function cloneDefaultData(): CareerVerseData {
  return {
    profile: { ...DEFAULT_CAREERVERSE_DATA.profile },
    science: { ...DEFAULT_CAREERVERSE_DATA.science },
    simulation: {
      ...DEFAULT_CAREERVERSE_DATA.simulation,
      choices: { ...DEFAULT_SWE_CHOICES },
    },
    quiz: { ...DEFAULT_CAREERVERSE_DATA.quiz },
  };
}

function normalizeData(data: DeepPartial<CareerVerseData>): CareerVerseData {
  return {
    profile: {
      ...DEFAULT_CAREERVERSE_DATA.profile,
      ...data.profile,
    },
    science: {
      ...DEFAULT_CAREERVERSE_DATA.science,
      ...data.science,
    },
    simulation: {
      ...DEFAULT_CAREERVERSE_DATA.simulation,
      ...data.simulation,
      choices: {
        ...DEFAULT_SWE_CHOICES,
        ...data.simulation?.choices,
      },
    },
    quiz: {
      completed: data.quiz?.completed ?? DEFAULT_CAREERVERSE_DATA.quiz.completed,
      score: data.quiz?.score ?? DEFAULT_CAREERVERSE_DATA.quiz.score,
      answers: (data.quiz?.answers || []).filter((a): a is string => typeof a === "string"),
    },
  };
}

function legacyToData(legacy: Partial<GuestProfile>): CareerVerseData {
  return normalizeData({
    profile: {
      name: legacy.firstName ?? "",
      grade: legacy.grade ?? null,
      suggestedPath: legacy.careerPressure ?? null,
    },
    science: {
      completed: legacy.scienceCompleted ?? legacy.scienceStatus === "completed",
      enjoyment: legacy.scienceReflection?.interest ?? null,
      fit: legacy.scienceReflection?.confidence ?? null,
      step: legacy.scienceLessonStep ?? null,
    },
    simulation: {
      completed: legacy.sweCompleted ?? legacy.sweStatus === "completed",
      enjoyment: legacy.sweReflection?.interest ?? null,
      fit: legacy.sweReflection?.confidence ?? null,
      step: legacy.sweSimulationStep ?? null,
      choices: {
        ...DEFAULT_SWE_CHOICES,
        ...legacy.sweChoices,
      },
    },
    quiz: {
      completed: legacy.scienceQuizScore !== null && legacy.scienceQuizScore !== undefined,
      score: legacy.scienceQuizScore ?? null,
      answers: [],
    },
  });
}

function dataGuestProfile(data: CareerVerseData): GuestProfile {
  const onboardingCompleted =
    Boolean(data.profile.name.trim()) &&
    data.profile.grade !== null &&
    data.profile.suggestedPath !== null;
  const scienceStatus: ExperienceStatus = data.science.completed
    ? "completed"
    : data.science.step
      ? "in_progress"
      : "not_started";
  const sweStatus: ExperienceStatus = data.simulation.completed
    ? "completed"
    : data.simulation.step
      ? "in_progress"
      : "not_started";

  return {
    ...DEFAULT_GUEST_PROFILE,
    firstName: data.profile.name,
    grade: data.profile.grade,
    careerPressure: data.profile.suggestedPath,
    onboardingCompleted,
    scienceStatus,
    sweStatus,
    scienceCompleted: data.science.completed,
    sweCompleted: data.simulation.completed,
    scienceLessonStep: data.science.step,
    scienceQuizScore: data.quiz.score,
    scienceReflection:
      data.science.enjoyment !== null && data.science.fit !== null
        ? { interest: data.science.enjoyment, confidence: data.science.fit }
        : null,
    sweSimulationStep: data.simulation.step,
    sweChoices: data.simulation.choices,
    sweReflection:
      data.simulation.enjoyment !== null && data.simulation.fit !== null
        ? { interest: data.simulation.enjoyment, confidence: data.simulation.fit }
        : null,
  };
}

export function getCareerVerseData(): CareerVerseData {
  if (!isBrowser()) {
    return cloneDefaultData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeData(JSON.parse(raw) as Partial<CareerVerseData>);
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const migrated = legacyToData(JSON.parse(legacyRaw) as Partial<GuestProfile>);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return cloneDefaultData();
  } catch {
    return cloneDefaultData();
  }
}

// Background synchronization with Supabase
function syncToSupabase(updates: DeepPartial<CareerVerseData>) {
  if (typeof window === "undefined") return;

  supabase.auth.getSession().then(({ data: { session } }) => {
    const userId = session?.user?.id;
    if (!userId) return;

    // 1. Sync Profile Updates
    if (updates.profile) {
      const current = getCareerVerseData();
      const hasOnboarding =
        Boolean(current.profile.name) &&
        current.profile.grade !== null &&
        current.profile.suggestedPath !== null;

      db.updateProfile(userId, {
        name: current.profile.name,
        grade: current.profile.grade,
        suggested_path: current.profile.suggestedPath || null,
        career_pressure: current.profile.suggestedPath || null,
        onboarding_completed: hasOnboarding,
      }).catch((err) => console.error("Sync profile error:", formatSupabaseError(err)));
    }

    // 2. Sync Science Simulation
    if (updates.science) {
      const current = getCareerVerseData();
      db.upsertSimulation(userId, {
        career_name: "science",
        choices: {},
        choices_made: {},
        completion_status: current.science.completed ? "completed" : "in_progress",
        current_step: current.science.step || "intro",
        reflection_interest: current.science.enjoyment,
        reflection_confidence: current.science.fit,
        ending_unlocked: current.science.completed ? "Completed Physics Lesson" : null,
      }).catch((err) => console.error("Sync science error:", formatSupabaseError(err)));

      if (updates.science.completed && updates.science.enjoyment !== null) {
        db.addJournalEntry(
          userId,
          `Completed the grade 11 Physics lesson. Rated interest: ${current.science.enjoyment}/5, confidence: ${current.science.fit}/5.`,
          "science"
        ).catch((err) => console.error("Sync science journal error:", formatSupabaseError(err)));

        // Add XP & achievements
        db.getProfile(userId).then((prof) => {
          if (prof) {
            const achievements = Array.from(new Set([...(prof.achievements || []), "science_pioneer"]));
            db.updateProfile(userId, {
              xp: (prof.xp || 0) + 100,
              achievements,
            }).catch((err) => console.error("Sync science XP error:", formatSupabaseError(err)));
          }
        });
      }
    }

    // 3. Sync SWE Simulation
    if (updates.simulation) {
      const current = getCareerVerseData();
      const choices = current.simulation.choices;
      db.upsertSimulation(userId, {
        career_name: "software-engineer",
        choices: choices as any,
        choices_made: choices as any,
        completion_status: current.simulation.completed ? "completed" : "in_progress",
        current_step: current.simulation.step || "intro",
        reflection_interest: current.simulation.enjoyment,
        reflection_confidence: current.simulation.fit,
        ending_unlocked: current.simulation.completed ? "Finished SWE Day" : null,
      }).catch((err) => console.error("Sync swe error:", formatSupabaseError(err)));

      if (updates.simulation.completed && updates.simulation.enjoyment !== null) {
        db.addJournalEntry(
          userId,
          `Completed the Software Engineer simulation. Choices: Standup: ${choices.scene1}, Bug: ${choices.scene2}, Deadline: ${choices.scene3}. Interest: ${current.simulation.enjoyment}/5, confidence: ${current.simulation.fit}/5.`,
          "software-engineer"
        ).catch((err) => console.error("Sync swe journal error:", formatSupabaseError(err)));

        // Add XP & achievements
        db.getProfile(userId).then((prof) => {
          if (prof) {
            const achievements = Array.from(new Set([...(prof.achievements || []), "swe_explorer"]));
            db.updateProfile(userId, {
              xp: (prof.xp || 0) + 100,
              achievements,
            }).catch((err) => console.error("Sync swe XP error:", formatSupabaseError(err)));
          }
        });

        // Sync DNA
        let analytical = 3;
        let creativity = 3;
        let collaboration = 3;
        let riskTolerance = 3;
        if (choices.scene1 === "a") collaboration += 2;
        if (choices.scene1 === "b") { analytical += 1; collaboration -= 1; }
        if (choices.scene2 === "a") analytical += 2;
        if (choices.scene2 === "b") { riskTolerance += 2; analytical -= 1; }
        if (choices.scene3 === "a") { creativity += 2; riskTolerance += 1; }
        if (choices.scene3 === "b") analytical += 1;

        db.upsertCareerDna(userId, {
          analytical: Math.min(10, analytical) * 10,
          creativity: Math.min(10, creativity) * 10,
          collaboration: Math.min(10, collaboration) * 10,
          risk_tolerance: Math.min(10, riskTolerance) * 10,
          archetype: analytical > collaboration ? "Builder" : collaboration > creativity ? "Team Catalyst" : "Explorer",
        }).catch((err) => console.error("Sync DNA error:", formatSupabaseError(err)));
      }
    }
  });
}

export function saveCareerVerseData(updates: DeepPartial<CareerVerseData>): CareerVerseData {
  const current = getCareerVerseData();
  const next = normalizeData({
    profile: { ...current.profile, ...updates.profile },
    science: { ...current.science, ...updates.science },
    simulation: {
      ...current.simulation,
      ...updates.simulation,
      choices: {
        ...current.simulation.choices,
        ...updates.simulation?.choices,
      },
    },
    quiz: { ...current.quiz, ...updates.quiz },
  });

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  // Trigger sync in the background
  syncToSupabase(updates);

  return next;
}

export function clearCareerVerseData(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.removeItem("careerverse-migrated");
  }

  // Trigger Supabase data reset in background
  supabase.auth.getSession().then(({ data: { session } }) => {
    const userId = session?.user?.id;
    if (userId) {
      db.resetUserData(userId).catch((err) => console.error("Error resetting Supabase user data:", err));
    }
  });
}

export function getGuestProfile(): GuestProfile {
  return dataGuestProfile(getCareerVerseData());
}

export function saveGuestProfile(updates: Partial<GuestProfile>): GuestProfile {
  const current = getGuestProfile();
  const merged = { ...current, ...updates };
  const next = saveCareerVerseData({
    profile: {
      name: merged.firstName,
      grade: merged.grade,
      suggestedPath: merged.careerPressure,
    },
    science: {
      completed: merged.scienceCompleted,
      enjoyment: merged.scienceReflection?.interest ?? null,
      fit: merged.scienceReflection?.confidence ?? null,
      step: merged.scienceLessonStep,
    },
    simulation: {
      completed: merged.sweCompleted,
      enjoyment: merged.sweReflection?.interest ?? null,
      fit: merged.sweReflection?.confidence ?? null,
      step: merged.sweSimulationStep,
      choices: merged.sweChoices,
    },
    quiz: {
      completed: merged.scienceQuizScore !== null,
      score: merged.scienceQuizScore,
      answers: getCareerVerseData().quiz.answers,
    },
  });

  return dataGuestProfile(next);
}

export function clearGuestProfile(): void {
  clearCareerVerseData();
}

export function setExperienceStatus(
  experience: "science" | "swe",
  status: ExperienceStatus,
): GuestProfile {
  if (experience === "science") {
    const next = saveCareerVerseData({
      science: {
        completed: status === "completed",
        step: status === "not_started" ? null : getCareerVerseData().science.step ?? "intro",
      },
    });
    return dataGuestProfile(next);
  }

  const next = saveCareerVerseData({
    simulation: {
      completed: status === "completed",
      step: status === "not_started" ? null : getCareerVerseData().simulation.step ?? "intro",
    },
  });
  return dataGuestProfile(next);
}

export function getCompletedExperienceCount(profile: GuestProfile): number {
  let count = 0;
  if (profile.scienceCompleted) count += 1;
  if (profile.sweCompleted) count += 1;
  return count;
}

export function getHubProgress(profile: GuestProfile) {
  return {
    scienceCompleted: profile.scienceCompleted,
    sweCompleted: profile.sweCompleted,
    completedCount: getCompletedExperienceCount(profile),
    bothComplete: profile.scienceCompleted && profile.sweCompleted,
  };
}

export function saveScienceLessonStep(step: ScienceLessonStep): GuestProfile {
  const current = getCareerVerseData();
  const next = saveCareerVerseData({
    science: {
      ...current.science,
      step,
    },
  });
  return dataGuestProfile(next);
}

export function completeScienceExperience(reflection: ScienceReflection): GuestProfile {
  const next = saveCareerVerseData({
    science: {
      completed: true,
      enjoyment: reflection.interest,
      fit: reflection.confidence,
      step: "reflection",
    },
  });
  return dataGuestProfile(next);
}

export function saveScienceQuizScore(score: number, answers: string[] = []): GuestProfile {
  const next = saveCareerVerseData({
    quiz: {
      completed: true,
      score,
      answers,
    },
  });
  return dataGuestProfile(next);
}

export function saveDemoJourney(): GuestProfile {
  const next = saveCareerVerseData({
    profile: {
      name: "Demo Student",
      grade: 10,
      suggestedPath: "myself",
    },
    science: {
      completed: true,
      enjoyment: 4,
      fit: 4,
      step: "reflection",
    },
    simulation: {
      completed: true,
      enjoyment: 5,
      fit: 4,
      step: "reflection",
      choices: {
        scene1: "a",
        scene2: "a",
        scene3: "c",
      },
    },
    quiz: {
      completed: true,
      score: 2,
      answers: ["nature", "observe"],
    },
  });
  return dataGuestProfile(next);
}

export function saveSweSimulationStep(step: SweSimulationStep): GuestProfile {
  const current = getCareerVerseData();
  const next = saveCareerVerseData({
    simulation: {
      ...current.simulation,
      step,
    },
  });
  return dataGuestProfile(next);
}

export function saveSweChoice(
  scene: "scene1" | "scene2" | "scene3",
  choice: SweSceneChoice,
): GuestProfile {
  const current = getCareerVerseData();
  const next = saveCareerVerseData({
    simulation: {
      ...current.simulation,
      step: scene === "scene1" ? "scene-1" : scene === "scene2" ? "scene-2" : "scene-3",
      choices: {
        ...current.simulation.choices,
        [scene]: choice,
      },
    },
  });
  return dataGuestProfile(next);
}

export function completeSweExperience(reflection: SweReflection): GuestProfile {
  const next = saveCareerVerseData({
    simulation: {
      completed: true,
      enjoyment: reflection.interest,
      fit: reflection.confidence,
      step: "reflection",
    },
  });
  return dataGuestProfile(next);
}

/**
 * Pull database profile down to localStorage cache
 */
export async function pullDatabaseToLocal(userId: string): Promise<void> {
  try {
    const data = await db.getDashboardData(userId);
    if (!data.profile) return;

    const current: CareerVerseData = {
      profile: {
        name: data.profile.name || "",
        grade: data.profile.grade,
        suggestedPath: (data.profile.suggested_path || data.profile.career_pressure) as any,
      },
      science: {
        completed: false,
        enjoyment: null,
        fit: null,
        step: null,
      },
      simulation: {
        completed: false,
        enjoyment: null,
        fit: null,
        step: null,
        choices: { scene1: null, scene2: null, scene3: null },
      },
      quiz: {
        completed: false,
        score: null,
        answers: [],
      },
    };

    const scienceSim = data.simulations.find((s) => s.career_name === "science");
    if (scienceSim) {
      current.science = {
        completed: scienceSim.completion_status === "completed",
        enjoyment: scienceSim.reflection_interest,
        fit: scienceSim.reflection_confidence,
        step: scienceSim.current_step as any,
      };
    }

    const sweSim = data.simulations.find((s) => s.career_name === "software-engineer");
    if (sweSim) {
      current.simulation = {
        completed: sweSim.completion_status === "completed",
        enjoyment: sweSim.reflection_interest,
        fit: sweSim.reflection_confidence,
        step: sweSim.current_step as any,
        choices: {
          scene1: (sweSim.choices?.scene1 || sweSim.choices_made?.scene1 || null) as any,
          scene2: (sweSim.choices?.scene2 || sweSim.choices_made?.scene2 || null) as any,
          scene3: (sweSim.choices?.scene3 || sweSim.choices_made?.scene3 || null) as any,
        },
      };
    }

    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error("Error pulling database to local cache:", e);
  }
}

export function getResumePath(experience: "science" | "swe", profile: GuestProfile): string {
  if (experience === "science") {
    if (profile.scienceStatus === "completed") {
      return "/explore/science/intro";
    }
    if (profile.scienceStatus === "in_progress") {
      const step = profile.scienceLessonStep;
      if (step === "section-1") return "/explore/science/section-1";
      if (step === "section-2") return "/explore/science/section-2";
      if (step === "section-3") return "/explore/science/section-3";
      if (step === "quiz") return "/explore/science/quiz";
      if (step === "reflection") return "/explore/science/reflection";
      return "/explore/science/intro";
    }
    return "/explore/science/intro";
  } else {
    if (profile.sweStatus === "completed") {
      return "/explore/software-engineer/intro";
    }
    if (profile.sweStatus === "in_progress") {
      const step = profile.sweSimulationStep;
      if (step === "scene-1") return "/explore/software-engineer/scene-1";
      if (step === "scene-2") return "/explore/software-engineer/scene-2";
      if (step === "scene-3") return "/explore/software-engineer/scene-3";
      if (step === "debrief") return "/explore/software-engineer/debrief";
      if (step === "reflection") return "/explore/software-engineer/reflection";
      return "/explore/software-engineer/intro";
    }
    return "/explore/software-engineer/intro";
  }
}
