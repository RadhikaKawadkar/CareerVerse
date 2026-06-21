export type StudentVoice = {
  name: string;
  avatar: string;
  currentYear: string;
  school: string;
  whyChose: string;
  challenge: string;
  nobodyTellsYou: string;
  chooseAgain: "Yes" | "No" | "Absolutely";
};

export const STUDENT_VOICES: Record<string, StudentVoice[]> = {
  "software-engineer": [
    {
      name: "Rahul Mehta",
      avatar: "💻",
      currentYear: "4th Year B.Tech CSE",
      school: "IIT Delhi",
      whyChose: "I loved building small automation scripts and hosting website layouts for my school tech fest.",
      challenge: "Debugging silent pointer exceptions and coordinating API specs with developers under tight timelines.",
      nobodyTellsYou: "You spend 70% of your time reading legacy code, attending agile sprints, and writing unit test logic - not coding brand new apps.",
      chooseAgain: "Absolutely"
    }
  ],
  "data-scientist": [
    {
      name: "Sneha Sen",
      avatar: "📊",
      currentYear: "Graduate Trainee",
      school: "ISI Kolkata",
      whyChose: "Statistics always felt like a superpower. I wanted to use math to deduce real corporate outcomes.",
      challenge: "Scrubbing dirty dataset logs. Real-world data is extremely messy and has missing indexes.",
      nobodyTellsYou: "A simple regression model that is explainable is often favored by businesses over a complex neural network.",
      chooseAgain: "Yes"
    }
  ],
  "product-manager": [
    {
      name: "Karan Johar",
      avatar: "📋",
      currentYear: "MBA Candidate",
      school: "IIM Ahmedabad",
      whyChose: "I wanted to sit at the intersection of business strategy, software technology, and UI design.",
      challenge: "Managing team alignment when engineers and business clients have completely contradictory targets.",
      nobodyTellsYou: "You have zero direct authority over the engineers, so you must influence through evidence and clear specs.",
      chooseAgain: "Yes"
    }
  ],
  "entrepreneur": [
    {
      name: "Divya Gupta",
      avatar: "🚀",
      currentYear: "Co-Founder",
      school: "BITS Pilani Incubator",
      whyChose: "I saw a huge gap in regional delivery logistics and wanted to build a business solving it.",
      challenge: "Stretching bridge funding when our pilot product had critical bugs and cash was running low.",
      nobodyTellsYou: "You will spend your initial year doing sales, compliance paperwork, customer support, and cleaning office desks.",
      chooseAgain: "Absolutely"
    }
  ],
  "doctor": [
    {
      name: "Dr. Kabir Roy",
      avatar: "🩺",
      currentYear: "MD Resident",
      school: "AIIMS New Delhi",
      whyChose: "Biology class fascinated me, and I wanted to work directly on saving patient lives.",
      challenge: "Staying focused during 36-hour clinical shifts with zero sleep, dealing with critical emergencies.",
      nobodyTellsYou: "The emotional toll of delivering bad diagnostic news to family members is heavier than any board exam.",
      chooseAgain: "Yes"
    }
  ],
  "lawyer": [
    {
      name: "Meera Nair",
      avatar: "⚖️",
      currentYear: "Associate",
      school: "NLS Bangalore Graduate",
      whyChose: "I loved debate, argumentation logic, and analyzing the structures of constitutional law.",
      challenge: "Reading through 500-page corporate acquisition audit records to trace compliance gaps.",
      nobodyTellsYou: "You spend your initial two years doing exhaustive document audits and cataloging case files, rather than arguing in court.",
      chooseAgain: "Yes"
    }
  ],
  "fashion-designer": [
    {
      name: "Priya Varma",
      avatar: "🎨",
      currentYear: "Design Lead",
      school: "NIFT Delhi Alum",
      whyChose: "I loved sketching textiles, draping fabrics, and creating unique visual outfits.",
      challenge: "Finding reliable manufacturers who can execute custom fabric designs within tight budgets.",
      nobodyTellsYou: "Fashion is a commercial business. You spend more time analyzing fabric costs and supply tracks than drawing sketches.",
      chooseAgain: "Absolutely"
    }
  ],
  "psychologist": [
    {
      name: "Alok Dave",
      avatar: "🧠",
      currentYear: "M.Sc. Counseling",
      school: "TISS Mumbai",
      whyChose: "I wanted to understand human psychology and help people navigate mental health struggles.",
      challenge: "Setting emotional boundaries so that patient crises do not burn you out personally.",
      nobodyTellsYou: "You need a license, Master's degree, and supervised hours before you can legally consult your first client.",
      chooseAgain: "Yes"
    }
  ],
  "chef": [
    {
      name: "Rohan Dsouza",
      avatar: "👨‍🍳",
      currentYear: "Sous Chef",
      school: "IHM Mumbai",
      whyChose: "Cooking is my art. I wanted to design premium recipes and curate fine dining plating.",
      challenge: "Coordinating expediting lines during high-volume corporate banquets under heavy heat.",
      nobodyTellsYou: "Kitchens are loud, hot, and physically exhausting. You stand for 10+ hours a day and work weekends.",
      chooseAgain: "Yes"
    }
  ],
  "content-creator": [
    {
      name: "Tanmay Bhatia",
      avatar: "🎥",
      currentYear: "Full-Time Creator",
      school: "Self-Taught Portfolio",
      whyChose: "I loved recording videos, editing visual layouts, and building online community forums.",
      challenge: "Managing creative burnout when algorithms drop views and sponsor targets are pending.",
      nobodyTellsYou: "You are a media company of one. You have to handle lighting, script writing, analytics charts, and taxes.",
      chooseAgain: "Absolutely"
    }
  ],
  "architect": [
    {
      name: "Vikram Shah",
      avatar: "🏛️",
      currentYear: "Junior Architect",
      school: "IIT Roorkee B.Arch",
      whyChose: "I wanted to combine engineering math logic with visual building design.",
      challenge: "Revising blueprints repeatedly due to sudden municipal code and height limits changes.",
      nobodyTellsYou: "A lot of design is standardized CAD drafting of staircase profiles and toilet layout regulations.",
      chooseAgain: "Yes"
    }
  ],
  "digital-marketer": [
    {
      name: "Arjun Sen",
      avatar: "📈",
      currentYear: "Ads Consultant",
      school: "B.Com, DU",
      whyChose: "I loved digital trends, ad layouts, and interpreting user analytics dashboards.",
      challenge: "Managing client budgets when Facebook or Google algorithms change tracking formats.",
      nobodyTellsYou: "Marketing is heavily data-driven. If you can't read Excel sheets and compute ROI stats, creativity won't save you.",
      chooseAgain: "Yes"
    }
  ],
  "teacher": [
    {
      name: "Shalini Sen",
      avatar: "🍎",
      currentYear: "High School Teacher",
      school: "B.Ed, Delhi University",
      whyChose: "I wanted to inspire students and make academic science learning feel fun and accessible.",
      challenge: "Managing disengaged student attitudes while completing strict school syllabus deadlines.",
      nobodyTellsYou: "Admin work, exam grading, lesson plan logs, and parent meetings take up almost half of your weekly working hours.",
      chooseAgain: "Absolutely"
    }
  ],
  "pilot": [
    {
      name: "Capt. Rohit Roy",
      avatar: "✈️",
      currentYear: "First Officer",
      school: "IGRUA Flying Club",
      whyChose: "I wanted to fly aircraft, travel globally, and study aviation mechanics.",
      challenge: "Studying flight meteorology and clearing 5 DGCA exams while logging flight hours.",
      nobodyTellsYou: "The jet lag is persistent. You wake up at 3 AM for flights and miss family birthdays due to rosters.",
      chooseAgain: "Absolutely"
    }
  ],
  "journalist": [
    {
      name: "Nidhi Razdan",
      avatar: "📰",
      currentYear: "Reporter",
      school: "IIMC Delhi Alum",
      whyChose: "I wanted to investigate local politics, question power systems, and report truths.",
      challenge: "Verifying local source leaks under massive press release deadlines.",
      nobodyTellsYou: "Real journalism involves hours of waiting at court steps and calling local sources for minor updates.",
      chooseAgain: "Yes"
    }
  ],
  "graphic-designer": [
    {
      name: "Maya Angelou",
      avatar: "🎨",
      currentYear: "UI Designer",
      school: "NID Ahmedabad",
      whyChose: "I loved color palettes, vector layout design, and drawing digital banners.",
      challenge: "Revising vector logo styles repeatedly based on client instructions that break color rules.",
      nobodyTellsYou: "You spend more time negotiating client briefs than playing with design canvas tools.",
      chooseAgain: "Yes"
    }
  ],
  "chartered-accountant": [
    {
      name: "CA Aditya Birla",
      avatar: "📊",
      currentYear: "Tax Auditor",
      school: "ICAI Member, Mumbai",
      whyChose: "I loved accounting double-entry logic, tax laws, and business financial metrics.",
      challenge: "Balancing client ledgers during the busy tax auditing month of September.",
      nobodyTellsYou: "CA exams are highly competitive. Preparing for final attempts requires immense discipline and articleship sweat.",
      chooseAgain: "Yes"
    }
  ]
};

export function getStudentVoices(careerId: string): StudentVoice[] {
  return STUDENT_VOICES[careerId] || [
    {
      name: "Aman Verma",
      avatar: "🎓",
      currentYear: "Graduate Trainee",
      school: "Standard National College",
      whyChose: "I liked the practical day-to-day operations and stream alignment.",
      challenge: "Adapting to industry tool frameworks and coordinate team backlogs.",
      nobodyTellsYou: "Most duties are routine admin and logging project parameters, but strategic moments are extremely rewarding.",
      chooseAgain: "Yes"
    }
  ];
}
