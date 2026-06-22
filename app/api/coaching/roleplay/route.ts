/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const runtime = "edge";

const MODELS = ["gemini-1.5-flash"];
const GEMINI_TIMEOUT_MS = 28000;

function extractText(data: any): string {
  return (data.candidates?.[0]?.content?.parts || [])
    .map((part: { text?: string }) => part.text || "")
    .join("")
    .trim();
}

function contextualFallback(career: string, message: string): string {
  const latest = message.toLowerCase();
  if (career === "lawyer") {
    return "Counselor, what specific evidence supports that argument? The court needs proof, not broad claims.";
  }
  if (latest.includes("age")) return "I am 45 years old, doctor.";
  if (latest.includes("sleep")) return "I sleep about 4-5 hours because chest discomfort wakes me up at night.";
  if (latest.includes("pain") || latest.includes("chest")) return "It feels like a heavy pressure in the middle of my chest, especially when I climb stairs.";
  return "Doctor, I feel anxious and short of breath with this chest pressure. What should I tell you next?";
}

async function callGemini(apiKey: string, systemInstruction: string, contents: any[], json = false) {
  let lastError = "Gemini request failed.";
  for (const model of MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("Gemini key loaded:", Boolean(process.env.GEMINI_API_KEY));
        const modelName = model;
        console.log("Gemini model:", modelName);
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: json ? 0.2 : 0.7,
            maxOutputTokens: json ? 1000 : 300,
            ...(json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      });
      clearTimeout(timeout);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        lastError = data.error?.message || `Gemini ${model} failed with status ${response.status}.`;
        if (process.env.NODE_ENV === "development") {
          console.error("Gemini coaching roleplay error:", lastError);
          console.error("Exact Gemini API response:", JSON.stringify(data));
        }
        continue;
      }
      const text = extractText(data);
      if (!text) {
        lastError = `Gemini ${model} returned an empty response.`;
        continue;
      }
      return text;
    } catch (error: any) {
      clearTimeout(timeout);
      lastError = error?.name === "AbortError" ? "Gemini request timed out." : (error?.message || "Gemini network failure.");
      if (process.env.NODE_ENV === "development") console.error("Gemini coaching roleplay exception:", lastError);
    }
  }
  throw new Error(lastError);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { career, message, history, profile, isFeedback } = body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (process.env.NODE_ENV === "development") {
    console.log("Gemini key loaded:", Boolean(process.env.GEMINI_API_KEY));
  }

  if (!apiKey) {
    return NextResponse.json({ reply: contextualFallback(career, message || ""), source: "fallback", fallback: true, error: "GEMINI_API_KEY missing" });
  }

  try {
    if (isFeedback) {
      const systemInstruction = `Evaluate this CareerVerse roleplay. Return only JSON with strengths, improvement, careerFitScore, communicationScore, confidenceScore, nextAction.`;
      const raw = await callGemini(apiKey, systemInstruction, [{ role: "user", parts: [{ text: JSON.stringify({ career, history, profile }) }] }], true);
      return NextResponse.json(JSON.parse(raw.trim()));
    }

    const systemInstruction = career === "lawyer"
      ? `You are a strict courtroom judge. Stay in character, challenge weak arguments, and ask for evidence. Reply under 80 words.`
      : `You are Alex Mercer, a 45-year-old patient. Stay in character, answer the exact doctor question, reveal only asked details, and reply under 70 words.`;
    const contents = Array.isArray(history)
      ? history.filter((h: any) => h?.text).map((h: any) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] }))
      : [];
    if (message) contents.push({ role: "user", parts: [{ text: message }] });
    if (contents.length === 0) contents.push({ role: "user", parts: [{ text: "Start in character." }] });

    const reply = await callGemini(apiKey, systemInstruction, contents);
    return NextResponse.json({ reply, source: "gemini", fallback: false });
  } catch (error: any) {
    const reason = error?.message || "Gemini request failed.";
    if (process.env.NODE_ENV === "development") console.error("Coaching roleplay final error:", reason);
    return NextResponse.json({ reply: contextualFallback(career, message || ""), source: "fallback", fallback: true, error: reason });
  }
}

