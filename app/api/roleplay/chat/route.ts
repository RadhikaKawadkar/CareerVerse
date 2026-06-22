/* eslint-disable @typescript-eslint/no-explicit-any */
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

function getFriendlyError(status: number, errorText: string): string {
  const textLower = errorText.toLowerCase();
  if (status === 404 || textLower.includes("model") || textLower.includes("not found") || textLower.includes("not_found") || textLower.includes("unavailable")) {
    return "Gemini model unavailable";
  }
  return errorText || "Gemini API call failed";
}

// Robust fetch helper with retry and model fallback
async function callGeminiWithRetry(
  apiKey: string,
  modelList: string[],
  isFeedback: boolean,
  systemInstruction: string,
  contents: any
): Promise<Response> {
  let response: Response | null = null;
  let lastError: Error | null = null;
  let delay = 800;

  for (let attempt = 0; attempt < 3; attempt++) {
    // Attempt gemini-2.5-flash first, then fall back to gemini-1.5-flash on retry
    const currentModel = modelList[Math.min(attempt, modelList.length - 1)];
    const method = isFeedback ? "generateContent" : "streamGenerateContent";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:${method}?key=${apiKey}`;

    const requestBody: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: isFeedback ? 0.2 : 0.7,
        maxOutputTokens: isFeedback ? 1000 : 300,
      },
    };

    if (isFeedback) {
      requestBody.generationConfig.responseMimeType = "application/json";
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Gemini API DEBUG] Route called: /api/roleplay/chat`);
        console.log(`[Gemini API DEBUG] GEMINI_API_KEY loaded: ${apiKey ? "YES" : "NO"}`);
        console.log(`[Gemini API DEBUG] Model requested: ${currentModel} (${method}) - Attempt ${attempt + 1}...`);
      }

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        return response;
      }

      const status = response.status;
      const errText = await response.text();
      lastError = new Error(`HTTP ${status}: ${errText}`);

      if (process.env.NODE_ENV === "development") {
        console.error(`[Gemini API DEBUG] Route called: /api/roleplay/chat`);
        console.error(`[Gemini API DEBUG] Model requested: ${currentModel}`);
        console.error(`[Gemini API DEBUG] Response Status Code: ${status}`);
        console.error(`[Gemini API DEBUG] Exact Gemini error message: ${errText}`);
      }

      // Retry on 500, 502, 503, 504
      if (status === 500 || status === 502 || status === 503 || status === 504) {
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // 800ms -> 1600ms
          continue;
        }
      }
      return response; // Exit loop for non-retryable statuses (e.g. 400, 403)
    } catch (err: any) {
      lastError = err;
      if (process.env.NODE_ENV === "development") {
        console.error(`[Gemini API DEBUG] Attempt ${attempt + 1} network/timeout error:`, err);
      }
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }

  if (lastError) throw lastError;
  throw new Error("API call failed");
}

