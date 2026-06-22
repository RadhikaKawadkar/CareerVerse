import { type UnifiedProfileV12 } from "./global-state";
import { type MentorProfile } from "./mentors";

export type Message = {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string; // ISO
};

function buildCoachPayload(
  messageText: string,
  history: Message[],
  selectedMentor: MentorProfile | null,
  profile: UnifiedProfileV12
) {
  return {
    message: messageText,
    history: history.map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
    mentor: selectedMentor,
    profile: {
      name: profile.name,
      grade: profile.grade,
      xp: profile.xp,
      level: profile.level,
      dna: profile.dna,
      completedSimulations: profile.completedSimulations,
      goals: profile.goals,
      interests: profile.interests,
      favoriteCareers: profile.favoriteCareers,
      journalReflections: profile.journalReflections,
    },
  };
}

async function fetchCoachReply(
  messageText: string,
  history: Message[],
  selectedMentor: MentorProfile | null,
  profile: UnifiedProfileV12
): Promise<string> {
  const response = await fetch("/api/coaching/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildCoachPayload(messageText, history, selectedMentor, profile)),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `API returned status ${response.status}`);
  }

  const reply = typeof data.reply === "string" ? data.reply : typeof data.text === "string" ? data.text : "";
  if (!reply.trim()) {
    throw new Error(data.error || "Empty coaching response");
  }
  return reply;
}

/**
 * Service abstraction for Gemini AI Coach responses.
 * Attempts to call the local Edge API endpoint. If not configured or fails,
 * falls back to an intelligent client-side response builder.
 */
export async function generateAICoachResponse(
  messageText: string,
  history: Message[],
  selectedMentor: MentorProfile | null,
  profile: UnifiedProfileV12
): Promise<string> {
  try {
    return await fetchCoachReply(messageText, history, selectedMentor, profile);
  } catch (error) {
    console.warn("Edge API coaching route failed or unconfigured, falling back to local simulation layer.", error);
    return getIntelligentFallbackResponse(messageText, history, selectedMentor, profile);
  }
}

/**
 * Streams the AI response chunk-by-chunk invoking onChunk callback.
 * Uses the non-streaming Gemini API route, then simulates typing for UI continuity.
 */
