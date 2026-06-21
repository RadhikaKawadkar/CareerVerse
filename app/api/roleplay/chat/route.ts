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
    const { career, scenario, message, history, profile, isFeedback } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured on server." },
        { status: 500 }
      );
    }

    const modelName = "gemini-2.5-flash";

    if (isFeedback) {
      // Feedback Generation Endpoint
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const empathyOrPersuasion = career === "lawyer" ? "persuasionScore" : "empathyScore";
      const empathyOrPersuasionLabel = career === "lawyer" ? "persuasion score" : "empathy score";

      const systemPrompt = `
        You are the CareerVerse Roleplay Evaluation Engine.
        You will analyze a conversation history between a student and an AI character.
        The career simulation is: ${career === "lawyer" ? "Lawyer (Student acts as Lawyer, AI acts as Judge)" : "Doctor (Student acts as Doctor, AI acts as Patient)"}.
        Selected Scenario: ${scenario || (career === "lawyer" ? "Courtroom Trial" : "Clinical intake")}.
        Student Profile: Name: ${profile?.name || "Student"}, Grade: ${profile?.grade || 10}.
        
        Evaluate the student's performance across the session.
        Provide a JSON response containing exactly the following keys:
        - strengths: a string summarizing 1-2 major strengths of the student in this roleplay.
        - improvement: a string summarizing 1-2 key areas where the student can improve.
        - communicationScore: a number (0-100) representing their communication clarity and tone.
        - confidenceScore: a number (0-100) representing their confidence level.
        - reasoningScore: a number (0-100) representing their logical analysis, evidence application, or medical diagnosis logic.
        - ${empathyOrPersuasion}: a number (0-100) representing their ${empathyOrPersuasionLabel}.
        - careerFitScore: a number (0-100) representing overall career suitability based on these metrics.
        - careerFitInsight: a brief, qualitative insight about their suitability for this career.
        - nextAction: a specific, actionable next recommendation (e.g. "Read about hearsay rules of evidence" or "Practice active patient listening and reassurance").

        IMPORTANT: Output ONLY a valid JSON object. Do not include markdown code block formatting (no \`\`\`json). Just the raw JSON.
      `;

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Here is the full conversation history of the roleplay session:\n${JSON.stringify(
                history
              )}\n\nPlease evaluate this session and return the JSON evaluation card.`
            }
          ]
        }
      ];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API call failed for feedback in /api/roleplay/chat", errorText);
        return NextResponse.json({ error: "Gemini API call failed" }, { status: response.status });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          const parsed = JSON.parse(text.trim());
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ rawText: text });
        }
      }
      return NextResponse.json({ error: "No response text" }, { status: 500 });
    }

    // Roleplay Dialogue Generation (Streaming)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${apiKey}`;

    let systemInstruction = "";
    if (career === "lawyer") {
      systemInstruction = `
        You are a strict, formal Judge (Judge Sterling) presiding over a courtroom trial.
        The scenario is: ${scenario || "Courtroom Trial"}.
        A student named ${profile?.name || "Student"} is acting as the Defense Attorney.
        
        Your behavior guidelines:
        - You must stay strictly in character as a formal, courtroom Judge.
        - Speak formally, address the student as "counselor", and demand logical clarity and evidence.
        - You must challenge the student's arguments and ask realistic, demanding follow-up questions.
        - Do not give generic praise or say "good point" or "you are right" after every answer. Stay formal, critical, and objective.
        - Point out weak reasoning in the defense's statements and ask for evidence.
        - Adapt your arguments dynamically based on what the student says.
        - Keep your response brief, natural, and under 80 words to maintain snappy dialogue pacing.
      `;
    } else {
      systemInstruction = `
        You are a patient named Alex Mercer visiting the doctor (played by the student named ${profile?.name || "Student"}).
        The scenario is: ${scenario || "Clinical intake"}.
        
        Your behavior guidelines:
        - You must stay strictly in character as the patient. You do not have medical knowledge and do not use clinical jargon.
        - Describe your symptoms simply and naturally: squeezing/heavy chest pressure, anxiety, shortness of breath, getting worse on exertion (walking up stairs).
        - Describe symptoms anxiously but naturally, only if asked.
        - You must NOT reveal the diagnosis (Angina Pectoris) immediately.
        - Answer ONLY what the student asks. Do not volunteer extra medical details unless asked.
        - Ask realistic, anxious follow-up questions if the student is unclear or tells you something scary.
        - Do not give predefined or generic answers. Stay dynamic.
        - Do not say "you are right doctor" or "you diagnosed me correctly". Keep the consultation realistic.
        - Keep your response brief, natural, and under 70 words to keep the dialogue snappy.
      `;
    }

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && history.length > 0) {
      contents.push(
        ...history.map((h: { role: string; text: string }) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }))
      );
    } else if (career === "doctor") {
      // For doctor, patient initiates
      contents.push({
        role: "user",
        parts: [{ text: "Start clinical intake consultation" }],
      });
    }

    // Add current user message if any and not already appended
    if (message && (!history || history.length === 0 || history[history.length - 1].text !== message)) {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

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
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API call failed for roleplay text in /api/roleplay/chat", errorText);
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
    console.error("Roleplay API Route Error:", err);
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
