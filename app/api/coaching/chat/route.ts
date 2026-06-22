import { NextResponse } from "next/server";
import { generateGrokResponse } from "@/lib/grok-service";

export const runtime = "edge";

type ChatHistoryItem = {
  role?: string;
  text?: string;
  content?: string;
};

function cleanStringList(value: unknown): string {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 10).join(", ")
    : "";
}

function getUsefulFallback(message: string, profile: { name?: string }): string {
  const lower = message.toLowerCase();
  const name = typeof profile?.name === "string" ? profile.name : "there";
  if (lower.includes("parent") || lower.includes("parents") || lower.includes("engineering") || lower.includes("lawyer") || lower.includes("law")) {
    return `Hi ${name}, a practical way to handle this is to separate emotion from evidence. Tell your parents you respect why engineering feels safe, then show them a structured lawyer pathway: CLAT/LSAT options, BA LLB colleges, internships, courtroom/corporate law roles, and salary ranges. Ask for a time-boxed agreement: you prepare seriously for law entrance while keeping one backup academic option open. That makes your choice look responsible, not impulsive.`;
  }
  if (lower.includes("career") || lower.includes("confused") || lower.includes("choose")) {
    return `Start with three filters: what work you can do repeatedly, what subjects you can tolerate when they get hard, and what lifestyle you want. Then test two careers through simulations or short projects before deciding. A good next step is to compare one safe option with one exciting option using education path, cost, salary, daily work, and growth.`;
  }
  return `Here is a useful way to think about it: define the decision, list your top two options, compare the education path and daily work, then choose one small experiment this week. If you share the exact career choice or pressure you are facing, I can help you frame a clearer next step.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? (body.history as ChatHistoryItem[]) : [];
    const mentor = body.mentor || {};
    const profile = body.profile || {};

    if (!message) {
      return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "XAI_API_KEY missing" }, { status: 400 });
    }

    const mentorName = typeof mentor.name === "string" ? mentor.name : "AI Career Coach";
    const mentorDescription = typeof mentor.description === "string" ? mentor.description : "general career guidance";

    const systemInstruction = `
      You are CareerVerse AI Mentor (named ${mentorName}), specializing in ${mentorDescription}.
      Give practical career guidance.
      Reference user interests and goals.
      No generic responses.
      
      Student context:
      - Name: ${typeof profile.name === "string" ? profile.name : "Student"}
      - Grade: ${profile.grade || 10}
      - Interests: ${cleanStringList(profile.interests) || "Not provided"}
      - Favorite careers: ${cleanStringList(profile.favoriteCareers) || "Not provided"}
      - Completed simulations: ${cleanStringList(profile.completedSimulations) || "None"}
      - Career DNA: ${profile.dna ? JSON.stringify(profile.dna) : "Not available"}
    `.trim();

    const historyText = history
      .slice(-16)
      .map((item) => {
        const text = typeof item.content === "string" ? item.content : typeof item.text === "string" ? item.text : "";
        return `${item.role === "assistant" || item.role === "model" ? "Coach" : "Student"}: ${text}`;
      })
      .join("\n");

    const finalPrompt = `
      ${systemInstruction}

      Conversation History:
      ${historyText}
      Student: ${message}

      Coach Response:
    `.trim();

    try {
      const reply = await generateGrokResponse(finalPrompt);
      if (!reply.trim()) {
        const fallbackReply = getUsefulFallback(message, profile);
        return NextResponse.json({ reply: fallbackReply, source: "local" }, { status: 200 });
      }

      return NextResponse.json({ reply: reply.trim(), source: "grok" }, { status: 200 });
    } catch (err) {
      console.error("Exception in Grok direct coaching call:", err);
      const fallbackReply = getUsefulFallback(message, profile);
      return NextResponse.json({ reply: fallbackReply, source: "local" }, { status: 200 });
    }
  } catch (err) {
    console.error("Coaching request parse error:", err);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
