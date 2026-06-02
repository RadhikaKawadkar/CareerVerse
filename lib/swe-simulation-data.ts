import type { SweSceneChoice } from "@/types/profile";

export type SweChoiceOption = {
  id: SweSceneChoice;
  label: string;
  reaction: string;
  reactionFrom: string;
};

export type SweSceneData = {
  id: "scene-1" | "scene-2" | "scene-3";
  sceneKey: "scene1" | "scene2" | "scene3";
  moment: number;
  time: string;
  title: string;
  story: string;
  prompt: string;
  choices: SweChoiceOption[];
  nextPath: string;
};

export const SWE_SCENES: SweSceneData[] = [
  {
    id: "scene-1",
    sceneKey: "scene1",
    moment: 1,
    time: "9:02 AM",
    title: "Morning Standup",
    story:
      "Your team opens the morning standup on a video call. The product manager asks for your update on a login issue affecting a pilot school. You found the error last night, but the authentication flow is still failing in one browser.",
    prompt: "What do you say?",
    choices: [
      {
        id: "a",
        label: "Admit you're stuck and ask for help",
        reaction:
          "Maya jumps in: \"Good call. I've seen this when cookies are blocked. Let's pair for 20 minutes after standup.\" The PM updates the plan, and the team gets a realistic path forward.",
        reactionFrom: "Maya, Senior Developer",
      },
      {
        id: "b",
        label: "Say \"almost done\" and figure it out alone",
        reaction:
          "You leave the call uneasy. By lunch, the same browser bug is still open and the QA channel is asking for an ETA. Moving quietly can feel brave, but teams need visible blockers.",
        reactionFrom: "Internal monologue",
      },
      {
        id: "c",
        label: "Suggest moving the task to next sprint",
        reaction:
          "Jordan asks, \"Is it blocked, or do we need a second set of eyes?\" You realize the fastest next step is not delay; it is making the problem clear enough for help.",
        reactionFrom: "Jordan, Product Manager",
      },
    ],
    nextPath: "/explore/software-engineer/scene-2",
  },
  {
    id: "scene-2",
    sceneKey: "scene2",
    moment: 2,
    time: "2:14 PM",
    title: "Bug Report",
    story:
      "A support message lands in the team channel: a few students cannot submit their course preference form. You have logs, a browser report, and one angry screenshot from a school counselor.",
    prompt: "It is afternoon. What is your move?",
    choices: [
      {
        id: "a",
        label: "Dig into logs methodically",
        reaction:
          "You compare the screenshot with the logs and reproduce the issue in 25 minutes. Root cause: an old validation rule. The fix is small, but you add a test before shipping.",
        reactionFrom: "You, after finding the bug",
      },
      {
        id: "b",
        label: "Ship a quick patch now, investigate later",
        reaction:
          "The quick patch passes the first check, then Alex spots a side effect in staging. Speed matters, but production fixes still need a tiny safety net.",
        reactionFrom: "Alex, QA Engineer",
      },
      {
        id: "c",
        label: "Escalate to a senior developer immediately",
        reaction:
          "Maya joins, asks you to explain what you already tried, and then walks the logs with you. The bug becomes a shared investigation instead of a solo panic.",
        reactionFrom: "Maya, Senior Developer",
      },
    ],
    nextPath: "/explore/software-engineer/scene-3",
  },
  {
    id: "scene-3",
    sceneKey: "scene3",
    moment: 3,
    time: "5:45 PM",
    title: "Feature Deadline",
    story:
      "Tomorrow's demo is for a school partner. Your recommendation screen works, but the empty state and one mobile layout look rough. Polishing everything would take three more hours.",
    prompt: "What do you prioritize?",
    choices: [
      {
        id: "a",
        label: "Polish the UI, risk missing the deadline",
        reaction:
          "You stay late making the screen shine, but one untested edge case breaks during rehearsal. Polish helps, but reliability is also part of the demo.",
        reactionFrom: "Jordan, after rehearsal",
      },
      {
        id: "b",
        label: "Ship the functional version, polish later",
        reaction:
          "The demo runs smoothly. The partner notices the rough empty state, but the main flow is clear. Most real products improve in slices, not in one perfect release.",
        reactionFrom: "Demo feedback",
      },
      {
        id: "c",
        label: "Cut scope - demo only the core flow",
        reaction:
          "You hide the unfinished edge case, document it, and rehearse the core flow. The demo lands well because the team shows one reliable story instead of five fragile ones.",
        reactionFrom: "Your team in Slack",
      },
    ],
    nextPath: "/explore/software-engineer/debrief",
  },
];

export function getSceneById(id: SweSceneData["id"]): SweSceneData {
  const scene = SWE_SCENES.find((item) => item.id === id);
  if (!scene) {
    throw new Error(`Scene ${id} not found`);
  }
  return scene;
}

export function getChoiceLabel(
  sceneKey: SweSceneData["sceneKey"],
  choiceId: SweSceneChoice | null,
): string {
  if (!choiceId) return "No choice recorded";
  const scene = SWE_SCENES.find((item) => item.sceneKey === sceneKey);
  const option = scene?.choices.find((item) => item.id === choiceId);
  return option?.label ?? "Unknown choice";
}

export function getChoiceInsight(
  sceneKey: SweSceneData["sceneKey"],
  choiceId: SweSceneChoice | null,
): string {
  if (!choiceId) return "";
  const scene = SWE_SCENES.find((item) => item.sceneKey === sceneKey);
  const option = scene?.choices.find((item) => item.id === choiceId);
  return option?.reaction ?? "";
}

export function getOverallInsight(choices: {
  scene1: SweSceneChoice | null;
  scene2: SweSceneChoice | null;
  scene3: SweSceneChoice | null;
}): string {
  const collaborative =
    [choices.scene1, choices.scene2, choices.scene3].filter((c) => c === "a" || c === "c").length;
  const independent =
    [choices.scene1, choices.scene2, choices.scene3].filter((c) => c === "b").length;

  if (collaborative >= 2) {
    return "You lean toward teamwork, communication, and thoughtful tradeoffs - core skills for modern software engineering.";
  }
  if (independent >= 2) {
    return "You prefer solving problems on your own and moving fast - valuable traits, but SWE also means knowing when to sync with others.";
  }
  return "You mix collaboration and independence - a balanced style that fits many engineering teams.";
}
