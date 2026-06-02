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
      ...DEFAULT_CAREERVERSE_DATA.quiz,
      ...data.quiz,
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

function dataToGuestProfile(data: CareerVerseData): GuestProfile {
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

  return next;
}

export function clearCareerVerseData(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}

export function getGuestProfile(): GuestProfile {
  return dataToGuestProfile(getCareerVerseData());
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

  return dataToGuestProfile(next);
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
    return dataToGuestProfile(next);
  }

  const next = saveCareerVerseData({
    simulation: {
      completed: status === "completed",
      step: status === "not_started" ? null : getCareerVerseData().simulation.step ?? "intro",
    },
  });
  return dataToGuestProfile(next);
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
  return dataToGuestProfile(next);
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
  return dataToGuestProfile(next);
}

export function saveScienceQuizScore(score: number, answers: string[] = []): GuestProfile {
  const next = saveCareerVerseData({
    quiz: {
      completed: true,
      score,
      answers,
    },
  });
  return dataToGuestProfile(next);
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
  return dataToGuestProfile(next);
}

export function saveSweSimulationStep(step: SweSimulationStep): GuestProfile {
  const current = getCareerVerseData();
  const next = saveCareerVerseData({
    simulation: {
      ...current.simulation,
      step,
    },
  });
  return dataToGuestProfile(next);
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
  return dataToGuestProfile(next);
}

export function completeSweExperience(reflection: SweReflection): GuestProfile {
  const current = getCareerVerseData();
  const next = saveCareerVerseData({
    simulation: {
      ...current.simulation,
      completed: true,
      enjoyment: reflection.interest,
      fit: reflection.confidence,
      step: "reflection",
    },
  });
  return dataToGuestProfile(next);
}
