import { enrichCareerItem } from "./career-enriched-data";

export type TimelineEvent = {
  time: string;
  activity: string;
  details: string;
};

export type SalaryInsight = {
  entry: string;
  mid: string;
  senior: string;
  entryVal: number; // LPA
  midVal: number;
  seniorVal: number;
};

export type AIImpact = {
  automationRisk: number; // 0-100
  level: "Low" | "Medium" | "High";
  summary: string;
  strategy: string;
};

export type SimulationOption = {
  id: "a" | "b" | "c";
  label: string;
  insight: string;
  scores: {
    analytical: number;
    creativity: number;
    collaboration: number;
    risk: number;
  };
};

export type SimulationScene = {
  id: string;
  title: string;
  dilemma: string;
  options: SimulationOption[];
};

export type RoadmapStep = {
  stage: "Grade 10-12" | "College / Training" | "Entry-Level Job" | "Senior Leadership";
  action: string;
  details: string;
};

export type EnrichedSalaryInsight = {
  india: SalaryInsight;
  global: {
    entry: string;
    mid: string;
    senior: string;
    entryVal: number;
    midVal: number;
    seniorVal: number;
  };
};

export type MarketDemandInsight = {
  level: "High" | "Moderate" | "Growing" | "Niche";
  description: string;
};

export type GrowthProjectionInsight = {
  rate: string;
  timeframe: string;
  insights: string;
};

export type EnrichedSkills = {
  hard: string[];
  soft: string[];
  tools: string[];
};

export type DegreePaths = {
  undergrad: string[];
  postgrad: string[];
  exams: string[];
};

export type FreelanceInsight = {
  viability: "High" | "Medium" | "Low";
  roles: string[];
  insights: string;
};

export type EntrepreneurshipInsight = {
  viability: "High" | "Medium" | "Low";
  models: string[];
  insights: string;
};

export type ComparisonParams = {
  workLifeBalance: number;
  educationCost: "Low" | "Medium" | "High";
  flexibility: "Low" | "Medium" | "High";
  remoteOpportunities: "Remote" | "Hybrid" | "On-site" | "Rare";
  bestFor: string;
  typicalDay: string;
  futureOutlook: string;
};

export type RealityVsExpectationItem = {
  expectation: string;
  reality: string;
};

export type CareerMythItem = {
  myth: string;
  fact: string;
};

export type GrowthLadderStep = {
  role: string;
  experience: string;
  description: string;
};

export type CareerItem = {
  id: string;
  title: string;
  stream: "Science" | "Commerce" | "Arts" | "Vocational";
  category: string;
  shortDesc: string;
  longDesc: string;
  salary: SalaryInsight;
  growthRate: string;
  demandLevel: "High" | "Moderate" | "Growing";
  typicalRoles: string[];
  hardSkills: string[];
  softSkills: string[];
  educationPath: {
    highSchoolSubjects: string;
    degrees: string[];
    entranceExams: string[];
    certifications: string[];
    alternatePaths: string;
  };
  aiImpact: AIImpact;
  simulationAvailable: boolean;
  dayInTheLife: TimelineEvent[];
  roadmap: RoadmapStep[];
  simulation: SimulationScene[];

  // V13 Enriched Fields
  indiaSalary: SalaryInsight;
  globalSalary: {
    entry: string;
    mid: string;
    senior: string;
    entryVal: number;
    midVal: number;
    seniorVal: number;
  };
  marketDemand: MarketDemandInsight;
  growthProjections: GrowthProjectionInsight;
  enrichedSkills: EnrichedSkills;
  degreePaths: DegreePaths;
  alternativePathways: string[];
  freelanceOpportunities: FreelanceInsight;
  entrepreneurshipOpportunities: EntrepreneurshipInsight;
  comparisonParams: ComparisonParams;

  // V15 Enriched Fields
  realJourney?: string;
  misconceptions?: string[];
  realityVsExpectation?: RealityVsExpectationItem[];
  myths?: CareerMythItem[];
  growthLadder?: GrowthLadderStep[];
};

const INITIAL_CAREER_LIBRARY: Omit<
  CareerItem,
  | "indiaSalary"
  | "globalSalary"
  | "marketDemand"
  | "growthProjections"
  | "enrichedSkills"
  | "degreePaths"
  | "alternativePathways"
  | "freelanceOpportunities"
  | "entrepreneurshipOpportunities"
  | "comparisonParams"
