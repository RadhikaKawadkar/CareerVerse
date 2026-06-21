import { NextResponse } from "next/server";

export const runtime = "edge";

function findJsonObjectBoundary(str: string): number {
  let braceCount = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          return i;
        }
      }
    }
  }
  return -1;
}

export async function POST(req: Request) {
  try {
    const { message, history, mentor, profile } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured on server." },
        { status: 500 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`;

    const systemInstruction = `
      You are the CareerVerse AI Mentor persona named ${mentor?.name || "AI Coach"}, who works as a ${
        mentor?.role || "Specialist"
      } at ${mentor?.organization || "CareerVerse"}.
      Your background: ${mentor?.journey || ""}
      
      You are guiding a high school student named ${profile.name || "Student"} (Grade ${profile.grade || 10}).
      Student Career DNA Profile:
      - Work Style: ${profile.dna?.workStyle || "Balanced"}
      - Analytical Index: ${profile.dna?.analytical || 50}%
      - Creativity Index: ${profile.dna?.creativity || 50}%
      - Completed Simulations: ${profile.completedSimulations?.join(", ") || "None"}
      - Active Goals/Quests: ${profile.goals?.join(", ") || "None"}
      - Interests: ${profile.interests?.join(", ") || "None"}
      - Favorite Careers: ${profile.favoriteCareers?.join(", ") || "None"}
      - Journal Reflections: ${profile.journalReflections?.map((r: { careerId: string; excited: string; difficult: string; surprised: string }) => `Career: ${r.careerId}, Excited: ${r.excited}, Difficult: ${r.difficult}, Surprised: ${r.surprised}`).join(" | ") || "None"}
      
      Respond directly as the persona, utilizing your career expertise. Speak like a supportive, startup-ready mentor. Give concise, actionable advice under 180 words. Reference their completed simulations, Career DNA, favorite careers, and journal reflections when relevant to make the feedback feel deeply personalized and demonstrate you know them.
    `;

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && history.length > 0) {
      contents.push(
        ...history.map((h: { role: string; text: string }) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }))
      );
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API call failed", errorText);
      return NextResponse.json(
        { error: "Gemini API call failed" },
        { status: response.status }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body?.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            let pos;
            while ((pos = findJsonObjectBoundary(buffer)) !== -1) {
              const part = buffer.slice(0, pos + 1);
              buffer = buffer.slice(pos + 1);
              
              let cleanPart = part.trim();
              if (cleanPart.startsWith("[")) cleanPart = cleanPart.slice(1).trim();
              if (cleanPart.startsWith(",")) cleanPart = cleanPart.slice(1).trim();
              if (cleanPart.endsWith("]")) cleanPart = cleanPart.slice(0, -1).trim();
              
              if (cleanPart) {
                try {
                  const parsed = JSON.parse(cleanPart);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // Prepend back if it's incomplete
                  buffer = part + buffer;
                  break;
                }
              }
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err: unknown) {
    console.error("Edge Route Error:", err);
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
