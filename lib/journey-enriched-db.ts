import { type CareerJourney, type JourneyScene, type JourneyOption } from "./journey-database";

export const ENRICHED_JOURNEYS: Record<string, Partial<CareerJourney>> = {
  lawyer: {
    stages: ["School", "College", "College", "Internship", "First Job", "First Job", "Senior Career"],
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
            consequence: "You build deep political theory foundations, but miss science logic.",
            emotionalConsequence: "You feel excited and aligned, but parents express concern about engineering routes.",
            professionalInsight: "Experts recommend humanities streams as they build crucial reading comprehension and analytical writing skills early.",
            scores: { analytical: 5, creativity: 10, collaboration: 8, risk: 10 },
            milestone: "Selected Humanities Stream"
          },
          {
            id: "b",
            label: "Choose Science (PCM) to train logical thinking and satisfy your family.",
            consequence: "You master rigorous logical proofs, but must study history in your spare time.",
            emotionalConsequence: "You feel secure and satisfy your family, but suffer exam stress.",
            professionalInsight: "A science background helps with intellectual property or patent law logic, but self-learning history is crucial.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Selected Science Stream"
          },
          {
            id: "c",
            label: "Choose Commerce with Legal Studies to learn business and audit fundamentals.",
            consequence: "You balance accounting basics with legal theory, keeping business routes open.",
            emotionalConsequence: "You find a balanced compromise; parent tension is minimized.",
            professionalInsight: "Corporate lawyers benefit heavily from early financial literacy, accounting, and business structures.",
            scores: { analytical: 10, creativity: 8, collaboration: 7, risk: 6 },
            milestone: "Selected Commerce-Legal Stream"
          }
        ]
      },
      {
        id: "law-2",
        stage: "College",
        character: "Prof. Nair",
        avatar: "👩‍🏫",
        text: "You are at National Law School. You have to select your mock court trial team topic. Which track do you choose?",
        options: [
          {
            id: "a",
            label: "Choose the International Human Rights mock trial brief.",
            consequence: "You research complex global treaties, public policy, and constitutional rights.",
            emotionalConsequence: "You feel motivated by the public interest, but overwhelmed by 1,000 pages of foreign court records.",
            professionalInsight: "Public advocacy moots train oral advocacy and pleading presence under intense panel cross-examination.",
            scores: { analytical: 8, creativity: 12, collaboration: 8, risk: 9 },
            milestone: "Prepared Human Rights Brief"
          },
          {
            id: "b",
            label: "Choose the Competition & Anti-trust corporate mock trial brief.",
            consequence: "You analyze market share metrics, corporate mergers, and anti-competitive trade practices.",
            emotionalConsequence: "You feel highly career-secure, though compiling market spreadsheets feels tedious.",
            professionalInsight: "Antitrust litigation is a premium skill valued by corporate firms representing big tech clients.",
            scores: { analytical: 14, creativity: 4, collaboration: 8, risk: 6 },
            milestone: "Mastered Antitrust Pleading"
          },
          {
            id: "c",
            label: "Choose the Tech Privacy & Algorithmic Regulation moot court brief.",
            consequence: "You debate algorithmic biases, user data licensing, and data collection safety rules.",
            emotionalConsequence: "You feel highly creative and forward-looking, addressing cutting-edge tech laws.",
            professionalInsight: "Technology and IP law is growing at 30% YoY due to global data compliance disputes.",
            scores: { analytical: 10, creativity: 10, collaboration: 10, risk: 8 },
            milestone: "Argued Tech Privacy Moot"
          }
        ]
      },
      {
        id: "law-3",
        stage: "College",
        character: "Intern Peer Rahul",
        avatar: "👨‍💼",
        text: "You are preparing the final moot submission. Rahul's drafted section is messy and full of citation errors. The deadline is tomorrow morning. Your move?",
        options: [
          {
            id: "a",
            label: "Stay up all night to rewrite and correct Rahul's citation blocks yourself.",
            consequence: "The brief is technically perfect, but Rahul feels insulted and ceases talking to you.",
            emotionalConsequence: "You feel exhausted and resentful, carrying the entire team load.",
            professionalInsight: "Moot teams succeed when peers review work, but lone-wolf takeovers damage collaboration.",
            scores: { analytical: 15, creativity: 5, collaboration: 3, risk: 8 },
            milestone: "Drafted Sole Brief"
          },
          {
            id: "b",
            label: "Submit the brief as-is, letting the judges notice Rahul's formatting errors.",
            consequence: "The team loses points on compliance formatting, but Rahul is forced to face his errors.",
            emotionalConsequence: "You feel initial relief, but face intense stress and defeat during oral rounds.",
            professionalInsight: "In law firms, partners evaluate teams collectively; a single associate's error affects the whole firm.",
            scores: { analytical: 5, creativity: 8, collaboration: 12, risk: 12 },
            milestone: "Delegated Moot Prep"
          },
          {
            id: "c",
            label: "Coordinate a late-night pair-review session to clean up the citations together.",
            consequence: "You format the document cleanly together. Rahul learns the correctBluebook style.",
            emotionalConsequence: "You feel balanced, cooperative, and secure in team capability.",
            professionalInsight: "Document peer auditing guarantees compliance and builds solid team work style.",
            scores: { analytical: 10, creativity: 10, collaboration: 15, risk: 5 },
            milestone: "Coordinated Team Brief"
          }
        ]
      },
      {
        id: "law-4",
        stage: "Internship",
        character: "Senior Advocate Meera",
        avatar: "👩‍⚖️",
        text: "During your internship, you discover a minor undisclosed environmental liability in a client's 500-page acquisition file late at night. What do you do?",
        options: [
          {
            id: "a",
            label: "Stay overnight to draft an exhaustive risk memorandum highlighting the hazard.",
            consequence: "Meera is highly impressed. The client negotiates a ₹10 Crore discount.",
            emotionalConsequence: "You feel exhausted from overwork, but Meera respects your dedication.",
            professionalInsight: "Thorough document auditing protects the client from future catastrophic environmental lawsuits.",
            scores: { analytical: 15, creativity: 5, collaboration: 8, risk: 5 },
            milestone: "Drafted Landmark Risk Memorandum"
          },
          {
            id: "b",
            label: "Inform the client's public relations team directly to prepare a press statement.",
            consequence: "The deal hits a compliance bottleneck, but you prevent a public relations crisis.",
            emotionalConsequence: "You feel public-advocacy pride, but chamber partners review your protocol access.",
            professionalInsight: "Informing PR without partner approval violates firm protocol, but protects public safety margins.",
            scores: { analytical: 5, creativity: 10, collaboration: 12, risk: 15 },
            milestone: "Prevented Public Relations Crisis"
          },
          {
            id: "c",
            label: "Schedule an audit mediation meeting with the other party to clarify the discrepancy.",
            consequence: "You resolve the issue out-of-court, amending the contract clauses amicably.",
            emotionalConsequence: "You feel balanced and collaborative, working out compromises.",
            professionalInsight: "Mediation is faster and cheaper than court battles; smart corporate lawyers resolve disputes through structured discussions.",
            scores: { analytical: 10, creativity: 8, collaboration: 10, risk: 5 },
            milestone: "Resolved Liability via Mediation"
          }
        ]
      },
      {
        id: "law-5",
        stage: "First Job",
        character: "Partner Malhotra",
        avatar: "👨‍💼",
        text: "A major tech client offers a ₹50 Lakh out-of-court settlement for a user privacy breach. Opposing counsel pushes to settle, but you suspect a trial could set a public precedent. Your move?",
        options: [
          {
            id: "a",
            label: "Advise client to accept the settlement to minimize cash risk.",
            consequence: "The client gets immediate cash flow, but the corporate data privacy system continues unregulated.",
            emotionalConsequence: "You feel secure about cash flows, but minor consumer guilt logs.",
            professionalInsight: "Settlements limit business litigation risks and represent standard corporate paths.",
            branchSet: "Corporate",
            scores: { analytical: 10, creativity: 5, collaboration: 15, risk: 5 },
            milestone: "Settled Landmark Tech Case"
          },
          {
            id: "b",
            label: "Push the client to reject the offer and proceed to public trial.",
            consequence: "It is a high-risk trial. The press covers every hearing. You win the case, establishing a national privacy precedent!",
            emotionalConsequence: "You feel high court stress and partner pressure, but gain massive public pride.",
            professionalInsight: "Trials establish precedents but are costly.",
            branchSet: "Civil",
            scores: { analytical: 8, creativity: 15, collaboration: 5, risk: 18 },
            milestone: "Won Public Privacy Trial"
          },
          {
            id: "c",
            label: "Propose a conditional settlement requiring the client to undergo independent code safety audits.",
            consequence: "The client pays the settlement and patches their databases, securing user records.",
            emotionalConsequence: "You feel collaborative, aligning engineers and opposing counsel.",
            professionalInsight: "Conditional settlements ensure system safety and build trust.",
            branchSet: "Consultant",
            scores: { analytical: 12, creativity: 8, collaboration: 12, risk: 8 },
            milestone: "Structured Audited Settlement"
          }
        ]
      },
      {
        id: "law-6",
        stage: "First Job",
        character: "Partner Malhotra",
        avatar: "👨‍💼",
        text: "You are invited to select your permanent specialization track at the firm. Which chamber do you join?",
        options: [
          {
            id: "a",
            label: "Join the Corporate Advisory & M&A practice.",
            consequence: "You focus on commercial transactions, seed rounds, and corporate audits.",
            emotionalConsequence: "You feel highly career-secure, though contract audits feel repetitive.",
            professionalInsight: "Corporate M&A constitutes the largest revenue generator for commercial law firms.",
            branchSet: "Corporate",
            scores: { analytical: 15, creativity: 5, collaboration: 10, risk: 6 },
            milestone: "Joined Corporate Advisory"
          },
          {
            id: "b",
            label: "Join the Trial Litigation and Courtroom Advocacy chamber.",
            consequence: "You manage civil disputes, file writs, and perform cross-examinations in court daily.",
            emotionalConsequence: "You feel high adrenaline and court trial stress, but build courtroom authority.",
            professionalInsight: "Litigation requires immediate oral reasoning, argument pacing, and procedural memory.",
            branchSet: "Civil",
            scores: { analytical: 8, creativity: 15, collaboration: 6, risk: 14 },
            milestone: "Joined Trial Advocacy Chamber"
          },
          {
            id: "c",
            label: "Join the Intellectual Property & Technology Law squad.",
            consequence: "You audit patent filings, software copyright licenses, and AI compliance policies.",
            emotionalConsequence: "You feel creative, working with innovative designers and programmers.",
            professionalInsight: "IP Law is expanding due to global digital licensing, representing a highly specialized niche.",
            branchSet: "Consultant",
            scores: { analytical: 10, creativity: 12, collaboration: 10, risk: 8 },
            milestone: "Joined IP & Tech Law Practice"
          }
        ]
      },
      {
        id: "law-7",
        stage: "Senior Career",
        character: "Registrar General",
        avatar: "🏛️",
        text: "You are now a seasoned legal authority. A major public interest litigation (PIL) challenges government digital surveillance. You are invited to argue the lead brief. How do you approach the bench?",
        options: [
          {
            id: "a",
            label: "Argue from a strict statutory interpretation angle, citing exact legal text rules.",
            consequence: "The court issues a structured, conservative ruling restricting surveillance parameters.",
            emotionalConsequence: "You feel proud of your legal precision; colleagues respect your logic.",
            professionalInsight: "Textual arguments are highly persuasive to conservative benches.",
            branchSet: "Consultant",
            scores: { analytical: 18, creativity: 5, collaboration: 8, risk: 5 },
            milestone: "Clipped Surveillance Overreach"
          },
          {
            id: "b",
            label: "Deliver a passionate defense based on fundamental human rights and privacy.",
            consequence: "The bench issues a historic judgment establishing privacy as an absolute constitutional right!",
            emotionalConsequence: "You feel a rush of moral victory, but face intense state lawyer resistance.",
            professionalInsight: "Constitutional litigation relies on fundamental human rights arguments.",
            branchSet: "Civil",
            scores: { analytical: 5, creativity: 18, collaboration: 10, risk: 15 },
            milestone: "Established Privacy Precedent"
          },
          {
            id: "c",
            label: "Recommend establishing a judicial oversight committee to monitor surveillance requests.",
            consequence: "The court adopts your structure, setting up a panel of retired judges for audit control.",
            emotionalConsequence: "You feel accomplished, establishing a permanent structural solution.",
            professionalInsight: "Judicial committees bridge national safety with personal rights; it shows high institutional leadership.",
            branchSet: "Corporate",
            scores: { analytical: 14, creativity: 8, collaboration: 14, risk: 10 },
            milestone: "Formed Oversight Committee"
          }
        ]
      }
    ]
  },
  "software-engineer": {
    stages: ["School", "College", "College", "Internship", "First Job", "First Job", "Senior Career"],
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
            emotionalConsequence: "You feel high analytical pressure but gain confidence in maths.",
            professionalInsight: "PCM CS is the most direct route to engineering colleges, building solid logical reasoning.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Entered Science Stream"
          },
          {
            id: "b",
            label: "Choose Commerce with Applied Math and self-teach coding.",
            consequence: "You balance business finance knowledge with online coding courses. Lower pressure, higher autonomy.",
            emotionalConsequence: "You feel relaxed and autonomous, but sometimes miss classroom CS peers.",
            professionalInsight: "Applied math + self-teaching builds coding pragmatism; many top SDEs come from Commerce.",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 10 },
            milestone: "Selected Commerce Stream"
          },
          {
            id: "c",
            label: "Choose Arts with Computer Applications, building web design portfolios.",
            consequence: "You focus on CSS layouts, HTML, and design theory, bypassing physics/chemistry load.",
            emotionalConsequence: "You feel creative and happy, but need to explain your path to tech recruiters.",
            professionalInsight: "UX Engineers and Frontend Architects frequently take arts backgrounds to combine design with code.",
            scores: { analytical: 6, creativity: 15, collaboration: 8, risk: 12 },
            milestone: "Selected Design-Arts Stream"
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
            emotionalConsequence: "You feel coding pride, but worry stakeholders won't understand the command-line display.",
            professionalInsight: "Machine learning backend structures are highly analytical; they require data scrubbing and model tuning.",
            scores: { analytical: 14, creativity: 6, collaboration: 5, risk: 10 },
            milestone: "Built ML Backend Engine"
          },
          {
            id: "b",
            label: "Design a stunning interactive web dashboard layout (Frontend/UI).",
            consequence: "Your dashboard looks incredibly premium. The judges love the smooth framer-motion micro-animations!",
            emotionalConsequence: "You feel creative satisfaction, but know the backend calculations are static mocks.",
            professionalInsight: "UI/UX engineering focuses on user retention and visual layouts; it requires design systems mastery.",
            scores: { analytical: 6, creativity: 15, collaboration: 12, risk: 5 },
            milestone: "Coded Premium React Dashboard"
          },
          {
            id: "c",
            label: "Lead as Product Owner: define the slide presentation and coordinate tasks.",
            consequence: "You bridge backend and UI teams, creating a compelling project pitch deck.",
            emotionalConsequence: "You feel collaborative leadership vibes, but write less actual code.",
            professionalInsight: "Product Managers lead hackathons by focusing on GTM pitches and aligning engineering blocks.",
            scores: { analytical: 8, creativity: 10, collaboration: 15, risk: 8 },
            milestone: "Led Hackathon Team Pitch"
          }
        ]
      },
      {
        id: "swe-3",
        stage: "College",
        character: "Intern Peer Amit",
        avatar: "🧑‍💻",
        text: "You are working on the final college code submission. Amit writes messy, undocumented code that breaks your deployment pipelines. The deadline is tomorrow morning. Your move?",
        options: [
          {
            id: "a",
            label: "Stay up all night to rewrite Amit's messy code blocks silently.",
            consequence: "The build succeeds, but Amit feels insulted and refuses to collaborate further.",
            emotionalConsequence: "You feel exhausted, resentful, and highly stressed by the sudden workload spike.",
            professionalInsight: "Quietly overriding colleagues' code fixes symptoms but causes long-term team friction.",
            scores: { analytical: 12, creativity: 5, collaboration: 4, risk: 9 },
            milestone: "Rewrote Codebase Blocks"
          },
          {
            id: "b",
            label: "Refuse to merge the code, waiting for Amit to clean it up himself.",
            consequence: "The code quality is preserved, but you miss the submission deadline, leading to a late mark.",
            emotionalConsequence: "You feel frustrated by team stagnation, but proud of your strict quality rules.",
            professionalInsight: "Refusing coordination bottlenecks shipping; engineers must balance code health with delivery targets.",
            scores: { analytical: 15, creativity: 3, collaboration: 6, risk: 3 },
            milestone: "Enforced Code Quality"
          },
          {
            id: "c",
            label: "Host a pair-programming refactor session to fix the blocks together.",
            consequence: "The pipeline clears, Amit learns standard Git/doc rules, and code quality is preserved.",
            emotionalConsequence: "You feel aligned, supported, and cooperative, resolving the bug amicably.",
            professionalInsight: "Pair debugging builds common code ownership and team capabilities early.",
            scores: { analytical: 8, creativity: 8, collaboration: 15, risk: 4 },
            milestone: "Conducted Pair Programming"
          }
        ]
      },
      {
        id: "swe-4",
        stage: "Internship",
        character: "Tech Lead Vikram",
        avatar: "👨‍💻",
        text: "You are an SDE intern. A critical bug causes database connections to bottleneck. Vikram asks for a solution: write a quick cache patch or rebuild the indexing layers. Your choice?",
        options: [
          {
            id: "a",
            label: "Deploy a quick Redis cache patch to resolve immediate connection logs.",
            consequence: "The servers recover immediately, but you introduce potential data syncing bugs later.",
            emotionalConsequence: "You feel relief under fast relief, but carry technical debt guilt.",
            professionalInsight: "Redis cache patches resolve high traffic spikes instantly; it is a pragmatic temporary fix.",
            scores: { analytical: 8, creativity: 10, collaboration: 10, risk: 12 },
            milestone: "Deployed Quick Cache Patch"
          },
          {
            id: "b",
            label: "Refactor database indexing rules to fix root read/write latency.",
            consequence: "The build takes longer, but ensures structural reliability and zero connection leaks.",
            emotionalConsequence: "You feel pride in clean engineering, though Vikram notes it delayed shipping.",
            professionalInsight: "Refactoring database indexes solves root bottlenecks; it is the correct engineering protocol.",
            scores: { analytical: 18, creativity: 4, collaboration: 8, risk: 4 },
            milestone: "Refactored Indexing Architectures"
          },
          {
            id: "c",
            label: "Configure auto-scaling triggers to spawn replica servers dynamically.",
            consequence: "Spawns new databases as traffic rises, distributing load cleanly.",
            emotionalConsequence: "You feel accomplished, but notice hosting budgets spike by 40%.",
            professionalInsight: "DevOps engineering uses auto-scaling to absorb traffic spikes; it balances speed but raises costs.",
            scores: { analytical: 12, creativity: 8, collaboration: 12, risk: 10 },
            milestone: "Configured DB Replica Auto-Scaling"
          }
        ]
      },
      {
        id: "swe-5",
        stage: "First Job",
        character: "Product Manager Priya",
        avatar: "👩‍💼",
        text: "As an SDE-1, you are invited to specialize. You can join the core Infrastructure team, or transition to the AI Agent prototyping squad. Which road do you take?",
        options: [
          {
            id: "a",
            label: "Join the AI Agent prototyping squad.",
            consequence: "You work directly on training guide agents using Large Language Models.",
            emotionalConsequence: "You feel exciting innovation energy, working with emerging APIs.",
            professionalInsight: "AI Engineering relies on model prompts and vector databases; it is fast-moving and high-value.",
            branchSet: "AI Engineer",
            scores: { analytical: 12, creativity: 15, collaboration: 8, risk: 10 },
            milestone: "Joined AI Agent Squad"
          },
          {
            id: "b",
            label: "Join the Core Infrastructure team to manage database clusters.",
            consequence: "You master Kubernetes deployments, pipeline orchestration, and server latency controls.",
            emotionalConsequence: "You feel secure in systems reliability, though routines feel repetitive.",
            professionalInsight: "Core infrastructure (SRE) manages cloud clustering and uptime; it requires strict safety control.",
            branchSet: "Backend",
            scores: { analytical: 16, creativity: 5, collaboration: 10, risk: 5 },
            milestone: "Joined Infrastructure Team"
          },
          {
            id: "c",
            label: "Join the Customer Interface team to lead design-to-code components.",
            consequence: "You code reusable React library components and coordinate with UI designers.",
            emotionalConsequence: "You feel visual satisfaction, styling animations and layouts.",
            professionalInsight: "Frontend specialists bridge styling and logic; it requires a high creativity score.",
            branchSet: "Frontend",
            scores: { analytical: 8, creativity: 18, collaboration: 12, risk: 6 },
            milestone: "Joined UI Component Squad"
          }
        ]
      },
      {
        id: "swe-6",
        stage: "First Job",
        character: "Product Manager Priya",
        avatar: "👩‍💼",
        text: "A severe memory leak is detected in the production server late at night, spiking server CPU to 99%. Your move?",
        options: [
          {
            id: "a",
            label: "Deploy a quick automated script to reboot servers whenever memory spikes.",
            consequence: "The servers stay online, but customers experience transient logout glitches.",
            emotionalConsequence: "You feel temporary relief, but worry about leaving the root leak unfixed.",
            professionalInsight: "Automated reboots bypass root diagnoses, accumulating technical debt.",
            branchSet: "Backend",
            scores: { analytical: 10, creativity: 5, collaboration: 10, risk: 15 },
            milestone: "Deployed Reboot Script"
          },
          {
            id: "b",
            label: "Spend 12 hours profiling heap memory dumps to trace and patch the leak.",
            consequence: "You find a circular reference in the caching module and patch it permanently.",
            emotionalConsequence: "You feel extreme fatigue but deep intellectual satisfaction.",
            professionalInsight: "Heap profiling isolates exact code leak nodes, preventing future server crashes.",
            branchSet: "AI Engineer",
            scores: { analytical: 18, creativity: 4, collaboration: 8, risk: 5 },
            milestone: "Patched Memory Leak"
          },
          {
            id: "c",
            label: "Configure static fallback pages and schedule the patch for low-traffic hours.",
            consequence: "Traffic routes cleanly to fallback mirrors. You resolve the issue safely during normal hours.",
            emotionalConsequence: "You feel calm and in control, avoiding midnight emergency coding.",
            professionalInsight: "Static failovers absorb traffic surges and protect engineering sanity.",
            branchSet: "Product Manager",
            scores: { analytical: 12, creativity: 8, collaboration: 12, risk: 8 },
            milestone: "Configured Failover Routine"
          }
        ]
      },
      {
        id: "swe-7",
        stage: "Senior Career",
        character: "CTO Maya",
        avatar: "👩‍💼",
        text: "You are now a Senior Staff Engineer. A massive data leak is detected. You must coordinate the containment. Do you push for system-wide service shut down or apply live patching?",
        options: [
          {
            id: "a",
            label: "Order a full system shutdown to secure user data completely.",
            consequence: "Operations stop and revenue drops, but you secure 100% of user data assets.",
            emotionalConsequence: "You feel intense business loss stress, but customer trust is saved.",
            professionalInsight: "Full shutdowns prioritize user safety and privacy, proving high ethical compliance.",
            branchSet: "Product Manager",
            scores: { analytical: 12, creativity: 5, collaboration: 18, risk: 5 },
            milestone: "Protected Customer Security Assets"
          },
          {
            id: "b",
            label: "Attempt live server hot patches while maintaining active operations.",
            consequence: "You deploy hot patches under extreme pressure. The patch succeeds, saving company uptime!",
            emotionalConsequence: "You feel absolute adrenaline relief, but exhaust your team over 18 hours.",
            professionalInsight: "Hot patching preserves service availability, but risks deploying unverified bugs.",
            branchSet: "AI Engineer",
            scores: { analytical: 15, creativity: 10, collaboration: 5, risk: 20 },
            milestone: "Executed Hot Patch Containment"
          },
          {
            id: "c",
            label: "Redirect target user traffic to a static read-only database backup server.",
            consequence: "Maintains read operations while you fix the main write databases safely.",
            emotionalConsequence: "You feel smart and strategic, keeping operations active with zero data leak risk.",
            professionalInsight: "Read-only failovers balance uptime with database protection; it is a top systems architect design.",
            branchSet: "Backend",
            scores: { analytical: 18, creativity: 8, collaboration: 12, risk: 10 },
            milestone: "Deployed Read-Only Failover"
          }
        ]
      }
    ]
  },
  doctor: {
    stages: ["School", "College", "College", "Internship", "First Job", "First Job", "Senior Career"],
    scenes: [
      {
        id: "doc-1",
        stage: "School",
        character: "Biology Mentor Dr. Rao",
        avatar: "👨‍⚕️",
        text: "You are in Grade 10. To follow medicine, you must take Biology (PCB). Preparing for the NEET exam requires sacrificing your debate team activities. Your choice?",
        options: [
          {
            id: "a",
            label: "Focus exclusively on NEET mock test papers.",
            consequence: "Your biology grades are high, but you feel isolated from debate peers.",
            emotionalConsequence: "You feel highly focused but miss team public speaking events.",
            professionalInsight: "Repetitive practice mock tests build memory retrieval required for competitive exams.",
            scores: { analytical: 15, creativity: 3, collaboration: 5, risk: 5 },
            milestone: "Focused on NEET Prep"
          },
          {
            id: "b",
            label: "Maintain debate club presence while self-studying biology journals.",
            consequence: "Your mock scores are borderline, but you master verbal arguments.",
            emotionalConsequence: "You feel happy and balanced, though parents worry about your rank margins.",
            professionalInsight: "Verbal communication skills are vital for future patient diagnostics and consults.",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 10 },
            milestone: "Maintained Debate Presence"
          },
          {
            id: "c",
            label: "Choose a Biotechnology stream with healthcare lab sciences.",
            consequence: "You learn lab testing protocols, bypassing traditional physics prep load.",
            emotionalConsequence: "You feel relieved and hands-on, discovering clinical testing environments.",
            professionalInsight: "Biotech tracks build solid pharmaceutical research foundations.",
            scores: { analytical: 10, creativity: 8, collaboration: 7, risk: 7 },
            milestone: "Selected Biotech Track"
          }
        ]
      },
      {
        id: "doc-2",
        stage: "College",
        character: "Professor Sen",
        avatar: "👩‍⚕️",
        text: "You are in medical college. You must choose a clinical observation rotation track. Which do you choose?",
        options: [
          {
            id: "a",
            label: "Choose the Cardiology ICU rotation.",
            consequence: "You study high-stress heart monitors, pacemaker logs, and cardiac arrest triages.",
            emotionalConsequence: "You feel intellectually charged, but experience high anxiety levels.",
            professionalInsight: "Cardiology is analytical and structured, requiring rapid diagnostic math.",
            scores: { analytical: 14, creativity: 6, collaboration: 5, risk: 10 },
            milestone: "Joined Cardiology Observation"
          },
          {
            id: "b",
            label: "Choose the Emergency Trauma ER rotation.",
            consequence: "You assist on accident intakes, suturing wounds under immediate pressure.",
            emotionalConsequence: "You experience massive adrenaline spikes and sleep deprivation.",
            professionalInsight: "Emergency medicine tests immediate diagnostic reasoning under severe time constraints.",
            scores: { analytical: 8, creativity: 10, collaboration: 10, risk: 12 },
            milestone: "Joined ER Trauma Observation"
          },
          {
            id: "c",
            label: "Choose the Pediatrics clinic rotation.",
            consequence: "You observe childhood growth cycles, immunizations, and child psychology.",
            emotionalConsequence: "You feel empathetic warmth and enjoy communicating with families.",
            professionalInsight: "Pediatrics requires high verbal empathy and relationship-building skills.",
            scores: { analytical: 10, creativity: 10, collaboration: 10, risk: 5 },
            milestone: "Joined Pediatrics Observation"
          }
        ]
      },
      {
        id: "doc-3",
        stage: "College",
        character: "Resident Colleague Dr. Amit",
        avatar: "🧑‍⚕️",
        text: "It is shift handover. Amit forgets to record a critical patient's medication dose updates in the logs. Your move?",
        options: [
          {
            id: "a",
            label: "Update the chart yourself based on verbal logs, without confronting Amit.",
            consequence: "The patient is safe, but Amit repeats the log error on his next shift.",
            emotionalConsequence: "You feel tired and resentful, doing double log audits.",
            professionalInsight: "Chart logs require accurate ownership tracking to trace dosage histories.",
            scores: { analytical: 12, creativity: 5, collaboration: 5, risk: 8 },
            milestone: "Updated Ward Charts"
          },
          {
            id: "b",
            label: "Report Amit's negligence to the HOD immediately.",
            consequence: "Amit receives a formal warning, creating heavy department tension.",
            emotionalConsequence: "You feel secure in protocol compliance but experience workplace isolation.",
            professionalInsight: "Reporting protocol protects patients, but talking to peers first prevents team breakdown.",
            scores: { analytical: 15, creativity: 2, collaboration: 4, risk: 5 },
            milestone: "Filed Negligence Report"
          },
          {
            id: "c",
            label: "Call Amit back to the ward to review and update the charts together.",
            consequence: "The records are updated cleanly. Amit realizes the hazard and thanks you.",
            emotionalConsequence: "You feel collaborative, supported, and confident in team trust.",
            professionalInsight: "Accountability is best established through collaborative peer checks in wards.",
            scores: { analytical: 8, creativity: 8, collaboration: 15, risk: 4 },
            milestone: "Resolved Chart Discrepancy"
          }
        ]
      },
      {
        id: "doc-4",
        stage: "Internship",
        character: "Chief Resident Sen",
        avatar: "👩‍⚕️",
        text: "A patient refuses an emergency blood transfusion due to spiritual beliefs. What do you do?",
        options: [
          {
            id: "a",
            label: "Accept their choice immediately and document it.",
            consequence: "You respect autonomy, but the patient's vitals deteriorate.",
            emotionalConsequence: "You feel morally split and carry heavy professional concern.",
            professionalInsight: "Autonomy is a key legal pillar, but doctors must fully explain risk margins first.",
            scores: { analytical: 10, creativity: 5, collaboration: 10, risk: 5 },
            milestone: "Respected Patient Autonomy"
          },
          {
            id: "b",
            label: "Perform the transfusion while they are sedated.",
            consequence: "The patient survives, but sues the hospital for battery.",
            emotionalConsequence: "You experience extreme panic under legal inquiry.",
            professionalInsight: "Transfusions without consent represent serious battery, violating medical law.",
            scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 20 },
            milestone: "Transfused Without Consent"
          },
          {
            id: "c",
            label: "Consult on alternatives like non-blood expanders.",
            consequence: "You find a safe clinical compromise, and the patient recovers.",
            emotionalConsequence: "You feel proud, creative, and collaborative under pressure.",
            professionalInsight: "Exploring blood alternatives respects patient beliefs while preserving life.",
            scores: { analytical: 15, creativity: 10, collaboration: 10, risk: 5 },
            milestone: "Administered Blood Expanders"
          }
        ]
      },
      {
        id: "doc-5",
        stage: "First Job",
        character: "Dr. Rao",
        avatar: "👨‍⚕️",
        text: "The ER has two critical triage cases but only one senior ventilator is open. Your move?",
        options: [
          {
            id: "a",
            label: "Allocate it to the patient with higher survival odds.",
            consequence: "The selected patient recovers; the other patient's family grieves.",
            emotionalConsequence: "You experience extreme ethical fatigue and triage stress.",
            professionalInsight: "Utilitarian triage is standard protocol during acute resource bottlenecks.",
            branchSet: "Emergency Medicine",
            scores: { analytical: 15, creativity: 3, collaboration: 8, risk: 8 },
            milestone: "Executed Triage Allocation"
          },
          {
            id: "b",
            label: "Allocate it to a high-paying VIP board member's relative.",
            consequence: "The relative lives. Other doctors file an ethical complaint.",
            emotionalConsequence: "You feel guilt-ridden and face code of conduct reviews.",
            professionalInsight: "VIP favoritism violates healthcare compliance guidelines.",
            branchSet: "Hospital Administrator",
            scores: { analytical: 1, creativity: 1, collaboration: 1, risk: 15 },
            milestone: "Allocated VIP Ventilator"
          },
          {
            id: "c",
            label: "Transfer the second patient to a partner hospital via ICU ambulance.",
            consequence: "Both patients survive, though the transit was highly risky.",
            emotionalConsequence: "You experience extreme stress followed by massive relief.",
            professionalInsight: "Inter-hospital network coordination resolves local resource limits.",
            branchSet: "Cardiology",
            scores: { analytical: 10, creativity: 10, collaboration: 15, risk: 10 },
            milestone: "Coordinated ICU Transfer"
          }
        ]
      },
      {
        id: "doc-6",
        stage: "First Job",
        character: "Hospital Director",
        avatar: "👩‍💼",
        text: "You are ready for senior residency specialization. Which fellowship do you join?",
        options: [
          {
            id: "a",
            label: "Join the Cardiothoracic Surgery fellowship.",
            consequence: "You manage bypass circuits, open-heart operations, and valve repairs.",
            emotionalConsequence: "You experience intense cognitive focus, long hours, and high stakes.",
            professionalInsight: "Cardiology fellowships require precise diagnostic math and steady hand control.",
            branchSet: "Cardiology",
            scores: { analytical: 18, creativity: 5, collaboration: 6, risk: 12 },
            milestone: "Entered Surgery Fellowship"
          },
          {
            id: "b",
            label: "Join the Emergency Trauma ER residency.",
            consequence: "You lead ER night shifts, managing multiple trauma intakes.",
            emotionalConsequence: "You feel high-adrenaline, rapid decisions, and erratic sleep.",
            professionalInsight: "ER trauma doctors handle severe clinical uncertainty, pacing triage streams.",
            branchSet: "Emergency Medicine",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 15 },
            milestone: "Entered Trauma Residency"
          },
          {
            id: "c",
            label: "Join the Pediatrics and Community Clinic track.",
            consequence: "You manage childhood growth, developmental diagnostics, and vaccines.",
            emotionalConsequence: "You feel empathetic joy, working in stable daylight hours.",
            professionalInsight: "Pediatric clinic directors focus on diagnostic communication and preventative health.",
            branchSet: "Pediatrics",
            scores: { analytical: 10, creativity: 12, collaboration: 10, risk: 5 },
            milestone: "Entered Pediatrics Track"
          }
        ]
      },
      {
        id: "doc-7",
        stage: "Senior Career",
        character: "Health Minister",
        avatar: "🏛️",
        text: "An outbreak requires vaccine deployment across the region. How do you lead?",
        options: [
          {
            id: "a",
            label: "Deploy strict localized containment quarantine measures.",
            consequence: "Outbreak stops, but local trade collapses.",
            emotionalConsequence: "You feel under fire, but public safety is saved.",
            professionalInsight: "Quarantines are effective but economically harsh.",
            branchSet: "Emergency Medicine",
            scores: { analytical: 15, creativity: 5, collaboration: 10, risk: 8 },
            milestone: "Enforced Regional Quarantine"
          },
          {
            id: "b",
            label: "Lead vaccine clinical trials and speed up approvals.",
            consequence: "Vaccine deployed in 6 months, regional population immunized.",
            emotionalConsequence: "You feel exhilarated, proud of scientific breakthrough.",
            professionalInsight: "Clinical trial pacing requires strict audit records.",
            branchSet: "Cardiology",
            scores: { analytical: 18, creativity: 10, collaboration: 8, risk: 12 },
            milestone: "Accelerated Vaccine Trial"
          },
          {
            id: "c",
            label: "Build a public-private network of diagnostic labs and clinics.",
            consequence: "Diagnostics scaled by 300%, caseload drops.",
            emotionalConsequence: "You feel accomplished, structural leader.",
            professionalInsight: "Public health integration scales diagnostics.",
            branchSet: "Hospital Administrator",
            scores: { analytical: 12, creativity: 8, collaboration: 18, risk: 6 },
            milestone: "Led National Health Council"
          }
        ]
      }
    ]
  },
  "fashion-designer": {
    stages: ["School", "College", "College", "Internship", "First Job", "First Job", "Senior Career"],
    scenes: [
      {
        id: "fas-1",
        stage: "School",
        character: "Art Teacher Ms. Sen",
        avatar: "👩‍🎨",
        text: "You want to prepare for NIFT. Your parents recommend taking Commerce for business skills. Your stream choice?",
        options: [
          {
            id: "a",
            label: "Choose Arts/Design and focus on sketch portfolios.",
            consequence: "You master illustration and color theory, though you must learn cash flow ledgers later.",
            emotionalConsequence: "You feel creative and happy, but face parental worry.",
            professionalInsight: "Design portfolios require strong color coordination and drawing fundamentals.",
            scores: { analytical: 5, creativity: 15, collaboration: 6, risk: 8 },
            milestone: "Built Sketch Portfolio"
          },
          {
            id: "b",
            label: "Choose Commerce to learn accounting and market economics.",
            consequence: "You master cash flow logic, but study sketching in free time.",
            emotionalConsequence: "You feel secure and balanced, but suffer exam prep stress.",
            professionalInsight: "Accounting skills are vital for managing design fabric margins.",
            scores: { analytical: 12, creativity: 8, collaboration: 8, risk: 5 },
            milestone: "Selected Commerce Track"
          },
          {
            id: "c",
            label: "Choose Vocational Apparel Science and manufacturing details.",
            consequence: "You learn fabric chemistry, dye runs, and pattern stitching.",
            emotionalConsequence: "You feel practical and hands-on, discovering textile labs.",
            professionalInsight: "Textile science builds a solid foundation for sustainable material sourcing.",
            scores: { analytical: 10, creativity: 10, collaboration: 7, risk: 6 },
            milestone: "Selected Apparel Science"
          }
        ]
      },
      {
        id: "fas-2",
        stage: "College",
        character: "Prof. Kapoor",
        avatar: "🧔",
        text: "It is collection design week. Which collection theme do you submit?",
        options: [
          {
            id: "a",
            label: "Sustainable Haute Couture using recycled metals and plastics.",
            consequence: "High creative praise, but material sourcing is expensive.",
            emotionalConsequence: "You feel proud and eco-focused, but budget stress rises.",
            professionalInsight: "Haute couture values pattern aesthetics; sustainable materials require green audits.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 8, creativity: 16, collaboration: 6, risk: 12 },
            milestone: "Designed Recycled Collection"
          },
          {
            id: "b",
            label: "Cinematic Costume History based on old epics.",
            consequence: "Deep historical research, intricate drapes, and high detail.",
            emotionalConsequence: "You feel immersed in historical storytelling, despite a heavy pattern workload.",
            professionalInsight: "Costume design relies on narrative history and period-accurate textile draping.",
            branchSet: "Costume Design",
            scores: { analytical: 12, creativity: 12, collaboration: 8, risk: 8 },
            milestone: "Designed Historical Collection"
          },
          {
            id: "c",
            label: "Streetwear D2C line for urban youth.",
            consequence: "Simple fits, bold prints, and scalable factory specs.",
            emotionalConsequence: "You feel commercially excited, tracking manufacturing speeds.",
            professionalInsight: "Streetwear brands focus on volume sales and digital catalog retail margins.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 10, creativity: 10, collaboration: 14, risk: 8 },
            milestone: "Designed Streetwear Line"
          }
        ]
      },
      {
        id: "fas-3",
        stage: "College",
        character: "Backstage Coordinator Pooja",
        avatar: "👩‍🎨",
        text: "The main shipping crate containing your collection is delayed. The show starts in 2 hours. Your move?",
        options: [
          {
            id: "a",
            label: "Work backstage all night to stitch replacement outfits yourself.",
            consequence: "Outfits are ready, but you are physically exhausted for show day.",
            emotionalConsequence: "You experience extreme stress and physical fatigue.",
            professionalInsight: "Manual recovery works in crises, but exhausts design scaling capacities.",
            scores: { analytical: 10, creativity: 12, collaboration: 4, risk: 14 },
            milestone: "Hand-Stitched Show Backups"
          },
          {
            id: "b",
            label: "Cancel the delayed segment and present only completed pieces.",
            consequence: "A safe and structured presentation, but the runway catalog feels short.",
            emotionalConsequence: "You feel disappointed but experience lower stress levels.",
            professionalInsight: "Editing collection size preserves presentation quality and protects designer sanity.",
            scores: { analytical: 12, creativity: 5, collaboration: 8, risk: 4 },
            milestone: "Edited Runway Collection"
          },
          {
            id: "c",
            label: "Redrape existing showroom fabrics backstage using creative pinning.",
            consequence: "The runway collection is improvised. Critics praise the unique draping style!",
            emotionalConsequence: "You feel high adrenaline, collaborative relief, and creative joy.",
            professionalInsight: "Improvised styling backstage is a key capability for runway directors.",
            scores: { analytical: 8, creativity: 18, collaboration: 12, risk: 10 },
            milestone: "Styled Improvised Runway"
          }
        ]
      },
      {
        id: "fas-4",
        stage: "Internship",
        character: "Factory Manager Rohit",
        avatar: "🧔",
        text: "A supplier offers a cheap toxic chemical dye that cuts manufacturing cost by 40%. Rohit asks for your specs. Your move?",
        options: [
          {
            id: "a",
            label: "Reject the dye and maintain strict organic fabric specs.",
            consequence: "Sourcing cost is higher, but the collection meets organic guidelines.",
            emotionalConsequence: "You feel ethical pride, despite high budget tension.",
            professionalInsight: "Fabric compliance audits protect brand labels from regulatory fines.",
            scores: { analytical: 12, creativity: 5, collaboration: 10, risk: 4 },
            milestone: "Enforced Organic Standards"
          },
          {
            id: "b",
            label: "Use the cheap dye to maximize collection margins.",
            consequence: "The fabric looks fine, but fails retail chemical safety checks later.",
            emotionalConsequence: "You experience guilt and constant anxiety regarding auditing tests.",
            professionalInsight: "Toxic dyes violate environmental compliance codes, risking brand bans.",
            scores: { analytical: 4, creativity: 5, collaboration: 5, risk: 18 },
            milestone: "Used Budget Dyes"
          },
          {
            id: "c",
            label: "Negotiate a volume discount on soy-based organic dyes.",
            consequence: "Cost drops by 15%, maintaining eco-friendly specifications.",
            emotionalConsequence: "You feel accomplished, finding a balanced commercial compromise.",
            professionalInsight: "Volume retainer agreements secure better pricing on certified green textiles.",
            scores: { analytical: 10, creativity: 10, collaboration: 12, risk: 6 },
            milestone: "Negotiated Organic Retainer"
          }
        ]
      },
      {
        id: "fas-5",
        stage: "First Job",
        character: "Brand Manager Priya",
        avatar: "👩‍💼",
        text: "A high-profile celebrity client demands an overnight alteration on their gala dress. Your move?",
        options: [
          {
            id: "a",
            label: "Accept the remake, staying up 18 hours to hand-stitch.",
            consequence: "The celebrity wears the dress, and the label goes viral on social feeds.",
            emotionalConsequence: "You feel absolute physical burnout, but massive pride.",
            professionalInsight: "High-profile events require rapid execution under immediate deadlines.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 8, creativity: 15, collaboration: 8, risk: 16 },
            milestone: "Delivered Gala Dress"
          },
          {
            id: "b",
            label: "Refuse the remake, explaining that garment specs cannot be rushed.",
            consequence: "The client drops your label, but you protect team boundaries.",
            emotionalConsequence: "You feel nervous about public fallout, but calm inside.",
            professionalInsight: "Setting styling boundaries preserves quality and protects staff capacities.",
            branchSet: "Costume Design",
            scores: { analytical: 12, creativity: 4, collaboration: 12, risk: 5 },
            milestone: "Enforced Design Boundaries"
          },
          {
            id: "c",
            label: "Alter the dress using modular pre-made corset overlays.",
            consequence: "The alteration takes 3 hours, and the client is thrilled with the modular look.",
            emotionalConsequence: "You feel clever, collaborative, and highly relieved.",
            professionalInsight: "Modular pattern designs allow rapid customization under severe deadlines.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 14, creativity: 12, collaboration: 10, risk: 8 },
            milestone: "Executed Modular Alteration"
          }
        ]
      },
      {
        id: "fas-6",
        stage: "First Job",
        character: "Fashion Director Sen",
        avatar: "👩‍🎨",
        text: "You are ready to choose your design niche. Which track do you join?",
        options: [
          {
            id: "a",
            label: "Join the Sustainable Haute Couture design house.",
            consequence: "You design custom garments using recycled textiles for Paris and Milan runways.",
            emotionalConsequence: "You feel artistic fulfillment, despite intense styling scrutiny.",
            professionalInsight: "Haute couture focuses on precise pattern making and draping aesthetics.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 10, creativity: 18, collaboration: 8, risk: 10 },
            milestone: "Specialized in Luxury Couture"
          },
          {
            id: "b",
            label: "Join the Movie Studio Costume design squad.",
            consequence: "You recreate historical garments and sci-fi armor for major movie sets.",
            emotionalConsequence: "You feel creative immersion in visual storytelling with filming crews.",
            professionalInsight: "Costume design balances script character details with textile flexibility.",
            branchSet: "Costume Design",
            scores: { analytical: 12, creativity: 14, collaboration: 12, risk: 6 },
            milestone: "Specialized in Costume Design"
          },
          {
            id: "c",
            label: "Launch an independent sustainable D2C fashion label.",
            consequence: "You manage supplier logistics and manufacture catalog designs for online retail.",
            emotionalConsequence: "You feel autonomous, though financial inventory stress is high.",
            professionalInsight: "Fashion entrepreneurship requires digital GTM marketing and cost-per-click strategies.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 14, creativity: 10, collaboration: 12, risk: 15 },
            milestone: "Launched eCommerce Brand"
          }
        ]
      },
      {
        id: "fas-7",
        stage: "Senior Career",
        character: "Runway Producer",
        avatar: "🏛️",
        text: "It is Milan Fashion Week finale. Which collection do you present?",
        options: [
          {
            id: "a",
            label: "Present avant-garde structured metal and glass couture.",
            consequence: "Critics hail it as a masterpiece; you win a global design award.",
            emotionalConsequence: "You feel artistic vindication and immense creative joy.",
            professionalInsight: "Avant-garde designs challenge wearability limits, establishing high-end brand authority.",
            branchSet: "Luxury Fashion",
            scores: { analytical: 8, creativity: 20, collaboration: 8, risk: 15 },
            milestone: "Won Milan Design Award"
          },
          {
            id: "b",
            label: "Present hand-woven silk designs supporting rural artisans.",
            consequence: "Rural weaver cooperatives secure bulk orders, restoring local heritage.",
            emotionalConsequence: "You feel deep social pride and cultural connection.",
            professionalInsight: "Heritage preservation builds high emotional connection, supporting manufacturing ecosystems.",
            branchSet: "Costume Design",
            scores: { analytical: 14, creativity: 14, collaboration: 10, risk: 6 },
            milestone: "Preserved Heritage Silks"
          },
          {
            id: "c",
            label: "Present a fully modular, biodegradable streetwear catalog.",
            consequence: "You secure a ₹10 Crore retail distribution contract with major malls.",
            emotionalConsequence: "You feel commercial security and business relief.",
            professionalInsight: "Catalog wearability is key to scaling retail supply volumes.",
            branchSet: "Fashion Brand Founder",
            scores: { analytical: 12, creativity: 12, collaboration: 18, risk: 10 },
            milestone: "Secured Retail Deal"
          }
        ]
      }
    ]
  },
  entrepreneur: {
    stages: ["School", "College", "College", "Internship", "First Job", "First Job", "Senior Career"],
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
            emotionalConsequence: "You feel confident in technical skills, despite heavy JEE exam pressure.",
            professionalInsight: "Technical founders build early MVPs directly, reducing seed code costs.",
            scores: { analytical: 15, creativity: 5, collaboration: 5, risk: 5 },
            milestone: "Selected Technical Track"
          },
          {
            id: "b",
            label: "Choose Commerce to study economics and sales pitching.",
            consequence: "You master accounting and business law, but must hire technical developers later.",
            emotionalConsequence: "You feel relaxed and social, though parents question engineering bypass.",
            professionalInsight: "Early financial literacy is critical for runway budgeting and cash burn math.",
            scores: { analytical: 8, creativity: 8, collaboration: 12, risk: 10 },
            milestone: "Selected Business Track"
          },
          {
            id: "c",
            label: "Choose Humanities to focus on social campaign design.",
            consequence: "You study public policy and media, focusing on social enterprise models.",
            emotionalConsequence: "You feel motivated by community impacts, though parents show doubt.",
            professionalInsight: "Social entrepreneurs rely on public trust, storytelling, and NGO grant structures.",
            scores: { analytical: 5, creativity: 12, collaboration: 10, risk: 12 },
            milestone: "Selected Social Track"
          }
        ]
      },
      {
        id: "ent-2",
        stage: "College",
        character: "Incubator Director Raj",
        avatar: "🧔",
        text: "You have your startup idea. How do you validate it at college?",
        options: [
          {
            id: "a",
            label: "Spend 3 months coding a detailed functional software MVP.",
            consequence: "You have a working app, but discover users find the flow complex.",
            emotionalConsequence: "You feel coding pride, but face anxiety over user onboarding logs.",
            professionalInsight: "Coding before validation risks building features that users don't require.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 14, creativity: 6, collaboration: 6, risk: 8 },
            milestone: "Coded Software MVP"
          },
          {
            id: "b",
            label: "Launch a simple landing page, signing up 100 waitlist users in a week.",
            consequence: "You validate market demand instantly with zero code investment.",
            emotionalConsequence: "You feel excited by the metric signals, despite code absence pressure.",
            professionalInsight: "Waitlists validate GTM interest with minimum resource waste.",
            branchSet: "D2C Retail",
            scores: { analytical: 8, creativity: 12, collaboration: 10, risk: 10 },
            milestone: "Launched Waitlist Page"
          },
          {
            id: "c",
            label: "Conduct 30 in-depth user interview sessions regarding their pain points.",
            consequence: "You compile deep pain point data, modifying your pricing model.",
            emotionalConsequence: "You feel highly connected to users, though no assets are built yet.",
            professionalInsight: "Qualitative research helps map pricing value metrics before coding.",
            branchSet: "Social Enterprise",
            scores: { analytical: 10, creativity: 10, collaboration: 12, risk: 5 },
            milestone: "Conducted User Audits"
          }
        ]
      },
      {
        id: "ent-3",
        stage: "College",
        character: "Co-Founder Rohit",
        avatar: "🧔",
        text: "Rohit wants to hire a designer to clean up the UI, but you want a backend developer. Your budget only allows one. Your move?",
        options: [
          {
            id: "a",
            label: "Enforce hiring the backend developer to build core features.",
            consequence: "Features ship on time, but the UI looks amateur, driving away initial users.",
            emotionalConsequence: "You feel secure in code health, despite constant user UI complaints.",
            professionalInsight: "Backend stability is vital, but poor UI design increases early user churn.",
            scores: { analytical: 12, creativity: 4, collaboration: 6, risk: 8 },
            milestone: "Hired Lead Developer"
          },
          {
            id: "b",
            label: "Agree to hire the designer, mapping out premium UX flows.",
            consequence: "The prototype looks stunning, helping you align early investor checks.",
            emotionalConsequence: "You feel creative satisfaction, though shipping speed slows.",
            professionalInsight: "Beautiful UI mocks are persuasive to angel investors during seed pitches.",
            scores: { analytical: 4, creativity: 15, collaboration: 10, risk: 8 },
            milestone: "Hired Lead Designer"
          },
          {
            id: "c",
            label: "Hire a freelance designer and outsource coding tasks.",
            consequence: "You balance both needs via contracts, though project costs rise.",
            emotionalConsequence: "You feel collaborative relief, coordinating separate contract lines.",
            professionalInsight: "Outsourcing helps early startups test MVPs without high staff cost burn rates.",
            scores: { analytical: 8, creativity: 10, collaboration: 15, risk: 10 },
            milestone: "Outsourced App Prototypes"
          }
        ]
      },
      {
        id: "ent-4",
        stage: "Internship",
        character: "Investor Malhotra",
        avatar: "👨‍💼",
        text: "An investor offers a ₹50 Lakh seed check, but demands 40% equity in return. Your move?",
        options: [
          {
            id: "a",
            label: "Reject the offer, choosing to bootstrap using customer sales.",
            consequence: "You maintain 100% control, but growth velocity is slow.",
            emotionalConsequence: "You feel proud of autonomy, but carry high cash flow anxiety.",
            professionalInsight: "Bootstrapping protects equity control, limiting dilution margins.",
            scores: { analytical: 12, creativity: 8, collaboration: 5, risk: 15 },
            milestone: "Bootstrapped Operations"
          },
          {
            id: "b",
            label: "Accept the funding, giving up the 40% equity.",
            consequence: "You secure runway and hire staff, but the board directs exit plans.",
            emotionalConsequence: "You feel financial relief, but lose sole control of strategic pivots.",
            professionalInsight: "High early dilution reduces founder payouts during future exits.",
            scores: { analytical: 10, creativity: 5, collaboration: 12, risk: 8 },
            milestone: "Secured Seed Capital"
          },
          {
            id: "c",
            label: "Negotiate a convertible note bridges at 15% equity cap.",
            consequence: "You secure immediate runway while deferring valuation debates to the next round.",
            emotionalConsequence: "You feel smart, resolving finance conflicts cleanly.",
            professionalInsight: "Convertible notes defer equity disputes, using interest caps to protect founders.",
            scores: { analytical: 15, creativity: 10, collaboration: 10, risk: 6 },
            milestone: "Structured Convertible Note"
          }
        ]
      },
      {
        id: "ent-5",
        stage: "First Job",
        character: "Board Director Malhotra",
        avatar: "👨‍💼",
        text: "A database outage blocks user transactions during a major marketing campaign. Your move?",
        options: [
          {
            id: "a",
            label: "Deploy replica failover servers immediately, losing 2 hours of data logs.",
            consequence: "Checkouts restore in 10 minutes, saving sales volumes.",
            emotionalConsequence: "You feel rapid recovery relief, despite losing minor audit trails.",
            professionalInsight: "Failover replicas restore commerce uptime, prioritizing revenue recovery.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 14, creativity: 6, collaboration: 10, risk: 10 },
            milestone: "Restored Checkout Servers"
          },
          {
            id: "b",
            label: "Stop transactions for 4 hours to run database integrity checks.",
            consequence: "You lose zero transaction data logs, but miss ₹5 Lakhs in sales.",
            emotionalConsequence: "You feel stress over revenue loss, despite code data safety.",
            professionalInsight: "Integrity audits preserve transaction records, complying with finance rules.",
            branchSet: "Social Enterprise",
            scores: { analytical: 18, creativity: 2, collaboration: 8, risk: 4 },
            milestone: "Executed Database Audit"
          },
          {
            id: "c",
            label: "Route checkouts manually via a third-party payment link.",
            consequence: "Checkouts continue, but you pay a 5% higher API transaction commission.",
            emotionalConsequence: "You feel coordinated and calm, implementing backup plans.",
            professionalInsight: "API redundancy mitigates server outages at a slightly higher fee margin.",
            branchSet: "D2C Retail",
            scores: { analytical: 10, creativity: 10, collaboration: 15, risk: 8 },
            milestone: "Routed Alternative APIs"
          }
        ]
      },
      {
        id: "ent-6",
        stage: "First Job",
        character: "Lead Director Priya",
        avatar: "👩‍💼",
        text: "Your core product growth slows. You must pivot to scale. Which segment do you focus on?",
        options: [
          {
            id: "a",
            label: "Pivot to an Enterprise B2B SaaS software model.",
            consequence: "You secure corporate clients with high annual contracts, stabilizing runway.",
            emotionalConsequence: "You feel corporate stability, despite long enterprise sales cycles.",
            professionalInsight: "B2B SaaS features high contract values and recurring subscription revenues.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 15, creativity: 6, collaboration: 10, risk: 12 },
            milestone: "Specialized in B2B SaaS"
          },
          {
            id: "b",
            label: "Pivot to a social utility grid solar model.",
            consequence: "You deploy mini-grids to schools, winning global NGO grants.",
            emotionalConsequence: "You feel deep social purpose, despite grant funding compliance logs.",
            professionalInsight: "Social enterprises rely on community compliance and philanthropic grants.",
            branchSet: "Social Enterprise",
            scores: { analytical: 10, creativity: 10, collaboration: 12, risk: 10 },
            milestone: "Specialized in Social Impact"
          },
          {
            id: "c",
            label: "Pivot to a sustainable consumer goods D2C brand.",
            consequence: "You build apparel lines, running digital ads and factory supply checks.",
            emotionalConsequence: "You feel creative design pride, despite factory inventory latency.",
            professionalInsight: "D2C ecommerce requires digital brand building and product logistics.",
            branchSet: "D2C Retail",
            scores: { analytical: 8, creativity: 16, collaboration: 12, risk: 14 },
            milestone: "Specialized in D2C Retail"
          }
        ]
      },
      {
        id: "ent-7",
        stage: "Senior Career",
        character: "Board Chairman",
        avatar: "🏛️",
        text: "You are now CEO. An acquisition offer of ₹50 Crores lands, or you can list an IPO. Your choice?",
        options: [
          {
            id: "a",
            label: "Sell the startup for the ₹50 Crore exit.",
            consequence: "You secure financial exit, transitioning into a startup investor.",
            emotionalConsequence: "You feel immense pride and absolute financial security.",
            professionalInsight: "Exits realize equity value, allowing founders to bootstrap new investments.",
            branchSet: "D2C Retail",
            scores: { analytical: 14, creativity: 5, collaboration: 15, risk: 10 },
            milestone: "Executed Startup Exit"
          },
          {
            id: "b",
            label: "Reject the exit, listing the company IPO in 2 years.",
            consequence: "You scale departments, completing IPO audit filings on stock exchanges.",
            emotionalConsequence: "You experience high public scrutiny, but massive scaling pride.",
            professionalInsight: "IPO listings require rigorous quarterly audits and financial reporting.",
            branchSet: "SaaS Tech Startup",
            scores: { analytical: 12, creativity: 12, collaboration: 10, risk: 20 },
            milestone: "Listed Company on IPO"
          },
          {
            id: "c",
            label: "Transition the company into a community trust.",
            consequence: "Corporate earnings permanently fund school solar grid programs.",
            emotionalConsequence: "You feel generative legacy fulfillment and global recognition.",
            professionalInsight: "Trust ownership models protect social startup missions from corporate buyouts.",
            branchSet: "Social Enterprise",
            scores: { analytical: 10, creativity: 15, collaboration: 15, risk: 8 },
            milestone: "Formed Community Trust"
          }
        ]
      }
    ]
  }
};

