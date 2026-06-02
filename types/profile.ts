export type CareerPressure =
  | "parents"
  | "teachers"
  | "friends"
  | "social-media"
  | "myself"
  | "not-sure";

export type ExperienceStatus = "not_started" | "in_progress" | "completed";

export type ScienceLessonStep =
  | "intro"
  | "section-1"
  | "section-2"
  | "section-3"
  | "quiz"
  | "reflection";

export type ScienceReflection = {
  interest: number;
  confidence: number;
};

export type SweSimulationStep =
  | "intro"
  | "scene-1"
  | "scene-2"
  | "scene-3"
  | "debrief"
  | "reflection";

export type SweSceneChoice = "a" | "b" | "c";

export type SweSimulationChoices = {
  scene1: SweSceneChoice | null;
  scene2: SweSceneChoice | null;
  scene3: SweSceneChoice | null;
};

export type SweReflection = {
  interest: number;
  confidence: number;
};

export type CareerVerseData = {
  profile: {
    name: string;
    grade: number | null;
    suggestedPath: CareerPressure | null;
  };
  science: {
    completed: boolean;
    enjoyment: number | null;
    fit: number | null;
    step: ScienceLessonStep | null;
  };
  simulation: {
    completed: boolean;
    enjoyment: number | null;
    fit: number | null;
    step: SweSimulationStep | null;
    choices: SweSimulationChoices;
  };
  quiz: {
    completed: boolean;
    score: number | null;
    answers: string[];
  };
};

export type GuestProfile = {
  firstName: string;
  grade: number | null;
  careerPressure: CareerPressure | null;
  onboardingCompleted: boolean;
  scienceStatus: ExperienceStatus;
  sweStatus: ExperienceStatus;
  scienceCompleted: boolean;
  sweCompleted: boolean;
  scienceLessonStep: ScienceLessonStep | null;
  scienceQuizScore: number | null;
  scienceReflection: ScienceReflection | null;
  sweSimulationStep: SweSimulationStep | null;
  sweChoices: SweSimulationChoices;
  sweReflection: SweReflection | null;
};

export const DEFAULT_SWE_CHOICES: SweSimulationChoices = {
  scene1: null,
  scene2: null,
  scene3: null,
};

export const DEFAULT_CAREERVERSE_DATA: CareerVerseData = {
  profile: {
    name: "",
    grade: null,
    suggestedPath: null,
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
    choices: DEFAULT_SWE_CHOICES,
  },
  quiz: {
    completed: false,
    score: null,
    answers: [],
  },
};

export const DEFAULT_GUEST_PROFILE: GuestProfile = {
  firstName: "",
  grade: null,
  careerPressure: null,
  onboardingCompleted: false,
  scienceStatus: "not_started",
  sweStatus: "not_started",
  scienceCompleted: false,
  sweCompleted: false,
  scienceLessonStep: null,
  scienceQuizScore: null,
  scienceReflection: null,
  sweSimulationStep: null,
  sweChoices: DEFAULT_SWE_CHOICES,
  sweReflection: null,
};

export const CAREER_PRESSURE_OPTIONS: {
  value: CareerPressure;
  label: string;
}[] = [
  { value: "parents", label: "Parents" },
  { value: "teachers", label: "Teachers" },
  { value: "friends", label: "Friends" },
  { value: "social-media", label: "Social Media" },
  { value: "myself", label: "Myself" },
  { value: "not-sure", label: "Not Sure" },
];

export const GRADE_OPTIONS = [8, 9, 10, 11, 12] as const;