export async function POST(req: Request) {
  try {
    const { career, scenario, message, history, profile, isFeedback, stats } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (process.env.NODE_ENV === "development") {
      console.log(`[Gemini API DEBUG] Route called: /api/roleplay/chat`);
      console.log(`[Gemini API DEBUG] GEMINI_API_KEY loaded: ${apiKey ? "YES" : "NO"}`);
    }
    if (!apiKey) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[Gemini API DEBUG] Error: Gemini API key not found`);
      }
      return NextResponse.json(
        { error: "Gemini API key not found" },
        { status: 500 }
      );
    }

    const stableModels = ["gemini-2.5-flash", "gemini-1.5-flash"];

    if (isFeedback) {

      const systemPrompt = `
        You are the CareerVerse Roleplay Evaluation Engine.
        You will analyze a conversation history between a high school student and an AI character to generate a strict, realistic evaluation.
        The career simulation is: ${career === "lawyer" ? "Lawyer (Student acts as Lawyer, AI acts as Judge)" : "Doctor (Student acts as Doctor, AI acts as Patient)"}.
        Selected Scenario: ${scenario || (career === "lawyer" ? "Courtroom Trial" : "Clinical intake")}.
        Student Profile: Name: ${profile?.name || "Student"}.
        
        Session statistics:
        - Turn count: ${stats?.turnCount || 0}
        - Average Response Length: ${stats?.avgResponseLength || 0} words
        - Question Count: ${stats?.questionCount || 0}
        - Follow-up Questions: ${stats?.followUpQuestions || 0}
        - Voice Mode used: ${stats?.voiceUsed ? "Yes" : "No"}
        - Total Speaking Time: ${stats?.totalSpeakingTime || 0} seconds
        - Interruptions: ${stats?.interruptions || 0}
        - Hesitation Count: ${stats?.hesitationCount || 0}
        - Microphone Participation: ${stats?.microphoneParticipation || 0}%

        Evaluate the student's performance objectively, strictly, and realistically.
        Rubric guidelines:
        - If the student acts as a Doctor:
          * Reward deep diagnostic questioning (asking about chest pain triggers, duration, radiation, family history, etc.).
          * Reward empathy, active listening, and patient reassurance.
          * Reward logical follow-up questions based on patient's answers.
          * Reduce scores severely for shallow, generic, or brief questioning, or if they jump to a diagnosis too quickly.
        - If the student acts as a Lawyer:
          * Reward logical argument structure and clear legal evidence application.
          * Reward asking for evidence, challenging Judge/witness assertions, and structured courtroom reasoning.
          * Reward formal legal language and courtroom etiquette.
          * Reduce scores severely for weak reasoning, lack of evidence-based statements, or overly informal/short responses.
        
        Do NOT give generic or high scores (like all 90s) unless the conversation is exceptionally professional. If responses are short, off-topic, or lack depth, give low scores (e.g., 40s-60s) and detailed improvement points. Differ scores significantly based on quality.
        
        Provide a JSON response containing exactly the following keys:
        - "communication": a number (0-100) representing communication clarity, tone, and vocabulary.
        - "confidence": a number (0-100) representing confidence level and assertiveness.
        - "reasoning": a number (0-100) representing diagnostic logic or argument structure.
        - "empathy": a number (0-100) representing empathy (for Doctor) or persuasion (for Lawyer).
        - "careerFit": a number (0-100) representing overall career suitability.
        - "strengths": an array of strings (at least 2 strings) summarizing specific behaviors they performed well.
        - "improvements": an array of strings (at least 2 strings) summarizing specific weaknesses or areas where they can improve.
        - "summary": a string summarizing the performance and overall feedback.
        - "recommendedNextAction": a specific, actionable next recommendation.

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

      try {
        const response = await callGeminiWithRetry(apiKey, stableModels, true, systemPrompt, contents);
        if (!response.ok) {
          const status = response.status;
          const errorText = await response.text();
          if (process.env.NODE_ENV === "development") {
            console.error(`[Gemini API DEBUG] Feedback request failed. Status: ${status}. Error: ${errorText}`);
          }
          return NextResponse.json({ error: getFriendlyError(status, errorText) }, { status });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          try {
            let cleanText = text.trim();
            if (cleanText.startsWith("```")) {
              const firstLineIndex = cleanText.indexOf("\n");
              if (firstLineIndex !== -1) {
                cleanText = cleanText.substring(firstLineIndex + 1);
              }
              if (cleanText.endsWith("```")) {
                cleanText = cleanText.substring(0, cleanText.length - 3);
              }
              cleanText = cleanText.trim();
            }
            const parsed = JSON.parse(cleanText);
            return NextResponse.json(parsed);
          } catch {
            return NextResponse.json({ rawText: text });
          }
        }
        return NextResponse.json({ error: "No response text" }, { status: 500 });
      } catch (retryErr: any) {
        console.error("[Gemini API Feedback Final Error]", retryErr);
        return NextResponse.json({ error: retryErr.message || "Feedback generation failed" }, { status: 500 });
      }
    }

    // Roleplay Dialogue Generation (Streaming)
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
      contents.push({
        role: "user",
        parts: [{ text: "Start clinical intake consultation" }],
      });
    }

    if (message && (!history || history.length === 0 || history[history.length - 1].text !== message)) {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

    let response;
    try {
      response = await callGeminiWithRetry(apiKey, stableModels, false, systemInstruction, contents);
    } catch (retryErr: any) {
      console.error("[Gemini API Dialogue Final Error]", retryErr);
      return NextResponse.json({ error: retryErr.message || "Dialogue generation failed" }, { status: 500 });
    }

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      if (process.env.NODE_ENV === "development") {
        console.error(`[Gemini API DEBUG] Dialogue request failed. Status: ${status}. Error: ${errorText}`);
      }
      return NextResponse.json({ error: getFriendlyError(status, errorText) }, { status });
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

                  // Handle Gemini error JSON inside stream
                  if (parsed.error) {
                    console.error("[Gemini Stream JSON Error]", parsed.error);
                    controller.error(new Error(parsed.error.message || "Internal error in stream"));
                    return;
                  }

                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (jsonErr) {
                  if (process.env.NODE_ENV === "development") {
                    console.warn("[Stream Parser] JSON parse error on chunk:", jsonErr);
                  }
                  // Malformed chunk: prepend back if it might be incomplete
                  buffer = part + buffer;
                  break;
                }
              }
            }
          }
        } catch (e) {
          console.error("[Gemini Stream Read Error]", e);
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