export function enrichJourney(base: CareerJourney): CareerJourney {
  const enrich = ENRICHED_JOURNEYS[base.careerId];
  if (!enrich) {
    // Generative fallback for secondary simulated careers to ensure option c exists
    const enrichedScenes = base.scenes.map((scene: JourneyScene) => {
      if (scene.options.length < 3) {
        const optionC: JourneyOption = {
          id: "c",
          label: "Consult your peers to design a balanced compromise strategy.",
          consequence: "You design a middle-path compromise, coordinating interests.",
          emotionalConsequence: "You feel supported and collaborative, reducing stress.",
          professionalInsight: "Real professionals frequently negotiate compromises to balance business speed with compliance safety.",
          scores: { analytical: 8, creativity: 8, collaboration: 10, risk: 5 },
          milestone: "Negotiated Collaborative Compromise"
        };

        const updatedOptions: JourneyOption[] = scene.options.map(opt => {
          const o = opt as JourneyOption & { emotionalConsequence?: string; professionalInsight?: string };
          return {
            ...o,
            emotionalConsequence: o.emotionalConsequence || "You experience standard stress and progress.",
            professionalInsight: o.professionalInsight || "Real professionals focus on fact checking and system compliance."
          };
        });

        if (updatedOptions.length === 2) {
          updatedOptions.push(optionC);
        }

        return {
          ...scene,
          options: updatedOptions
        };
      }
      return scene;
    });

    return {
      ...base,
      scenes: enrichedScenes
    };
  }

  return {
    ...base,
    ...enrich
  } as CareerJourney;
}