export async function streamAICoachResponse(
  messageText: string,
  history: Message[],
  selectedMentor: MentorProfile | null,
  profile: UnifiedProfileV12,
  onChunk: (chunk: string) => void
): Promise<string> {
  try {
    const reply = await fetchCoachReply(messageText, history, selectedMentor, profile);
    const words = reply.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i === words.length - 1 ? "" : " ");
      onChunk(word);
      await new Promise((resolve) => setTimeout(resolve, 12 + Math.random() * 18));
    }
    return reply;
  } catch (error) {
    console.warn("Edge API coaching route failed, falling back to simulated local response.", error);
    const fallbackText = getIntelligentFallbackResponse(messageText, history, selectedMentor, profile);
    const words = fallbackText.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i === words.length - 1 ? "" : " ");
      onChunk(word);
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25));
    }
    return fallbackText;
  }
}
function getIntelligentFallbackResponse(
  messageText: string,
  history: Message[],
  selectedMentor: MentorProfile | null,
  profile: UnifiedProfileV12
): string {
  const query = messageText.toLowerCase();
  const name = profile.name || "Explorer";
  const grade = profile.grade || 10;
  const dna = profile.dna;
  const mentorName = selectedMentor?.name || "AI Career Coach";
  const mentorRole = selectedMentor?.role || "Career Specialist";
  const mentorOrg = selectedMentor?.organization || "CareerVerse";

  // Derive tone and specialty based on mentor organization/role
  const isTech = mentorRole.includes("SDE") || mentorRole.includes("ML") || mentorRole.includes("Product") || mentorOrg.includes("Google") || mentorOrg.includes("Flipkart");
  const isLaw = mentorRole.includes("Associate") || mentorRole.includes("Lawyer") || mentorOrg.includes("Khaitan");
  const isMedical = mentorRole.includes("Doctor") || mentorRole.includes("Cardiologist") || mentorOrg.includes("Fortis");
  const isCreative = mentorRole.includes("Creative") || mentorRole.includes("Designer") || mentorRole.includes("Creator");

  // General context assembly
  const completedCount = profile.completedSimulations.length;
  const favoriteCareers = profile.favoriteCareers || [];
  const journalReflections = profile.journalReflections || [];

  const introduction = `[Persona: ${mentorName} · ${mentorRole} at ${mentorOrg}]\n\n`;
  let advice = "";

  // Recall previous query context from history
  let contextRecall = "";
  const pastQueries = history
    .filter((m) => m.sender === "user")
    .map((m) => m.text.toLowerCase());

  if (pastQueries.length > 1) {
    contextRecall = `Continuing our discussion, and taking your previous question into account: `;
  }

  // Answer matching routes
  if (query.includes("suits me") || query.includes("suit me") || query.includes("recommend") || query.includes("what career")) {
    const streamTip = profile.grade && profile.grade >= 11 ? "stream specializations" : "subjects matching your style";
    advice = `Based on your **${dna.workStyle}** DNA (Analytical: ${dna.analytical}%, Creativity: ${dna.creativity}%), I recommend looking into ${streamTip} that value structural design. `;
    
    if (isTech) {
      advice += `In technology, roles like Software Systems Architect or Data Analyst would fit your high analytical index. My journey at ${mentorOrg} shown me that combining engineering with statistical math is highly rewarded.`;
    } else if (isLaw) {
      advice += `In government and law, you could leverage your logical reasoning score in Corporate Law or Compliance Auditing. These tracks require the precise statutory mapping you demonstrated.`;
    } else if (isMedical) {
      advice += `For clinical paths, your analytical precision is an excellent foundation for diagnostics, radiology, or surgical pacing which require low error margins under pressure.`;
    } else {
      advice += `A balanced approach across multidisciplinary streams is a great way to discover your organic fit. Try starting the Chef or Fashion Designer simulations next to expand your signals!`;
    }

    if (favoriteCareers.length > 0) {
      advice += `\n\nI see you've favorited **${favoriteCareers.join(", ")}**, which aligns well with your interests.`;
    }

    if (completedCount > 0) {
      advice += `\n\nI see you have completed the simulations for **${profile.completedSimulations.join(", ")}**. You showed strong decisions in these modules!`;
    }

    if (journalReflections.length > 0) {
      advice += ` In your journal reflection for ${journalReflections[0].careerId}, you noted that "${journalReflections[0].excited}" excited you. Let's build on that!`;
    }
  } else if (query.includes("salary") || query.includes("earn") || query.includes("lpa") || query.includes("money")) {
    advice = `Salary structures vary significantly between entry-level brackets and senior leadership. `;
    if (isTech) {
      advice += `In tech, entry SDEs in India typically start around ₹6 - 12 LPA. But as you scale to Staff SDE or Principal Architect positions, packages range between ₹35 - 75+ LPA. Globally, SDE roles often command $80k - $160k+ USD annually.`;
    } else if (isLaw) {
      advice += `Legal starting packages in national chambers start at ₹5 - 9 LPA. Corporate Senior Associates or Partners routinely scale to ₹25 - 60+ LPA depending on startup financing portfolios.`;
    } else if (isMedical) {
      advice += `Clinical residency starts at ₹8 - 14 LPA, but senior medical consultants or surgeons scale to ₹35 - 80+ LPA. The educational pipeline is longer, but long-term growth is exceptionally stable.`;
    } else if (isCreative) {
      advice += `Design roles start around ₹3.5 - 7 LPA. However, building a strong freelance portfolio or scaling a D2C sustainable label can lead to significant revenue scaling.`;
    } else {
      advice += `Average packages in the market scale with your claimed competencies. Check out our Trends Explorer or College section for specific placement rates.`;
    }
  } else if (query.includes("exam") || query.includes("college") || query.includes("study") || query.includes("degree")) {
    advice = `Preparing for the right educational pipeline is critical. `;
    if (isTech) {
      advice += `To enter top tech positions, aiming for B.Tech CS degrees is common, with exams like JEE Main/Advanced. Alternative paths like bootcamps, contributing to open-source, or building strong GitHub portfolios are also highly valued now.`;
    } else if (isLaw) {
      advice += `Lawyers path typically requires integrated BA LLB or BBA LLB (5 years) programs. You will want to target entrance tests like **CLAT** or **LSAT India** during Grade 12.`;
    } else if (isMedical) {
      advice += `Medical practitioners must crack the **NEET UG** exam for MBBS admissions, followed by Resident PG specializations. It requires high dedication to Biology and Chemistry.`;
    } else if (isCreative) {
      advice += `Top design institutions like NIFT, NID, or IIT IDC accept scores from exams like NIFT Entrance or UCEED/CEED. Focus on building a rich sketching portfolio.`;
    } else {
      advice += `Look at the 'Degree Paths' in our database library. It maps exactly what high school subjects and exams you need.`;
    }
  } else if (query.includes("parents") || query.includes("pressure") || query.includes("force")) {
    advice = `Navigating family expectations is a key milestone for students. As a professional, my advice is to avoid direct conflict and instead focus on 'showing, not telling'. \n\nShow them your completed simulations, streak milestones, and the shareable Portfolio card you generated. Presenting solid data about starting salaries, global growth, and AI safety in fields like ours helps reassure them of your career's viability.`;
  } else {
    // General conversational fallback tailored to the selected mentor persona
    advice = `That is a great question, ${name}. In my role at **${mentorOrg}**, I routinely see that students in **Grade ${grade}** who show a **${dna.workStyle}** style benefit from building strong foundations early. `;
    
    if (favoriteCareers.length > 0) {
      advice += `Your interest in favorited paths like **${favoriteCareers.join(", ")}** shows a clear focus. `;
    }

    if (journalReflections.length > 0) {
      advice += `Also, in your journal, you reflected that "${journalReflections[0].excited}" was exciting, which highlights your strengths. `;
    }

    if (profile.goals.length > 0) {
      advice += `I see you are tracking quests for **${profile.goals.join(", ")}**. My suggestion is to focus on claiming target certifications on the Skills page.`;
    } else {
      advice += `To calibrate my advice further, try bookmarking a career goal or completing a simulator module!`;
    }
  }

  return `${introduction}${contextRecall}${advice}\n\n*Feel free to ask me more specific questions about entry requirements, daily schedules, or typical work-life balance!*`;
}



