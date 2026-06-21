import type { CareerPressure, GuestProfile } from "@/types/profile";
import { CAREER_LIBRARY } from "./career-library";

export type CareerArchetype = {
  name: string;
  badge: string;
  description: string;
  traits: string[];
  gradient: string;
  textColor: string;
  borderColor: string;
  strengths: string[];
  growthAreas: string[];
  nextExplorations: { id: string; title: string }[];
};

export type CareerDNA = {
  creativity: number;
  analytical: number;
  collaboration: number;
  riskTolerance: number;
  strengths: string[];
  interests: string[];
  workStyle: string;
  learningStyle: string;
  communicationScore: number;
  creativityScore: number;
  leadershipScore: number;
  analyticalScore: number;
  confidenceScore: number;
  decisionPatterns: string[];
  strengthClusters: string[];
  growthHistory: { label: string; analytical: number; creativity: number; leadership: number }[];
};

export type JourneyEvent = {
  title: string;
  description: string;
  badge: string;
};

export type CareerRecommendation = {
  careerId: string;
  careerTitle: string;
  stream: string;
  matchScore: number;
  confidence: "High" | "Moderate" | "Exploring";
  matchReasons: string[];
  explanation: string;
};

export type AnalysisResult = {
  archetype: CareerArchetype;
  scienceScore: number;
  sweScore: number;
  sciencePercent: number;
  swePercent: number;
  pressureComparison: {
    source: string;
    level: string;
    analysisText: string;
    adviceText: string;
    negotiationTactic?: string;
  };
  checklist: string[];
  recommendation: string;
  careerRecommendations: CareerRecommendation[];
  careerDNA: CareerDNA;
  journeyTimeline: JourneyEvent[];
};