>[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    stream: "Science",
    category: "Technology",
    shortDesc: "Design and build software applications, APIs, and systems solving real-world challenges.",
    longDesc: "Software Engineers solve problems through algorithmic logic. They work in agile teams to translate business designs into code, optimizing for reliability and performance.",
    salary: { entry: "₹6 - 12 LPA", mid: "₹15 - 28 LPA", senior: "₹35 - 75+ LPA", entryVal: 9, midVal: 21, seniorVal: 55 },
    growthRate: "+22% YoY",
    demandLevel: "High",
    typicalRoles: ["Frontend Engineer", "Backend Developer", "DevOps Engineer", "Cloud Architect"],
    hardSkills: ["Python / JavaScript", "Data Structures", "APIs", "System Architecture", "Databases"],
    softSkills: ["Team Collaboration", "Logical Debugging", "Patience", "Pragmatism"],
    educationPath: {
      highSchoolSubjects: "Science Stream (Physics, Chemistry, Math - PCM)",
      degrees: ["B.Tech / B.E. in Computer Science", "BCA + MCA", "B.Sc. in IT"],
      entranceExams: ["JEE Main / Advanced", "VITEEE", "BITSAT"],
      certifications: ["AWS Certified Developer", "Google Professional Cloud Architect", "Scrum Master"],
      alternatePaths: "Coding Bootcamps, contributing to Open Source, or building a strong GitHub portfolio."
    },
    aiImpact: {
      automationRisk: 30,
      level: "Medium",
      summary: "AI code assistants automate boilerplates, shifting human value to systems design, debugging, and business alignment.",
      strategy: "Leverage AI to double coding speed, and focus on system architecture and code verification."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:30 AM", activity: "Sprint Sync", details: "Coordinate code status updates with team developers." },
      { time: "11:00 AM", activity: "Feature Coding", details: "Implement core backend API logic for checkout screens." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCM Stream", details: "Study Physics, Chemistry, and Math. Learn basic Python or Java." },
      { stage: "College / Training", action: "B.Tech CS Degree", details: "Participate in coding contests and secure internship projects." },
      { stage: "Entry-Level Job", action: "Junior SDE", details: "Write unit tests, fix legacy bugs, and master system tools." },
      { stage: "Senior Leadership", action: "Staff SDE / Architect", details: "Lead engineering strategy and design cloud architectures." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "The Critical Release Bug",
        dilemma: "A major security bug is discovered right before product launch. What is your choice?",
        options: [
          { id: "a", label: "Delay the launch to fix it completely.", insight: "Security-first decision. Prevents leaks but delays marketing schedules.", scores: { analytical: 10, creativity: 2, collaboration: 5, risk: 2 } },
          { id: "b", label: "Launch anyway and patch it silently tomorrow.", insight: "High risk. Compromises trust if caught.", scores: { analytical: 2, creativity: 5, collaboration: 2, risk: 10 } },
          { id: "c", label: "Disable only the buggy module and launch the rest.", insight: "Smart tradeoff. Minimizes impact while retaining schedule.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 5 } }
        ]
      },
      {
        id: "scene-2",
        title: "Scale Bottleneck",
        dilemma: "Servers are crashing due to a sudden traffic spike. How do you scale?",
        options: [
          { id: "a", label: "Add load balancers and horizontal scaling.", insight: "Correct engineering method. Distributes workload efficiently.", scores: { analytical: 10, creativity: 4, collaboration: 5, risk: 2 } },
          { id: "b", label: "Optimize database queries on the primary server.", insight: "Local fix, helps but won't solve systemic overload.", scores: { analytical: 8, creativity: 2, collaboration: 2, risk: 4 } },
          { id: "c", label: "Turn off non-essential telemetry services.", insight: "Effective emergency patch to reduce CPU usage.", scores: { analytical: 5, creativity: 8, collaboration: 5, risk: 8 } }
        ]
      },
      {
        id: "scene-3",
        title: "Technical Debt Dilemma",
        dilemma: "You can write quick code to ship now or take a week to refactor correctly.",
        options: [
          { id: "a", label: "Refactor core codebase before shipping.", insight: "Ensures long-term sanity, but delays release.", scores: { analytical: 10, creativity: 2, collaboration: 5, risk: 2 } },
          { id: "b", label: "Ship quick code and document technical debt.", insight: "Pragmatic for business, but accumulates tech debt.", scores: { analytical: 4, creativity: 5, collaboration: 4, risk: 8 } },
          { id: "c", label: "Pair program to write clean code at high velocity.", insight: "Highly collaborative, balances speed and clean engineering.", scores: { analytical: 8, creativity: 8, collaboration: 10, risk: 4 } }
        ]
      }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    stream: "Science",
    category: "Technology",
    shortDesc: "Clean data pipelines, train machine learning models, and deduce business trends.",
    longDesc: "Data Scientists combine statistics, math, and code to clean datasets, formulate predictive models, and deliver business insights.",
    salary: { entry: "₹7 - 13 LPA", mid: "₹15 - 28 LPA", senior: "₹32 - 70+ LPA", entryVal: 10, midVal: 21.5, seniorVal: 51 },
    growthRate: "+25% YoY",
    demandLevel: "High",
    typicalRoles: ["Data Scientist", "ML Engineer", "Quantitative Analyst", "Analytics Lead"],
    hardSkills: ["Python / R", "SQL Databases", "Statistics", "Machine Learning", "Data Viz"],
    softSkills: ["Storytelling", "Analytical Mindset", "Critical Evaluation", "Curiosity"],
    educationPath: {
      highSchoolSubjects: "Science Stream (Math preferred) or Commerce with Mathematics",
      degrees: ["B.Sc. / M.Sc. in Data Science or Statistics", "B.Tech in CS/AI", "BCA + MCA"],
      entranceExams: ["JEE Main", "ISI Admission Test", "JAM Statistics"],
      certifications: ["Google Data Analytics", "Microsoft Certified: Azure Data Scientist", "TensorFlow Developer"],
      alternatePaths: "Participating in Kaggle competitions, analyzing public datasets, and publishing analytics notebooks."
    },
    aiImpact: {
      automationRisk: 25,
      level: "Medium",
      summary: "AI systems automate code for data scrubbing and training baselines, but hypothesis modeling requires human validation.",
      strategy: "Focus on domain business logic and modeling ethics."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:30 AM", activity: "Sync Metrics", details: "Review predictive scores of active models." },
      { time: "11:00 AM", activity: "SQL Data Wrangling", details: "Write queries to extract user logs." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCM Stream", details: "Study Math and Statistics. Work on database logic basics." },
      { stage: "College / Training", action: "Data Science Degree", details: "Learn R/Python, regressions, and neural network theory." },
      { stage: "Entry-Level Job", action: "Junior Data Analyst", details: "Clean raw logs, build SQL queries, and deploy reports." },
      { stage: "Senior Leadership", action: "Lead Data Scientist", details: "Formulate business analytics plans and align pipelines." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Model Telemetry Error",
        dilemma: "Retention metrics show a sudden drop, but it could be a pipeline telemetry glitch.",
        options: [
          { id: "a", label: "Report Churn Alert immediately to stakeholders.", insight: "Risky. Can trigger costly marketing reactions for false alarms.", scores: { analytical: 3, creativity: 5, collaboration: 6, risk: 8 } },
          { id: "b", label: "Audit the ingestion pipeline log files first.", insight: "Methodical and correct. Validates data health first.", scores: { analytical: 10, creativity: 2, collaboration: 4, risk: 2 } },
          { id: "c", label: "Re-train target models using current logs.", insight: "Garbage In, Garbage Out. Corrupts modeling logic.", scores: { analytical: 2, creativity: 2, collaboration: 2, risk: 9 } }
        ]
      },
      {
        id: "scene-2",
        title: "Feature Selection Bias",
        dilemma: "Your credit risk model excludes minor applicants unfairly due to historical bias.",
        options: [
          { id: "a", label: "Normalize inputs and adjust weight functions.", insight: "Ethical engineering. Root out bias at model level.", scores: { analytical: 10, creativity: 6, collaboration: 5, risk: 3 } },
          { id: "b", label: "Hardcode filter adjustments in the dashboard.", insight: "Brittle fix. Leads to scaling issues later.", scores: { analytical: 6, creativity: 4, collaboration: 2, risk: 5 } },
          { id: "c", label: "Launch the model as-is; let compliance flag it.", insight: "Breaks safety compliance standards.", scores: { analytical: 2, creativity: 2, collaboration: 2, risk: 10 } }
        ]
      },
      {
        id: "scene-3",
        title: "Insights Presentation",
        dilemma: "Executive board wants simplified insights, but modeling margins are complex.",
        options: [
          { id: "a", label: "Present raw code and equations.", insight: "Stakeholders get confused; loses commercial value.", scores: { analytical: 9, creativity: 1, collaboration: 2, risk: 2 } },
          { id: "b", label: "Translate complex correlations into commercial stories.", insight: "Ideal translator skill. Bridges stats and business.", scores: { analytical: 7, creativity: 10, collaboration: 8, risk: 4 } },
          { id: "c", label: "Guarantee 100% accuracy to win funding.", insight: "Unethical. Models operate on probabilities, not certainty.", scores: { analytical: 2, creativity: 4, collaboration: 5, risk: 9 } }
        ]
      }
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    stream: "Commerce",
    category: "Technology",
    shortDesc: "Manage engineering, business priorities, and design to ship successful features.",
    longDesc: "Product Managers drive the lifecycle of digital products. They define feature scopes, coordinate design wireframes, prioritize backlogs, and track success metrics.",
    salary: { entry: "₹7 - 14 LPA", mid: "₹18 - 32 LPA", senior: "₹35 - 75+ LPA", entryVal: 10.5, midVal: 25, seniorVal: 55 },
    growthRate: "+18% YoY",
    demandLevel: "High",
    typicalRoles: ["Associate PM", "Product Lead", "Director of Product", "VP Product"],
    hardSkills: ["Product Analytics", "Roadmapping", "A/B Testing", "Agile / Scrum", "Market Research"],
    softSkills: ["Influence without Authority", "Team Alignment", "Empathy", "Storytelling"],
    educationPath: {
      highSchoolSubjects: "Commerce or Science Stream (Business Studies, Economics, Math)",
      degrees: ["BBA / B.Com", "B.Tech + MBA", "B.Sc. in Economics"],
      entranceExams: ["CAT (for MBA)", "GMAT", "IPMAT"],
      certifications: ["Product School PM Certification", "Pragmatic Institute Certified", "CSPO"],
      alternatePaths: "Transitioning internally from software development, operations, or product design roles."
    },
    aiImpact: {
      automationRisk: 20,
      level: "Low",
      summary: "AI systems can generate roadmap drafts, but team facilitation, client mediation, and leadership remain human.",
      strategy: "Develop stakeholder negotiation and user empathy skills."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Backlog Grooming", details: "Refine specifications with UX designers." },
      { time: "02:00 PM", activity: "User Interview", details: "Validate checkout drop points with users." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Commerce Stream", details: "Study Business Studies and Economics. Understand design basics." },
      { stage: "College / Training", action: "Business Degree / CS", details: "Lead university student clubs to learn team alignment." },
      { stage: "Entry-Level Job", action: "Associate PM", details: "Analyze metric graphs, write feature specs, and run tests." },
      { stage: "Senior Leadership", action: "Chief Product Officer", details: "Define long-term market portfolios and guide product divisions." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Conflicting Client Scopes",
        dilemma: "Two high-value clients demand opposite features on the dashboard.",
        options: [
          { id: "a", label: "Build both halfway by pushing the developers.", insight: "Rushing code leads to design bugs and team burnout.", scores: { analytical: 3, creativity: 4, collaboration: 4, risk: 8 } },
          { id: "b", label: "Align with mass market scope; negotiate with clients.", insight: "Prioritizes scale. Keeps core vision aligned.", scores: { analytical: 10, creativity: 6, collaboration: 8, risk: 3 } },
          { id: "c", label: "Build whichever feature is easier.", insight: "Lacks strategy. Doesn't optimize for target user base.", scores: { analytical: 5, creativity: 5, collaboration: 5, risk: 6 } }
        ]
      },
      {
        id: "scene-2",
        title: "Delayed Timeline Spike",
        dilemma: "Engineering flags a 3-week delay for a critical marketing launch.",
        options: [
          { id: "a", label: "Cut minor scopes to release a simplified MVP on time.", insight: "Agile product trade-off. Ships value while protecting dates.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 4 } },
          { id: "b", label: "Demand overtime to meet the release date.", insight: "Destroys engineering trust and code quality.", scores: { analytical: 2, creativity: 2, collaboration: 2, risk: 10 } },
          { id: "c", label: "Postpone the launch date entirely.", insight: "Safe, but hurts marketing pipelines and commitments.", scores: { analytical: 6, creativity: 3, collaboration: 6, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Metrics Drop",
        dilemma: "A new design layout drops sign-up conversion metrics by 15%.",
        options: [
          { id: "a", label: "Roll back to previous design immediately.", insight: "Stops bleed immediately, a safe operations move.", scores: { analytical: 8, creativity: 2, collaboration: 5, risk: 2 } },
          { id: "b", label: "Run A/B test variations to identify failure spots.", insight: "Methodical diagnostics. Identifies drop source.", scores: { analytical: 10, creativity: 8, collaboration: 6, risk: 4 } },
          { id: "c", label: "Launch advertisements to hide the metric drop.", insight: "Inefficient and waste of capital. Fix the product first.", scores: { analytical: 2, creativity: 4, collaboration: 4, risk: 9 } }
        ]
      }
    ]
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    stream: "Commerce",
    category: "Entrepreneurship",
    shortDesc: "Found startups, scale business models, manage capital, and lead teams.",
    longDesc: "Entrepreneurs take risks to build business operations. They define core product fit, secure investor seed funds, hire departments, and steer companies in competitive markets.",
    salary: { entry: "₹0 - 6 LPA (Founder's cut)", mid: "₹12 - 30 LPA (Secured seed)", senior: "₹50 - 200+ LPA (Scaled company)", entryVal: 3, midVal: 21, seniorVal: 125 },
    growthRate: "High Risk / Reward",
    demandLevel: "Growing",
    typicalRoles: ["CEO / Co-Founder", "Managing Partner", "Venture Incubator Lead"],
    hardSkills: ["Business Valuation", "Fundraising", "Product Design", "GTM Strategy", "Runway Auditing"],
    softSkills: ["Resilience / Grit", "Visionary Pacing", "Public Pitching", "Delegation"],
    educationPath: {
      highSchoolSubjects: "Any Stream (Commerce / Economics background highly helpful)",
      degrees: ["B.Com / BBA in Finance", "B.Tech (CS / Engineering)", "No formal degree requirement"],
      entranceExams: ["None (Ideation & Execution matters)"],
      certifications: ["Y Combinator Startup School", "Stanford Ignite Program"],
      alternatePaths: "Launching tiny side-projects, selling digital products, or starting local retail operations."
    },
    aiImpact: {
      automationRisk: 10,
      level: "Low",
      summary: "AI systems handle operations blueprints, contract templates, and drafts. Leadership and investor synergy remain human.",
      strategy: "Leverage AI tools to lower capital startup costs."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "08:30 AM", activity: "Capital Audit", details: "Review bank balances and monthly burn ratios." },
      { time: "02:00 PM", activity: "Pitch Meeting", details: "Present series proposals to investors." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Stream Agnostic", details: "Learn business economics, basic sales, and digital tools." },
      { stage: "College / Training", action: "Hacker / Builder mode", details: "Build product prototypes, run campus sales, and network." },
      { stage: "Entry-Level Job", action: "Solo Hustle / Product Lead", details: "Validate customer needs, secure beta signups, and ship MVP." },
      { stage: "Senior Leadership", action: "Founder & CEO", details: "Direct scaled operations, raise venture funding, and execute exits." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Cashflow Depletion",
        dilemma: "Cash is depleted to 2 months of runway, but the beta product is still buggy.",
        options: [
          { id: "a", label: "Fold operations immediately to refund backup cash.", insight: "Lacks grit. Founders pivot and stretch budgets first.", scores: { analytical: 4, creativity: 2, collaboration: 3, risk: 2 } },
          { id: "b", label: "Release a basic version now; seek bridge funding.", insight: "Decisive survival strategy. Cash flow is oxygen.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 8 } },
          { id: "c", label: "Commit personal loans to high-budget marketing.", insight: "Double-down risk. Dangerous if product bugs remain.", scores: { analytical: 2, creativity: 5, collaboration: 3, risk: 10 } }
        ]
      },
      {
        id: "scene-2",
        title: "Core Hire Leaves",
        dilemma: "Your lead technical co-founder exits right before investor diligence audits.",
        options: [
          { id: "a", label: "Offer equity bonuses to secure a replacement.", insight: "Pragmatic. Retains developer confidence at the cost of dilution.", scores: { analytical: 8, creativity: 7, collaboration: 9, risk: 5 } },
          { id: "b", label: "Delay the audit and explain status honestly.", insight: "Safe. Protects credibility but delays deal closes.", scores: { analytical: 9, creativity: 2, collaboration: 7, risk: 2 } },
          { id: "c", label: "Lie to investors; cover up the co-founder's exit.", insight: "Fraud risk. Will destroy the company in audits.", scores: { analytical: 2, creativity: 3, collaboration: 2, risk: 10 } }
        ]
      },
      {
        id: "scene-3",
        title: "Pivot Dilemma",
        dilemma: "Data reveals users only use a minor sub-feature, ignoring the main app.",
        options: [
          { id: "a", label: "Add marketing budgets to push the main app.", insight: "Fighting customer trends. Inefficient spend.", scores: { analytical: 3, creativity: 4, collaboration: 4, risk: 8 } },
          { id: "b", label: "Pivot completely: strip the app down to that sub-feature.", insight: "Lean startup methodology. Follow user behavior.", scores: { analytical: 10, creativity: 9, collaboration: 7, risk: 7 } },
          { id: "c", label: "Shut the feature down to enforce main app usage.", insight: "Fails user feedback metrics. Leads to churn.", scores: { analytical: 5, creativity: 1, collaboration: 3, risk: 4 } }
        ]
      }
    ]
  },
  {
    id: "doctor",
    title: "Medical Doctor",
    stream: "Science",
    category: "Healthcare",
    shortDesc: "Diagnose clinical diseases, prescribe medicine, and perform operations.",
    longDesc: "Doctors apply biological sciences and diagnostics to cure illnesses. They consult patients, interpret laboratory results, perform surgeries, and monitor rehabilitation.",
    salary: { entry: "₹8 - 14 LPA", mid: "₹16 - 30 LPA", senior: "₹35 - 80+ LPA", entryVal: 11, midVal: 23, seniorVal: 57.5 },
    growthRate: "+12% YoY",
    demandLevel: "High",
    typicalRoles: ["General Physician", "Surgeon", "Pediatrician", "Cardiologist"],
    hardSkills: ["Diagnostics", "Clinical Pathology", "Pharmacology", "Anatomy", "Surgical Pacing"],
    softSkills: ["Bedside Empathy", "Stress Pacing", "Active Inquiry", "Ethical Mindset"],
    educationPath: {
      highSchoolSubjects: "Science Stream (Physics, Chemistry, Biology - PCB)",
      degrees: ["MBBS (5.5 years)", "MD / MS (Specialization)", "DM / MCh (Super-speciality)"],
      entranceExams: ["NEET UG", "NEET PG", "INICET"],
      certifications: ["BLS/ACLS Life Support", "FMGE (for foreign degrees)"],
      alternatePaths: "Working in medical research labs, public health management (MPH), or healthcare consulting."
    },
    aiImpact: {
      automationRisk: 10,
      level: "Low",
      summary: "AI systems analyze MRI/CT scans with high speed, but clinical decision ownership and surgical execution require human MDs.",
      strategy: "Master diagnostic AI assistant tools and surgical robotics."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "08:00 AM", activity: "Ward Rounds", details: "Examine status check logs of admitted patients." },
      { time: "02:00 PM", activity: "Surgical Theater", details: "Perform scheduled keyhole appendectomy." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCB Stream", details: "Focus on Biology, Chemistry, and Physics. Prepare for NEET UG." },
      { stage: "College / Training", action: "MBBS Program", details: "Learn pathology, anatomy, and complete hospital internships." },
      { stage: "Entry-Level Job", action: "Junior Resident", details: "Handle emergency intakes, write charts, and assist surgeries." },
      { stage: "Senior Leadership", action: "Consultant / HOD", details: "Direct department portfolios, lead super-speciality cases, and teach." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Autonomy Conflict",
        dilemma: "A patient refuses an emergency transfusion due to spiritual beliefs.",
        options: [
          { id: "a", label: "Accept their choice immediately and document it.", insight: "Autonomy choice, but fails to exhaust medical options first.", scores: { analytical: 5, creativity: 2, collaboration: 6, risk: 3 } },
          { id: "b", label: "Perform it while they are sedated.", insight: "Serious legal battery. Violates clinical consent laws.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } },
          { id: "c", label: "Consult on alternatives like non-blood expanders.", insight: "Clinical diplomacy. Respects patient while saving lives.", scores: { analytical: 10, creativity: 9, collaboration: 8, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "Triage Crisis",
        dilemma: "ER has two critical cases, but only one senior ventilator is open.",
        options: [
          { id: "a", label: "Allocate to the patient with higher survival rate.", insight: "Classic utilitarian triage rule in medical crises.", scores: { analytical: 10, creativity: 2, collaboration: 5, risk: 5 } },
          { id: "b", label: "Ventilate the high-paying VIP patient.", insight: "Unethical. Breaks medical code criteria.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } },
          { id: "c", label: "Try to support both cases using split valves manually.", insight: "High risk. Valve splitting is unapproved and dangerous.", scores: { analytical: 4, creativity: 8, collaboration: 5, risk: 9 } }
        ]
      },
      {
        id: "scene-3",
        title: "Diagnostic Gap",
        dilemma: "Test data shows ambiguous results, but surgery must be scheduled fast.",
        options: [
          { id: "a", label: "Proceed with exploratory surgery.", insight: "Aggressive path. Risks patient if issue is non-surgical.", scores: { analytical: 4, creativity: 5, collaboration: 4, risk: 10 } },
          { id: "b", label: "Order a rapid MRI sequence to confirm diagnosis.", insight: "Correct. Data confirmation limits surgical risk.", scores: { analytical: 10, creativity: 3, collaboration: 7, risk: 2 } },
          { id: "c", label: "Prescribe strong antibiotics and wait.", insight: "Passive path. Ambiguity risk could worsen.", scores: { analytical: 6, creativity: 2, collaboration: 4, risk: 6 } }
        ]
      }
    ]
  },
  {
    id: "lawyer",
    title: "Lawyer",
    stream: "Arts",
    category: "Government & Law",
    shortDesc: "Argue cases in courtrooms, draft corporate agreements, and consult clients.",
    longDesc: "Lawyers research statutes, write legal briefs, represent clients in trials, and negotiate corporate mergers and settlements.",
    salary: { entry: "₹5 - 9 LPA", mid: "₹11 - 22 LPA", senior: "₹25 - 60+ LPA", entryVal: 7, midVal: 16.5, seniorVal: 42.5 },
    growthRate: "+10% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Litigation Associate", "Corporate Legal Counsel", "Arbitration Specialist"],
    hardSkills: ["Legal Drafting", "Statutory Interpretation", "Case Law Research", "Contracts", "Cross-examination"],
    softSkills: ["Logical Argumentation", "Public Speaking", "Negotiation", "Critical Reading"],
    educationPath: {
      highSchoolSubjects: "Arts / Commerce Stream (Legal Studies, Political Science helpful)",
      degrees: ["Integrated B.A. LLB / BBA LLB (5 years)", "LLB (3 years after graduation)"],
      entranceExams: ["CLAT", "AILET", "LSAT India"],
      certifications: ["Bar Council of India license (AIBE exam)", "Corporate Compliance Certified"],
      alternatePaths: "Working as legal researchers, corporate compliance officers, or NGO advocates."
    },
    aiImpact: {
      automationRisk: 35,
      level: "Medium",
      summary: "AI systems analyze document catalogs in seconds, shifting lawyer's focus to trial tactics, oral pleading, and litigation strategy.",
      strategy: "Master litigation skills and arbitration compliance."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Case Prep", details: "Review precedents for corporate dispute filing." },
      { time: "10:30 AM", activity: "High Court Pleading", details: "Argue stay petition before the judge." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Arts Stream", details: "Study Legal Studies, English, and History. Join debate clubs." },
      { stage: "College / Training", action: "BA LLB Degree", details: "Participate in Moot Court competitions and intern at law firms." },
      { stage: "Entry-Level Job", action: "Junior Advocate", details: "Draft contracts, research case law, and file petitions." },
      { stage: "Senior Leadership", action: "Senior Counsel / Partner", details: "Lead high-court litigation, manage corporate transactions, or become a Judge." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "The Contract Loophole",
        dilemma: "You spot a loophole in an agreement that favors your client but ruins the other party.",
        options: [
          { id: "a", label: "Point it out to keep agreements clean.", insight: "Ethical but violates primary loyalty duty to advocate for client.", scores: { analytical: 5, creativity: 3, collaboration: 8, risk: 2 } },
          { id: "b", label: "Keep quiet, sign, and exploit it later.", insight: "Exposes client to litigation risk later if found to be bad faith.", scores: { analytical: 6, creativity: 5, collaboration: 2, risk: 9 } },
          { id: "c", label: "Advise client and negotiate an official amendment.", insight: "Professional. Uses leverage to secure a clean contract.", scores: { analytical: 10, creativity: 8, collaboration: 6, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "Confidentiality Breach",
        dilemma: "A corporate client admits they knowingly dumped waste, asking you to file a compliance report.",
        options: [
          { id: "a", label: "File the report denying the dumping.", insight: "Filing false reports is perjury. Serious professional penalty.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } },
          { id: "b", label: "Refuse the filing; advise them to self-report and remediate.", insight: "Upholds law and ethics while protecting attorney privilege.", scores: { analytical: 10, creativity: 6, collaboration: 7, risk: 3 } },
          { id: "c", label: "Report them to the EPA anonymously.", insight: "Violates absolute attorney-client confidentiality rules.", scores: { analytical: 3, creativity: 4, collaboration: 3, risk: 9 } }
        ]
      },
      {
        id: "scene-3",
        title: "Cross-Examination Choice",
        dilemma: "You possess a personal secret of a witness that would discredit them but is unrelated to the case.",
        options: [
          { id: "a", label: "Expose it in court for maximum shock value.", insight: "Highly aggressive, but can trigger judge warnings for relevance.", scores: { analytical: 3, creativity: 6, collaboration: 1, risk: 9 } },
          { id: "b", label: "Focus purely on objective evidence discrepancies.", insight: "Standard legal practice, but misses discrediting opportunity.", scores: { analytical: 9, creativity: 2, collaboration: 5, risk: 2 } },
          { id: "c", label: "Use it as subtle leverage during settlement talks.", insight: "Strategic. Solves dispute out of court cleanly.", scores: { analytical: 8, creativity: 9, collaboration: 6, risk: 5 } }
        ]
      }
    ]
  },
  {
    id: "psychologist",
    title: "Psychologist",
    stream: "Arts",
    category: "Healthcare",
    shortDesc: "Administer psychometric tests, evaluate cognitive patterns, and deliver therapy.",
    longDesc: "Psychologists study cognitive behavior and mental diagnostics. They consult patients, apply counseling therapies (CBT, DBT), and run workshops on mental wellness.",
    salary: { entry: "₹3 - 6 LPA", mid: "₹8 - 15 LPA", senior: "₹18 - 35+ LPA", entryVal: 4.5, midVal: 11.5, seniorVal: 26.5 },
    growthRate: "+15% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Clinical Psychologist", "Counseling Specialist", "School Counselor"],
    hardSkills: ["CBT / DBT", "Psychometric Testing", "Clinical Diagnosis", "Session Structuring"],
    softSkills: ["Active Listening", "Empathetic Presence", "Boundary Setting", "Emotional Resilience"],
    educationPath: {
      highSchoolSubjects: "Arts or Science Stream (Psychology background helpful)",
      degrees: ["B.A. / B.Sc. in Psychology", "M.A. / M.Sc. in Clinical Psychology", "M.Phil (for RCI licensing)"],
      entranceExams: ["University PG Entrances", "NET"],
      certifications: ["Rehabilitation Council of India License", "Cognitive Hypnotherapy Practitioner"],
      alternatePaths: "Human Resource behavioral strategist, school counselor, or research associate."
    },
    aiImpact: {
      automationRisk: 15,
      level: "Low",
      summary: "AI systems can generate logs or wellness prompts, but empathetic trust and therapy require human therapist presence.",
      strategy: "Focus on deep family dynamic therapy and diagnostics."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "10:00 AM", activity: "Therapy Session", details: "Conduct CBT counseling for corporate burnout cases." },
      { time: "03:00 PM", activity: "Psychometric Scoring", details: "Review cognitive testing worksheets." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Arts Stream", details: "Take Psychology, Sociology, and English. Read behavioral research." },
      { stage: "College / Training", action: "Masters in Psychology", details: "Learn clinical diagnosis, CBT models, and complete clinical internships." },
      { stage: "Entry-Level Job", action: "Counselor / Intern", details: "Lead intake diagnostics, run counselor circles, and file logs." },
      { stage: "Senior Leadership", action: "Licensed Clinical Psychologist", details: "Establish private clinics, consult corporate divisions, and teach PG courses." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Conflicting Expectations",
        dilemma: "A student feels career choice panic but is terrified to tell their parents.",
        options: [
          { id: "a", label: "Tell them to ignore parent wishes.", insight: "Fails systemic family counseling. Increases student stress.", scores: { analytical: 3, creativity: 2, collaboration: 3, risk: 8 } },
          { id: "b", label: "Perform a role-play session to build boundary talk skills.", insight: "Excellent clinical practice. Builds confidence safely.", scores: { analytical: 10, creativity: 8, collaboration: 7, risk: 3 } },
          { id: "c", label: "Call parents directly to explain the student's panic.", insight: "Serious breach of client trust. Violates confidentiality.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } }
        ]
      },
      {
        id: "scene-2",
        title: "Self-Harm Disclosure",
        dilemma: "A client admits to minor self-harm, begging you not to inform their family.",
        options: [
          { id: "a", label: "Keep confidentiality to protect the therapeutic alliance.", insight: "Risks patient safety. Duty of care overrides confidentiality when self-harm is present.", scores: { analytical: 3, creativity: 1, collaboration: 3, risk: 10 } },
          { id: "b", label: "Assess risk level; co-create a safety contract and contact guardians.", insight: "Correct. Follows emergency safety compliance while limiting damage.", scores: { analytical: 10, creativity: 5, collaboration: 9, risk: 4 } },
          { id: "c", label: "Call emergency medical services immediately.", insight: "Overreaction if risk is low, can destroy therapeutic trust.", scores: { analytical: 6, creativity: 2, collaboration: 4, risk: 7 } }
        ]
      },
      {
        id: "scene-3",
        title: "Countertransference",
        dilemma: "A client's family issues mirror your own recent personal grief, affecting your focus.",
        options: [
          { id: "a", label: "Push through and continue sessions.", insight: "Risky. Can distort clinical diagnosis and empathy checks.", scores: { analytical: 2, creativity: 1, collaboration: 3, risk: 8 } },
          { id: "b", label: "Seek supervision and consider referring the client.", insight: "Correct ethical protocol. Ensures standard of care is met.", scores: { analytical: 10, creativity: 3, collaboration: 8, risk: 2 } },
          { id: "c", label: "Share your own grief details with the client.", insight: "Breaks clinical boundaries. Shifting focus to therapist is bad practice.", scores: { analytical: 1, creativity: 5, collaboration: 6, risk: 9 } }
        ]
      }
    ]
  },
  {
    id: "fashion-designer",
    title: "Fashion Designer",
    stream: "Arts",
    category: "Fashion & Design",
    shortDesc: "Design sketches, select fabrics, and coordinate apparel manufacturing lines.",
    longDesc: "Fashion designers research apparel trends, draw sketches, test fabric drapes, draft patterns, and coordinate manufacturing factories to publish clothing ranges.",
    salary: { entry: "₹3.5 - 7 LPA", mid: "₹8 - 15 LPA", senior: "₹20 - 45+ LPA", entryVal: 5.25, midVal: 11.5, seniorVal: 32.5 },
    growthRate: "+9% YoY",
    demandLevel: "Moderate",
    typicalRoles: ["Apparel Designer", "Textile Designer", "Creative Director"],
    hardSkills: ["CAD Design", "Fabric Science", "Garment Stitching", "Color Styling"],
    softSkills: ["Trend Analysis", "Aesthetic Vision", "Supplier Sync", "Creative Storytelling"],
    educationPath: {
      highSchoolSubjects: "Arts / Design Stream (Fashion Studies, Fine Arts helpful)",
      degrees: ["B.Des in Fashion Design", "Diploma in Apparel Design"],
      entranceExams: ["NIFT", "NID DAT", "UCEED"],
      certifications: ["Adobe Illustrator for Apparel", "Sustainable Sourcing Certified"],
      alternatePaths: "Starting a custom boutique, launching online retail lines, or working as a fashion illustrator."
    },
    aiImpact: {
      automationRisk: 30,
      level: "Medium",
      summary: "AI creates visual mockups from prompt inputs. Fashion designers will transition to drape fitting, fabric choice, and brand storytelling.",
      strategy: "Focus on sustainable fabric selection and structural fitting."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Moodboard Design", details: "Sketch style color concepts for spring release." },
      { time: "02:00 PM", activity: "Drape Check", details: "Fit fabric styles on dress form dummy." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Fine Arts / Design Stream", details: "Build drawing portfolio. Study apparel histories and stitching." },
      { stage: "College / Training", action: "B.Des Fashion Degree", details: "Master CAD tools, pattern cuts, fabric science, and intern at design houses." },
      { stage: "Entry-Level Job", action: "Assistant Designer", details: "Prepare technical files, check fabric dye quality, and sketch details." },
      { stage: "Senior Leadership", action: "Creative Director", details: "Formulate entire brand catalogs, manage fashion runs, and direct marketing campaigns." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Dull Hemp Drape",
        dilemma: "Sustainable hemp fabric sourced for a client dress looks dull and lacks drape flow.",
        options: [
          { id: "a", label: "Use silk instead, bypassing sustainable scope.", insight: "Breaks client trust. Fails eco-friendly guidelines.", scores: { analytical: 3, creativity: 2, collaboration: 3, risk: 8 } },
          { id: "b", label: "Blend hemp with Tencel to increase drape softness.", insight: "Excellent textile choices. Retains green profile and drape.", scores: { analytical: 10, creativity: 10, collaboration: 6, risk: 3 } },
          { id: "c", label: "Deliver the dull hemp as-is.", insight: "Unprofessional. Drape looks bad for red-carpet launch.", scores: { analytical: 5, creativity: 1, collaboration: 3, risk: 5 } }
        ]
      },
      {
        id: "scene-2",
        title: "Production Color Shift",
        dilemma: "A factory run of your apparel shows a slight color shift compared to design sheets.",
        options: [
          { id: "a", label: "Reject the entire batch; demand reproduction.", insight: "Ensures quality, but delays collection launch by 6 weeks.", scores: { analytical: 8, creativity: 2, collaboration: 4, risk: 5 } },
          { id: "b", label: "Pivot branding; market the shift as an exclusive limited color.", insight: "Creative startup agility. Turns defect into marketing.", scores: { analytical: 7, creativity: 10, collaboration: 7, risk: 8 } },
          { id: "c", label: "Accept the batch silently.", insight: "Risks customer complaints and reviews.", scores: { analytical: 4, creativity: 4, collaboration: 2, risk: 8 } }
        ]
      },
      {
        id: "scene-3",
        title: "Trend Shift",
        dilemma: "Mid-production, market reports show neon accents are out; pastels are now in demand.",
        options: [
          { id: "a", label: "Discard neon designs, redesigning on pastels.", insight: "High cost. Causes budget overrun and delays.", scores: { analytical: 4, creativity: 7, collaboration: 5, risk: 9 } },
          { id: "b", label: "Keep cuts, but replace detailing prints with soft pastels.", insight: "Balanced pivot. Redesign accents without high costs.", scores: { analytical: 9, creativity: 8, collaboration: 7, risk: 4 } },
          { id: "c", label: "Proceed with neon line anyway.", insight: "Lacks customer trend sync. Can lead to unsold inventory.", scores: { analytical: 6, creativity: 2, collaboration: 3, risk: 6 } }
        ]
      }
    ]
  },
  {
    id: "chef",
    title: "Culinary Chef",
    stream: "Vocational",
    category: "Hospitality",
    shortDesc: "Design recipes, scale restaurant menus, and manage kitchen staff service.",
    longDesc: "Chefs oversee menu planning, food safety, recipe engineering, cooking methods, plating aesthetics, and fast-paced kitchen pacing.",
    salary: { entry: "₹3 - 5 LPA", mid: "₹6 - 12 LPA", senior: "₹15 - 35+ LPA", entryVal: 4, midVal: 9, seniorVal: 25 },
    growthRate: "+14% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Commis Chef", "Sous Chef", "Chef de Cuisine", "Food Stylist"],
    hardSkills: ["Knife Craft", "Cooking Methods", "HACCP Safety", "Menu Costing", "Kitchen Operations"],
    softSkills: ["Team Pacing", "Kitchen Leadership", "Flavor Harmony", "Stamina"],
    educationPath: {
      highSchoolSubjects: "Any Stream (Hotel Management courses in high school helpful)",
      degrees: ["B.Sc. in Culinary Arts", "Diploma in Food Production"],
      entranceExams: ["NCHMCT JEE (for HM degrees)"],
      certifications: ["Food Safety (HACCP) Certified", "First Aid Certified"],
      alternatePaths: "Working as a kitchen helper, prep cook, and climbing the ranks through apprentice work."
    },
    aiImpact: {
      automationRisk: 10,
      level: "Low",
      summary: "AI systems suggest ingredient pairings, but physical taste adjustments and fast kitchen leadership require humans.",
      strategy: "Develop recipe signature styles and kitchen accounting skills."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Vendor Sourcing", details: "Inspect fish arrivals from market." },
      { time: "07:00 PM", activity: "Dinner Rush Service", details: "Pace order plates in high-volume kitchen." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Agnostic Stream", details: "Study home science. Practice knife work and food safety basics." },
      { stage: "College / Training", action: "Culinary Degree", details: "Learn food chemistry, pastry, safety codes, and complete hotel internships." },
      { stage: "Entry-Level Job", action: "Commis Chef", details: "Chop vegetables, prepare prep stations, and clean cooking grids." },
      { stage: "Senior Leadership", action: "Executive Chef", details: "Engineer menu costs, direct staff lines, and run restaurant food styles." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Dinnertime Shortage",
        dilemma: "A key ingredient for your signature dish runs out during Friday night dinner service.",
        options: [
          { id: "a", label: "Apologize and cancel the dish for the evening.", insight: "Honest, but disappoints diners and loses revenue.", scores: { analytical: 4, creativity: 1, collaboration: 5, risk: 2 } },
          { id: "b", label: "Create a special alternate dish using kitchen assets.", insight: "Agile chef move. Turns a shortage into a chef's special.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 7 } },
          { id: "c", label: "Use a frozen, low-quality substitute.", insight: "Compromises kitchen food codes. Ruins reputation.", scores: { analytical: 2, creativity: 3, collaboration: 2, risk: 10 } }
        ]
      },
      {
        id: "scene-2",
        title: "Cold Food Complaint",
        dilemma: "A critical food critic sends back their steak, complaining it is undercooked.",
        options: [
          { id: "a", label: "Flash-fry the same steak and send it back.", insight: "Lazy and bad practice. Dries the meat and looks cheap.", scores: { analytical: 2, creativity: 1, collaboration: 3, risk: 8 } },
          { id: "b", label: "Personally cook a new cut and present it with an apology.", insight: "Ideal customer service. Restores reputation.", scores: { analytical: 8, creativity: 7, collaboration: 10, risk: 3 } },
          { id: "c", label: "Argue that the temperature is correct for this cut.", insight: "Arrogant, alienates critics and diners.", scores: { analytical: 4, creativity: 2, collaboration: 2, risk: 9 } }
        ]
      },
      {
        id: "scene-3",
        title: "Staffing Crisis",
        dilemma: "Your primary sous chef falls ill on the morning of a major corporate banquet.",
        options: [
          { id: "a", label: "Reduce menu complexity.", insight: "Decreases ticket load but may violate banquet agreements.", scores: { analytical: 7, creativity: 4, collaboration: 5, risk: 3 } },
          { id: "b", label: "Delegate stations to line cooks, stepping in to expedite.", insight: "Kitchen leadership. Promotes line cooks and runs service.", scores: { analytical: 8, creativity: 8, collaboration: 10, risk: 6 } },
          { id: "c", label: "Demand the sick chef report to work.", insight: "Food safety violation. Unethical and unsafe for cooking lines.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } }
        ]
      }
    ]
  },
  {
    id: "content-creator",
    title: "Content Creator",
    stream: "Vocational",
    category: "Media",
    shortDesc: "Produce video formats, write scripts, edit media, and build sponsorships.",
    longDesc: "Content Creators manage digital media channels. They storyboard videos, record footage, edit sound tracks, manage algorithm distributions, and coordinate sponsor deals.",
    salary: { entry: "₹2.5 - 6 LPA", mid: "₹8 - 18 LPA", senior: "₹22 - 50+ LPA", entryVal: 4.25, midVal: 13, seniorVal: 36 },
    growthRate: "+28% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Video Producer", "Brand Editor", "Creative Strategist"],
    hardSkills: ["Video Editing", "Sound Design", "SEO / Metadata", "Camera Tech", "Analytics"],
    softSkills: ["Storytelling", "Consistency", "Audience Empathy", "Adaptability"],
    educationPath: {
      highSchoolSubjects: "Any Stream (Media, English, Mass Comm courses helpful)",
      degrees: ["B.A. in Mass Communication", "Diploma in Digital Media", "Self-taught portfolio"],
      entranceExams: ["None (Publishing portfolio matters)"],
      certifications: ["Premiere Pro Certified Professional", "Google Analytics Certified"],
      alternatePaths: "Building a personal YouTube channel, TikTok account, or digital podcast network."
    },
    aiImpact: {
      automationRisk: 45,
      level: "High",
      summary: "AI creates voiceovers and rough script drafts instantly. Human connection, personality, and community trust are critical.",
      strategy: "Leverage AI tools to speed up editing; focus on unique perspective."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Scriptwriting", details: "Storyboard next video concept." },
      { time: "02:00 PM", activity: "Editing Session", details: "Sync audio keys in editing software." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Agnostic Stream", details: "Learn video editing, storytelling, and study platform algorithms." },
      { stage: "College / Training", action: "Mass Comm Degree / Portfolio", details: "Launch channels, create micro-content, and study brand integrations." },
      { stage: "Entry-Level Job", action: "Junior Video Editor / Creator", details: "Cut raw footage, write thumbnails, and compile analytics stats." },
      { stage: "Senior Leadership", action: "Creative Studio Founder", details: "Manage multi-channel brand assets, license avatar profiles, and direct media teams." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Shady Sponsor Deal",
        dilemma: "A high-paying sponsor wants you to promote a financial app with bad user reviews.",
        options: [
          { id: "a", label: "Accept to secure cash flow.", insight: "Ruins long-term viewer trust. Audience is the core asset.", scores: { analytical: 2, creativity: 3, collaboration: 3, risk: 10 } },
          { id: "b", label: "Reject the sponsorship to protect trust.", insight: "Correct creator ethics. Retains long-term channel health.", scores: { analytical: 10, creativity: 5, collaboration: 6, risk: 2 } },
          { id: "c", label: "Accept but add a disclaimer that you don't recommend it.", insight: "Contradictory and violates typical sponsor contracts.", scores: { analytical: 4, creativity: 4, collaboration: 4, risk: 8 } }
        ]
      },
      {
        id: "scene-2",
        title: "Algorithm Drop",
        dilemma: "Platform updates drop your search view counts by 40%.",
        options: [
          { id: "a", label: "Copy hot trending formats immediately.", insight: "Temporarily helps but dilutes original channel style.", scores: { analytical: 4, creativity: 7, collaboration: 5, risk: 8 } },
          { id: "b", label: "Audit retention graphs; optimize thumbnails.", insight: "Data-driven response. Improves organic CTR.", scores: { analytical: 10, creativity: 5, collaboration: 6, risk: 3 } },
          { id: "c", label: "Publish a video complaining about the platform.", insight: "Fails to solve technical drop; annoys viewers.", scores: { analytical: 2, creativity: 3, collaboration: 4, risk: 6 } }
        ]
      },
      {
        id: "scene-3",
        title: "Burnout Crisis",
        dilemma: "Weekly upload deadlines are causing severe creator burnout.",
        options: [
          { id: "a", label: "Stop uploads completely for 2 months.", insight: "Cures burnout but can kill algorithmic recommendations.", scores: { analytical: 5, creativity: 2, collaboration: 3, risk: 9 } },
          { id: "b", label: "Transition to seasonal formats; delegate edits.", insight: "Smart production scaling. Protects mental health.", scores: { analytical: 9, creativity: 8, collaboration: 9, risk: 4 } },
          { id: "c", label: "Increase upload speed to outpace stress.", insight: "High collapse risk. Quality and mental health drop.", scores: { analytical: 1, creativity: 1, collaboration: 2, risk: 10 } }
        ]
      }
    ]
  },
  {
    id: "biotech-researcher",
    title: "Biotech Researcher",
    stream: "Science",
    category: "Science & Space",
    shortDesc: "Conduct genetic sequencing, study cells, and formulate vaccines or bio-fuels.",
    longDesc: "Biotech Researchers manipulate biological processes in laboratories to solve medical, agricultural, and environmental issues, working with gene tools like CRISPR.",
    salary: { entry: "₹4.5 - 8 LPA", mid: "₹9 - 18 LPA", senior: "₹22 - 50+ LPA", entryVal: 6.25, midVal: 13.5, seniorVal: 36 },
    growthRate: "+15% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Biotech Analyst", "Research Scientist", "Lab Supervisor"],
    hardSkills: ["PCR / Gene Assays", "Cell Culture", "Bioinformatics", "HPLC Chromatography"],
    softSkills: ["Methodical Logic", "Observation", "Patience", "Ethics"],
    educationPath: {
      highSchoolSubjects: "Science Stream (Physics, Chemistry, Biology - PCB)",
      degrees: ["B.Tech / B.Sc. in Biotechnology", "M.Tech / M.Sc. in Biotech", "Ph.D. for senior research"],
      entranceExams: ["GAT-B", "IIT JAM Biotech", "CSIR NET"],
      certifications: ["GLP (Good Laboratory Practice) Certified", "Clinical Trial Auditor"],
      alternatePaths: "Quality control manager in pharmaceutical units or bio-data analyst."
    },
    aiImpact: {
      automationRisk: 15,
      level: "Low",
      summary: "AI systems analyze gene matches fast, but physical lab culture checks and assay validations need researchers.",
      strategy: "Learn Python for bioinformatics data interpretation."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Cell Culture Audit", details: "Examine petri plate developments." },
      { time: "02:00 PM", activity: "Sequencing Analysis", details: "Analyze genetic match charts on screen." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCB Stream", details: "Study Biology and Chemistry. Volunteer in high school lab projects." },
      { stage: "College / Training", action: "Biotech Degree", details: "Master molecular biology, cell cloning, bioinformatics tools, and write research papers." },
      { stage: "Entry-Level Job", action: "Research Assistant", details: "Maintain laboratory inventory, run PCR assays, and log results charts." },
      { stage: "Senior Leadership", action: "Principal Investigator", details: "Direct research departments, secure grants, and publish clinical trials." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "CRISPR Off-Target Cut",
        dilemma: "Your gene editing tests show off-target cuts that could cause toxic mutations.",
        options: [
          { id: "a", label: "Publish findings immediately claiming success anyway.", insight: "Serious research fraud. Will ruin career when checked.", scores: { analytical: 1, creativity: 2, collaboration: 2, risk: 10 } },
          { id: "b", label: "Halt tests; troubleshoot guide RNA sequences.", insight: "Correct scientific method. Focuses on trial safety.", scores: { analytical: 10, creativity: 5, collaboration: 5, risk: 2 } },
          { id: "c", label: "Ignore results and move to animal trials.", insight: "Unethical. Breaks biosafety regulations.", scores: { analytical: 3, creativity: 4, collaboration: 2, risk: 9 } }
        ]
      },
      {
        id: "scene-2",
        title: "Contamination Crisis",
        dilemma: "A minor seal breach is logged in your stem-cell incubator vault.",
        options: [
          { id: "a", label: "Discard the batch; sanitize the incubator.", insight: "Standard protocol. Prevents corrupting future research.", scores: { analytical: 10, creativity: 2, collaboration: 6, risk: 2 } },
          { id: "b", label: "Test the batch; proceed if tests look normal.", insight: "Risky. Minor latent contamination might not show in fast checks.", scores: { analytical: 6, creativity: 5, collaboration: 3, risk: 7 } },
          { id: "c", label: "Cover up the log alert to protect timelines.", insight: "Bio-safety violation. Invalidates entire research catalog.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } }
        ]
      },
      {
        id: "scene-3",
        title: "Funding Pressure",
        dilemma: "A corporate sponsor wants you to adjust data charts to show high efficiency.",
        options: [
          { id: "a", label: "Adjust charts as requested to protect laboratory funding.", insight: "Fails academic integrity. Deconstructs trust in biotech.", scores: { analytical: 2, creativity: 3, collaboration: 2, risk: 10 } },
          { id: "b", label: "Publish the raw, less-efficient data honestly.", insight: "Correct. Ethical validation preserves long-term authority.", scores: { analytical: 10, creativity: 4, collaboration: 8, risk: 3 } },
          { id: "c", label: "Withhold the publication; delay to get better results.", insight: "Bridges interest. Buys time to research efficiency fixes.", scores: { analytical: 8, creativity: 7, collaboration: 5, risk: 5 } }
        ]
      }
    ]
  },
  {
    id: "architect",
    title: "Architect",
    stream: "Science",
    category: "Arts & Design",
    shortDesc: "Design buildings, blueprints, and sustainable urban layouts.",
    longDesc: "Architects combine engineering logic and aesthetics to draft, simulate, and supervise the construction of homes, offices, and green spaces.",
    salary: { entry: "₹4 - 7 LPA", mid: "₹10 - 16 LPA", senior: "₹25 - 45+ LPA", entryVal: 5, midVal: 13, seniorVal: 35 },
    growthRate: "+12% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Junior Architect", "Project Architect", "Urban Designer", "BIM Coordinator"],
    hardSkills: ["AutoCAD / Revit", "BIM Modeling", "Structural Physics", "Sustainability Design", "Blueprint Drafting"],
    softSkills: ["Spatial Reasoning", "Aesthetic Vision", "Client Communication", "Attention to Detail"],
    educationPath: {
      highSchoolSubjects: "Science Stream with Math (Physics, Chemistry, Math - PCM)",
      degrees: ["B.Arch (Bachelor of Architecture)", "M.Arch (Master of Architecture)"],
      entranceExams: ["NATA (National Aptitude Test in Architecture)", "JEE Main Paper 2"],
      certifications: ["Council of Architecture (COA) Registration", "LEED Green Associate"],
      alternatePaths: "Starting as a CAD Drafter or interior design modeler."
    },
    aiImpact: {
      automationRisk: 22,
      level: "Low",
      summary: "AI generates fast layout mockups, but structural safety approvals, regional building codes, and client adjustments require human supervision.",
      strategy: "Leverage AI tools for fast 3D prototyping and focus on client curation and structural safety details."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:30 AM", activity: "Site Inspection", details: "Review concrete pouring levels at a commercial project." },
      { time: "02:00 PM", activity: "CAD Layout Draft", details: "Adjust BIM model files according to client ventilation requests." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCM Stream + Sketching", details: "Study Physics, Chemistry, and Math. Practice sketching and spatial logic." },
      { stage: "College / Training", action: "B.Arch Professional Degree", details: "Master Revit/AutoCAD, complete a 6-month office internship, and submit a thesis portfolio." },
      { stage: "Entry-Level Job", action: "Junior Architect", details: "Draft site plans, compile structural specifications, and coordinate municipal safety permits." },
      { stage: "Senior Leadership", action: "Principal Architect / Partner", details: "Lead design competitions, sign structural blueprints, and manage multi-crore building accounts." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "The Eco-Material Dilemma",
        dilemma: "A client wants to cut costs by substituting certified sustainable materials with generic materials while retaining 'Green Certified' branding.",
        options: [
          { id: "a", label: "Use high-cost eco-materials and hold firm.", insight: "Ethical choice. Preserves project credibility but strains client budgets.", scores: { analytical: 10, creativity: 3, collaboration: 5, risk: 2 } },
          { id: "b", label: "Substitute with generic materials; greenwash the reporting.", insight: "Highly unethical. Risks COA license cancellation if audited.", scores: { analytical: 2, creativity: 4, collaboration: 1, risk: 10 } },
          { id: "c", label: "Redesign the spatial layout to maximize natural light/airflow instead.", insight: "Highly creative. Achieves green compliance through design, saving material budgets.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "Historic Facade Conflict",
        dilemma: "Municipal codes request you preserve a 100-year-old brick facade, but it restricts modern load-bearing columns.",
        options: [
          { id: "a", label: "Demolish the facade and pay the municipal penalty.", insight: "Violates historical preservation values and gets negative publicity.", scores: { analytical: 5, creativity: 2, collaboration: 3, risk: 9 } },
          { id: "b", label: "Integrate old bricks as an aesthetic veneer over steel columns.", insight: "Superb creative compromise. Blends history and structural engineering.", scores: { analytical: 8, creativity: 10, collaboration: 6, risk: 4 } },
          { id: "c", label: "Petition the city council to lift the preservation rule.", insight: "Takes months of bureaucracy; delays project timeline.", scores: { analytical: 6, creativity: 4, collaboration: 9, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Structural Load Deficit",
        dilemma: "Engineers find the top roof deck load exceeds safe weight limits by 15%. What is your fix?",
        options: [
          { id: "a", label: "Add support pillars, breaking up open interior floor plans.", insight: "Safe but compromises interior architectural aesthetics.", scores: { analytical: 10, creativity: 2, collaboration: 6, risk: 2 } },
          { id: "b", label: "Switch to lightweight structural carbon fiber beams.", insight: "Innovative materials choice. Keeps floor plan open but raises costs.", scores: { analytical: 8, creativity: 9, collaboration: 5, risk: 6 } },
          { id: "c", label: "Proceed as planned; claim margin of safety handles it.", insight: "Extremely dangerous. Threatens catastrophic building failure.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } }
        ]
      }
    ]
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    stream: "Commerce",
    category: "Media & Marketing",
    shortDesc: "Manage digital ad spends, viral social media campaigns, SEO and analytics.",
    longDesc: "Digital Marketers design, execute, and analyze internet campaign systems to grow brand awareness and customer conversion rates across search engines, social media, and newsletters.",
    salary: { entry: "₹3.5 - 6 LPA", mid: "₹8 - 15 LPA", senior: "₹20 - 45+ LPA", entryVal: 4.5, midVal: 11, seniorVal: 32 },
    growthRate: "+18% YoY",
    demandLevel: "High",
    typicalRoles: ["SEO Specialist", "Social Media Manager", "Performance Marketer", "Marketing Director"],
    hardSkills: ["Google Ads / Meta Ads", "Google Analytics", "SEO & Copywriting", "A/B Testing", "Email Marketing Tools"],
    softSkills: ["Consumer Psychology", "Data Interpretation", "Creative Storytelling", "Fast Adaptation"],
    educationPath: {
      highSchoolSubjects: "Commerce or Arts stream recommended (Maths/Economics helpful)",
      degrees: ["BBA in Marketing", "B.Com / B.A. in Media Studies", "MBA in Marketing (For leadership)"],
      entranceExams: ["CUET (For BBA/B.Com)", "CAT / XAT (For PG management)"],
      certifications: ["Google Ads Certification", "HubSpot Content Marketing", "Meta Certified Media Buyer"],
      alternatePaths: "Freelancing as a social media coordinator or writing marketing copies to build a case-study portfolio."
    },
    aiImpact: {
      automationRisk: 38,
      level: "Medium",
      summary: "AI automates ad copy variations and customer segment tagging, but marketing campaign strategy, brand voice alignment, and emotional storytelling require human oversight.",
      strategy: "Leverage AI generators for rapid brainstorming, and specialize in high-level brand strategy and data modeling."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:30 AM", activity: "Dashboard Audit", details: "Review cost-per-click metrics across active Google and Meta campaigns." },
      { time: "03:00 PM", activity: "Creative Brainstorm", details: "Draft copywriting concepts and script storyboard layouts for viral ads." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Agnostic Stream", details: "Practice storytelling, basic copywriting, and study internet video trends." },
      { stage: "College / Training", action: "Marketing BBA / B.Com", details: "Complete Google Certifications, run low-budget personal blogs, and land growth internships." },
      { stage: "Entry-Level Job", action: "SEO or Ads Associate", details: "Configure tracking pixels, adjust daily budgets, write ad copy, and log analytics." },
      { stage: "Senior Leadership", action: "Chief Marketing Officer (CMO)", details: "Manage global marketing budgets, direct brand strategy, and coordinate creative agencies." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "The Influencer Scandal",
        dilemma: "A key brand influencer gets caught in a major controversy on the day of a massive product launch.",
        options: [
          { id: "a", label: "Terminate contract immediately and pull all campaigns.", insight: "Protects brand safety but loses initial marketing momentum and campaign assets.", scores: { analytical: 10, creativity: 3, collaboration: 5, risk: 2 } },
          { id: "b", label: "Capitalize on the viral attention with a funny, self-aware ad pivot.", insight: "High risk, high reward. Can save the campaign or trigger secondary backlash.", scores: { analytical: 3, creativity: 10, collaboration: 4, risk: 10 } },
          { id: "c", label: "Pause campaigns silently; release a generic PR statement tomorrow.", insight: "Safe, boring compromise. Minimizes damage but fails to save launch momentum.", scores: { analytical: 6, creativity: 4, collaboration: 8, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "Ad Channel Algorithm Lockout",
        dilemma: "A privacy update locks tracking data, causing cost-per-acquisition to spike by 60% on Meta ads.",
        options: [
          { id: "a", label: "Transition marketing budgets to Google Search context-native ads.", insight: "Data-driven pivot. Focuses on intent-based channels where tracking is less critical.", scores: { analytical: 10, creativity: 4, collaboration: 5, risk: 4 } },
          { id: "b", label: "Keep current ad budgets; hope algorithms calibrate in a month.", insight: "Very risky. Burns client ad spend without proof of stability.", scores: { analytical: 2, creativity: 2, collaboration: 4, risk: 10 } },
          { id: "c", label: "Build an organic email/SMS list to market directly to users.", insight: "Excellent customer strategy. Reduces reliance on paid ad platforms long term.", scores: { analytical: 8, creativity: 8, collaboration: 9, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Underperforming Ad Audit",
        dilemma: "A client's e-commerce ad campaign generates high traffic but zero checkouts. What is your fix?",
        options: [
          { id: "a", label: "Increase ad budgets to push more volume.", insight: "Flawed logic. Pushing more traffic to a broken checkout path wasting capital.", scores: { analytical: 2, creativity: 2, collaboration: 2, risk: 9 } },
          { id: "b", label: "Audit the website landing page; simplify the checkout form.", insight: "Correct CRO method. Solves conversion blockage on site.", scores: { analytical: 10, creativity: 6, collaboration: 7, risk: 2 } },
          { id: "c", label: "Rewrite the creative ads to appeal to premium buyers.", insight: "Attempts creative fix, but won't solve technical checkout bugs.", scores: { analytical: 5, creativity: 9, collaboration: 5, risk: 5 } }
        ]
      }
    ]
  },
  {
    id: "teacher",
    title: "School Educator",
    stream: "Arts",
    category: "Education",
    shortDesc: "Inspire students, structure lesson plans, and audit academic performances.",
    longDesc: "Teachers design lesson curricula, tutor classes, evaluate student progress, and guide personal growth, adapting styles to different learning paces.",
    salary: { entry: "₹3 - 5 LPA", mid: "₹6 - 10 LPA", senior: "₹12 - 20 LPA", entryVal: 3.5, midVal: 8, seniorVal: 15 },
    growthRate: "+10% YoY",
    demandLevel: "Moderate",
    typicalRoles: ["TGT Teacher", "PGT Teacher", "Curriculum Specialist", "School Principal"],
    hardSkills: ["Lesson Planning", "Subject Pedagogy", "LMS Tools", "Student Evaluation", "Child Psychology"],
    softSkills: ["Public Speaking", "Patience", "Empathy", "Conflict Resolution"],
    educationPath: {
      highSchoolSubjects: "Any stream (Science/Arts/Commerce) based on target teaching subject",
      degrees: ["B.Ed (Bachelor of Education)", "B.A. / B.Sc. + B.Ed Integrated", "M.A. / M.Sc. in teaching subject"],
      entranceExams: ["CTET (Central Teacher Eligibility Test)", "State TETs"],
      certifications: ["Google Certified Educator", "TESOL/TEFL (for English teaching)"],
      alternatePaths: "Working as an online tutor or subject matter expert on ed-tech platforms."
    },
    aiImpact: {
      automationRisk: 15,
      level: "Low",
      summary: "AI systems draft syllabus ideas and customize tests, but child counseling, classroom management, and human mentorship cannot be automated.",
      strategy: "Leverage AI to grade papers and plan outlines, dedicating class hours to student mentorship and debates."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "08:00 AM", activity: "Morning Lecture", details: "Teach Grade 11 literature analysis or algebra." },
      { time: "01:30 PM", activity: "Paper Grading", details: "Review exam submissions and document feedback marks." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Agnostic Stream", details: "Develop deep subject interest. Practice presenting to family." },
      { stage: "College / Training", action: "B.Ed Professional Degree", details: "Complete a teaching internship, master pedagogy theories, and clear TET tests." },
      { stage: "Entry-Level Job", action: "School Teacher", details: "Design lesson plans, manage student assemblies, and lead parent-teacher meetings." },
      { stage: "Senior Leadership", action: "Principal / Academic Director", details: "Oversee school budgets, coordinate teacher training, and lead curriculum design." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Tech Disruption in Class",
        dilemma: "You notice multiple students using AI tools to write their essays instead of doing research.",
        options: [
          { id: "a", label: "Ban AI tools completely and handwrite all future essays.", insight: "Safe for verifying original work, but fails to prepare students for the modern tech world.", scores: { analytical: 8, creativity: 1, collaboration: 3, risk: 2 } },
          { id: "b", label: "Integrate AI; teach them to write prompts and verify facts.", insight: "Highly progressive. Teaches critical thinking and tech coexistence.", scores: { analytical: 8, creativity: 10, collaboration: 5, risk: 7 } },
          { id: "c", label: "Run a group debate on the ethics of AI vs Human writers.", insight: "Engaging and collaborative. Focuses on peer discussions and expression.", scores: { analytical: 5, creativity: 7, collaboration: 10, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "The Disengaged Student",
        dilemma: "A bright student is failing your class and refuses to submit homework due to lack of interest.",
        options: [
          { id: "a", label: "Assign extra homework and log detentions.", insight: "Punitive, usually fails to address the root cause and alienates the student.", scores: { analytical: 4, creativity: 1, collaboration: 2, risk: 10 } },
          { id: "b", label: "Relate concepts to their hobby (e.g. video games, sports).", insight: "Creative pedagogy. Rekindles passion through personalized connection.", scores: { analytical: 6, creativity: 10, collaboration: 8, risk: 3 } },
          { id: "c", label: "Schedule a joint chat with school counselors and parents.", insight: "Collaborative and structured. Involves supportive systems.", scores: { analytical: 8, creativity: 4, collaboration: 9, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Standardized Exam Pressure",
        dilemma: "The administration pushes you to teach only rote exam drills, skipping experimental projects.",
        options: [
          { id: "a", label: "Follow the admin directive completely; drill exam papers.", insight: "Safe, helps exam scores but kills student critical thinking and joy of learning.", scores: { analytical: 10, creativity: 2, collaboration: 5, risk: 1 } },
          { id: "b", label: "Run creative hands-on experiments; squeeze drill prep into homework.", insight: "Creative compromise. Protects learning depth while meeting quotas.", scores: { analytical: 7, creativity: 10, collaboration: 6, risk: 6 } },
          { id: "c", label: "Coordinate with other teachers to request project hours.", insight: "Collaborative advocacy. Builds power in numbers.", scores: { analytical: 6, creativity: 5, collaboration: 10, risk: 4 } }
        ]
      }
    ]
  },
  {
    id: "pilot",
    title: "Commercial Pilot",
    stream: "Science",
    category: "Aviation",
    shortDesc: "Navigate aircraft systems, verify flight paths, and fly passengers/cargo safely.",
    longDesc: "Commercial Pilots check weather forecasts, configure flight control decks, coordinate with Air Traffic Control (ATC), and fly multi-engine aircraft under strict safety protocols.",
    salary: { entry: "₹15 - 20 LPA", mid: "₹25 - 40 LPA", senior: "₹50 - 90+ LPA", entryVal: 17, midVal: 32, seniorVal: 70 },
    growthRate: "+14% YoY",
    demandLevel: "High",
    typicalRoles: ["First Officer (Co-Pilot)", "Captain", "Flight Instructor", "Aviation Inspector"],
    hardSkills: ["Flight Navigation", "Meteorology / Weather Diagnostics", "Aerodynamics Logic", "Avionics Systems Control", "Aircraft Systems"],
    softSkills: ["Spatial Awareness", "Crisis Management", "Crew Resource Management (CRM)", "Instant Decisiveness"],
    educationPath: {
      highSchoolSubjects: "Science Stream with Physics & Math (PCM) mandatory",
      degrees: ["Commercial Pilot License (CPL) from flying academy", "B.Sc. in Aviation (Optional)"],
      entranceExams: ["IGRUA Entrance Exam", "DGCA Theory Papers (Navigation, Meteor)"],
      certifications: ["Class 1 Medical Fitness Certificate", "Radio Telephony License (RTR-A)"],
      alternatePaths: "Joining the Indian Air Force (IAF) and converting to commercial pilot later."
    },
    aiImpact: {
      automationRisk: 25,
      level: "Medium",
      summary: "Autopilot manages cruise flights, but unpredictable storm cells, emergency landings, and cabin crisis management require human pilots.",
      strategy: "Focus on Crew Resource Management, simulator trainings, and extreme weather navigation."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "06:00 AM", activity: "Pre-Flight Briefing", details: "Review weather forecasts, fuel requirements, and flight logs." },
      { time: "08:30 AM", activity: "Flight Takeoff", details: "Pilot Boeing or Airbus aircraft out of international runways." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "PCM Stream (Mandatory)", details: "Study Physics and Math. Clear DGCA medical fitness checks." },
      { stage: "College / Training", action: "CPL License Course", details: "Register at a flight school, clear 5 DGCA exams, and log 200 flying hours." },
      { stage: "Entry-Level Job", action: "First Officer (Co-Pilot)", details: "Complete specific aircraft type rating and manage cockpit checklists." },
      { stage: "Senior Leadership", action: "Flight Captain / Commander", details: "Direct flights, authorize emergency protocols, and manage crew schedules." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Weather vs Fuel Lockout",
        dilemma: "A massive storm cell blocks your destination runway. You have only 45 minutes of reserve fuel remaining.",
        options: [
          { id: "a", label: "Hold in holding pattern; wait for storm clearance.", insight: "Extremely risky. Reserve fuel can deplete fast if storm lingers.", scores: { analytical: 4, creativity: 2, collaboration: 3, risk: 10 } },
          { id: "b", label: "Divert to alternate airport immediately.", insight: "Safe, correct aviation decision. Preserves safety margins.", scores: { analytical: 10, creativity: 4, collaboration: 6, risk: 2 } },
          { id: "c", label: "Declare a priority landing; attempt storm runway approach.", insight: "High risk. Storm turbulence can cause a crash.", scores: { analytical: 2, creativity: 6, collaboration: 2, risk: 10 } }
        ]
      },
      {
        id: "scene-2",
        title: "Instrument Failure",
        dilemma: "Your primary electronic flight instruments go black during climb-out through thick cloud cover.",
        options: [
          { id: "a", label: "Crosscheck data with backup analog mechanics.", insight: "Correct procedure. Verifies attitude and airspeed.", scores: { analytical: 10, creativity: 3, collaboration: 5, risk: 3 } },
          { id: "b", label: "Disengage autopilot; hand-fly by instinct.", insight: "Can cause spatial disorientation in clouds. Risky.", scores: { analytical: 3, creativity: 6, collaboration: 3, risk: 9 } },
          { id: "c", label: "Delegate instruments diagnostics to Co-Pilot.", insight: "Excellent CRM. Share the cognitive workload.", scores: { analytical: 8, creativity: 5, collaboration: 10, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Medical Crisis in Cabin",
        dilemma: "Cabin crew reports a passenger has collapsed with heart attack symptoms over the ocean.",
        options: [
          { id: "a", label: "Continue flight to target destination (2 hours away).", insight: "Risks passenger life to maintain schedules.", scores: { analytical: 3, creativity: 1, collaboration: 3, risk: 10 } },
          { id: "b", label: "Divert to nearest coastal airport (40 mins away).", insight: "Correct decision. Human life is priority. Coordinates diversion with ATC.", scores: { analytical: 10, creativity: 4, collaboration: 7, risk: 4 } },
          { id: "c", label: "Query passengers for doctors; coordinate cabin aid.", insight: "Good initial action, but doesn't replace the need for airport diversion.", scores: { analytical: 6, creativity: 6, collaboration: 10, risk: 5 } }
        ]
      }
    ]
  },
  {
    id: "journalist",
    title: "Journalist",
    stream: "Arts",
    category: "Media",
    shortDesc: "Investigate stories, interview subjects, and write editorial reports.",
    longDesc: "Journalists research news events, interview public figures, write articles or broadcast scripts, and verify sources to report facts honestly.",
    salary: { entry: "₹3 - 5 LPA", mid: "₹7 - 12 LPA", senior: "₹16 - 30 LPA", entryVal: 4, midVal: 9.5, seniorVal: 23 },
    growthRate: "+8% YoY",
    demandLevel: "Moderate",
    typicalRoles: ["Reporter", "Sub-Editor", "News Anchor", "Investigative Journalist"],
    hardSkills: ["Reporting", "Copywriting", "Source Verification", "Media Law", "Video Editing"],
    softSkills: ["Curiosity", "Grit", "Active Listening", "Objectivity"],
    educationPath: {
      highSchoolSubjects: "Arts or Commerce stream recommended (English/History helpful)",
      degrees: ["B.A. in Journalism & Mass Communication", "Diploma in Broadcast Media"],
      entranceExams: ["CUET (for central mass comm degrees)"],
      certifications: ["Certified Media Professional", "Advanced Video Editing Certificate"],
      alternatePaths: "Publishing articles on personal substacks, medium blogs, or local news portals."
    },
    aiImpact: {
      automationRisk: 42,
      level: "Medium",
      summary: "AI drafts summaries and basic earnings news, but original investigations, street interviews, and boots-on-the-ground reporting require human integrity.",
      strategy: "Leverage AI to transcribe audios and check edits; specialize in local investigative columns."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Source Check", details: "Call local government logs to verify municipal budget shifts." },
      { time: "02:00 PM", activity: "Beat Reporting", details: "Interview civic society leads regarding local environmental drops." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Agnostic Stream", details: "Write school essays, run student magazines, and read global news outlets." },
      { stage: "College / Training", action: "Mass Comm Degree / Portfolio", details: "Write for local campus blogs, publish interview clips, and intern at press bureaus." },
      { stage: "Entry-Level Job", action: "Associate Beat Reporter", details: "Write daily local logs, cover neighborhood meetings, and verify press releases." },
      { stage: "Senior Leadership", action: "Chief Bureau Editor", details: "Direct global news operations, verify high-priority leaks, and manage editorial teams." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "The Unverified Leak",
        dilemma: "An anonymous source leaks documents showing corruption in a local hospital group. The editor pushes to publish before competitors verify.",
        options: [
          { id: "a", label: "Publish the leak immediately to secure the headline.", insight: "Very risky. Defamation litigation risk if document facts prove false.", scores: { analytical: 2, creativity: 3, collaboration: 3, risk: 10 } },
          { id: "b", label: "Delay publication to check document signatures with a second source.", insight: "Ethical reporting. Prioritizes verify rules over rush headlines.", scores: { analytical: 10, creativity: 4, collaboration: 5, risk: 2 } },
          { id: "c", label: "Ask the hospital group PR team to comment before writing.", insight: "Standard balanced reporting, but gives them time to lock records.", scores: { analytical: 7, creativity: 6, collaboration: 8, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "The Litigation Threat",
        dilemma: "A corporate sponsor demands you pull down an investigative report detailing their chemical spill, threatening a defamation suit.",
        options: [
          { id: "a", label: "Retract the article immediately to avoid law risk.", insight: "Kills press integrity. Yields to corporate pressure.", scores: { analytical: 4, creativity: 1, collaboration: 2, risk: 9 } },
          { id: "b", label: "Refuse retraction; publish a follow-up document check.", insight: "Upholds public interest. Protects credibility with double-checks.", scores: { analytical: 10, creativity: 8, collaboration: 6, risk: 6 } },
          { id: "c", label: "Soften the wording in the article silently.", insight: "Weak compromise that compromises reporting ethics.", scores: { analytical: 5, creativity: 5, collaboration: 5, risk: 5 } }
        ]
      },
      {
        id: "scene-3",
        title: "Undercover Beat Safety",
        dilemma: "You are tracing local black-market electronics trade, and things get physically dangerous at a warehouse.",
        options: [
          { id: "a", label: "Withdraw from the site; notify the authorities.", insight: "Safe decision. Professional safety is always priority over story scoops.", scores: { analytical: 10, creativity: 2, collaboration: 8, risk: 1 } },
          { id: "b", label: "Enter the warehouse undercover with a hidden camera.", insight: "Extremely dangerous. Violates corporate safety guidelines.", scores: { analytical: 2, creativity: 6, collaboration: 2, risk: 10 } },
          { id: "c", label: "Coordinate with other local media units to report together.", insight: "Collaborative strength. Reduces individual safety threats.", scores: { analytical: 6, creativity: 8, collaboration: 9, risk: 4 } }
        ]
      }
    ]
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    stream: "Arts",
    category: "Arts & Design",
    shortDesc: "Design brand logos, visual advertisements, UI assets, and marketing layouts.",
    longDesc: "Graphic Designers blend visual aesthetics and typography to design logos, websites, marketing banners, and packaging layouts for commercial brands.",
    salary: { entry: "₹3 - 5 LPA", mid: "₹7 - 14 LPA", senior: "₹20 - 40 LPA", entryVal: 4, midVal: 10.5, seniorVal: 30 },
    growthRate: "+15% YoY",
    demandLevel: "Growing",
    typicalRoles: ["Brand Designer", "Visual Artist", "UI Designer", "Art Director"],
    hardSkills: ["Adobe Photoshop / Illustrator", "Figma Design", "Typography Rules", "Color Theory", "Vector Asset Design"],
    softSkills: ["Creativity", "Visual Storytelling", "Client Empathy", "Receptive to Critique"],
    educationPath: {
      highSchoolSubjects: "Any stream in Grade 11 & 12 (Arts/Fine Arts helpful)",
      degrees: ["B.Des in Visual Communication", "BFA (Bachelor of Fine Arts)", "Diploma in Graphic Design"],
      entranceExams: ["UCEED (for B.Des)", "NID DAT", "NIFT Entrance"],
      certifications: ["Adobe Certified Professional", "UI/UX Figma Master Certification"],
      alternatePaths: "Building a Behance or Dribbble design portfolio and freelancing for global brands."
    },
    aiImpact: {
      automationRisk: 30,
      level: "Medium",
      summary: "AI creates simple banners and stock design modifications instantly. Brand positioning, layout storytelling, and client curation need human artists.",
      strategy: "Leverage AI generators for rapid asset drafting, and focus on customized user interface design and client strategy."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Client Alignment", details: "Receive brand guideline sheets from marketing leads." },
      { time: "01:30 PM", activity: "Vector Illustration", details: "Sketch custom icon assets in Illustrator canvas." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Arts Stream recommended", details: "Practice drawing, color pairings, and download basic design software." },
      { stage: "College / Training", action: "B.Des Visual Communication", details: "Publish vector portfolios, create UI layouts, and secure design agency internships." },
      { stage: "Entry-Level Job", action: "Junior Designer", details: "Clean vectors, adjust typography sizes, and export brand layouts." },
      { stage: "Senior Leadership", action: "Creative Art Director", details: "Supervise brand aesthetics, pitch layouts to large clients, and lead design teams." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Client Direction Clash",
        dilemma: "A client insists on using color palettes that violate basic color theory rules, threatening to look unprofessional.",
        options: [
          { id: "a", label: "Use their requested color scheme without feedback.", insight: "Keeps client happy but compromises the quality of your portfolio piece.", scores: { analytical: 3, creativity: 1, collaboration: 10, risk: 2 } },
          { id: "b", label: "Present 3 alternative schemes balancing their idea with design theory.", insight: "Correct design consulting. Educates client through choices.", scores: { analytical: 8, creativity: 10, collaboration: 8, risk: 4 } },
          { id: "c", label: "Refuse the client job to preserve creative standards.", insight: "High risk. Strains client relationship and loses project fee.", scores: { analytical: 2, creativity: 5, collaboration: 2, risk: 10 } }
        ]
      },
      {
        id: "scene-2",
        title: "The Copycat Allegation",
        dilemma: "Your draft vector logo design looks highly similar to an existing startup logo found on the web.",
        options: [
          { id: "a", label: "Publish it anyway; hope no one files a complaint.", insight: "Extremely risky. Violates copyright laws and ruins professional authority.", scores: { analytical: 1, creativity: 2, collaboration: 2, risk: 10 } },
          { id: "b", label: "Discard the layout; redesign a fresh vector layout.", insight: "Correct designer ethics. Redesigning keeps asset original.", scores: { analytical: 8, creativity: 10, collaboration: 5, risk: 4 } },
          { id: "c", label: "Check patent files to compare exact similarity indexes.", insight: "Methodical and analytical check. Verifies infringement safety.", scores: { analytical: 10, creativity: 4, collaboration: 6, risk: 2 } }
        ]
      },
      {
        id: "scene-3",
        title: "Tight Delivery Deadline",
        dilemma: "Marketing asks for 15 custom ad banners in 4 hours for an emergency campaign.",
        options: [
          { id: "a", label: "Use stock template vectors to complete the batch fast.", insight: "Safe, rapid delivery but lacks original brand character.", scores: { analytical: 8, creativity: 3, collaboration: 6, risk: 5 } },
          { id: "b", label: "Hand-craft 3 premium styles and request a deadline shift.", insight: "Prioritizes quality over timelines. Strain client schedule.", scores: { analytical: 6, creativity: 10, collaboration: 4, risk: 7 } },
          { id: "c", label: "Pair up with another layout designer to divide tasks.", insight: "Collaborative design. Scales production quickly.", scores: { analytical: 7, creativity: 6, collaboration: 10, risk: 2 } }
        ]
      }
    ]
  },
  {
    id: "chartered-accountant",
    title: "Chartered Accountant",
    stream: "Commerce",
    category: "Commerce & Finance",
    shortDesc: "Audit tax compliance, balance corporate ledgers, and advise on finance.",
    longDesc: "Chartered Accountants manage corporate taxation, audit company financial statements, ensure legal financial compliance, and advise on corporate wealth planning.",
    salary: { entry: "₹6 - 9 LPA", mid: "₹12 - 20 LPA", senior: "₹30 - 60+ LPA", entryVal: 7.5, midVal: 16, seniorVal: 45 },
    growthRate: "+12% YoY",
    demandLevel: "High",
    typicalRoles: ["Tax Auditor", "Financial Analyst", "Internal Auditor", "Chief Financial Officer (CFO)"],
    hardSkills: ["Taxation Law", "Financial Auditing", "Excel / SAP ERP", "Compliance Auditing", "Corporate Valuation"],
    softSkills: ["Ethical Integrity", "Extreme Precision", "Analytical Mindset", "Clear Reporting"],
    educationPath: {
      highSchoolSubjects: "Commerce Stream with Accountancy & Mathematics recommended",
      degrees: ["CA Foundation -> Intermediate -> Final course", "B.Com + CA"],
      entranceExams: ["CA Foundation (conducted by ICAI)"],
      certifications: ["ICAI Chartered Accountant Membership", "DISA (Information Systems Audit)"],
      alternatePaths: "Starting as a tax associate or bookkeeper while clearing CA exams."
    },
    aiImpact: {
      automationRisk: 28,
      level: "Medium",
      summary: "AI systems classify transactions and reconcile accounts automatically, but interpreting taxation loopholes, signing audits, and financial advisory require certified humans.",
      strategy: "Leverage automated ledger audits and specialize in strategic CFO corporate advisory."
    },
    simulationAvailable: true,
    dayInTheLife: [
      { time: "09:00 AM", activity: "Audit Checklist", details: "Verify company inventory ledgers against purchase records." },
      { time: "02:30 PM", activity: "Tax Advisory", details: "Advise client founders on restructuring corporate deductions." }
    ],
    roadmap: [
      { stage: "Grade 10-12", action: "Commerce Stream", details: "Focus on Accountancy, Mathematics, and Business Studies." },
      { stage: "College / Training", action: "CA Course + Articleship", details: "Clear Foundation & Intermediate exams. Complete a 3-year articleship at an active CA firm." },
      { stage: "Entry-Level Job", action: "Audit Senior / Associate", details: "Perform detailed asset verifications, compile tax returns, and write audit checklists." },
      { stage: "Senior Leadership", action: "CA Firm Partner / CFO", details: "Sign off corporate financial statement audits, direct capital acquisitions, and advise on corporate taxes." }
    ],
    simulation: [
      {
        id: "scene-1",
        title: "Discovered Ledger Gap",
        dilemma: "You trace a minor, unexplained cash deficit in the company's ledger books right before filing.",
        options: [
          { id: "a", label: "Document and report it honestly to the Audit Committee.", insight: "Ethical auditing. Uncompromising integrity protects your license.", scores: { analytical: 10, creativity: 2, collaboration: 6, risk: 1 } },
          { id: "b", label: "Help the accounting team balance the books silently.", insight: "Audit fraud. High risk of losing license if external auditors trace it.", scores: { analytical: 2, creativity: 4, collaboration: 4, risk: 10 } },
          { id: "c", label: "Run a full internal audit to find the deficit source.", insight: "Methodical and diagnostic. Isolates the error source.", scores: { analytical: 8, creativity: 5, collaboration: 8, risk: 4 } }
        ]
      },
      {
        id: "scene-2",
        title: "Tax Saving Pressure",
        dilemma: "An executive pushes you to write off personal travel as a corporate tax expense.",
        options: [
          { id: "a", label: "Refuse the write-off and document the compliance breach.", insight: "Upholds compliance, but creates friction with executive team.", scores: { analytical: 10, creativity: 1, collaboration: 4, risk: 3 } },
          { id: "b", label: "Agree to protect your job relation with the executive.", insight: "Violates tax laws. Exposes you to legal penalties if audited.", scores: { analytical: 1, creativity: 2, collaboration: 1, risk: 10 } },
          { id: "c", label: "Advise them on legal corporate tax deductions instead.", insight: "Consultative approach. Bridges client needs and legal frameworks.", scores: { analytical: 8, creativity: 8, collaboration: 10, risk: 4 } }
        ]
      },
      {
        id: "scene-3",
        title: "Audit Deadline Crunch",
        dilemma: "You are short of files to verify inventory levels on the night of audit submissions.",
        options: [
          { id: "a", label: "Sample the largest items and sign off.", insight: "High risk of inventory misstatement if minor items are lost.", scores: { analytical: 4, creativity: 3, collaboration: 4, risk: 9 } },
          { id: "b", label: "Request a formal audit delay to verify all inventory records.", insight: "Correct. Prioritizes audit accuracy, but delays filings.", scores: { analytical: 10, creativity: 4, collaboration: 5, risk: 2 } },
          { id: "c", label: "Coordinate a late-night team audit to count remaining stock.", insight: "Collaborative audit sprint. Meets deadlines without sacrificing quality.", scores: { analytical: 7, creativity: 6, collaboration: 10, risk: 5 } }
        ]
      }
    ]
  }
];

// Fallback career template to support V3 dynamic simulation for all 30 careers
export function getExtendedCareers(): CareerItem[] {
  const base = [...INITIAL_CAREER_LIBRARY];
  const missing = [
    { id: "cybersecurity-analyst", title: "Cybersecurity Analyst", category: "Technology", stream: "Science", short: "Protect networks, trace server intrusions, and audit digital assets.", sal: [5, 12, 30] },
    { id: "ux-designer", title: "UX/UI Designer", category: "Arts & Design", stream: "Arts", short: "Design mockups, wireframes, and verify user flows for applications.", sal: [4, 11, 28] },
    { id: "civil-servant", title: "Civil Servant (IAS/IPS)", category: "Government & Law", stream: "Arts", short: "Manage public policies, administer districts, and enforce state laws.", sal: [7, 15, 30] },

    { id: "investment-banker", title: "Investment Banker", category: "Commerce & Finance", stream: "Commerce", short: "Manage corporate mergers, raise capital, and run valuation analyses.", sal: [9, 22, 60] },
    { id: "astrophysicist", title: "Astrophysicist", category: "Science & Space", stream: "Science", short: "Study stars, analyze telescope data, and model physical formulas.", sal: [5, 12, 28] },
    { id: "robotics-engineer", title: "Robotics Engineer", category: "Science & Space", stream: "Science", short: "Build mechanical systems, configure microcontrollers, and code robots.", sal: [6, 14, 32] },
    { id: "environmental-scientist", title: "Environmental Scientist", category: "Science & Space", stream: "Science", short: "Trace soil toxicity, check carbon counts, and draft conservation rules.", sal: [4, 9, 22] },
    { id: "physiotherapist", title: "Physiotherapist", category: "Healthcare", stream: "Science", short: "Evaluate muscle recovery, guide exercise, and restore joint health.", sal: [3.5, 8, 18] },
    { id: "pharmacist", title: "Pharmacist", category: "Healthcare", stream: "Science", short: "Manage medicine inventory, verify prescriptions, and audit dosages.", sal: [3, 7, 15] },
    { id: "sports-coach", title: "Sports Coach", category: "Media & Sports", stream: "Vocational", short: "Train athletes, design workout rosters, and strategize game plays.", sal: [3, 8, 20] },
    { id: "sports-manager", title: "Sports Manager", category: "Media & Sports", stream: "Commerce", short: "Coordinate team PR, manage sports contracts, and arrange events.", sal: [4, 9, 22] },
    { id: "hotel-manager", title: "Hotel Manager", category: "Hospitality", stream: "Commerce", short: "Audit hotel check-ins, manage hospitality staffing, and run services.", sal: [3.5, 8, 18] },
    { id: "animator", title: "Animator / 3D Artist", category: "Arts & Design", stream: "Arts", short: "Render 3D assets, animate game assets, and design visual overlays.", sal: [3.5, 9, 22] },
    { id: "actuary", title: "Actuary", category: "Commerce & Finance", stream: "Commerce", short: "Calculate insurance risks, value portfolios, and design statistical reserves.", sal: [7, 16, 40] },
    { id: "supply-chain-analyst", title: "Supply Chain Analyst", category: "Commerce & Finance", stream: "Commerce", short: "Optimize delivery tracks, manage warehouse logs, and limit pricing lag.", sal: [4.5, 10, 22] },
    { id: "social-entrepreneur", title: "Social Entrepreneur", category: "Entrepreneurship", stream: "Arts", short: "Address social issues through scalable corporate models and NGO sync.", sal: [3, 9, 25] },
    { id: "ai-ethics-auditor", title: "AI Ethics Auditor", category: "Technology", stream: "Science", short: "Audit algorithmic decisions, test neural networks, and verify biases.", sal: [8, 18, 42] }
  ];

  missing.forEach((m) => {
    if (!base.some(b => b.id === m.id)) {
      base.push({
        id: m.id,
        title: m.title,
        stream: m.stream as "Science" | "Commerce" | "Arts" | "Vocational",
        category: m.category,
        shortDesc: m.short,
        longDesc: `A professional career path in ${m.title} focusing on core tasks inside ${m.category}. It requires specialized skills and is growing globally in the modern market.`,
        salary: {
          entry: `₹${m.sal[0]} - ${m.sal[0] + 3} LPA`,
          mid: `₹${m.sal[1]} - ${m.sal[1] + 6} LPA`,
          senior: `₹${m.sal[2]} - ${m.sal[2] + 20}+ LPA`,
          entryVal: m.sal[0] + 1,
          midVal: m.sal[1] + 3,
          seniorVal: m.sal[2] + 10
        },
        growthRate: "+15% YoY",
        demandLevel: "High",
        typicalRoles: [`Junior ${m.title}`, `Senior ${m.title}`, `${m.title} Lead`],
        hardSkills: ["Technical Auditing", "Analytical Tools", "Domain Logic"],
        softSkills: ["Teamwork", "Problem Solving", "Adaptability"],
        educationPath: {
          highSchoolSubjects: `${m.stream} Stream recommended in Grade 11 & 12.`,
          degrees: [`Bachelor in ${m.category} / related field`, "Master specialization"],
          entranceExams: ["Standard National/State Entrances"],
          certifications: ["Domain Certification Level I", "Compliance Master Certificate"],
          alternatePaths: "Working through related entry-level support nodes or self-made portfolios."
        },
        aiImpact: {
          automationRisk: 20,
          level: "Low",
          summary: "AI systems handle data drafts and compliance reports. Complex strategy and operations require human inputs.",
          strategy: "Leverage automation tools and double down on strategic planning."
        },
        simulationAvailable: true,
        dayInTheLife: [
          { time: "09:00 AM", activity: "Morning Sync", details: "Review tasks and sync with the client team." },
          { time: "02:00 PM", activity: "Core Operations Execution", details: "Perform core duties for the project backlog." }
        ],
        roadmap: [
          { stage: "Grade 10-12", action: "Stream Alignment", details: "Take relevant stream classes. Learn tool basics." },
          { stage: "College / Training", action: "Obtain Degree", details: "Study core curriculum theory and join campus internships." },
          { stage: "Entry-Level Job", action: "Junior Role", details: "Complete support tasks, trace errors, and align logs." },
          { stage: "Senior Leadership", action: "Manager / Principal", details: "Supervise departments, define budgets, and align strategy." }
        ],
        simulation: [
          {
            id: "scene-1",
            title: "Client Scope Lockout",
            dilemma: "A major client files an immediate complaint about project metrics.",
            options: [
              { id: "a", label: "Perform a detailed audit to isolate issues.", insight: "Methodical and correct. Solves the issue scientifically.", scores: { analytical: 10, creativity: 3, collaboration: 5, risk: 2 } },
              { id: "b", label: "Offer discounts immediately to settle the noise.", insight: "Saves client relation but hides technical bugs.", scores: { analytical: 4, creativity: 6, collaboration: 8, risk: 6 } },
              { id: "c", label: "Deny the complaint claims.", insight: "High risk. Violates customer-centricity values.", scores: { analytical: 2, creativity: 1, collaboration: 2, risk: 10 } }
            ]
          },
          {
            id: "scene-2",
            title: "Scaling Spikes",
            dilemma: "Project operations spike by 50% overnight, overloading the team.",
            options: [
              { id: "a", label: "Delegate tasks and authorize overtime templates.", insight: "Quick response, but can tire team if sustained.", scores: { analytical: 6, creativity: 4, collaboration: 9, risk: 6 } },
              { id: "b", label: "Refine automated scripting triggers to handle peak volumes.", insight: "Automation first. Scales cleanly.", scores: { analytical: 10, creativity: 8, collaboration: 6, risk: 4 } },
              { id: "c", label: "Refuse new project transactions.", insight: "Safe but loses business revenue potential.", scores: { analytical: 4, creativity: 2, collaboration: 4, risk: 1 } }
            ]
          },
          {
            id: "scene-3",
            title: "Ethical Compliance Gate",
            dilemma: "Audit reports trace a compliance deviation. Reporting it will delay funding.",
            options: [
              { id: "a", label: "File report honestly; delay funding round.", insight: "Correct. Ethical compliance saves long-term legal penalties.", scores: { analytical: 10, creativity: 2, collaboration: 7, risk: 2 } },
              { id: "b", label: "Cover up the log files; proceed with funding.", insight: "Illegal and violates professional code.", scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 10 } },
              { id: "c", label: "Run internal remediation silently; delay audit audits.", insight: "Balances concerns. Fixes errors safely.", scores: { analytical: 8, creativity: 8, collaboration: 5, risk: 5 } }
            ]
          }
        ]
      });
    }
  });

  return base.map(enrichCareerItem);
}

export const CAREER_LIBRARY: CareerItem[] = getExtendedCareers();
