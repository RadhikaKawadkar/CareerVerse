import { NextResponse } from "next/server";
import { generateGrokResponse } from "@/lib/grok-service";

export const runtime = "edge";

type RoleplayLanguage = "english" | "hindi" | "hinglish";

function getLatestUserMessage(message: unknown, history: { role?: string; sender?: string; text?: string; content?: string }[]): string {
  if (typeof message === "string" && message.trim()) return message.trim();
  const latest = [...history].reverse().find((item) => item?.role === "user" || item?.sender === "user");
  return typeof latest?.text === "string" ? latest.text : "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getContextualRoleplayFallback(body: any, language: RoleplayLanguage): string {
  const career = body.career === "lawyer" ? "lawyer" : "doctor";
  const latest = getLatestUserMessage(body.message || body.latestMessage, Array.isArray(body.history) ? body.history : (Array.isArray(body.messages) ? body.messages : [])).toLowerCase();

  if (career === "lawyer") {
    if (language === "hindi") return "vakil sahab, aapke tark ke liye seedha saboot kya hai? court ko andaza nahi, pramaan chahiye.";
    if (language === "hinglish") return "vakil sahab, aapka argument suna, lekin iske support me strong evidence kya hai? court ko proof chahiye.";
    return "Counselor, I hear your argument, but what specific evidence supports it? The court needs proof, not assumptions.";
  }

  if (latest.includes("age") || latest.includes("umra") || latest.includes("umar")) {
    if (language === "english") return "I am 45 years old, doctor.";
    if (language === "hinglish") return "doctor, main 45 saal ka hoon.";
    return "main 45 saal ka hoon, doctor.";
  }
  if (latest.includes("sleep") || latest.includes("hours") || latest.includes("neend") || latest.includes("sote")) {
    if (language === "english") return "I sleep about 4-5 hours. The chest discomfort wakes me up at night.";
    if (language === "hinglish") return "doctor, main sirf 4-5 hours sleep kar pata hoon. chest discomfort ki wajah se raat me neend toot jati hai.";
    return "main lagbhag 4-5 ghante sota hoon. raat me seene ke dard ki wajah se neend toot jati hai.";
  }
  if (latest.includes("pain") || latest.includes("dard") || latest.includes("chest") || latest.includes("pressure")) {
    if (language === "english") return "It feels like a heavy pressure in the middle of my chest, especially when I climb stairs.";
    if (language === "hinglish") return "doctor, chest ke beech me heavy pressure feel hota hai, especially stairs chadhne par.";
    return "doctor, mere seene ke beech me bhaari dabav jaisa dard hota hai, khaaskar seedhi chadhne par.";
  }
  if (language === "english") return "Doctor, I feel anxious and short of breath with this chest pressure. What should I tell you next?";
  if (language === "hinglish") return "doctor, chest pressure ke saath anxiety aur shortness of breath bhi feel ho rahi hai. aap kya puchhna chahenge?";
  return "doctor, seene ke dabav ke saath ghabrahat aur saans lene me takleef ho rahi hai. aap kya puchhna chahenge?";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { career, selectedLanguage, messages, latestMessage, mode } = body;
    
    const careerSelected = career || "doctor";
    const selectedLanguageEnum = (selectedLanguage === "hindi" || selectedLanguage === "hinglish" ? selectedLanguage : "english") as RoleplayLanguage;
    const finalLatestMessage = latestMessage || body.message || getLatestUserMessage(body.message, body.history || messages || []);
    const finalMessages = messages || body.history || [];
    const isFeedbackMode = body.isFeedback || mode === "feedback" || mode === "evaluation";

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "XAI_API_KEY missing" }, { status: 400 });
    }

    if (isFeedbackMode) {
      const systemInstruction = `
        You are the CareerVerse Roleplay Evaluation Engine.
        Evaluate the conversation objectively and strictly.
        Selected language: ${selectedLanguageEnum}.
        Return ONLY JSON with keys: communication, confidence, reasoning, empathy, careerFit, strengths, improvements, summary, recommendedNextAction.
        Do not include markdown fences.
      `.trim();

      const finalPrompt = `
        ${systemInstruction}
        
        Conversation history:
        ${JSON.stringify(finalMessages)}
        
        Stats:
        ${JSON.stringify(body.stats || {})}
        
        JSON response:
      `.trim();

      try {
        const reply = await generateGrokResponse(finalPrompt);
        let cleanReply = reply.trim();
        if (cleanReply.startsWith("```")) {
          cleanReply = cleanReply.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        return NextResponse.json(JSON.parse(cleanReply.trim()));
      } catch (err) {
        console.error("Grok evaluation API exception:", err);
        return NextResponse.json({ error: "Evaluation exception" }, { status: 500 });
      }
    }

    let roleplayInstruction = "";
    if (careerSelected === "lawyer") {
      roleplayInstruction = `
        You are Judge Sterling in a courtroom roleplay.
        Stay strictly in character as a judge.
        Challenge reasoning and ask for evidence.
        Do not praise every answer or give generic answers.
        Keep the reply under 80 words.
      `;
    } else {
      roleplayInstruction = `
        You are Alex Mercer, a patient.
        Stay strictly in character as a patient.
        Answer exactly what the student asks. If asked age, answer age. If asked symptoms, answer symptoms.
        Do not give generic answers. Do not reveal everything immediately.
        Keep the reply under 70 words.
      `;
    }

    let languageInstruction = "";
    if (selectedLanguageEnum === "hindi") {
      languageInstruction = "You must reply ONLY in Roman Hindi (using English letters, e.g., 'main 45 saal ka hoon, doctor'). Do NOT write in Devanagari script. Do NOT translate to English.";
    } else if (selectedLanguageEnum === "hinglish") {
      languageInstruction = "You must reply ONLY in Roman Hinglish (mixture of Hindi and English using English letters). Do NOT write in Devanagari script.";
    } else {
      languageInstruction = "You must reply ONLY in English.";
    }

    const historyText = finalMessages
      .map((m: { role?: string; sender?: string; text?: string; content?: string }) => `${m.role === "user" || m.sender === "user" ? "Student" : "AI"}: ${m.text || m.content || ""}`)
      .slice(-16)
      .join("\n");

    const finalPrompt = `
      ${roleplayInstruction}

      ${languageInstruction}

      Conversation History:
      ${historyText}
      Student: ${finalLatestMessage}

      AI Response:
    `.trim();

    try {
      const reply = await generateGrokResponse(finalPrompt);
      if (!reply.trim()) {
        const fallbackReply = getContextualRoleplayFallback(body, selectedLanguageEnum);
        return NextResponse.json({ reply: fallbackReply, source: "local" }, { status: 200 });
      }

      return NextResponse.json({ reply: reply.trim(), source: "grok" }, { status: 200 });
    } catch (err) {
      console.error("Exception in Grok direct call:", err);
      const fallbackReply = getContextualRoleplayFallback(body, selectedLanguageEnum);
      return NextResponse.json({ reply: fallbackReply, source: "local" }, { status: 200 });
    }
  } catch (err) {
    console.error("Request parse error:", err);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