export const PERSONALITY_ARCHETYPES: Record<string, CareerArchetype> = {
  Builder: {
    name: "Builder",
    badge: "Pragmatic & Structured",
    description: "You love coding systems, constructing layouts, and executing concrete blueprints. You focus on raw logic, quality control, and building tangible software or physical infrastructure.",
    traits: ["Logical", "Pragmatic", "Details-focused", "First-principles thinker"],
    gradient: "from-sky-500/10 via-primary/8 to-emerald-500/10",
    textColor: "text-primary",
    borderColor: "border-primary/30",
    strengths: ["Systems Architecture", "Algorithmic Debugging", "Process Automation"],
    growthAreas: ["Tolerance for Unstructured Ideas", "Stakeholder Diplomacy", "Adapting to Changing Scope"],
    nextExplorations: [{ id: "software-engineer", title: "Software Engineer" }, { id: "architect", title: "Architect" }, { id: "robotics-engineer", title: "Robotics Engineer" }]
  },
  Creator: {
    name: "Creator",
    badge: "Aesthetic & Expressive",
    description: "You thrive when storyboarding narratives, designing layouts, and publishing visual expressions. You value artistic voice and use micro-details to make interfaces or products feel alive.",
    traits: ["Imaginative", "Empathic", "Expressive", "Aesthetics-driven"],
    gradient: "from-purple-500/10 via-pink-500/8 to-transparent",
    textColor: "text-purple-600",
    borderColor: "border-purple-500/30",
    strengths: ["Visual Layout Design", "Narrative Copywriting", "User Experience Curation"],
    growthAreas: ["Strict Math Diagnostics", "Structured Compliance Auditing", "Rote Execution Stamina"],
    nextExplorations: [{ id: "fashion-designer", title: "Fashion Designer" }, { id: "content-creator", title: "Content Creator" }, { id: "ux-designer", title: "UX/UI Designer" }]
  },
  Analyst: {
    name: "Analyst",
    badge: "Methodical & Quantitative",
    description: "You excel at data pipeline scrubbing, hypothesis validation, and pattern deduction. You focus on statistical correlations and controlled lab telemetry rather than immediate release pressures.",
    traits: ["Data-driven", "Detail-oriented", "Skeptical", "Inquisitive"],
    gradient: "from-sky-500/10 via-indigo-500/8 to-transparent",
    textColor: "text-sky-600",
    borderColor: "border-sky-500/30",
    strengths: ["Data Ingestion Audits", "Statistical Modeling", "Bioinformatics Sequencing"],
    growthAreas: ["Fast Pivot Decision-Making", "Persuasive Presentation Storytelling", "High Risk Tolerance"],
    nextExplorations: [{ id: "data-scientist", title: "Data Scientist" }, { id: "biotech-researcher", title: "Biotech Researcher" }, { id: "actuary", title: "Actuary" }]
  },
  Leader: {
    name: "Leader",
    badge: "Strategic & Diplomatic",
    description: "You thrive when aligning stakeholder groups, resolving product scope dilemmas, and executing market growth bets. You prioritize collective team energy and scale targets over individual coding.",
    traits: ["Strategic", "Collaborative", "Decisive", "Risk-taking"],
    gradient: "from-amber-500/10 via-orange-500/8 to-transparent",
    textColor: "text-amber-600",
    borderColor: "border-amber-500/30",
    strengths: ["Cross-functional Alignment", "Tradeoff Valuation", "Venture Pitch Execution"],
    growthAreas: ["Patience with Technical Debt", "Manual Telemetry Auditing", "Rote Content Storyboarding"],
    nextExplorations: [{ id: "entrepreneur", title: "Entrepreneur" }, { id: "product-manager", title: "Product Manager" }, { id: "digital-marketer", title: "Digital Marketer" }]
  },
  Explorer: {
    name: "Explorer",
    badge: "Curious & Adaptable",
    description: "You show a balanced, open interest across multiple disciplines. You excel at sampling diverse stream concepts without committing early, adapting to science theory or design expression with ease.",
    traits: ["Adaptable", "Broad curiosity", "Observant", "Open-minded"],
    gradient: "from-violet-500/10 via-fuchsia-500/8 to-transparent",
    textColor: "text-violet-600",
    borderColor: "border-violet-500/30",
    strengths: ["Multidisciplinary Learning", "Rapid Synthesis", "Empathetic Observation"],
    growthAreas: ["Deep Technical Specialization", "Executing High-capital Risks", "Rote Process Administration"],
    nextExplorations: [{ id: "civil-servant", title: "Civil Servant" }, { id: "journalist", title: "Journalist" }, { id: "teacher", title: "School Educator" }]
  },
  Innovator: {
    name: "Innovator",
    badge: "Disruptive & Visionary",
    description: "You combine analytical thinking and creative ideation to design out-of-the-box structural, physical, or technical transformations. You challenge conventional standards and integrate new paradigms.",
    traits: ["Visionary", "Inventive", "Analytical", "Non-conformist"],
    gradient: "from-emerald-500/10 via-teal-500/8 to-transparent",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-500/30",
    strengths: ["Algorithmic AI Auditing", "Sustainable Structural Design", "Bio-fuel Formulations"],
    growthAreas: ["Strict Standard Compliance", "Routine Operations Maintenance", "Rote Ledger Audits"],
    nextExplorations: [{ id: "ai-ethics-auditor", title: "AI Ethics Auditor" }, { id: "cybersecurity-analyst", title: "Cybersecurity Analyst" }, { id: "pilot", title: "Commercial Pilot" }]
  }
};

