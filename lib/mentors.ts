export type MentorProfile = {
  name: string;
  role: string;
  organization: string;
  journey: string;
  avatar: string; // initials or emoji
};

export const MENTORS: Record<string, MentorProfile[]> = {
  "software-engineer": [
    {
      name: "Rohit Sharma",
      role: "SDE-2",
      organization: "Google India",
      journey: "IIT Delhi graduate → Interned at Microsoft → Joined Google Cloud core storage team.",
      avatar: "RS"
    }
  ],
  "data-scientist": [
    {
      name: "Ananya Iyer",
      role: "Lead ML Engineer",
      organization: "Flipkart",
      journey: "B.Sc. Stats at ISI → Data Analyst at Mu Sigma → ML Lead at Flipkart recommendation systems.",
      avatar: "AI"
    }
  ],
  "product-manager": [
    {
      name: "Saurabh Mukherjea",
      role: "Director of Product",
      organization: "Razorpay",
      journey: "CS Graduate → Startup Founder → Product Manager at Paytm → Razorpay core banking.",
      avatar: "SM"
    }
  ],
  "entrepreneur": [
    {
      name: "Varun Alagh",
      role: "Co-Founder (YC W21)",
      organization: "Lokal Delivery",
      journey: "BITS Pilani → Product Designer at Swiggy → Raised seed round for regional logistics node.",
      avatar: "VA"
    }
  ],
  "doctor": [
    {
      name: "Dr. Shreya Bose",
      role: "Cardiologist",
      organization: "Fortis Healthcare",
      journey: "MBBS at MAMC → MD Internal Medicine at AIIMS → Fellowship in interventional cardiology.",
      avatar: "SB"
    }
  ],
  "lawyer": [
    {
      name: "Rohan Advani",
      role: "Senior Associate",
      organization: "Khaitan & Co",
      journey: "NLS Bangalore → Associate at Trilegal → Specialized in startup financing and corporate mergers.",
      avatar: "RA"
    }
  ],
  "fashion-designer": [
    {
      name: "Meera Sen",
      role: "Creative Director",
      organization: "Label Meera",
      journey: "NIFT Delhi → Assistant Designer for Sabyasachi → Launched sustainable boutique label at Lakme Fashion Week.",
      avatar: "MS"
    }
  ],
  "psychologist": [
    {
      name: "Dr. Amit Verma",
      role: "Clinical Psychologist",
      organization: "MindPeers India",
      journey: "B.A. Psych at DU → M.Sc. Counseling at TISS → Registered practitioner consulting 500+ clients.",
      avatar: "AV"
    }
  ],
  "chef": [
    {
      name: "Chef Ranveer Brar",
      role: "Executive Culinary Chef",
      organization: "The Oberoi Group",
      journey: "IHM Lucknow → Chef de Partie at Taj Hotels → Culinary Director overseeing menu cost designs.",
      avatar: "RB"
    }
  ],
  "content-creator": [
    {
      name: "Kabir Cane",
      role: "Tech YouTuber (2M+ Subs)",
      organization: "CaneMedia Studio",
      journey: "BCA graduate → Started tech channels part-time → Scaling video productions and brand deals.",
      avatar: "KC"
    }
  ],
  "architect": [
    {
      name: "Nikhil Kamath",
      role: "Principal BIM Architect",
      organization: "Morphogenesis",
      journey: "B.Arch at IIT Kharagpur → M.Arch at CEPT Ahmedabad → LEED sustainability auditor.",
      avatar: "NK"
    }
  ],
  "digital-marketer": [
    {
      name: "Neha Dhupia",
      role: "Head of Growth",
      organization: "Nykaa",
      journey: "B.Com at SRCC → Performance Analyst at Dentsu → DirectingNykaa's ad campaign spends.",
      avatar: "ND"
    }
  ],
  "teacher": [
    {
      name: "Shalini Kapoor",
      role: "Academic Coordinator",
      organization: "Delhi Public School",
      journey: "B.Sc. Chemistry → B.Ed Delhi University → 12+ years classroom TGT instruction & board exam audit.",
      avatar: "SK"
    }
  ],
  "pilot": [
    {
      name: "Capt. Aishwarya Roy",
      role: "A320 Commander (Captain)",
      organization: "IndoGo Airlines",
      journey: "PCM Stream → CPL from IGRUA → First Officer at Air India → Upgraded to flight Captain.",
      avatar: "AR"
    }
  ],
  "journalist": [
    {
      name: "Siddharth Varadarajan",
      role: "Senior News Correspondent",
      organization: "The Hindu",
      journey: "M.A. Journalism at IIMC → Local crime beat reporter → Senior foreign bureau analyst.",
      avatar: "SV"
    }
  ],
  "graphic-designer": [
    {
      name: " Maya Sen",
      role: "Senior Visual Artist",
      organization: "Zomato",
      journey: "BFA at College of Art, Delhi → Freelance logo designer → Leading Nykaa & Zomato ad vectors.",
      avatar: "MS"
    }
  ],
  "chartered-accountant": [
    {
      name: "CA Nilesh Shah",
      role: "Auditing Partner",
      organization: "Deloitte India",
      journey: "B.Com at Podar College → Cleared CA Finals Rank 25 → Head Partner auditing multi-national ledgers.",
      avatar: "NS"
    }
  ]
};

export function getMentors(careerId: string): MentorProfile[] {
  return MENTORS[careerId] || [
    {
      name: "Aditya Roy",
      role: "Senior Lead Specialist",
      organization: "Industry Leader Corp",
      journey: "Relevant college graduate → 5+ years building and coordinating scale frameworks.",
      avatar: "AR"
    }
  ];
}
