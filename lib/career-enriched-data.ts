import { type CareerItem } from "./career-library";

export const ENRICHED_DATA_MAP: Record<
  string,
  Omit<
    CareerItem,
    | "id"
    | "title"
    | "stream"
    | "category"
    | "shortDesc"
    | "longDesc"
    | "salary"
    | "growthRate"
    | "demandLevel"
    | "typicalRoles"
    | "hardSkills"
    | "softSkills"
    | "educationPath"
    | "aiImpact"
    | "simulationAvailable"
    | "dayInTheLife"
    | "roadmap"
    | "simulation"
  >
> = {
  "software-engineer": {
    indiaSalary: { entry: "₹6 - 12 LPA", mid: "₹15 - 28 LPA", senior: "₹35 - 75+ LPA", entryVal: 9, midVal: 21.5, seniorVal: 55 },
    globalSalary: { entry: "$75k - 95k USD", mid: "$110k - 160k USD", senior: "$180k - 300k+ USD", entryVal: 85, midVal: 135, seniorVal: 240 },
    marketDemand: {
      level: "High",
      description: "Massive requirements driven by cloud integration, automated SaaS scaling, and specialized AI engineer tooling."
    },
    growthProjections: {
      rate: "+22% YoY",
      timeframe: "2026 - 2032",
      insights: "AI coding assistants accelerate syntax speed, scaling individual SDE impact and raising system-architect demand."
    },
    enrichedSkills: {
      hard: ["TypeScript / Python", "System Architecture", "SQL / NoSQL Databases", "REST APIs", "Git Version Control"],
      soft: ["Logical Debugging", "Patience", "Team Collaboration", "Pragmatic Trade-offs"],
      tools: ["VS Code", "GitHub Copilot", "Docker", "AWS Console", "Kubernetes"]
    },
    degreePaths: {
      undergrad: ["B.Tech in Computer Science", "B.E. in IT", "BCA (Computer Applications)"],
      postgrad: ["M.Tech in CS", "MCA", "M.Sc. in Data Engineering"],
      exams: ["JEE Main / Advanced", "VITEEE", "GATE (for Postgrad)"]
    },
    alternativePathways: ["Coding Bootcamps", "Open Source contributions", "Self-taught portfolio projects on GitHub"],
    freelanceOpportunities: {
      viability: "High",
      roles: ["Full-Stack Contractor", "API Specialist", "WordPress/Shopify Architect"],
      insights: "Massive global freelance networks exist on platforms like Upwork and Toptal, offering hourly rates of $40-$150+ USD."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["Micro-SaaS Product", "Tech Consulting Agency", "AI API Wrapper Startup"],
      insights: "Lowest operational cost setup in modern markets; requires only a laptop and hosting credits."
    },
    comparisonParams: {
      workLifeBalance: 8,
      educationCost: "Medium",
      flexibility: "High",
      remoteOpportunities: "Remote",
      bestFor: "Logical builders who love breaking down complex issues, writing code, and automating processes.",
      typicalDay: "Code writing sprint updates, resolving API bugs, reviewing developer PRs, and auditing server telemetry logs.",
      futureOutlook: "Strongest growth index. Core developers remain essential to structure systems design and verify code health."
    },
    realJourney: "Began as an open-source contributor in college, landed a Junior Frontend Engineer role at a growth-stage startup, transitioned to Senior Backend Engineer at a tech conglomerate, and eventually stepped up as a Principal Infrastructure Architect leading global database clustering.",
    misconceptions: [
      "You need to be a math genius to code.",
      "Software engineering is a solo job done in a dark room.",
      "AI will completely replace all software developers within two years."
    ],
    realityVsExpectation: [
      { expectation: "You write code uninterrupted for 8 hours a day.", reality: "You spend 3-4 hours coding, and the rest in design syncs, code reviews, debugging pipelines, and team meetings." },
      { expectation: "Building features is the hardest part.", reality: "Maintaining legacy systems, writing test suites, and scaling database index latency is where the real complexity lies." },
      { expectation: "You must memorize every programming language syntax.", reality: "You search documentation and use AI assistants; understanding system architecture and problem-solving patterns is what matters." }
    ],
    myths: [
      { myth: "Coding is only for computer science graduates.", fact: "More than 35% of professional engineers are self-taught or come from non-CS streams like Commerce or Arts." },
      { myth: "You need to know 10 different languages.", fact: "Mastering one stack (like TypeScript/React/Node) is far more valuable than basic knowledge of multiple languages." },
      { myth: "Senior engineers don't make mistakes.", fact: "Senior SDEs spend a significant portion of their time debugging errors, tracking system leaks, and checking logs." }
    ],
    growthLadder: [
      { role: "Software Intern", experience: "0-1 Year", description: "Write simple unit tests, assist with bug fixes under supervision, and learn Git version protocols." },
      { role: "Junior SDE (SDE-1)", experience: "1-3 Years", description: "Own minor end-to-end features, write database query APIs, and actively participate in code reviews." },
      { role: "Mid-Level SDE (SDE-2)", experience: "3-5 Years", description: "Design complex microservice integrations, refactor indexing, and resolve production pipeline bottlenecks." },
      { role: "Senior Developer (SDE-3)", experience: "5-8 Years", description: "Architect system layouts, mentor junior SDEs, balance hosting budgets, and lead feature releases." },
      { role: "Principal Architect / Director", experience: "8+ Years", description: "Define technological roadmaps, audit data security compliance, and align engineering clusters with business goals." }
    ]
  },
  "data-scientist": {
    indiaSalary: { entry: "₹7 - 13 LPA", mid: "₹15 - 28 LPA", senior: "₹32 - 70+ LPA", entryVal: 10, midVal: 21.5, seniorVal: 51 },
    globalSalary: { entry: "$80k - 105k USD", mid: "$120k - 175k USD", senior: "$190k - 320k+ USD", entryVal: 92, midVal: 147, seniorVal: 255 },
    marketDemand: {
      level: "High",
      description: "Data-driven commercial operations require modeling insights to analyze behavior and optimize user retention."
    },
    growthProjections: {
      rate: "+25% YoY",
      timeframe: "2026 - 2032",
      insights: "Driven by corporate adoption of large language models, regression forecasting, and predictive analytics tools."
    },
    enrichedSkills: {
      hard: ["Python / R coding", "SQL querying", "Statistics", "Machine Learning models", "Data Visualization"],
      soft: ["Critical Pacing", "Storytelling", "Business Acumen", "Curiosity"],
      tools: ["Jupyter Notebooks", "Tableau / PowerBI", "Pandas & Scikit-Learn", "PostgreSQL", "TensorFlow"]
    },
    degreePaths: {
      undergrad: ["B.Sc. in Statistics", "B.Tech in CS/AI", "B.Sc. in Data Science"],
      postgrad: ["M.Sc. in Data Science", "M.Tech in ML", "Ph.D. in Statistics"],
      exams: ["JEE Main", "ISI Admission Test", "JAM Statistics"]
    },
    alternativePathways: ["Kaggle Competitions", "Analyzing public data files", "Publishing analytics notebooks on GitHub"],
    freelanceOpportunities: {
      viability: "Medium",
      roles: ["Analytics Consultant", "SQL Dashboard Builder", "ML Model Calibrator"],
      insights: "Typically requires corporate NDA clearances; freelance projects center on dashboard designs and SQL cleansings."
    },
    entrepreneurshipOpportunities: {
      viability: "Medium",
      models: ["AI Analytics SaaS", "Data Scraping Agency", "ML Model Auditing Service"],
      insights: "Excellent opportunities in vertical analytics solutions targeting commerce niches."
    },
    comparisonParams: {
      workLifeBalance: 8,
      educationCost: "Medium",
      flexibility: "High",
      remoteOpportunities: "Hybrid",
      bestFor: "Quantitative thinkers who love analyzing statistics, checking spreadsheets, and training predictive networks.",
      typicalDay: "Querying databases with SQL, debugging model telemetry charts, presenting dashboards, and tuning hyperparameters.",
      futureOutlook: "Excellent. Businesses require analytical experts to translate raw log files into actionable business plans."
    }
  },
  "product-manager": {
    indiaSalary: { entry: "₹7 - 14 LPA", mid: "₹18 - 32 LPA", senior: "₹35 - 75+ LPA", entryVal: 10.5, midVal: 25, seniorVal: 55 },
    globalSalary: { entry: "$85k - 110k USD", mid: "$130k - 180k USD", senior: "$195k - 300k+ USD", entryVal: 97, midVal: 155, seniorVal: 247 },
    marketDemand: {
      level: "High",
      description: "Crucial orchestrator role bridging technology developers with visual designers and business growth targets."
    },
    growthProjections: {
      rate: "+18% YoY",
      timeframe: "2026 - 2032",
      insights: "AI speeds up writing product briefs (PRDs), allowing PMs to spend more hours on client calls and user interviews."
    },
    enrichedSkills: {
      hard: ["Product Analytics", "Roadmapping", "A/B Testing", "Agile / Scrum methodology", "UX wireframing"],
      soft: ["Influence without Authority", "Team Alignment", "Empathy", "Storytelling"],
      tools: ["Jira / Linear", "Figma (viewing)", "Mixpanel / Amplitude", "Notion", "Miro"]
    },
    degreePaths: {
      undergrad: ["BBA (Business)", "B.Tech (CS / Engineering)", "B.Sc. in Economics"],
      postgrad: ["MBA in Product / Systems", "Master in Management"],
      exams: ["CAT (for MBA)", "GMAT", "IPMAT"]
    },
    alternativePathways: ["Transitioning from software development or UX roles", "Launching independent side products", "Associate PM roles"],
    freelanceOpportunities: {
      viability: "Low",
      roles: ["Agile Consultant", "Freelance Product Spec Writer", "Product Launch Consultant"],
      insights: "PM roles are deeply integrated into organization logs, making standalone freelance gigs less common."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["Agile Consulting Studio", "Product Incubation Hub", "Venture Building Partnership"],
      insights: "Strong PM skills align perfectly with solo-founding tech startups or managing startup incubators."
    },
    comparisonParams: {
      workLifeBalance: 7,
      educationCost: "Medium",
      flexibility: "Medium",
      remoteOpportunities: "Hybrid",
      bestFor: "Strategic coordinators who enjoy solving trade-offs, designing client solutions, and facilitating team meetings.",
      typicalDay: "Grooming Linear backlogs, coordinating engineering deadlines, interviewing users, and reviewing design drafts.",
      futureOutlook: "Positive. Leadership skills, client negotiations, and empathy checks remain highly safe from automation."
    }
  },
  "entrepreneur": {
    indiaSalary: { entry: "₹0 - 6 LPA (Founder's cut)", mid: "₹12 - 30 LPA (Secured seed)", senior: "₹50 - 200+ LPA (Scaled company)", entryVal: 3, midVal: 21, seniorVal: 125 },
    globalSalary: { entry: "$0 - 50k USD", mid: "$80k - 150k USD", senior: "$250k - 1M+ USD", entryVal: 25, midVal: 115, seniorVal: 625 },
    marketDemand: {
      level: "High",
      description: "Growing focus on local product building, D2C brand logistics, and customized software agency operations."
    },
    growthProjections: {
      rate: "+20% YoY",
      timeframe: "2026 - 2032",
      insights: "No job security, but maximum upside. AI tools lower the initial developer staff costs required to build tech startups."
    },
    enrichedSkills: {
      hard: ["Business Valuation", "Fundraising / Pitching", "Product Design", "GTM Strategy", "Runway Auditing"],
      soft: ["Resilience / Grit", "Visionary Pacing", "Public Speaking", "Delegation"],
      tools: ["Stripe Dashboard", "CapTable sheets", "Figma", "Pitch deck software", "Slack"]
    },
    degreePaths: {
      undergrad: ["No formal degree requirement", "B.Com in Finance", "B.Tech / B.E."],
      postgrad: ["MBA (helpful for scaling)", "Incubator bootcamps"],
      exams: ["None (Market execution metrics matter)"]
    },
    alternativePathways: ["Launching small eCommerce products", "Selling digital assets", "Running local retail or consulting gigs"],
    freelanceOpportunities: {
      viability: "High",
      roles: ["Fractional CEO", "Pitch Consultant", "Startup Advisor"],
      insights: "Experienced founders routinely consult early-stage startups on fundraising and operational pivots."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["SaaS / Digital Products", "D2C Brand Label", "Tech Service Agency"],
      insights: "High risk/reward setup. Requires deep grit, validation tests, and capital budgeting."
    },
    comparisonParams: {
      workLifeBalance: 5,
      educationCost: "Low",
      flexibility: "High",
      remoteOpportunities: "Remote",
      bestFor: "Self-driven builders willing to accept financial risk to manifest ideas and direct operations.",
      typicalDay: "Reviewing runway metrics, pitching investors, alignment syncs with heads of tech/product, and customer chats.",
      futureOutlook: "Favorable. AI agents drastically reduce operational costs, making solo-founder setups viable."
    },
    realJourney: "Co-founded a campus software services agency, pivoted to a B2B SaaS product, raised seed capital, scaled operations to 50 employees, and successfully exited via acquisition.",
    misconceptions: [
      "Being an entrepreneur means you don't have a boss.",
      "You need a revolutionary, unique idea to build a startup.",
      "You will become rich and scale a unicorn within a year."
    ],
    realityVsExpectation: [
      { expectation: "You spend your time brainstorming big ideas.", reality: "You spend 90% of your time on sales pitches, hiring developers, resolving legal structures, and tracking cash flow logs." },
      { expectation: "Raising venture capital is the ultimate success.", reality: "Fundraising is just a starting milestone. Building a self-sustaining business model and retaining customers is the real win." },
      { expectation: "You have complete flexibility over your work hours.", reality: "You are the ultimate safety net. Founders frequently work 70+ hour weeks, especially during cash crunches or system outages." }
    ],
    myths: [
      { myth: "You must drop out of college to build a startup.", fact: "Most successful founders have degrees and worked several years in industry to build networks and domain expertise first." },
      { myth: "Entrepreneurs are high-risk gamblers.", fact: "Great founders are actually experts at risk mitigation. They test theories with MVPs (Minimum Viable Products) before spending capital." },
      { myth: "You need a co-founder who has the same skills.", fact: "The best founding teams have complementary skills, e.g., one technical builder (CTO) and one commercial business seller (CEO)." }
    ],
    growthLadder: [
      { role: "Solo Founder", experience: "0-2 Years", description: "Build initial MVP prototype, talk directly to early users, and self-fund initial hosting or tool costs." },
      { role: "Co-Founder & CEO", experience: "2-4 Years", description: "Raise seed capital, hire first engineering and sales employees, and establish corporate legal structures." },
      { role: "Growth Stage CEO", experience: "4-7 Years", description: "Manage departmental managers, optimize user acquisition costs, and negotiate commercial enterprise deals." },
      { role: "Scale-Up Executive", experience: "7-10 Years", description: "Direct international market expansions, raise Series B+ institutional rounds, and manage board alignments." },
      { role: "Venture Partner / Board Member", experience: "10+ Years", description: "Invest in early-stage startups, advise portfolio founders, and direct corporate mergers and acquisitions." }
    ]
  },
  "doctor": {
    indiaSalary: { entry: "₹8 - 14 LPA", mid: "₹16 - 30 LPA", senior: "₹35 - 80+ LPA", entryVal: 11, midVal: 23, seniorVal: 57.5 },
    globalSalary: { entry: "$120k - 200k USD", mid: "$240k - 380k USD", senior: "$450k - 800k+ USD", entryVal: 160, midVal: 310, seniorVal: 625 },
    marketDemand: {
      level: "High",
      description: "Evergreen demand due to growing population stats and specialized surgical care needs."
    },
    growthProjections: {
      rate: "+12% YoY",
      timeframe: "2026 - 2032",
      insights: "Scanners analyze images fast, but surgery validation and bedside manner counseling remain exclusively human."
    },
    enrichedSkills: {
      hard: ["Surgical Pacing", "Clinical Pathology", "Diagnostics", "Pharmacology", "Anatomy"],
      soft: ["Bedside Empathy", "Stress Pacing", "Active Inquiry", "Ethical Decision-Making"],
      tools: ["Stethoscope / ECG", "MRI/CT scan software", "Surgical Scalpel", "Electronic Health Records (EHR)"]
    },
    degreePaths: {
      undergrad: ["MBBS (5.5 years)", "BDS (Dental)"],
      postgrad: ["MD (Medicine)", "MS (Surgery)", "DM / MCh (Speciality)"],
      exams: ["NEET UG", "NEET PG", "INICET"]
    },
    alternativePathways: ["Clinical Research Associate", "Public Health consulting (MPH)", "Healthcare Administrator"],
    freelanceOpportunities: {
      viability: "Medium",
      roles: ["Locum Tenens Doctor", "Virtual Tele-consultant", "Medical Writer"],
      insights: "Consulting via tele-medicine apps offers excellent hourly flexibility."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["Private Clinic / Diagnostic Center", "Health-Tech Consult", "Specialized Care Nursing Home"],
      insights: "Requires significant initial capital setup for machinery, licensing, and nursing staff."
    },
    comparisonParams: {
      workLifeBalance: 4,
      educationCost: "High",
      flexibility: "Low",
      remoteOpportunities: "On-site",
      bestFor: "Empathetic, stress-resilient builders who value biological science and public health.",
      typicalDay: "Diagnosing clinical cases, consulting patients in OPD, performing surgeries, and checking ward logs.",
      futureOutlook: "Exceptionally stable. Demographics ensure growing requirements for physicians and surgeons."
    },
    realJourney: "Completed MBBS, worked as a Junior Resident in a busy public hospital ER, pursued MD in Pediatrics, and established a community pediatric clinic focusing on child diagnostics.",
    misconceptions: [
      "Doctors immediately know the cure for every symptom.",
      "A doctor's job is mostly performing major operations.",
      "The hard work ends once you graduate from medical school."
    ],
    realityVsExpectation: [
      { expectation: "You cure rare, exotic diseases every day.", reality: "Most patient interactions are about managing chronic conditions, diagnosing common infections, and explaining diet and medication guidelines." },
      { expectation: "Your clinical choices are solely based on medical science.", reality: "You must balance clinical decisions with patient budgets, insurance compliance, and family wishes." },
      { expectation: "You operate in a quiet, sterile, high-tech environment.", reality: "Wards and ERs can be chaotic, loud, and physically exhausting, requiring long hours standing on your feet." }
    ],
    myths: [
      { myth: "All doctors make high salaries immediately.", fact: "Junior residents work 80+ hour weeks for modest stipends. Significant financial scaling happens after completing specializations (MD/MS)." },
      { myth: "You cannot have a work-life balance.", fact: "While surgeons and ER doctors have irregular hours, specialists like dermatologists or ophthalmologists enjoy stable office hours." },
      { myth: "AI will replace radiologists and diagnostic doctors.", fact: "AI is an excellent tool for screening, but verifying results and deciding on patient treatments remains the human doctor's duty." }
    ],
    growthLadder: [
      { role: "Medical Intern", experience: "0-1 Year", description: "Perform basic checkups, take patient histories, record ward logs, and learn emergency codes." },
      { role: "Junior Resident (MBBS)", experience: "1-3 Years", description: "Manage ward intakes, administer medications, assist in minor procedures, and handle night duties." },
      { role: "Senior Resident (MD/MS)", experience: "3-6 Years", description: "Supervise ward operations, lead clinical diagnoses, perform standard surgeries, and train interns." },
      { role: "Consultant Specialist", experience: "6-10 Years", description: "Lead super-speciality cases, perform complex surgeries, run OPD clinics, and manage patient treatment rosters." },
      { role: "Head of Department (HOD) / Director", experience: "10+ Years", description: "Manage hospital department budgets, represent clinical boards, direct research studies, and lead regional health policies." }
    ]
  },
  "lawyer": {
    indiaSalary: { entry: "₹5 - 9 LPA", mid: "₹11 - 22 LPA", senior: "₹25 - 60+ LPA", entryVal: 7, midVal: 16.5, seniorVal: 42.5 },
    globalSalary: { entry: "$70k - 95k USD", mid: "$125k - 180k USD", senior: "$210k - 400k+ USD", entryVal: 82, midVal: 152, seniorVal: 305 },
    marketDemand: {
      level: "High",
      description: "Growing corporate transactions, IP rights, startup deals, and litigation caseloads in national courts."
    },
    growthProjections: {
      rate: "+10% YoY",
      timeframe: "2026 - 2032",
      insights: "AI automates document classification, but courtroom pleading and client strategy remain secure human tasks."
    },
    enrichedSkills: {
      hard: ["Legal Drafting", "Contracts & Compliance", "Precedent Research", "Cross-Examination", "Statutory Interpretation"],
      soft: ["Logical Argumentation", "Public Speaking", "Negotiation", "Critical Reading"],
      tools: ["Manupatra / SCC Online", "Microsoft Word", "Legal billing software", "DocuSign", "Zoom (Virtual Court)"]
    },
    degreePaths: {
      undergrad: ["BA LLB (5 years integrated)", "BBA LLB", "B.Com LLB"],
      postgrad: ["LLM (Master of Laws)", "Diploma in Corporate Compliance"],
      exams: ["CLAT", "AILET", "AIBE (Bar Licensing Exam)"]
    },
    alternativePathways: ["Legal Compliance Officer", "Arbitration mediator", "Non-profit legal aid specialist"],
    freelanceOpportunities: {
      viability: "High",
      roles: ["Independent Advocate", "Contract Draftsman", "Patent Filing Specialist"],
      insights: "Freelance contract reviews for startups pay high project-based fees ($50-$200/hr)."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["Law Firm Partnership", "Legal-Tech Startup", "Corporate Compliance Agency"],
      insights: "Law firms scale by hiring associates; partnership structures offer equity splits on retainer clients."
    },
    comparisonParams: {
      workLifeBalance: 6,
      educationCost: "High",
      flexibility: "Medium",
      remoteOpportunities: "Hybrid",
      bestFor: "Debaters who love reading files, constructing structured arguments, and negotiating terms.",
      typicalDay: "Pleading staying petitions in court, drafting corporate contracts, reviewing compliance filings, and client briefs.",
      futureOutlook: "Good. AI speeds up legal research, but courtroom representation and complex deals require human lawyers."
    },
    realJourney: "Graduated with a BA LLB from National Law School, began as a Litigation Associate in district courts, transitioned to a Senior Corporate Counsel at a national law firm, and eventually became General Counsel for a multinational fintech company.",
    misconceptions: [
      "Lawyers spend all their time arguing dramatically in courtrooms.",
      "You must memorize every section of every law book.",
      "Law is a static field that never changes."
    ],
    realityVsExpectation: [
      { expectation: "You deliver passionate speeches in front of a jury daily.", reality: "Most cases are decided on the strength of written briefs. You spend 80% of your time researching precedents and drafting pleadings." },
      { expectation: "Corporate lawyers work on exciting business expansions.", reality: "Much of corporate law is auditing contracts, validating compliance lists, and assessing regulatory liabilities." },
      { expectation: "A legal career is all about win-or-lose battles.", reality: "The best lawyers prevent disputes entirely by structuring clear, balanced, and audited agreements." }
    ],
    myths: [
      { myth: "Only extroverts who love public arguing can succeed in law.", fact: "Many of the most successful corporate, tax, and patent lawyers are introverts who excel at document auditing and logic mapping." },
      { myth: "Lawyers are paid to lie or hide facts.", fact: "Legal ethics require absolute honesty to the court. Misrepresenting facts can lead to losing your license to practice." },
      { myth: "You must come from a family of lawyers.", fact: "First-generation lawyers thrive by securing internships early and building reputations in specialized fields like IP or Tech Law." }
    ],
    growthLadder: [
      { role: "Legal Intern / Clerk", experience: "0-1 Year", description: "Review long document files, pull up case precedents from databases, and draft basic corporate forms." },
      { role: "Associate Advocate", experience: "1-3 Years", description: "Represent clients in minor chambers hearings, draft legal notices, and assist senior partners on major trials." },
      { role: "Senior Associate", experience: "3-6 Years", description: "Manage litigation backlogs, draft complex commercial agreements, and lead settlement mediation sessions." },
      { role: "Partner / Senior Partner", experience: "6-10 Years", description: "Bring in corporate clients, manage firm associate pools, and direct departmental litigation briefs." },
      { role: "General Counsel / HOD", experience: "10+ Years", description: "Supervise all internal legal compliance, direct high-stakes regulatory policy, and advise corporate boards on risk strategies." }
    ]
  },
  "psychologist": {
    indiaSalary: { entry: "₹3 - 6 LPA", mid: "₹8 - 15 LPA", senior: "₹18 - 35+ LPA", entryVal: 4.5, midVal: 11.5, seniorVal: 26.5 },
    globalSalary: { entry: "$50k - 70k USD", mid: "$85k - 120k USD", senior: "$140k - 220k+ USD", entryVal: 60, midVal: 102, seniorVal: 180 },
    marketDemand: {
      level: "High",
      description: "Surging demands driven by employee burnout, campus wellness plans, and global mental health focus."
    },
    growthProjections: {
      rate: "+15% YoY",
      timeframe: "2026 - 2032",
      insights: "Highly safe from automation. Therapeutic bonds, clinical empathy, and mental trust cannot be coded."
    },
    enrichedSkills: {
      hard: ["CBT / DBT", "Psychometric Testing", "Clinical Diagnostics", "Session Structuring"],
      soft: ["Active Listening", "Empathetic Presence", "Boundary Setting", "Emotional Resilience"],
      tools: ["Therapy Log tools", "DSM-5 Diagnostic Reference", "Anxiety Scale Sheets", "Tele-health dashboards"]
    },
    degreePaths: {
      undergrad: ["B.A. in Psychology", "B.Sc. in Cognitive Science"],
      postgrad: ["M.A. in Clinical Psychology", "M.Phil in Clinical Psychology", "Ph.D. in Counseling"],
      exams: ["University Entrances", "RCI Licensing Exam", "NET"]
    },
    alternativePathways: ["Human Resources specialist", "School Counselor", "Behavioral design consultant for apps"],
    freelanceOpportunities: {
      viability: "High",
      roles: ["Private Therapist", "Virtual counselor", "Mental Wellness Speaker"],
      insights: "Tele-therapy scaling allows counselors to build global client bases with flexible hours."
    },
    entrepreneurshipOpportunities: {
      viability: "Medium",
      models: ["Mental Health Clinic", "Corporate Wellness SaaS", "Meditation & Therapy Center"],
      insights: "Starting wellness centers requires clinical licenses and partner counselor setups."
    },
    comparisonParams: {
      workLifeBalance: 8,
      educationCost: "Medium",
      flexibility: "High",
      remoteOpportunities: "Hybrid",
      bestFor: "Listeners who want to study human behaviors, help others, and map mental diagnostics.",
      typicalDay: "Conducting therapy consults, reviewing patient check sheets, grading psychometric profiles, and writing notes.",
      futureOutlook: "Excellent. Low automation threat. Empathy-focused roles are the most resilient against AI."
    }
  },
  "fashion-designer": {
    indiaSalary: { entry: "₹3.5 - 7 LPA", mid: "₹8 - 15 LPA", senior: "₹20 - 45+ LPA", entryVal: 5.25, midVal: 11.5, seniorVal: 32.5 },
    globalSalary: { entry: "$45k - 65k USD", mid: "$75k - 110k USD", senior: "$130k - 220k+ USD", entryVal: 55, midVal: 92, seniorVal: 175 },
    marketDemand: {
      level: "Moderate",
      description: "Competitive landscape. Growing options for sustainable labels, eco-fabrics, and digital D2C lines."
    },
    growthProjections: {
      rate: "+9% YoY",
      timeframe: "2026 - 2032",
      insights: "Generative AI produces rapid design combinations, shifting human value to fabric selection and custom drape setups."
    },
    enrichedSkills: {
      hard: ["CAD illustration", "Fabric Science", "Garment Stitching", "Color Theory", "Pattern Making"],
      soft: ["Trend Analysis", "Aesthetic Vision", "Supplier Sync", "Creative Storytelling"],
      tools: ["Adobe Illustrator", "CLO 3D", "Sewing Machinery", "Moodboards", "Tech-pack sheets"]
    },
    degreePaths: {
      undergrad: ["B.Des in Fashion Design", "B.Des in Textile Design"],
      postgrad: ["M.Des in Fashion", "Master in Fashion Management"],
      exams: ["NIFT", "NID DAT", "UCEED"]
    },
    alternativePathways: ["Launching a custom boutique", "Self-taught designer portfolio", "Fashion Stylist"],
    freelanceOpportunities: {
      viability: "High",
      roles: ["Fashion Illustrator", "Tech-pack designer", "Stylist"],
      insights: "Brands contract freelance artists to draft tech specifications and design sketches."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["eCommerce Brand Label", "Sustainable Apparel Studio", "Bespoke Boutique"],
      insights: "D2C online channels lower storage costs; requires GTM branding and sourcing partnerships."
    },
    comparisonParams: {
      workLifeBalance: 7,
      educationCost: "Medium",
      flexibility: "Medium",
      remoteOpportunities: "Hybrid",
      bestFor: "Creative designers interested in textiles, aesthetics, sketching apparel, and brand curation.",
      typicalDay: "Sketching moodboard files, checking material samples, auditing dye runs at local factories, and social styling.",
      futureOutlook: "Stable. Mass production leverages AI templates, but luxury brands and green labels rely on human artists."
    },
    realJourney: "Graduated with a NIFT design degree, worked as a Design Assistant at an apparel exporter, rose to Lead Designer for a street fashion brand, and eventually launched a sustainable D2C label.",
    misconceptions: [
      "Fashion designers spend all day sketching beautiful dresses.",
      "Fashion is a glamorous world of runway shows and parties.",
      "Anyone who has good style can be a professional designer."
    ],
    realityVsExpectation: [
      { expectation: "You create custom outfits for models and stars.", reality: "The bulk of the market is in mass-retail and commercial apparel, designing comfortable clothes within strict fabric budget constraints." },
      { expectation: "You have complete creative freedom over your designs.", reality: "You must design styles that match buyer trends, seasonal calendars, factory capabilities, and raw material availability." },
      { expectation: "Runway shows are where designers make money.", reality: "Runways are marketing investments. Revenues come from manufacturing volume sales, retail partnerships, and online D2C orders." }
    ],
    myths: [
      { myth: "Fashion is only about sketching and drawing.", fact: "Drape patterns, fabric chemistry, textile weaving, and costing sheets are equally critical technical design disciplines." },
      { myth: "You must live in Paris or Milan to succeed.", fact: "India has a massive apparel export and retail fashion industry, with hubs in Mumbai, Delhi, Bengaluru, and Tiruppur." },
      { myth: "Sustainable fashion is just a trend.", fact: "Sustainability is now a core business requirement due to shifting consumer demands and global supply chain regulations." }
    ],
    growthLadder: [
      { role: "Design Intern", experience: "0-1 Year", description: "Organize fabric swatch logs, sketch detail files, and assist during fitting and photoshoot sessions." },
      { role: "Assistant Designer", experience: "1-3 Years", description: "Create tech-packs for factories, research color forecasts, and communicate garment specs with suppliers." },
      { role: "Lead Designer", experience: "3-6 Years", description: "Develop seasonal collections, approve textile prints, and supervise garment fitting and pattern approvals." },
      { role: "Creative Director", experience: "6-10 Years", description: "Define a brand's visual identity, curate runway layouts, manage design budgets, and collaborate with marketing." },
      { role: "Brand Founder / CEO", experience: "10+ Years", description: "Direct commercial retail, manage supplier agreements, raise brand capital, and expand global D2C logistics." }
    ]
  },
  "chef": {
    indiaSalary: { entry: "₹3 - 5 LPA", mid: "₹6 - 12 LPA", senior: "₹15 - 35+ LPA", entryVal: 4, midVal: 9, seniorVal: 25 },
    globalSalary: { entry: "$35k - 50k USD", mid: "$60k - 95k USD", senior: "$110k - 200k+ USD", entryVal: 42, midVal: 77, seniorVal: 155 },
    marketDemand: {
      level: "Growing",
      description: "Driven by the growth of experimental dining startups, luxury hotels, and cloud kitchens."
    },
    growthProjections: {
      rate: "+14% YoY",
      timeframe: "2026 - 2032",
      insights: "Very safe from AI. Physical recipe execution, sensory tasting, and kitchen rushes cannot be automated."
    },
    enrichedSkills: {
      hard: ["Knife Mastery", "Cooking Techniques", "HACCP Safety Codes", "Menu Costing", "Kitchen Accounting"],
      soft: ["Kitchen Leadership", "Flavor Harmony", "Stamina under heat", "Team Pacing"],
      tools: ["Chef Knife", "Sous-vide cooker", "Commercial oven", "Baking scales", "Plating assets"]
    },
    degreePaths: {
      undergrad: ["B.Sc. in Culinary Arts", "B.Sc. in Hotel Management"],
      postgrad: ["Diploma in Pastry Arts", "Master in Hospitality Management"],
      exams: ["NCHMCT JEE"]
    },
    alternativePathways: ["Apprenticing as a prep helper", "Working in local cafes and climbing the kitchen ranks"],
    freelanceOpportunities: {
      viability: "Medium",
      roles: ["Private Chef", "Culinary Consultant", "Recipe Developer"],
      insights: "Cooking for high-end client events or consulting cafes on recipe costs pays good daily fees."
    },
    entrepreneurshipOpportunities: {
      viability: "High",
      models: ["Boutique Restaurant", "Cloud Kitchen Franchise", "Pastry Store Label"],
      insights: "Starting food franchises is profitable but requires heavy inventory cost management and licenses."
    },
    comparisonParams: {
      workLifeBalance: 5,
      educationCost: "Medium",
      flexibility: "Low",
      remoteOpportunities: "On-site",
      bestFor: "Hands-on food lovers who thrive in fast, heat-filled teams and enjoy cooking science.",
      typicalDay: "Inspecting meat/fish stocks, cooking custom sauces, managing kitchen line speed, and testing new recipes.",
      futureOutlook: "Steady. Rote fast-food has robot automation, but premium fine dining remains human."
    }
  }
};

