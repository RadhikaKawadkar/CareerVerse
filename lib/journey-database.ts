import { enrichJourney } from "./journey-enriched-db";

export type JourneyStage = "School" | "College" | "Internship" | "First Job" | "Senior Career";

export type JourneyOption = {
  id: "a" | "b" | "c";
  label: string;
  consequence: string;
  emotionalConsequence?: string; // V13
  professionalInsight?: string;  // V13
  branchSet?: string; // e.g. "Corporate"
  scores: {
    analytical: number;
    creativity: number;
    collaboration: number;
    risk: number;
  };
  milestone?: string;
};

export type JourneyScene = {
  id: string;
  stage: JourneyStage;
  character: string;
  avatar: string;
  text: string;
  options: JourneyOption[];
};

export type UnlockableEnding = {
  id: string;
  title: string;
  description: string;
  requiredBranch?: string;
  badge: string;
};

export type CareerJourney = {
  careerId: string;
  title: string;
  shortDesc: string;
  stages: JourneyStage[];
  scenes: JourneyScene[];
  endings: UnlockableEnding[];
  suggestedNext: string[];
};

const BASE_CAREER_JOURNEYS: Record<string, CareerJourney> = {
  "lawyer": {
    careerId: "lawyer",
    title: "Corporate & Litigation Lawyer",
    shortDesc: "Navigate high-stakes courtroom preparation, contract compliance audits, and public advocacy.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["entrepreneur", "journalist"],
    endings: [
      { id: "supreme-court", title: "Supreme Court Litigator", description: "You built deep argumentation precedents, championing public civil cases before the Supreme Court bench.", requiredBranch: "Civil", badge: "⚖️" },
      { id: "general-counsel", title: "General Counsel (Tech Giant)", description: "You mastered intellectual property, mergers, and corporate governance compliance globally.", requiredBranch: "Corporate", badge: "🏢" },
      { id: "criminal-defender", title: "Chief Criminal Defender", description: "You became a fierce defender of constitutional rights in landmark criminal cases.", requiredBranch: "Criminal", badge: "⚔️" },
      { id: "legal-consultant", title: "International Legal Consultant", description: "You advice sovereign agencies on foreign trade policy and dispute resolutions.", requiredBranch: "Consultant", badge: "🌍" }
    ],
    scenes: [
      {
        id: "law-1",
        stage: "School",
        character: "Debate Coach Mr. Kapoor",
        avatar: "🧔",
        text: "You are selecting your subject stream. You love legal debate, but your family recommends taking Science (PCM) to keep engineering routes open. What is your choice?",
        options: [
          {
            id: "a",
            label: "Choose Arts/Humanities to focus on History, Civics, and public writing.",
            consequence: "Your humanities roots give you a strong foundation in political theory, but you miss traditional science logic rules.",
            scores: { analytical: 5, creativity: 10, collaboration: 8, risk: 10 },
            milestone: "Selected Humanities Stream"
          },
          {
            id: "b",
            label: "Choose Science (PCM) to train logical thinking and satisfy your family.",
            consequence: "You master rigorous logical proofs and math, but have to read constitutional history files in your spare time.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Selected Science Stream"
          }
        ]
      },
      {
        id: "law-2",
        stage: "College",
        character: "Prof. Nair",
        avatar: "👩‍🏫",
        text: "You are at National Law School. You have to select your core specialization track for the final semesters. What is your primary focus?",
        options: [
          {
            id: "a",
            label: "Choose Corporate Law and Mergers & Acquisitions.",
            consequence: "You dive into commercial compliance, finance spreadsheets, and tax codes.",
            branchSet: "Corporate",
            scores: { analytical: 12, creativity: 4, collaboration: 10, risk: 6 },
            milestone: "Specialized in Corporate Law"
          },
          {
            id: "b",
            label: "Choose Criminal & Civil Advocacy.",
            consequence: "You focus on judicial precedents, public evidence, and constitutional rights litigation.",
            branchSet: "Civil",
            scores: { analytical: 8, creativity: 12, collaboration: 6, risk: 12 },
            milestone: "Specialized in Trial Advocacy"
          }
        ]
      },
      {
        id: "law-3",
        stage: "Internship",
        character: "Senior Advocate Meera",
        avatar: "👩‍⚖️",
        text: "During your internship at a top chambers, you discover a minor undisclosed environmental liability in a client's 500-page acquisition file late at night. What do you do?",
        options: [
          {
            id: "a",
            label: "Stay overnight to draft an exhaustive risk memorandum highlighting the hazard.",
            consequence: "Meera is highly impressed by your clinical compliance audit. The client negotiates a ₹10 Crore discount.",
            scores: { analytical: 15, creativity: 5, collaboration: 8, risk: 5 },
            milestone: "Drafted Landmark Risk Memorandum"
          },
          {
            id: "b",
            label: "Inform the client's public relations team directly to prepare a press release.",
            consequence: "The deal hits a compliance bottleneck, but you prevent a future public relations crisis.",
            scores: { analytical: 5, creativity: 10, collaboration: 12, risk: 15 },
            milestone: "Prevented Public Relations Crisis"
          }
        ]
      },
      {
        id: "law-4",
        stage: "First Job",
        character: "Partner Malhotra",
        avatar: "👨‍💼",
        text: "You are a junior associate. A major tech client offers a ₹50 Lakh out-of-court settlement for a user privacy breach. Opposing counsel pushes to settle, but you suspect a trial could set a public precedent. Your move?",
        options: [
          {
            id: "a",
            label: "Advise client to accept the settlement to minimize cash risk.",
            consequence: "The client gets immediate cash flow, but the corporate data privacy system continues unregulated.",
            branchSet: "Corporate",
            scores: { analytical: 10, creativity: 5, collaboration: 15, risk: 5 },
            milestone: "Settled Landmark Tech Case"
          },
          {
            id: "b",
            label: "Push the client to reject the offer and proceed to public trial.",
            consequence: "It is a high-risk trial. The press covers every hearing. You win the case, establishing a national privacy precedent!",
            branchSet: "Criminal", // or Civil depending on starting choices
            scores: { analytical: 8, creativity: 15, collaboration: 5, risk: 18 },
            milestone: "Won Public Privacy Trial"
          }
        ]
      },
      {
        id: "law-5",
        stage: "Senior Career",
        character: "Registrar General",
        avatar: "🏛️",
        text: "You are now a seasoned legal authority. A major public interest litigation (PIL) challenges government digital surveillance. You are invited to argue the lead brief. How do you approach the bench?",
        options: [
          {
            id: "a",
            label: "Argue from a strict statutory interpretation angle, citing exact legal text rules.",
            consequence: "The court issues a structured, conservative ruling restricting surveillance parameters.",
            branchSet: "Consultant",
            scores: { analytical: 18, creativity: 5, collaboration: 8, risk: 5 },
            milestone: "Clipped Surveillance Overreach"
          },
          {
            id: "b",
            label: "Deliver a passionate defense based on fundamental human rights and privacy.",
            consequence: "The bench issues a historic judgment establishing privacy as an absolute constitutional right!",
            branchSet: "Civil",
            scores: { analytical: 5, creativity: 18, collaboration: 10, risk: 15 },
            milestone: "Established Privacy Precedent"
          }
        ]
      }
    ]
  },
  "software-engineer": {
    careerId: "software-engineer",
    title: "Software Engineer",
    shortDesc: "Experience the life of a coder, from debugging basic syntax to architecting global AI systems.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["data-scientist", "entrepreneur"],
    endings: [
      { id: "ai-researcher", title: "Principal AI Researcher", description: "You pioneered deep reinforcement models, driving breakthroughs in conversational agents.", requiredBranch: "AI Engineer", badge: "🤖" },
      { id: "vp-product", title: "VP of Product", description: "You bridged engineering logic with strategic business exits, launching massive consumer SaaS platforms.", requiredBranch: "Product Manager", badge: "📈" },
      { id: "tech-lead", title: "Full-Stack Tech Lead", description: "You managed critical cloud microservices and database clustering with zero downtime.", requiredBranch: "Backend", badge: "💻" },
      { id: "frontend-creator", title: "UX Engineering Architect", description: "You designed open-source CSS rendering frameworks, setting worldwide web design standards.", requiredBranch: "Frontend", badge: "🎨" }
    ],
    scenes: [
      {
        id: "swe-1",
        stage: "School",
        character: "Computer Teacher Mrs. Roy",
        avatar: "👩‍💻",
        text: "You are in Grade 11. You enjoy coding logic, but you are concerned about the high academic pressure of Science (PCM) for JEE prep. Your stream choice?",
        options: [
          {
            id: "a",
            label: "Enroll in Science (PCM) with Computer Science.",
            consequence: "You build rigorous analytical coding foundations, though exam pressure limits your free time.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Entered Science Stream"
          },
          {
            id: "b",
            label: "Choose Commerce with Applied Math and self-teach coding.",
            consequence: "You balance business finance knowledge with online coding courses. Lower pressure, higher autonomy.",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 10 },
            milestone: "Selected Commerce Stream"
          }
        ]
      },
      {
        id: "swe-2",
        stage: "College",
        character: "Hackathon Organizer Raj",
        avatar: "🧔",
        text: "It is college hackathon night. Your team is split: build a complex machine learning model or code a highly interactive, responsive web interface. What is your lead role?",
        options: [
          {
            id: "a",
            label: "Focus on training a predictive neural network model (Backend/AI).",
            consequence: "Your engine yields high accuracy scoring, but the presentation demo lacks design polish.",
            branchSet: "Backend",
            scores: { analytical: 14, creativity: 6, collaboration: 5, risk: 10 },
            milestone: "Built ML Backend Engine"
          },
          {
            id: "b",
            label: "Design a stunning interactive web dashboard layout (Frontend/UI).",
            consequence: "Your dashboard looks incredibly premium. The judges love the smooth framer-motion micro-animations!",
            branchSet: "Frontend",
            scores: { analytical: 6, creativity: 15, collaboration: 12, risk: 5 },
            milestone: "Coded Premium React Dashboard"
          }
        ]
      },
      {
        id: "swe-3",
        stage: "Internship",
        character: "Tech Lead Vikram",
        avatar: "👨‍💻",
        text: "You are an SDE intern. A critical bug causes database connections to bottleneck. Vikram asks for a solution: write a quick cache patch or rebuild the indexing layers. Your choice?",
        options: [
          {
            id: "a",
            label: "Deploy a quick Redis cache patch to resolve immediate connection logs.",
            consequence: "The servers recover immediately, but you introduce potential data syncing bugs later.",
            scores: { analytical: 8, creativity: 10, collaboration: 10, risk: 12 },
            milestone: "Deployed Quick Cache Patch"
          },
          {
            id: "b",
            label: "Refactor database indexing rules to fix root read/write latency.",
            consequence: "The build takes longer, but ensures structural reliability and zero connection leaks.",
            scores: { analytical: 18, creativity: 4, collaboration: 8, risk: 4 },
            milestone: "Refactored Indexing Architectures"
          }
        ]
      },
      {
        id: "swe-4",
        stage: "First Job",
        character: "Product Manager Priya",
        avatar: "👩‍💼",
        text: "As an SDE-1, you are invited to specialize. You can join the core Infrastructure team, or transition to the AI Agent prototyping squad. Which road do you take?",
        options: [
          {
            id: "a",
            label: "Join the AI Agent prototyping squad.",
            consequence: "You work directly on training guide agents using Large Language Models.",
            branchSet: "AI Engineer",
            scores: { analytical: 12, creativity: 15, collaboration: 8, risk: 10 },
            milestone: "Joined AI Agent Squad"
          },
          {
            id: "b",
            label: "Join the Core Infrastructure team to manage database clusters.",
            consequence: "You master Kubernetes deployments, pipeline orchestration, and server latency controls.",
            branchSet: "Backend",
            scores: { analytical: 16, creativity: 5, collaboration: 10, risk: 5 },
            milestone: "Joined Infrastructure Team"
          }
        ]
      },
      {
        id: "swe-5",
        stage: "Senior Career",
        character: "CTO Maya",
        avatar: "👩‍💼",
        text: "You are now a Senior Staff Engineer. A massive data leak is detected. You must coordinate the containment. Do you push for system-wide service shut down or apply live patching?",
        options: [
          {
            id: "a",
            label: "Order a full system shutdown to secure user data completely.",
            consequence: "Operations stop and revenue drops, but you secure 100% of user data assets.",
            branchSet: "Product Manager",
            scores: { analytical: 12, creativity: 5, collaboration: 18, risk: 5 },
            milestone: "Protected Customer Security Assets"
          },
          {
            id: "b",
            label: "Attempt live server hot patches while maintaining active operations.",
            consequence: "You deploy hot patches under extreme pressure. The patch succeeds, saving company uptime!",
            branchSet: "AI Engineer", // or Backend depending on prior choices
            scores: { analytical: 15, creativity: 10, collaboration: 5, risk: 20 },
            milestone: "Executed Hot Patch Containment"
          }
        ]
      }
    ]
  },
  "doctor": {
    careerId: "doctor",
    title: "Medical Practitioner & Surgeon",
    shortDesc: "Experience the adrenaline of clinical diagnostics, emergency ward triage, and patient care.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["psychologist", "lawyer"],
    endings: [
      { id: "chief-surgeon", title: "Chief of Cardiothoracic Surgery", description: "You mastered high-risk cardiothoracic surgery, saving thousands of patient lives.", requiredBranch: "Cardiology", badge: "🫀" },
      { id: "er-director", title: "ER Trauma Ward Director", description: "You led high-stress emergency containment triages during regional epidemics.", requiredBranch: "Emergency Medicine", badge: "🩺" },
      { id: "global-health", title: "WHO Global Health Director", description: "You shaped global immunization policies and clinical health campaigns.", requiredBranch: "Hospital Administrator", badge: "🌍" },
      { id: "pediatrics-founder", title: "Pediatric Clinic Founder", description: "You built community healthcare clinics focused on childhood diagnostic welfare.", requiredBranch: "Pediatrics", badge: "👶" }
    ],
    scenes: [
      {
        id: "doc-1",
        stage: "School",
        character: "Biology Mentor Dr. Rao",
        avatar: "👨‍⚕️",
        text: "You are in Grade 10. To follow medicine, you must take Biology (PCB). However, preparing for the NEET entrance exam requires sacrificing extracurricular debate events. What do you do?",
        options: [
          {
            id: "a",
            label: "Focus exclusively on NEET mock preparation tests.",
            consequence: "Your diagnostic biology scores excel, though you feel isolated from team debate events.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Excelled in Biology Prep"
          },
          {
            id: "b",
            label: "Maintain debate club presence while self-studying biology journals.",
            consequence: "You develop top communications and bedside manner traits, but your study pacing is tighter.",
            scores: { analytical: 8, creativity: 10, collaboration: 12, risk: 10 },
            milestone: "Balanced Debate & Biology"
          }
        ]
      },
      {
        id: "doc-2",
        stage: "College",
        character: "Prof. Sen",
        avatar: "👩‍⚕️",
        text: "You are in MBBS final year. During clinical rounds, you notice a senior resident writing an incorrect dosage for a cardiovascular patient. What do you do?",
        options: [
          {
            id: "a",
            label: "Speak to the resident privately and suggest correcting the chart.",
            consequence: "The resident accepts the input, correcting the dosage with zero academic friction.",
            branchSet: "Pediatrics",
            scores: { analytical: 10, creativity: 5, collaboration: 15, risk: 5 },
            milestone: "Corrected Clinical Dose Chart"
          },
          {
            id: "b",
            label: "Report the incident immediately to the ward superintendent.",
            consequence: "Ensures complete clinical safety, but creates temporary friction with the senior staff.",
            branchSet: "Cardiology",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 15 },
            milestone: "Reported Medical Non-Compliance"
          }
        ]
      },
      {
        id: "doc-3",
        stage: "Internship",
        character: "ER Trauma Chief Dr. Kabir",
        avatar: "🩺",
        text: "An emergency trauma patient arrives with multiple fractures and respiratory failure. Resources are scarce, and you must decide whether to intubate immediately or request an urgent CT scan. Your choice?",
        options: [
          {
            id: "a",
            label: "Perform emergency blind intubation on the spot.",
            consequence: "You restore air passage immediately, saving the patient's vitals under heavy stress.",
            scores: { analytical: 5, creativity: 12, collaboration: 8, risk: 18 },
            milestone: "Performed Emergency Intubation"
          },
          {
            id: "b",
            label: "Stabilize patient and wait for the CT scan diagnostics.",
            consequence: "Ensures precise surgical data, but the patient's vitals dip temporarily.",
            scores: { analytical: 18, creativity: 5, collaboration: 8, risk: 5 },
            milestone: "Requested CT Diagnostics"
          }
        ]
      },
      {
        id: "doc-4",
        stage: "First Job",
        character: "Dean Roy",
        avatar: "🧔",
        text: "You are a resident medical officer. You can specialize in high-stakes Cardiothoracic Surgery, or join the Emergency Ward Triage team. What is your choice?",
        options: [
          {
            id: "a",
            label: "Enter Cardiothoracic Surgery specialization.",
            consequence: "You train under top heart surgeons, performing long microsurgical runs.",
            branchSet: "Cardiology",
            scores: { analytical: 16, creativity: 6, collaboration: 8, risk: 10 },
            milestone: "Specialized in Cardiology"
          },
          {
            id: "b",
            label: "Join the Emergency Ward Triage team.",
            consequence: "You face immediate trauma events, stabilizing accident cases daily.",
            branchSet: "Emergency Medicine",
            scores: { analytical: 10, creativity: 12, collaboration: 12, risk: 16 },
            milestone: "Joined Emergency Triage Squad"
          }
        ]
      },
      {
        id: "doc-5",
        stage: "Senior Career",
        character: "Health Minister",
        avatar: "🧔",
        text: "You are now Chief Medical Officer. A rare viral strain is detected in the district. You must decide whether to quarantine the municipal wards immediately or launch a targeted vaccination drive.",
        options: [
          {
            id: "a",
            label: "Recommend immediate ward-level quarantines.",
            consequence: "Containment succeeds immediately, limiting the spread to zero, though public panic rises.",
            branchSet: "Hospital Administrator",
            scores: { analytical: 15, creativity: 5, collaboration: 15, risk: 10 },
            milestone: "Enforced Epidemic Quarantine"
          },
          {
            id: "b",
            label: "Launch a rapid, targeted vaccination campaign.",
            consequence: "Maintains economic operations while slowly building herd immunity.",
            branchSet: "Emergency Medicine", // or Cardiology depending on prior choices
            scores: { analytical: 12, creativity: 15, collaboration: 10, risk: 18 },
            milestone: "Deployed Rapid Vaccination Campaign"
          }
        ]
      }
    ]
  },
  "fashion-designer": {
    careerId: "fashion-designer",
    title: "Fashion & Textile Designer",
    shortDesc: "Experience design studios, material budget M&As, runway stress, and D2C brand launches.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["architect", "entrepreneur"],
    endings: [
      { id: "runway-director", title: "Runway Luxury Director", description: "You directed Paris and Milan collections, defining high-end sustainable haute couture.", requiredBranch: "Luxury Fashion", badge: "👑" },
      { id: "costume-designer", title: "Oscar-Winning Costume Designer", description: "You designed historical and sci-fi costumes for major cinematic houses.", requiredBranch: "Costume Design", badge: "🎬" },
      { id: "d2c-founder", title: "D2C Sustainable Brand Founder", description: "You founded a global brand, recycling ocean plastics into street fashion.", requiredBranch: "Fashion Brand Founder", badge: "🌿" }
    ],
    scenes: [
      {
        id: "fas-1",
        stage: "School",
        character: "Art Teacher Ms. Sen",
        avatar: "👩‍🎨",
        text: "You want to prepare for the NIFT entrance exam. Your parents recommend taking Commerce to learn business management. What stream do you choose?",
        options: [
          {
            id: "a",
            label: "Choose Arts/Design and focus on sketch portfolios.",
            consequence: "You master illustration and color theory, though you must learn cash flow ledgers later.",
            scores: { analytical: 5, creativity: 15, collaboration: 8, risk: 8 },
            milestone: "Selected Design Stream"
          },
          {
            id: "b",
            label: "Choose Commerce to learn business fundamentals.",
            consequence: "You learn financial spreadsheets while attending night sketching classes.",
            scores: { analytical: 14, creativity: 8, collaboration: 10, risk: 6 },
            milestone: "Selected Commerce Stream"
          }
        ]
      },
      {
        id: "fas-2",
        stage: "College",
        character: "Prof. Priya",
        avatar: "👩‍🎨",
        text: "At NIFT, your graduation showstopper sketches exceed budget by 40% due to using organic mulberry silk. Your adjust?",
        options: [
          {
            id: "a",
            label: "Substitute the silk with a premium recycled polyester blend.",
            consequence: "Costs drop by half. The fabric drapes well, though it lacks the original silk sheen.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 12, creativity: 6, collaboration: 10, risk: 8 },
            milestone: "Optimized Material Budgets"
          },
          {
            id: "b",
            label: "Simplify design silhouettes to keep the pure mulberry silk yardage.",
            consequence: "You preserve the organic texture, though the simplified lines lose some dramatic flare.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 8, creativity: 15, collaboration: 5, risk: 10 },
            milestone: "Preserved Material Integrity"
          }
        ]
      },
      {
        id: "fas-3",
        stage: "Internship",
        character: "Creative Lead Vikram",
        avatar: "👨‍🎨",
        text: "During Lakme Fashion Week, your custom dye house suffers a power outage, delaying printing by 3 critical days. How do you resolve this?",
        options: [
          {
            id: "a",
            label: "Route printing to a backup facility in Delhi for double the price.",
            consequence: "Schedule is saved, but the emergency spending exhausts your marketing budget.",
            scores: { analytical: 8, creativity: 10, collaboration: 10, risk: 15 },
            milestone: "Routed Backup Fabric Print"
          },
          {
            id: "b",
            label: "Delay the launch preview and release a social media teaser instead.",
            consequence: "The teaser campaign builds online curiosity, though wholesale buyers are frustrated.",
            scores: { analytical: 5, creativity: 16, collaboration: 12, risk: 8 },
            milestone: "Launched Viral Teaser Campaign"
          }
        ]
      },
      {
        id: "fas-4",
        stage: "First Job",
        character: "Brand Manager Rohit",
        avatar: "🧔",
        text: "You are a junior designer. You can specialize in high-end Luxury Haute Couture, or join a major cinematic studio for Costume Design. Your choice?",
        options: [
          {
            id: "a",
            label: "Enter Luxury Haute Couture.",
            consequence: "You sketch custom bridal collections and work with fine traditional embroideries.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 6, creativity: 18, collaboration: 8, risk: 10 },
            milestone: "Joined Haute Couture Team"
          },
          {
            id: "b",
            label: "Join cinematic Costume Design.",
            consequence: "You research historical textiles, constructing elaborate armor and period dresses.",
            branchSet: "Costume Design",
            scores: { analytical: 12, creativity: 14, collaboration: 12, risk: 8 },
            milestone: "Joined Cinematic Design Team"
          }
        ]
      },
      {
        id: "fas-5",
        stage: "Senior Career",
        character: "Venture Capitalist",
        avatar: "👩‍💼",
        text: "You are now an acclaimed designer. A venture capitalist offers ₹1 Crore funding for 35% equity to take your sustainable label global. Do you accept or bootstrap?",
        options: [
          {
            id: "a",
            label: "Accept the venture capital funding to accelerate global supply chains.",
            consequence: "You scale factories globally, but lose creative control over capsule collections.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 15, creativity: 8, collaboration: 15, risk: 15 },
            milestone: "Secured Series A Brand Funding"
          },
          {
            id: "b",
            label: "Reject funding to bootstrap slowly through organic D2C sales.",
            consequence: "You keep 100% control, focusing on hyper-sustainable, zero-waste collections.",
            branchSet: "Luxury Fashion", // or Costume Design depending on start
            scores: { analytical: 8, creativity: 18, collaboration: 10, risk: 18 },
            milestone: "Bootstrapped Sustainable Label"
          }
        ]
      }
    ]
  },
  "chef": {
    careerId: "chef",
    title: "Culinary Artist & Chef",
    shortDesc: "Manage kitchen rushes, balance fine dining plating, and run restaurant expansions.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["entrepreneur", "fashion-designer"],
    endings: [
      { id: "michelin-chef", title: "3-Star Michelin Executive Chef", description: "You curated seasonal tasting menus, winning international Michelin recognition.", requiredBranch: "Fine Dining Cuisine", badge: "⭐" },
      { id: "patisserie-owner", title: "Global Patisserie Mogul", description: "You engineered signature confectionery lines, expanding globally.", requiredBranch: "Pastry Arts", badge: "🍰" },
      { id: "culinary-director", title: "Franchise Culinary Director", description: "You standardizing recipes across a network of 50+ luxury outlets.", requiredBranch: "Restaurant Entrepreneur", badge: "🧑‍🍳" }
    ],
    scenes: [
      {
        id: "chef-1",
        stage: "School",
        character: "Home Science Teacher Mrs. Dsouza",
        avatar: "👩‍🍳",
        text: "You love baking and culinary experiments, but your high school doesn't offer a direct culinary track. Do you take Science to learn chemistry or Commerce for management?",
        options: [
          {
            id: "a",
            label: "Choose Science to study chemical food transformations.",
            consequence: "You master food sciences and temperature laws, though you miss early business economics.",
            scores: { analytical: 14, creativity: 8, collaboration: 5, risk: 5 },
            milestone: "Learned Food Chemistry"
          },
          {
            id: "b",
            label: "Choose Commerce to understand operational finance.",
            consequence: "You master cash ledgers and cost controls while practicing cooking in your free time.",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 8 },
            milestone: "Studied Restaurant Economics"
          }
        ]
      },
      {
        id: "chef-2",
        stage: "College",
        character: "Chef Instructor Rohan",
        avatar: "👨‍🍳",
        text: "At IHM culinary school, you have to select your core focus: French Pastry Arts or Classical Cuisine. Which path do you enter?",
        options: [
          {
            id: "a",
            label: "Choose Classical Cuisine and Hot Kitchen operations.",
            consequence: "You learn butchery, hot stocks, and plating under heat and tight deadlines.",
            branchSet: "Fine Dining Cuisine",
            scores: { analytical: 10, creativity: 12, collaboration: 10, risk: 10 },
            milestone: "Mastered Hot Kitchen Ops"
          },
          {
            id: "b",
            label: "Choose French Pastry Arts and Confectionery.",
            consequence: "You master baking ratios, chocolate tempering, and structural cake designs.",
            branchSet: "Pastry Arts",
            scores: { analytical: 15, creativity: 15, collaboration: 5, risk: 5 },
            milestone: "Mastered Pastry Arts"
          }
        ]
      },
      {
        id: "chef-3",
        stage: "Internship",
        character: "Executive Chef Alok",
        avatar: "👨‍🍳",
        text: "During a busy weekend rush, a renowned food critic orders your signature soufflé, but the kitchen is short-staffed and soufflé takes 20 minutes. What do you do?",
        options: [
          {
            id: "a",
            label: "Prepare the soufflé from scratch, explaining the wait to the table.",
            consequence: "The critic appreciates the transparency and writes a rave review praising the quality.",
            scores: { analytical: 8, creativity: 15, collaboration: 12, risk: 10 },
            milestone: "Won Over Food Critic"
          },
          {
            id: "b",
            label: "Recommend the pre-prepared chocolate lava cake to speed up the table.",
            consequence: "Table turnaround is fast, but the critic writes a neutral review on the standard menu.",
            scores: { analytical: 14, creativity: 5, collaboration: 10, risk: 6 },
            milestone: "Sped Up Service Turnaround"
          }
        ]
      },
      {
        id: "chef-4",
        stage: "First Job",
        character: "Owner Kapoor",
        avatar: "🧔",
        text: "You are a commis chef. You can specialize in high-end Fine Dining Cuisine, or take a position as Pastry Chef at a luxury hotel. Your choice?",
        options: [
          {
            id: "a",
            label: "Join the Fine Dining Cuisine team.",
            consequence: "You create seasonal tasting plates and work with premium seafood and meats.",
            branchSet: "Fine Dining Cuisine",
            scores: { analytical: 8, creativity: 16, collaboration: 10, risk: 12 },
            milestone: "Joined Fine Dining Brigade"
          },
          {
            id: "b",
            label: "Accept the Pastry Chef position at the hotel.",
            consequence: "You manage the dessert section, designing wedding cakes and high-tea platters.",
            branchSet: "Pastry Arts",
            scores: { analytical: 14, creativity: 14, collaboration: 8, risk: 5 },
            milestone: "Led Hotel Dessert Section"
          }
        ]
      },
      {
        id: "chef-5",
        stage: "Senior Career",
        character: "Business Partner",
        avatar: "👩‍💼",
        text: "You are now Head Chef. Your restaurant is successful. Do you invest in expanding to a second franchise outlet or keep a single boutique menu targeting a Michelin star?",
        options: [
          {
            id: "a",
            label: "Expand to a second outlet, standardizing operational recipes.",
            consequence: "Revenue doubles. You transition into an executive business director role.",
            branchSet: "Restaurant Entrepreneur",
            scores: { analytical: 15, creativity: 5, collaboration: 15, risk: 15 },
            milestone: "Expanded Restaurant Franchise"
          },
          {
            id: "b",
            label: "Focus on the single outlet, curating ultra-premium tasting menus.",
            consequence: "Your culinary art excels. International inspectors visit, awarding a Michelin Star!",
            branchSet: "Fine Dining Cuisine", // or Pastry Arts depending on prior
            scores: { analytical: 8, creativity: 18, collaboration: 10, risk: 18 },
            milestone: "Awarded Michelin Star"
          }
        ]
      }
    ]
  },
  "psychologist": {
    careerId: "psychologist",
    title: "Counseling & Clinical Psychologist",
    shortDesc: "Understand human behavior, conduct cognitive therapy, and guide mental health programs.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["doctor", "teacher"],
    endings: [
      { id: "private-practice", title: "Private Clinic Director", description: "You founded a premier clinical counseling practice, mentoring junior therapists.", requiredBranch: "Clinical Therapy", badge: "🧠" },
      { id: "cpo", title: "Chief People Officer", description: "You applied organizational behavioral sciences, directing culture at global startups.", requiredBranch: "Organizational Psychology", badge: "💼" },
      { id: "neuro-pioneer", title: "Cognitive Research Pioneer", description: "You led research studies on neuroplasticity and cognitive memory networks.", requiredBranch: "Neuropsychology", badge: "🧬" }
    ],
    scenes: [
      {
        id: "psy-1",
        stage: "School",
        character: "School Counselor Mrs. Nair",
        avatar: "👩‍⚕️",
        text: "You want to study psychology. Your parents recommend taking Science (PCB) to apply for medical school, but you prefer Arts to study Sociology. Your stream selection?",
        options: [
          {
            id: "a",
            label: "Choose Arts with Psychology/Sociology.",
            consequence: "You build deep foundations in social behaviors and qualitative interviews.",
            scores: { analytical: 6, creativity: 12, collaboration: 14, risk: 5 },
            milestone: "Selected Humanities Track"
          },
          {
            id: "b",
            label: "Choose Science (PCB) to study brain biology and biochemistry.",
            consequence: "You master neurology and lab methods, though you read social psychology in your spare time.",
            scores: { analytical: 15, creativity: 6, collaboration: 8, risk: 5 },
            milestone: "Selected Biology Track"
          }
        ]
      },
      {
        id: "psy-2",
        stage: "College",
        character: "Dr. Alok",
        avatar: "🧠",
        text: "In your Master's thesis, you must decide between a qualitative study on student coping mechanisms or a quantitative brain-mapping research using EEG datasets. Your choice?",
        options: [
          {
            id: "a",
            label: "Choose qualitative coping interviews.",
            consequence: "You conduct 30 detailed patient case reviews, developing deep clinical empathy.",
            branchSet: "Clinical Therapy",
            scores: { analytical: 8, creativity: 14, collaboration: 15, risk: 5 },
            milestone: "Conducted Coping Interviews"
          },
          {
            id: "b",
            label: "Choose quantitative EEG brain-mapping research.",
            consequence: "You analyze complex datasets, coding statistical charts on memory circuits.",
            branchSet: "Neuropsychology",
            scores: { analytical: 16, creativity: 8, collaboration: 6, risk: 8 },
            milestone: "Mapped Cognitive Circuits"
          }
        ]
      },
      {
        id: "psy-3",
        stage: "Internship",
        character: "Supervisor Dr. Sen",
        avatar: "👩‍⚕️",
        text: "As a counseling intern, a client shows symptoms of severe anxiety due to workplace stress, but refuses to take diagnostic tests. How do you approach this?",
        options: [
          {
            id: "a",
            label: "Use cognitive behavioral therapy (CBT) conversational exercises first.",
            consequence: "The client relaxes, slowly detailing their triggers over three sessions.",
            scores: { analytical: 8, creativity: 12, collaboration: 16, risk: 5 },
            milestone: "Applied Conversational CBT"
          },
          {
            id: "b",
            label: "Insist on structured psychometric testing to form a diagnosis.",
            consequence: "Ensures precise clinical classification, though the client is initially hesitant.",
            scores: { analytical: 16, creativity: 5, collaboration: 8, risk: 10 },
            milestone: "Conducted Psychometric Tests"
          }
        ]
      },
      {
        id: "psy-4",
        stage: "First Job",
        character: "Director Roy",
        avatar: "🧔",
        text: "You can take a job as a Clinical Therapist at an outpatient hospital, or join a tech firm as an Organizational Behavioral Scientist. Which path?",
        options: [
          {
            id: "a",
            label: "Join the hospital as a Clinical Therapist.",
            consequence: "You work directly with patients suffering from clinical trauma and depression.",
            branchSet: "Clinical Therapy",
            scores: { analytical: 10, creativity: 12, collaboration: 15, risk: 6 },
            milestone: "Joined Hospital Therapy Team"
          },
          {
            id: "b",
            label: "Join the tech firm as an Organizational Behavioral Scientist.",
            consequence: "You design workplace happiness surveys and optimize team engineering performance.",
            branchSet: "Organizational Psychology",
            scores: { analytical: 14, creativity: 10, collaboration: 12, risk: 10 },
            milestone: "Joined Tech HR Squad"
          }
        ]
      },
      {
        id: "psy-5",
        stage: "Senior Career",
        character: "State Board Chief",
        avatar: "🧔",
        text: "You are now a senior psychologist. The state board invites you to lead a major public mental health helpline or publish a neurological research paper. Your choice?",
        options: [
          {
            id: "a",
            label: "Direct the public mental health helpline system.",
            consequence: "You scale emergency mental health counseling to thousands of rural students.",
            branchSet: "Clinical Therapy",
            scores: { analytical: 10, creativity: 12, collaboration: 18, risk: 10 },
            milestone: "Directed State Helpline Network"
          },
          {
            id: "b",
            label: "Publish the neurological study on neural networks.",
            consequence: "Your research wins international acclaim, prompting updates to cognitive therapy guidelines.",
            branchSet: "Neuropsychology",
            scores: { analytical: 18, creativity: 12, collaboration: 6, risk: 12 },
            milestone: "Published Neural Network Study"
          }
        ]
      }
    ]
  },
  "architect": {
    careerId: "architect",
    title: "Structural & Urban Architect",
    shortDesc: "Design sustainable high-rises, balance client blueprint specs, and direct smart city projects.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["fashion-designer", "entrepreneur"],
    endings: [
      { id: "pritzker", title: "Pritzker-Prize Architect", description: "You designed carbon-neutral cultural landmarks, winning the highest honor in architecture.", requiredBranch: "Sustainable Design", badge: "🏛️" },
      { id: "smart-city", title: "Smart City Chief Planner", description: "You engineered urban transit grids and green zones for regional megacities.", requiredBranch: "Urban Planning", badge: "🌆" },
      { id: "luxury-estates", title: "Luxury Residential Designer", description: "You curated custom cliffside mansions for global clients, redefining luxury aesthetics.", requiredBranch: "Luxury Residential", badge: "🏡" }
    ],
    scenes: [
      {
        id: "arc-1",
        stage: "School",
        character: "Art Coordinator Mr. Shah",
        avatar: "🧔",
        text: "To clear the NATA architecture entrance exam, you need Physics, Chemistry, and Math. However, you want to study Fine Arts. What is your high school subject choice?",
        options: [
          {
            id: "a",
            label: "Choose Science (PCM) to guarantee NATA eligibility.",
            consequence: "You master spatial math proofs and mechanical drawing, but practice artistic drafting at home.",
            scores: { analytical: 15, creativity: 6, collaboration: 5, risk: 5 },
            milestone: "Cleared Science Track"
          },
          {
            id: "b",
            label: "Choose Humanities with Math and take drawing classes.",
            consequence: "You build deep artistic aesthetics, but must study physics formulas independently.",
            scores: { analytical: 8, creativity: 14, collaboration: 10, risk: 8 },
            milestone: "Cleared Design Track"
          }
        ]
      },
      {
        id: "arc-2",
        stage: "College",
        character: "Prof. Vikram",
        avatar: "🏛️",
        text: "For your B.Arch graduation project, you can design a sustainable carbon-neutral cultural center or a highly commercial multi-tier shopping mall blueprint. Your design focus?",
        options: [
          {
            id: "a",
            label: "Design the carbon-neutral cultural center (Sustainable).",
            consequence: "You master natural airflow thermodynamics and solar panel arrays, though construction costs are high.",
            branchSet: "Sustainable Design",
            scores: { analytical: 10, creativity: 16, collaboration: 8, risk: 10 },
            milestone: "Designed Carbon-Neutral Hub"
          },
          {
            id: "b",
            label: "Design the commercial shopping mall blueprint.",
            consequence: "You master retail tenant layout flows, escalator columns, and strict fire safety compliance rules.",
            branchSet: "Luxury Residential",
            scores: { analytical: 14, creativity: 8, collaboration: 12, risk: 6 },
            milestone: "Designed Commercial Complex"
          }
        ]
      },
      {
        id: "arc-3",
        stage: "Internship",
        character: "Senior Partner Shalini",
        avatar: "👩‍💼",
        text: "During your internship, municipal auditors reject your team's skyscraper facade due to strict regional wind velocity limits. How do you adjust the blueprint?",
        options: [
          {
            id: "a",
            label: "Add aerodynamic wind-breaking slots throughout the facade panels.",
            consequence: "Auditors approve the revise. The skyscraper looks highly modern, though construction cost rises by 15%.",
            scores: { analytical: 15, creativity: 10, collaboration: 8, risk: 10 },
            milestone: "Redesigned Aerodynamic Facade"
          },
          {
            id: "b",
            label: "Simplify the building height and reduce facade panels.",
            consequence: "Ensures immediate compliance and reduces cost, but limits the landmark height.",
            scores: { analytical: 10, creativity: 5, collaboration: 15, risk: 5 },
            milestone: "Reduced Building Height Profile"
          }
        ]
      },
      {
        id: "arc-4",
        stage: "First Job",
        character: "Lead Planner Rohan",
        avatar: "👨‍💼",
        text: "You are a junior architect. You can specialize in high-end Luxury Residential estates, or join the municipal Urban Planning authority. Your path?",
        options: [
          {
            id: "a",
            label: "Join the Luxury Residential firm.",
            consequence: "You design custom glass mansions and work with premium marble and landscape engineers.",
            branchSet: "Luxury Residential",
            scores: { analytical: 8, creativity: 16, collaboration: 10, risk: 10 },
            milestone: "Joined Luxury Design Studio"
          },
          {
            id: "b",
            label: "Join the municipal Urban Planning authority.",
            consequence: "You design metro station hubs, public parks, and write city zoning laws.",
            branchSet: "Urban Planning",
            scores: { analytical: 14, creativity: 10, collaboration: 14, risk: 6 },
            milestone: "Joined Urban Planning Bureau"
          }
        ]
      },
      {
        id: "arc-5",
        stage: "Senior Career",
        character: "City Mayor",
        avatar: "🧔",
        text: "You are now Chief Architect. The mayor invites you to direct a massive smart city extension using self-shading alleys. Do you accept or establish your own boutique design studio?",
        options: [
          {
            id: "a",
            label: "Direct the smart city extension project.",
            consequence: "You direct 100+ engineers, building transit hubs and green belts for 1 Million citizens.",
            branchSet: "Urban Planning",
            scores: { analytical: 15, creativity: 8, collaboration: 18, risk: 12 },
            milestone: "Directed Smart City Extension"
          },
          {
            id: "b",
            label: "Establish your own boutique design studio.",
            consequence: "You win custom museum commissions, publishing designs in international design journals.",
            branchSet: "Sustainable Design", // or Luxury Residential
            scores: { analytical: 8, creativity: 20, collaboration: 10, risk: 18 },
            milestone: "Launched Design Studio"
          }
        ]
      }
    ]
  },
  "journalist": {
    careerId: "journalist",
    title: "Investigative Journalist",
    shortDesc: "Experience breaking news deadlines, verify anonymous whistleblowers, and host digital media feeds.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["lawyer", "psychologist"],
    endings: [
      { id: "pulitzer", title: "Pulitzer-Prize Reporter", description: "You exposed corporate financial cartels, earning the highest honors in investigative journalism.", requiredBranch: "Investigative Journalism", badge: "📰" },
      { id: "anchor", title: "Prime-Time Broadcast Anchor", description: "You directed news broadcasts, hosting discussions watched by millions daily.", requiredBranch: "Broadcast Media", badge: "🎙️" },
      { id: "substack-publisher", title: "Independent Substack Publisher", description: "You bypassed traditional editors, building a newsletter network of 100k paid subscribers.", requiredBranch: "Digital Columnist", badge: "✒️" }
    ],
    scenes: [
      {
        id: "jou-1",
        stage: "School",
        character: "English Teacher Ms. Sen",
        avatar: "👩‍🏫",
        text: "You want to run the school newspaper, but the principal wants you to focus on your board exam syllabus. Do you launch the paper anyway?",
        options: [
          {
            id: "a",
            label: "Launch the paper as a digital blog in your spare time.",
            consequence: "Your blog goes viral among students, though you sleep fewer hours before exams.",
            scores: { analytical: 5, creativity: 14, collaboration: 8, risk: 15 },
            milestone: "Launched Student News Blog"
          },
          {
            id: "b",
            label: "Focus on exams and write articles for the regional city daily.",
            consequence: "You secure top board marks and learn standard editor formatting rules.",
            scores: { analytical: 12, creativity: 8, collaboration: 10, risk: 5 },
            milestone: "Published Regional Article"
          }
        ]
      },
      {
        id: "jou-2",
        stage: "College",
        character: "Prof. Kabir",
        avatar: "🧔",
        text: "At journalism school, you obtain a tip regarding a local municipal funding leak, but the whistleblower demands absolute anonymity. Do you publish without a second source?",
        options: [
          {
            id: "a",
            label: "Wait to verify with a second municipal source.",
            consequence: "Your report is delayed, but you ensure complete verification safety.",
            branchSet: "Digital Columnist",
            scores: { analytical: 16, creativity: 5, collaboration: 10, risk: 4 },
            milestone: "Verified Whistleblower Source"
          },
          {
            id: "b",
            label: "Publish the scoop immediately to secure the exclusive story.",
            consequence: "Your story trends nationally, though the municipal council challenges your credibility.",
            branchSet: "Investigative Journalism",
            scores: { analytical: 5, creativity: 12, collaboration: 5, risk: 18 },
            milestone: "Published Municipal Leak Scoop"
          }
        ]
      },
      {
        id: "jou-3",
        stage: "Internship",
        character: "Editor-in-Chief Shalini",
        avatar: "👩‍💼",
        text: "During your internship, you capture photos of a famous actor violating quarantine laws. The actor's agent offers to book a major exclusive interview if you delete the photos. What is your choice?",
        options: [
          {
            id: "a",
            label: "Reject the trade, publishing the quarantine photos.",
            consequence: "You expose the violation, earning a reputation for ethical integrity.",
            scores: { analytical: 10, creativity: 8, collaboration: 5, risk: 16 },
            milestone: "Exposed quarantine Breach"
          },
          {
            id: "b",
            label: "Accept the trade, securing the exclusive movie interview.",
            consequence: "Your paper secures a high-traffic entertainment cover story, though you compromises raw truth.",
            scores: { analytical: 5, creativity: 15, collaboration: 15, risk: 5 },
            milestone: "Secured Exclusive Cover Interview"
          }
        ]
      },
      {
        id: "jou-4",
        stage: "First Job",
        character: "News Director Alok",
        avatar: "🧔",
        text: "You are hired. You can join the Investigative Journalism team to expose fraud, or join the Broadcast Media desk to host live news feeds. Your choice?",
        options: [
          {
            id: "a",
            label: "Join the Investigative Journalism team.",
            consequence: "You travel to remote regions, auditing tax documents and whistleblower logs.",
            branchSet: "Investigative Journalism",
            scores: { analytical: 15, creativity: 10, collaboration: 5, risk: 15 },
            milestone: "Joined Investigative Unit"
          },
          {
            id: "b",
            label: "Join the Broadcast Media desk.",
            consequence: "You learn teleprompter speaking, live interviewing, and studio camera pacing.",
            branchSet: "Broadcast Media",
            scores: { analytical: 8, creativity: 12, collaboration: 16, risk: 8 },
            milestone: "Joined Live Broadcast Desk"
          }
        ]
      },
      {
        id: "jou-5",
        stage: "Senior Career",
        character: "Network Board Chairman",
        avatar: "🧔",
        text: "You are now a senior correspondent. A conglomerate threatens to withdraw ads if you expose their labor violations. Do you run the story anyway or modify the wording?",
        options: [
          {
            id: "a",
            label: "Publish the story in full, accepting the ad loss.",
            consequence: "The network loses revenue, but you win the Pulitzer Prize for investigative bravery!",
            branchSet: "Investigative Journalism",
            scores: { analytical: 10, creativity: 15, collaboration: 5, risk: 20 },
            milestone: "Published Labor Fraud Report"
          },
          {
            id: "b",
            label: "Publish a modified report focusing on general labor trends.",
            consequence: "Maintains network ads, though you choose to launch your own independent newsletter later.",
            branchSet: "Digital Columnist",
            scores: { analytical: 14, creativity: 10, collaboration: 12, risk: 8 },
            milestone: "Launched Independent Column"
          }
        ]
      }
    ]
  },
  "veterinarian": {
    careerId: "veterinarian",
    title: "Veterinary Surgeon & Conservationist",
    shortDesc: "Diagnose domestic pets, lead forest wildlife rescue operations, and direct animal hospitals.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["doctor", "psychologist"],
    endings: [
      { id: "hospital-director", title: "Animal Hospital Director", description: "You directed a modern veterinary trauma facility, pioneering animal diagnostics.", requiredBranch: "Domestic Animals", badge: "🏥" },
      { id: "wildlife-vet", title: "National Park Wildlife Chief", description: "You led tiger and elephant conservation operations across regional forest sanctuaries.", requiredBranch: "Wildlife Conservation", badge: "🐅" },
      { id: "exotic-specialist", title: "Exotic Species Specialist", description: "You consulted global marine parks and sanctuaries on reptile and avian health.", requiredBranch: "Exotic Pet Care", badge: "🦅" }
    ],
    scenes: [
      {
        id: "vet-1",
        stage: "School",
        character: "Biology Coach Dr. Nair",
        avatar: "👩‍⚕️",
        text: "To clear the BVSc entrance exam, you must take Biology (PCB). However, you want to volunteer at a local animal shelter on weekends, which clashes with mock test hours. Your choice?",
        options: [
          {
            id: "a",
            label: "Focus on mock test hours to secure high admission ranks.",
            consequence: "Your exam scoring is top-tier, securing a government college seat.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Cleared BVSc Admissions"
          },
          {
            id: "b",
            label: "Maintain weekend shelter volunteering, studying at night.",
            consequence: "You gain immediate animal handling experience, though study pacing is highly intense.",
            scores: { analytical: 8, creativity: 10, collaboration: 14, risk: 8 },
            milestone: "Balanced Mock Tests & Shelter"
          }
        ]
      },
      {
        id: "vet-2",
        stage: "College",
        character: "Prof. Roy",
        avatar: "🧔",
        text: "At veterinary college, you must select your research internship path: Domestic Companion Animals or Forest Wildlife Sanctuaries. Your choice?",
        options: [
          {
            id: "a",
            label: "Choose Domestic Companion Animals.",
            consequence: "You specialize in canine orthopedics, feline surgery, and vaccination schedules.",
            branchSet: "Domestic Animals",
            scores: { analytical: 14, creativity: 6, collaboration: 10, risk: 5 },
            milestone: "Specialized in Companion Animals"
          },
          {
            id: "b",
            label: "Choose Wildlife Conservation & Forestry.",
            consequence: "You study tranquilization darts, large carnivore diagnostics, and forest tracking.",
            branchSet: "Wildlife Conservation",
            scores: { analytical: 8, creativity: 15, collaboration: 5, risk: 14 },
            milestone: "Specialized in Wildlife Vet"
          }
        ]
      },
      {
        id: "vet-3",
        stage: "Internship",
        character: "Clinic Vet Dr. Alok",
        avatar: "👨‍⚕️",
        text: "During your clinic internship, a stray dog is brought in with severe internal bleeding. The clinic has no blood transfusion kit. Do you attempt emergency plasma fluid stabilization or request immediate referral?",
        options: [
          {
            id: "a",
            label: "Attempt emergency plasma fluid stabilization.",
            consequence: "You stabilize the patient's heart rate immediately, saving its life under pressure.",
            scores: { analytical: 8, creativity: 14, collaboration: 10, risk: 16 },
            milestone: "Performed Emergency Stabilization"
          },
          {
            id: "b",
            label: "Refer the dog to the central animal hospital.",
            consequence: "Ensures access to structural surgical units, though transport is high-risk.",
            scores: { analytical: 16, creativity: 5, collaboration: 10, risk: 5 },
            milestone: "Referred Complex Trauma Case"
          }
        ]
      },
      {
        id: "vet-4",
        stage: "First Job",
        character: "Forest Officer Rohit",
        avatar: "🧔",
        text: "You are hired. You can join a domestic companion clinic in Mumbai, or take a position as Forest Vet at the tiger sanctuary. Your path?",
        options: [
          {
            id: "a",
            label: "Join the Mumbai Companion Animal Clinic.",
            consequence: "You perform routine surgeries, managing pet wellness charts and diets.",
            branchSet: "Domestic Animals",
            scores: { analytical: 12, creativity: 8, collaboration: 14, risk: 5 },
            milestone: "Joined Companion Clinic"
          },
          {
            id: "b",
            label: "Accept the tiger sanctuary Forest Vet position.",
            consequence: "You lead forest rescue missions, monitoring tiger migration grids.",
            branchSet: "Wildlife Conservation",
            scores: { analytical: 10, creativity: 12, collaboration: 8, risk: 18 },
            milestone: "Joined Wildlife Conservation Unit"
          }
        ]
      },
      {
        id: "vet-5",
        stage: "Senior Career",
        character: "Sanctuary Director",
        avatar: "🧔",
        text: "You are now a senior vet. An injured leopard is spotted inside a local village. You must decide whether to tranquilize immediately at night or wait for daylight tracking.",
        options: [
          {
            id: "a",
            label: "Tranquilize immediately under searchlights.",
            consequence: "High-risk dart shot. You succeed, securing the leopard and protecting the villagers!",
            branchSet: "Wildlife Conservation",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 20 },
            milestone: "Tranquilized Night Leopard"
          },
          {
            id: "b",
            label: "Wait for daylight tracking, establishing village containment cordons.",
            consequence: "Ensures complete medical safety for the animal, though villagers are anxious.",
            branchSet: "Exotic Pet Care",
            scores: { analytical: 16, creativity: 8, collaboration: 14, risk: 5 },
            milestone: "Established Safe Sanctuary Rescue"
          }
        ]
      }
    ]
  },
  "entrepreneur": {
    careerId: "entrepreneur",
    title: "Startup Founder & CEO",
    shortDesc: "Experience stream selections, MVP validation, capital fundraising pitches, and market pivots.",
    stages: ["School", "College", "Internship", "First Job", "Senior Career"],
    suggestedNext: ["software-engineer", "product-manager"],
    endings: [
      { id: "tech-unicorn", title: "Tech Unicorn Founder", description: "You scaled a software SaaS engine to a billion-dollar valuation, listing on the NASDAQ.", requiredBranch: "SaaS Tech Startup", badge: "🦄" },
      { id: "social-impact", title: "Social Impact Leader", description: "You built micro-grid solar systems for off-grid schools, winning global NGO grants.", requiredBranch: "Social Enterprise", badge: "💡" },
      { id: "d2c-mogul", title: "D2C Brand Mogul", description: "You scaled a sustainable consumer goods label, launching worldwide retail outlets.", requiredBranch: "D2C Retail", badge: "🛍️" }
    ],
    scenes: [
      {
        id: "ent-1",
        stage: "School",
        character: "Commerce Advisor Mr. Kapoor",
        avatar: "🧔",
        text: "You want to build a tech startup. Your parents recommend taking Science (PCM) to learn code architecture, while Kapoor recommends Commerce. Your stream choice?",
        options: [
          {
            id: "a",
            label: "Choose Science (PCM) to master code and computer logic.",
            consequence: "You learn systems architecture, but must self-teach cash flow accounting later.",
            scores: { analytical: 15, creativity: 6, collaboration: 5, risk: 5 },
            milestone: "Selected Technical Track"
          },
          {
            id: "b",
            label: "Choose Commerce to study economics and sales pitching.",
            consequence: "You master profit ledgers and sales presentations, though you must hire developers later.",
            scores: { analytical: 8, creativity: 12, collaboration: 12, risk: 8 },
            milestone: "Selected Commercial Track"
          }
        ]
      },
      {
        id: "ent-2",
        stage: "College",
        character: "Incubator Lead Shalini",
        avatar: "👩‍💼",
        text: "At college, you design a courier delivery app. To validate market demand, do you spend 4 months coding a full React native app, or launch a manual WhatsApp pilot in 2 days?",
        options: [
          {
            id: "a",
            label: "Spend 4 months coding a feature-rich React native app.",
            consequence: "Your app is robust, though you realize customers prefer a simpler SMS order flow.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 16, creativity: 6, collaboration: 5, risk: 8 },
            milestone: "Built Fully Featured App"
          },
          {
            id: "b",
            label: "Launch a manual WhatsApp coordination pilot in 2 days.",
            consequence: "You process 100 deliveries manually in a week, proving market demand immediately with zero code budget!",
            branchSet: "D2C Retail",
            scores: { analytical: 6, creativity: 15, collaboration: 12, risk: 14 },
            milestone: "Launched Lean WhatsApp Pilot"
          }
        ]
      },
      {
        id: "ent-3",
        stage: "Internship",
        character: "VC Partner Vikram",
        avatar: "👨‍💼",
        text: "Your startup cash is running low. Vikram offers a ₹40 Lakh funding cheque for a massive 35% equity cut of your company. Do you accept or reject and bootstrap?",
        options: [
          {
            id: "a",
            label: "Accept the funding to secure runway and hire engineers.",
            consequence: "The business survives, but Vikram pushes for aggressive quarterly growth targets.",
            scores: { analytical: 12, creativity: 6, collaboration: 15, risk: 10 },
            milestone: "Secured Pre-Seed Investment"
          },
          {
            id: "b",
            label: "Reject the offer, funding operations through freelance consulting.",
            consequence: "You keep 100% control, growing organically based on actual customer revenues.",
            scores: { analytical: 10, creativity: 14, collaboration: 8, risk: 18 },
            milestone: "Bootstrapped Initial Runway"
          }
        ]
      },
      {
        id: "ent-4",
        stage: "First Job",
        character: "Co-Founder Rohit",
        avatar: "🧔",
        text: "Your core product growth slows. You can pivot to a B2B Software Enterprise SaaS engine, or expand into a B2C sustainable consumer goods D2C brand. Which direction?",
        options: [
          {
            id: "a",
            label: "Pivot to a B2B Software Enterprise SaaS engine.",
            consequence: "You close corporate clients with high annual contract values, stabilizing cash.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 15, creativity: 8, collaboration: 10, risk: 12 },
            milestone: "Pivoted to B2B SaaS Model"
          },
          {
            id: "b",
            label: "Expand into a B2C sustainable consumer goods D2C brand.",
            consequence: "You manage supplier logistics and launch creative retail marketing campaigns.",
            branchSet: "D2C Retail",
            scores: { analytical: 8, creativity: 16, collaboration: 14, risk: 14 },
            milestone: "Launched B2C D2C Brand"
          }
        ]
      },
      {
        id: "ent-5",
        stage: "Senior Career",
        character: "Board Director",
        avatar: "👩‍💼",
        text: "You are now CEO. A massive rival offers to acquire your startup for ₹50 Crores. Do you sell to secure the exit or reject to take the company public?",
        options: [
          {
            id: "a",
            label: "Sell the startup for the ₹50 Crore exit.",
            consequence: "You secure a massive financial win, transitioning into a venture capitalist yourself.",
            branchSet: "D2C Retail", // or SaaS Tech Startup
            scores: { analytical: 15, creativity: 5, collaboration: 15, risk: 10 },
            milestone: "Executed ₹50 Crore Startup Exit"
          },
          {
            id: "b",
            label: "Reject the offer, targeting an IPO in 2 years.",
            consequence: "High-stress road. You scale team counts and go public, listing on national stock exchanges!",
            branchSet: "SaaS Tech Startup", // or Social Enterprise
            scores: { analytical: 10, creativity: 15, collaboration: 12, risk: 20 },
            milestone: "Listed Company on Stock Exchange"
          }
        ]
      }
    ]
  }
};

export const CAREER_JOURNEYS: Record<string, CareerJourney> = Object.keys(BASE_CAREER_JOURNEYS).reduce((acc, key) => {
  acc[key] = enrichJourney(BASE_CAREER_JOURNEYS[key]);
  return acc;
}, {} as Record<string, CareerJourney>);
