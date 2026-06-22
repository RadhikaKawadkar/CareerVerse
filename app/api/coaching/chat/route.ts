import { NextResponse } from "next/server";

export const runtime = "edge";

type ChatHistoryItem = {
  role?: string;
  text?: string;
  content?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

function cleanStringList(value: unknown): string {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 10).join(", ")
    : "";
}

function extractGeminiText(data: GeminiResponse): string {
  return (data.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || "")
    .join("")
    .trim();
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

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const mentorName = typeof mentor.name === "string" ? mentor.name : "AI Career Coach";
    const mentorDescription =
      typeof mentor.description === "string" ? mentor.description : "general career guidance";

    const systemInstruction = `
You are ${mentorName}, a supportive CareerVerse mentor specializing in ${mentorDescription}.
You are helping a high-school student explore careers and education.

Student context:
- Name: ${typeof profile.name === "string" ? profile.name : "Student"}
- Grade: ${profile.grade || 10}
- Interests: ${cleanStringList(profile.interests) || "Not provided"}
- Favorite careers: ${cleanStringList(profile.favoriteCareers) || "Not provided"}
- Completed simulations: ${cleanStringList(profile.completedSimulations) || "None"}

Answer the student's actual question directly using your general knowledge. Be warm, clear, practical,
and concise (normally under 220 words), but give enough detail to be useful. Ask at most one relevant
follow-up question. Do not pretend to know personal facts that were not provided. For medical, legal,
financial, or other high-stakes questions, provide general educational information and recommend
checking with a qualified adult or professional when appropriate.
    `.trim();

    const contents = history
      .slice(-20)
      .map((item) => {
        const text =
          typeof item.content === "string"
            ? item.content
            : typeof item.text === "string"
              ? item.text
              : "";

        return {
          role: item.role === "assistant" || item.role === "model" ? "model" : "user",
          parts: [{ text }],
        };
      })
      .filter((item) => item.parts[0].text.trim().length > 0);

    const lastContent = contents[contents.length - 1];
    if (
      !lastContent ||
      lastContent.role !== "user" ||
      lastContent.parts[0].text !== message
    ) {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 700,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => ({}))) as GeminiResponse;

    if (!response.ok) {
      const providerMessage =
        data.error?.message || `Gemini request failed with status ${response.status}.`;
      console.error("Gemini API error:", providerMessage);
      return NextResponse.json({ error: providerMessage }, { status: response.status });
    }

    const text = extractGeminiText(data);
    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini coaching route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
