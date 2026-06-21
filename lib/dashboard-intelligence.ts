import { type UnifiedProfileV12 } from "./global-state";

export type IntelligenceResult = {
  strengths: { name: string; score: number; description: string }[];
  growthAreas: { name: string; score: number; description: string }[];
  pattern: { title: string; description: string };
  blindSpots: { title: string; description: string }[];
  nextActions: { id: string; action: string; detail: string }[];
};

export function getDashboardIntelligence(profile: UnifiedProfileV12): IntelligenceResult {
  const dna = profile.dna;
  const streak = profile.streak || 3;
  const journalCount = profile.journalReflections.length;

  // Retrieve simulator data from localStorage
  const completedSims: { completed: boolean; fit?: number }[] = [];
  let totalSimFit = 0;
  let simFitCount = 0;
  
  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("simulation-")) {
        try {
          const simData = JSON.parse(localStorage.getItem(key) || "{}");
          if (simData.completed) {
            completedSims.push(simData);
            if (simData.fit) {
              totalSimFit += simData.fit;
              simFitCount++;
            }
          }
        } catch {}
      }
    }
  }

  const avgFit = simFitCount > 0 ? totalSimFit / simFitCount : 4;

  // Retrieve chat logs from localStorage to evaluate mentor interactions
  let mentorMsgsCount = 0;
  if (typeof window !== "undefined") {
    try {
      const savedChats = localStorage.getItem("careerverse-ai-mentor-chats");
      if (savedChats) {
        const chats = JSON.parse(savedChats);
        mentorMsgsCount = chats.filter((c: { sender: string }) => c.sender === "user").length;
      }
    } catch {}
  }

  // 1. STRENGTHS CALCULATIONS (Analytical Thinking, Creativity, Communication, Empathy, Problem Solving)
  
  // Analytical Thinking: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasAnalyticalSim = profile.completedSimulations.some(id => id === "software-engineer" || id === "data-scientist" || id === "biotech-researcher");
  const analyticalSimScore = hasAnalyticalSim ? 100 : 50;
  const hasAnalyticalJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("logic") || j.excited.toLowerCase().includes("code") || j.excited.toLowerCase().includes("database") || j.excited.toLowerCase().includes("data")
  );
  const analyticalJournalScore = hasAnalyticalJournal ? 100 : 40;
  const analyticalScore = Math.round(
    dna.analyticalScore * 0.4 +
    analyticalSimScore * 0.3 +
    analyticalJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Creativity: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasCreativeSim = profile.completedSimulations.some(id => id === "fashion-designer" || id === "graphic-designer" || id === "chef" || id === "content-creator");
  const creativeSimScore = hasCreativeSim ? 100 : 50;
  const hasCreativeJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("design") || j.excited.toLowerCase().includes("creative") || j.excited.toLowerCase().includes("draw") || j.excited.toLowerCase().includes("style")
  );
  const creativeJournalScore = hasCreativeJournal ? 100 : 40;
  const creativityScore = Math.round(
    dna.creativityScore * 0.4 +
    creativeSimScore * 0.3 +
    creativeJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Communication: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasCommSim = profile.completedSimulations.some(id => id === "lawyer" || id === "journalist" || id === "teacher");
  const commSimScore = hasCommSim ? 100 : 50;
  const hasCommJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("argue") || j.excited.toLowerCase().includes("talk") || j.excited.toLowerCase().includes("express") || j.excited.toLowerCase().includes("present")
  );
  const commJournalScore = hasCommJournal ? 100 : 40;
  const communicationScore = Math.round(
    dna.communicationScore * 0.4 +
    commSimScore * 0.3 +
    commJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Empathy: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasEmpathySim = profile.completedSimulations.some(id => id === "psychologist" || id === "doctor");
  const empathySimScore = hasEmpathySim ? 100 : 50;
  const hasEmpathyJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("feel") || j.excited.toLowerCase().includes("help") || j.excited.toLowerCase().includes("patient") || j.excited.toLowerCase().includes("people")
  );
  const empathyJournalScore = hasEmpathyJournal ? 100 : 40;
  const empathyScore = Math.round(
    dna.collaboration * 0.4 +
    empathySimScore * 0.3 +
    empathyJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Problem Solving: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const problemSimScore = completedSims.length > 0 ? 100 : 50;
  const hasProblemJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("solve") || j.excited.toLowerCase().includes("fix") || j.excited.toLowerCase().includes("overcome") || j.excited.toLowerCase().includes("debug")
  );
  const problemJournalScore = hasProblemJournal ? 100 : 40;
  const problemSolvingScore = Math.round(
    ((dna.analyticalScore + dna.creativityScore) / 2) * 0.4 +
    problemSimScore * 0.3 +
    problemJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  const strengthsList = [
    { name: "Analytical Thinking", score: analyticalScore, description: "Your strength lies in parsing complex data sheets, coding algorithms, and structural logics." },
    { name: "Creativity", score: creativityScore, description: "Your strength centers on conceptual storytelling, vector graphics, and out-of-the-box spatial layouts." },
    { name: "Communication", score: communicationScore, description: "Your strength includes public debates, negotiating agreements, and translating tech specs into business stories." },
    { name: "Empathy", score: empathyScore, description: "Your strength is bedside manner, active patient listening, and understanding family/client expectations." },
    { name: "Problem Solving", score: problemSolvingScore, description: "Your strength lies in troubleshooting latency crashes, fixing indexing bottlenecks, and debugging exceptions." }
  ].sort((a, b) => b.score - a.score);

  // 2. GROWTH AREAS CALCULATIONS (Leadership, Collaboration, Risk Tolerance, Consistency, Decision Confidence)
  
  // Leadership: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasLeadSim = profile.completedSimulations.some(id => id === "entrepreneur" || id === "product-manager");
  const leadSimScore = hasLeadSim ? 100 : 50;
  const hasLeadJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("lead") || j.excited.toLowerCase().includes("manage") || j.excited.toLowerCase().includes("run")
  );
  const leadJournalScore = hasLeadJournal ? 100 : 40;
  const leadershipScore = Math.round(
    dna.leadershipScore * 0.4 +
    leadSimScore * 0.3 +
    leadJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Collaboration: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasCollabSim = completedSims.length > 0 ? 90 : 50;
  const hasCollabJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("team") || j.excited.toLowerCase().includes("collaborate") || j.excited.toLowerCase().includes("group")
  );
  const collabJournalScore = hasCollabJournal ? 100 : 40;
  const collaborationScore = Math.round(
    dna.collaboration * 0.4 +
    hasCollabSim * 0.3 +
    collabJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Risk Tolerance: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const hasRiskSim = profile.completedSimulations.some(id => id === "entrepreneur" || id === "pilot");
  const riskSimScore = hasRiskSim ? 100 : 50;
  const hasRiskJournal = profile.journalReflections.some(j => 
    j.excited.toLowerCase().includes("risk") || j.excited.toLowerCase().includes("launch") || j.excited.toLowerCase().includes("fail")
  );
  const riskJournalScore = hasRiskJournal ? 100 : 40;
  const riskScore = Math.round(
    dna.risk * 0.4 +
    riskSimScore * 0.3 +
    riskJournalScore * 0.2 +
    Math.min(100, mentorMsgsCount * 15) * 0.1
  );

  // Consistency: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const consistencyScore = Math.round(
    Math.min(100, streak * 15) * 0.4 +
    Math.min(100, profile.completedSimulations.length * 35) * 0.3 +
    Math.min(100, journalCount * 30) * 0.2 +
    Math.min(100, mentorMsgsCount * 10) * 0.1
  );

  // Decision Confidence: 40% DNA, 30% Sims, 20% Journal, 10% Mentors
  const confidenceScore = Math.round(
    dna.confidenceScore * 0.4 +
    Math.min(100, avgFit * 20) * 0.3 +
    Math.min(100, journalCount * 25) * 0.2 +
    Math.min(100, mentorMsgsCount * 10) * 0.1
  );

  const growthList = [
    { name: "Leadership", score: leadershipScore, description: "Building team visions, raising capital investments, and managing product timelines." },
    { name: "Collaboration", score: collaborationScore, description: "Syncing cross-functional feedback, pairing in code tasks, and resolving client gaps." },
    { name: "Risk Tolerance", score: riskScore, description: "Launching minimal viable mockups early, choosing trials over out-of-court settlements." },
    { name: "Consistency", score: consistencyScore, description: "Maintaining study streaks, logging daily checksheets, and recording journal entries." },
    { name: "Decision Confidence", score: confidenceScore, description: "Making quick operational trade-offs and resolving ambiguities under stress." }
  ].sort((a, b) => a.score - b.score); // Ascending order (lowest scores first)

  // 3. BEHAVIORAL PATTERN DETECTION
  let patternTitle = "Explorative Strategist";
  let patternDesc = "You show a balanced curiosity across multiple disciplines, reviewing data structures and artistic designs with equal engagement.";

  if (dna.analytical > 70 && dna.collaboration < 50) {
    patternTitle = "Deep-Focus Specialist";
    patternDesc = "You prefer solving complex technical architectures and database indexing layers independently, maintaining high code standards.";
  } else if (dna.creativity > 70 && dna.collaboration > 65) {
    patternTitle = "Consensus Creative";
    patternDesc = "You prioritize aesthetic designs, user layout storytelling, and coordinating styling guidelines with teammates.";
  } else if (dna.risk > 65 && dna.leadershipScore > 65) {
    patternTitle = "High-Velocity Maverick";
    patternDesc = "You excel at launching startup products fast, managing venture audits, and deploying server hot-patches under stress.";
  } else if (dna.analytical > 70 && dna.risk < 50) {
    patternTitle = "Risk-Averse Analyst";
    patternDesc = "You prioritize safety checklists, data validation audits, and statutory code rules to prevent operational errors.";
  }

  // 4. BLIND SPOTS (Presented positively as "Unexplored Strengths")
  const blindSpots: { title: string; description: string }[] = [];
  
  // Show the lowest growth area as an unexplored strength
  const lowestGrowth = growthList[0];
  if (lowestGrowth.name === "Collaboration") {
    blindSpots.push({
      title: "Collaboration as an Unexplored Strength",
      description: "You excel at independent focus. Practicing group compromises or pairing in code exercises will amplify your overall output."
    });
  } else if (lowestGrowth.name === "Risk Tolerance") {
    blindSpots.push({
      title: "Risk Pacing as an Unexplored Strength",
      description: "You value strict stability and safety code rules. Trying out early MVP product launches will build your comfort with startup speed."
    });
  } else if (lowestGrowth.name === "Leadership") {
    blindSpots.push({
      title: "Leadership as an Unexplored Strength",
      description: "You are an excellent execution specialist. Stepping in to expedite project schedules or pitching startup ideas will unlock your influence."
    });
  } else {
    blindSpots.push({
      title: `${lowestGrowth.name} as an Unexplored Strength`,
      description: `Your scores suggest you prioritize other areas. Exploring activities focused on ${lowestGrowth.name.toLowerCase()} will balance your skills.`
    });
  }

  // Add a second general unexplored strength if available
  const secondLowest = growthList[1];
  blindSpots.push({
    title: `${secondLowest.name} as a Growth Area`,
    description: `You show high affinity for raw logic. Squeezing in exercises that practice ${secondLowest.name.toLowerCase()} will help round out your Career DNA.`
  });

  // 5. SUGGESTED NEXT ACTIONS (Calibrated to lowest growth areas)
  const nextActions: { id: string; action: string; detail: string }[] = [];
  
  if (lowestGrowth.name === "Leadership" || lowestGrowth.name === "Risk Tolerance") {
    nextActions.push({
      id: "action-pm",
      action: "Play the Entrepreneur or Product Manager simulation",
      detail: "Learn how startup founders raise seed capital and make high-stakes GTM launch decisions."
    });
  } else if (lowestGrowth.name === "Collaboration") {
    nextActions.push({
      id: "action-collab",
      action: "Participate in Community Discussion threads",
      detail: "Post questions in discussion rooms to practice stakeholder alignment and peer feedback."
    });
  } else if (lowestGrowth.name === "Decision Confidence") {
    nextActions.push({
      id: "action-sim",
      action: "Complete the Lawyer or Doctor workplace simulations",
      detail: "Face high-stress triage or courtroom cross-examinations to calibrate your quick decision metrics."
    });
  } else {
    nextActions.push({
      id: "action-skills",
      action: "Claim a new badge in the Skill Tree",
      detail: "Add tool certifications (like Figma or SQL) to prove your consistency scores."
    });
  }

  nextActions.push({
    id: "action-coach",
    action: `Ask ${profile.completedSimulations.length > 0 ? "your Career Mentor" : "AI Coach"} about subject streams`,
    detail: "Receive personalized feedback referencing your behavioral patterns and active quests."
  });

  return {
    strengths: strengthsList.slice(0, 3), // Top 3
    growthAreas: growthList.slice(0, 3),  // Lowest 3 (Growth Areas)
    pattern: { title: patternTitle, description: patternDesc },
    blindSpots,
    nextActions
  };
}