export function analyzeProfile(profile: GuestProfile): AnalysisResult {
  const scienceInterest = profile.scienceReflection?.interest ?? 3;
  const scienceConfidence = profile.scienceReflection?.confidence ?? 3;
  const sweInterest = profile.sweReflection?.interest ?? 3;
  const sweConfidence = profile.sweReflection?.confidence ?? 3;

  const scienceScore = (scienceInterest + scienceConfidence) / 2;
  const sweScore = (sweInterest + sweConfidence) / 2;

  const sciencePercent = (scienceScore / 5) * 100;
  const swePercent = (sweScore / 5) * 100;

  // Analyze choices (collaborative vs independent)
  const choices = profile.sweChoices;
  const collaborativeChoices = [choices.scene1, choices.scene2, choices.scene3].filter(
    (c) => c === "a" || c === "c"
  ).length;

  // Generate grade-specific advice
  const grade = profile.grade ?? 10;
  let checklist: string[] = [];

  if (grade <= 9) {
    checklist = [
      "Try the mock trade-offs for AI Engineer and Entrepreneur in the Career Library.",
      "Explore scratch block programming (like Scratch or basic Python) to see if you like creating logic.",
      "Read popular science articles or watch documentaries on physics and space exploration.",
      "Discuss your simulation results with a teacher to see what school clubs fit you.",
    ];
  } else if (grade === 10) {
    checklist = [
      "Compare the Physics and Software results. If you liked both, PCM with Computer Science is your best stream option.",
      "Visit the Career Library and read the 'Education Pathways' for AI Engineer and Product Manager.",
      "Solve 3 more mock scenarios in the Career Library for careers in Commerce and Arts to double check your preferences.",
      "Map out the registration dates for Grade 11 school admissions.",
    ];
  } else {
    // Grade 11 or 12
    checklist = [
      "Start building a GitHub profile. Code 3 small React or HTML/JS applications.",
      "Research university entry requirements (engineering entrance exams, B.Sc. merit programs).",
      "Look for virtual student internships or shadow a professional in your top-rated career.",
      "Examine the 'AI Impact' section of your target careers in the library to learn skills that coexist with AI.",
    ];
  }

  // Career DNA calculations
  let creativity = 50;
  let analytical = 50;
  let collaboration = 50;
  let riskTolerance = 50;

  // Adjust attributes based on Science experience
  if (profile.scienceCompleted) {
    analytical += scienceScore * 4; // max +20
    if (profile.scienceQuizScore && profile.scienceQuizScore >= 2) {
      analytical += 15;
    }
  }

  // Adjust attributes based on SWE experience
  if (profile.sweCompleted) {
    creativity += sweScore * 3; // max +15
    if (choices.scene1 === "b") analytical += 10;
    if (choices.scene1 === "a") collaboration += 15;
    if (choices.scene1 === "c") creativity += 15;

    if (choices.scene2 === "b") riskTolerance += 20;
    if (choices.scene2 === "c") analytical += 10;

    if (choices.scene3 === "a") collaboration += 15;
    if (choices.scene3 === "b") {
      collaboration -= 10;
      riskTolerance += 10;
    }
  }

  // Onboarding settings
  const influence = profile.careerPressure || "not-sure";
  if (influence === "myself") {
    riskTolerance += 15;
  } else if (influence === "parents" || influence === "teachers") {
    riskTolerance -= 5;
  }

  // Caps and Floors
  creativity = Math.min(98, Math.max(35, creativity));
  analytical = Math.min(98, Math.max(35, analytical));
  collaboration = Math.min(98, Math.max(35, collaboration));
  riskTolerance = Math.min(98, Math.max(35, riskTolerance));

  // Determine Archetype based on DNA
  let archetype = PERSONALITY_ARCHETYPES.Explorer;

  if (creativity >= 70 && analytical < 65) {
    archetype = PERSONALITY_ARCHETYPES.Creator;
  } else if (analytical >= 70 && creativity < 65) {
    if (riskTolerance < 55) {
      archetype = PERSONALITY_ARCHETYPES.Analyst;
    } else {
      archetype = PERSONALITY_ARCHETYPES.Builder;
    }
  } else if (collaboration >= 68 && riskTolerance >= 60) {
    archetype = PERSONALITY_ARCHETYPES.Leader;
  } else if (creativity >= 68 && analytical >= 68) {
    archetype = PERSONALITY_ARCHETYPES.Innovator;
  } else if (analytical >= 60 && riskTolerance >= 60) {
    archetype = PERSONALITY_ARCHETYPES.Builder;
  } else {
    archetype = PERSONALITY_ARCHETYPES.Explorer;
  }

  // DNA details
  const strengths: string[] = [...archetype.strengths];
  const interests: string[] = [];

  if (analytical >= 70) {
    strengths.push("Data-driven Synthesis");
  }
  if (creativity >= 70) {
    strengths.push("Conceptual Ideation");
  }
  if (collaboration >= 70) {
    strengths.push("Cross-functional Synergy");
  }

  if (profile.scienceCompleted && scienceInterest >= 4) {
    interests.push("Quantitative Physics", "Scientific Research");
  }
  if (profile.sweCompleted && sweInterest >= 4) {
    interests.push("Software Architectures", "Product UI Systems");
  }
  if (influence === "myself") {
    interests.push("Market Exploration");
  }

  const workStyle = collaboration >= 65 ? "Collaborative Team Alignment" : collaboration <= 48 ? "Deep Focus Independent Coding" : "Hybrid Team Integration";
  const learningStyle = scienceScore > sweScore ? "Concept-First Theoretical Inquiry" : "Practical Build-First Experimentation";

  const communicationScore = Math.round(collaboration);
  const creativityScore = Math.round(creativity);
  const analyticalScore = Math.round(analytical);
  const leadershipScore = Math.round((collaboration + riskTolerance) / 2);
  const confidenceScore = Math.round(((scienceConfidence + sweConfidence) / 10) * 100);

  const decisionPatterns: string[] = [];
  if (profile.sweCompleted) {
    if (choices.scene1 === "a") decisionPatterns.push("Prioritized collaborative consensus over developer isolation.");
    else if (choices.scene1 === "b") decisionPatterns.push("Independent task execution and strict code isolation.");
    else if (choices.scene1 === "c") decisionPatterns.push("Sought creative user feedback and layout validation first.");

    if (choices.scene2 === "a") decisionPatterns.push("High safety standards: prioritized QA rigour under critical bug reports.");
    else if (choices.scene2 === "b") decisionPatterns.push("Value-driven customer focus: prioritized immediate deployment of the revenue feature.");
    else if (choices.scene2 === "c") decisionPatterns.push("Balanced refactoring: cleaned architectural technical debt to maintain system health.");

    if (choices.scene3 === "a") decisionPatterns.push("Customer alignment: took responsibility for delivering high-quality UI details.");
    else if (choices.scene3 === "b") decisionPatterns.push("Agile product scaling: favored releasing a minimal viable prototype for fast feedback.");
    else if (choices.scene3 === "c") decisionPatterns.push("Technical excellence: postponed release to fix edge-case system exceptions.");
  } else {
    decisionPatterns.push("Exploring options: no interactive choices recorded yet.");
  }

  let strengthClusters: string[] = [];
  if (archetype.name === "Builder") strengthClusters = ["Systems Architecture", "Quality Engineering", "Procedural Execution"];
  else if (archetype.name === "Creator") strengthClusters = ["User Experience (UX) Design", "Brand Storytelling", "Visual Prototyping"];
  else if (archetype.name === "Analyst") strengthClusters = ["Data Cleansing", "Quantitative Logic", "Telemetry Diagnostics"];
  else if (archetype.name === "Leader") strengthClusters = ["Strategic Tradeoffs", "Stakeholder Diplomacy", "Product Sprints Management"];
  else if (archetype.name === "Innovator") strengthClusters = ["Emerging Tech Integration", "Out-of-box Prototyping", "Dynamic Systems Design"];
  else strengthClusters = ["Cross-functional Synthesis", "Curated User Journeys", "Adaptable Operations"];

  const growthHistory = [
    { label: "Week 1", analytical: 50, creativity: 50, leadership: 50 },
    { label: "Week 2", analytical: Math.round(50 + (analytical - 50) * 0.3), creativity: Math.round(50 + (creativity - 50) * 0.3), leadership: Math.round(50 + ((collaboration + riskTolerance)/2 - 50) * 0.3) },
    { label: "Week 3", analytical: Math.round(50 + (analytical - 50) * 0.6), creativity: Math.round(50 + (creativity - 50) * 0.6), leadership: Math.round(50 + ((collaboration + riskTolerance)/2 - 50) * 0.6) },
    { label: "Week 4", analytical: analyticalScore, creativity: creativityScore, leadership: leadershipScore }
  ];

  const careerDNA: CareerDNA = {
    creativity,
    analytical,
    collaboration,
    riskTolerance,
    strengths,
    interests,
    workStyle,
    learningStyle,
    communicationScore,
    creativityScore,
    leadershipScore,
    analyticalScore,
    confidenceScore,
    decisionPatterns,
    strengthClusters,
    growthHistory,
  };

  // Recommendations mapping
  const allCareers = CAREER_LIBRARY;
  const recommendations: CareerRecommendation[] = allCareers.map((career) => {
    let score = 55;
    const reasons: string[] = [];
    let explanation = "";

    const stream = career.stream;

    if (influence === "parents" || influence === "teachers") {
      if (stream === "Science") {
        score += 8;
        reasons.push("Aligns with family stream advice.");
      }
    }

    if (stream === "Science") {
      score += scienceScore * 7;
      if (scienceScore >= 4) {
        reasons.push(`High science lesson affinity (${scienceScore.toFixed(1)}/5).`);
      }
    } else if (stream === "Commerce") {
      const pmScore = (sweScore + 3) / 2;
      score += pmScore * 7;
    } else {
      const avgReflect = (scienceScore + sweScore) / 2;
      score += avgReflect * 6;
    }

    if (career.id === "software-engineer" || career.id === "data-scientist") {
      score += sweScore * 7;
      if (sweScore >= 4) {
        reasons.push("Matches high software execution ratings.");
      }
      if (collaboration < 50) {
        score += 6;
        reasons.push("Supports your independent builder style.");
      }
      explanation = `Matches your preference for structural logic and technical build cycles, aligning with your ${learningStyle} profile.`;
    } else if (career.id === "product-manager" || career.id === "entrepreneur") {
      if (collaboration >= 65) {
        score += 10;
        reasons.push("Matches your collaborative stakeholder style.");
      }
      explanation = `Taps into your high collaborative preference and ability to coordinate project priorities or commercial options.`;
    } else if (career.id === "psychologist" || career.id === "lawyer") {
      if (analytical >= 65) {
        score += 8;
        reasons.push("Suits your logical deduction strength.");
      }
      explanation = `Builds on your analytical thinking score and high focus on interpersonal diagnostics and argumentation rules.`;
    } else if (career.id === "fashion-designer" || career.id === "content-creator") {
      if (creativity >= 65) {
        score += 10;
        reasons.push("Aligned with your creative conceptual ideation strength.");
      }
      explanation = `Empowers your high creativity score and fits your interest in conceptual storytelling or design visual layouts.`;
    } else {
      explanation = `Offers a practical, action-oriented workspace that matches your hands-on execution and learning pacing.`;
    }

    const finalScore = Math.min(98, Math.max(45, Math.round(score)));
    const confidence = finalScore >= 82 ? "High" : finalScore >= 68 ? "Moderate" : "Exploring";

    if (reasons.length < 2) {
      reasons.push("Matches your primary learning style index.");
      reasons.push("Stable future index rating.");
    }

    return {
      careerId: career.id,
      careerTitle: career.title,
      stream: career.stream,
      matchScore: finalScore,
      confidence,
      matchReasons: reasons.slice(0, 3),
      explanation
    };
  });

  const sortedRecommendations = recommendations.sort((a, b) => b.matchScore - a.matchScore);

  // Generate pressure contrast analysis
  const pressureMap: Record<CareerPressure, string> = {
    parents: "parents",
    teachers: "teachers / school advisers",
    friends: "friends / peers",
    "social-media": "social media and online trends",
    myself: "yourself",
    "not-sure": "general uncertainty",
  };

  const pressureLevel = (influence === "parents" || influence === "teachers") ? "High" : (influence === "friends" || influence === "social-media") ? "Medium" : "Low";
  const pressureText = pressureMap[influence] || "general expectations";

  let analysisText = "";
  let adviceText = "";
  let negotiationTactic = "";

  if (influence === "myself") {
    analysisText = `You are highly self-driven! Your career interests are guided by your own curiosity. Your hands-on reactions show a clear spark for ${
      scienceScore > sweScore ? "scientific inquiry" : "software building"
    }, proving that your internal motivation matches your natural strengths.`;
    adviceText = `Continue listening to your inner guidance. You don't feel outside pressure, which gives you the freedom to choose what you truly love.`;
  } else if (influence === "parents" || influence === "teachers") {
    if (Math.max(scienceScore, sweScore) >= 4) {
      const topField = scienceScore > sweScore ? "Science" : "Software Engineering";
      analysisText = `You feel career direction pressure from your ${pressureText}. Your hands-on experience reveals a strong, genuine interest in ${topField} (rating it ${Math.max(scienceScore, sweScore).toFixed(1)}/5). This means their advice aligns with your actual experiences!`;
      adviceText = `Since there's a strong fit, you can comfortably pursue this direction while knowing you have their full support.`;
    } else {
      const topField = scienceScore > sweScore ? "Science" : "Software Engineering";
      analysisText = `You feel career pressure from your ${pressureText}, but your ratings during the simulations were moderate. This suggests that while they recommend these paths, the day-to-day work doesn't fully excite you yet.`;
      adviceText = `It might be worth exploring other streams (like Commerce or Arts) in our Career Library to find a stronger natural fit.`;
      negotiationTactic = `Hey! I took a hands-on career simulator for ${topField}. While I understand you see a great path for me here, I didn't feel a strong natural spark for the day-to-day tasks. Can we look at other options together?`;
    }
  } else if (influence === "friends" || influence === "social-media") {
    analysisText = `Your career thoughts are influenced by ${pressureText}. It's easy to get swept up in what's popular! Your actual scores suggest you have a ${
      scienceScore > sweScore ? "logical, physics-oriented" : "builder/coding"
    } inclination.`;
    adviceText = `Focus on what felt engaging during the simulations, not just what peers are discussing.`;
    negotiationTactic = `It's easy to want to do what my friends are doing, but I want to build a career based on my actual strengths, which seem to lean toward ${
      scienceScore > sweScore ? "science and research" : "software building"
    }.`;
  } else {
    analysisText = `Since you're not sure where your career influences come from, you have a blank slate! Your ratings indicate that you enjoyed ${
      scienceScore > sweScore ? "Science's structure" : "Software Engineering's choices"
    } the most.`;
    adviceText = `Use this as an authentic starting point for your research.`;
  }

  // Dynamic Journey Timeline
  const journeyTimeline: JourneyEvent[] = [];

  journeyTimeline.push({
    title: "Onboarding Initialized",
    description: `Registered student path. Indicated primary career influence: "${influence}". grade limit unlocked.`,
    badge: "Step 1"
  });

  if (profile.scienceStatus === "in_progress") {
    journeyTimeline.push({
      title: "Science Experience Started",
      description: "Began Kinematics lesson module on Physics motion.",
      badge: "Step 2"
    });
  } else if (profile.scienceStatus === "completed") {
    journeyTimeline.push({
      title: "Science Experience Completed",
      description: `Completed kinematics lessons, scored ${profile.scienceQuizScore ?? 0}/3 in SpaceX math. Enjoyment: ${scienceInterest}/5, Fit: ${scienceConfidence}/5.`,
      badge: "Step 2"
    });
  }

  if (profile.sweStatus === "in_progress") {
    journeyTimeline.push({
      title: "SWE Simulation Started",
      description: "Began software team workplace simulation.",
      badge: "Step 3"
    });
  } else if (profile.sweStatus === "completed") {
    journeyTimeline.push({
      title: "SWE Simulation Completed",
      description: `Completed simulation. Choice style: ${collaborativeChoices >= 2 ? "Collaborative Synchrony" : "Independent Builder"}. Enjoyment: ${sweInterest}/5, Fit: ${sweConfidence}/5.`,
      badge: "Step 3"
    });
  }

  if (profile.scienceCompleted && profile.sweCompleted) {
    journeyTimeline.push({
      title: "Career DNA Analyzed",
      description: `Mapped primary work style: "${workStyle}" and learning style: "${learningStyle}". Fit scoring fully compiled.`,
      badge: "Step 4"
    });
  }

  let recommendation = "";
  if (archetype.name === "Builder") {
    recommendation = "Pursue solid build structures, software backend architectures, or engineering. Leverage your high first-principles logic.";
  } else if (archetype.name === "Creator") {
    recommendation = "Focus on aesthetic design, video storytelling, or product interface curations where your creative vision thrives.";
  } else if (archetype.name === "Analyst") {
    recommendation = "Emphasize data statistics, scientific diagnostics, or market actuary analysis to leverage your quantitative rigor.";
  } else if (archetype.name === "Leader") {
    recommendation = "Explore product management, technology venture launches, or corporate marketing strategies where team alignment matters.";
  } else if (archetype.name === "Innovator") {
    recommendation = "Combine design thinking and engineering (like sustainable architecture or AI ethics) to challenge standard protocols.";
  } else {
    recommendation = "Maintain general curiosities. Explore various streams (Science, Commerce, Arts) to discover your organic fits.";
  }

  return {
    archetype,
    scienceScore,
    sweScore,
    sciencePercent,
    swePercent,
    pressureComparison: {
      source: influence === "parents" ? "Parents" : influence === "teachers" ? "Teachers" : influence === "friends" ? "Friends" : influence === "social-media" ? "Social Media" : influence === "myself" ? "Self" : "Not Sure",
      level: pressureLevel,
      analysisText,
      adviceText,
      ...(negotiationTactic ? { negotiationTactic } : {}),
    },
    checklist,
    recommendation,
    careerRecommendations: sortedRecommendations,
    careerDNA,
    journeyTimeline,
  };
}