/**
 * Merges base career item with enriched V13 fields, falling back to sensible defaults if key does not exist.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enrichCareerItem(item: any): CareerItem {
  const enrich = ENRICHED_DATA_MAP[item.id];

  if (enrich) {
    return {
      ...item,
      ...enrich,
      indiaSalary: enrich.indiaSalary || item.salary,
    };
  }

  // Generative fallback for secondary/missing careers to ensure zero TS errors
  const salRange = item.sal || [3, 8, 20];
  const indSal = {
    entry: `₹${salRange[0]} - ${salRange[0] + 3} LPA`,
    mid: `₹${salRange[1]} - ${salRange[1] + 6} LPA`,
    senior: `₹${salRange[2]} - ${salRange[2] + 20}+ LPA`,
    entryVal: salRange[0] + 1,
    midVal: salRange[1] + 3,
    seniorVal: salRange[2] + 10,
  };

  const genericEnrich = {
    indiaSalary: indSal,
    globalSalary: {
      entry: `$${salRange[0] * 10}k - ${(salRange[0] + 3) * 10}k USD`,
      mid: `$${salRange[1] * 10}k - ${(salRange[1] + 6) * 10}k USD`,
      senior: `$${salRange[2] * 10}k - ${(salRange[2] + 20) * 10}+ USD`,
      entryVal: salRange[0] * 10 + 5,
      midVal: salRange[1] * 10 + 10,
      seniorVal: salRange[2] * 10 + 20,
    },
    marketDemand: {
      level: (item.demandLevel || "Growing") as "High" | "Moderate" | "Growing" | "Niche",
      description: `Consistent requirements for ${item.title} professionals across regional market firms.`,
    },
    growthProjections: {
      rate: item.growthRate || "+12% YoY",
      timeframe: "2026 - 2032",
      insights: `Digital systems support basic tasks, while human coordination remains key to delivery.`,
    },
    enrichedSkills: {
      hard: item.hardSkills || ["Technical Execution", "Data Checks"],
      soft: item.softSkills || ["Problem Solving", "Adaptability"],
      tools: ["Domain Software Tools", "Communication suites"],
    },
    degreePaths: {
      undergrad: item.educationPath?.degrees || [`Bachelor in ${item.title}`],
      postgrad: ["Master specialization"],
      exams: item.educationPath?.entranceExams || ["National Level Entrances"],
    },
    alternativePathways: [item.educationPath?.alternatePaths || "Self-made portfolio assets"],
    freelanceOpportunities: {
      viability: "Medium" as "High" | "Medium" | "Low",
      roles: [`Consulting ${item.title}`],
      insights: "Gigs exist in corporate contract tasks and advisory boards.",
    },
    entrepreneurshipOpportunities: {
      viability: "Medium" as "High" | "Medium" | "Low",
      models: [`${item.title} Agency`],
      insights: "Starting boutique support teams provides steady expansion margins.",
    },
    comparisonParams: {
      workLifeBalance: 7,
      educationCost: "Medium" as "Low" | "Medium" | "High",
      flexibility: "Medium" as "Low" | "Medium" | "High",
      remoteOpportunities: "Hybrid" as "Remote" | "Hybrid" | "On-site" | "Rare",
      bestFor: `Analytical mindsets who enjoy executing core ${item.category} projects.`,
      typicalDay: `Synchronizing project backlogs, resolving errors, and aligning outputs with managers.`,
      futureOutlook: `Stable demand. Specialist capabilities will co-exist with automated AI agents.`,
    },
  };

  return {
    ...item,
    ...genericEnrich,
  };
}
