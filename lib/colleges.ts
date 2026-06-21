export type CollegeDetails = {
  colleges: string[];
  entranceExams: string[];
  eligibility: string;
  feesRange: string;
  scholarships: string[];
};

export const COLLEGE_DATA: Record<string, CollegeDetails> = {
  "software-engineer": {
    colleges: ["IIT Bombay", "BITS Pilani", "IIIT Hyderabad", "NIT Trichy"],
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT"],
    eligibility: "Class 12 with Physics, Chemistry, and Mathematics (PCM) minimum 75%",
    feesRange: "₹2.0 - ₹4.5 Lakhs per year",
    scholarships: ["Aditya Birla Scholarship", "Inspire Scholarship", "State Merit Scholarships"]
  },
  "data-scientist": {
    colleges: ["Indian Statistical Institute (ISI) Kolkata", "IIT Madras", "CMI Chennai"],
    entranceExams: ["ISI Admission Test", "JEE Main", "JEE Advanced"],
    eligibility: "Class 12 with Mathematics or Statistics mandatory, minimum 70%",
    feesRange: "₹1.5 - ₹3.5 Lakhs per year (ISI has zero tuition fees and offers stipends)",
    scholarships: ["ISI Stipend Scheme", "DST Inspire fellowship", "Google PhD Fellowships"]
  },
  "product-manager": {
    colleges: ["IIM Ahmedabad", "ISB Hyderabad", "FMS Delhi", "SPJIMR Mumbai"],
    entranceExams: ["CAT", "GMAT", "XAT"],
    eligibility: "Graduation in any stream (Engineering preferred by tech firms) + MBA",
    feesRange: "₹10 - ₹25 Lakhs total course fees",
    scholarships: ["OP Jindal Scholarship", "IIM Tuition Fee Waivers", "Corporate Sponsored Grants"]
  },
  "lawyer": {
    colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NUJS Kolkata", "GNLU Gandhinagar"],
    entranceExams: ["CLAT", "AILET", "LSAT India"],
    eligibility: "Class 12 in any stream (Science/Commerce/Arts) with minimum 45%",
    feesRange: "₹2.5 - ₹3.5 Lakhs per year",
    scholarships: ["Aditya Birla Scholarship", "State Central Sector Scholarships", "Nani Palkhivala Memorial aid"]
  },
  "fashion-designer": {
    colleges: ["NIFT Delhi", "NIFT Mumbai", "National Institute of Design (NID) Ahmedabad"],
    entranceExams: ["NIFT GAT & CAT Exam", "NID DAT (Design Aptitude Test)"],
    eligibility: "Class 12 in any stream (Arts/Commerce/Science) with minimum 50%",
    feesRange: "₹2.2 - ₹3.0 Lakhs per year",
    scholarships: ["NIFT Sarthak Financial Assistance", "NID Means-cum-Merit Scholarships", "State Design Awards"]
  },
  "chef": {
    colleges: ["IHM Mumbai", "Welcomgroup Graduate School of Hotel Administration (WGSHA) Manipal", "IHM Pusa Delhi"],
    entranceExams: ["NCHMCT JEE", "WGSHA Entrance Test"],
    eligibility: "Class 12 in any stream with English as a compulsory subject, minimum 50%",
    feesRange: "₹1.2 - ₹2.5 Lakhs per year",
    scholarships: ["Ministry of Tourism Scholarships", "IHG Academy Awards", "National Merit-cum-Means Scholarships"]
  },
  "architect": {
    colleges: ["IIT Roorkee", "Sir JJ College of Architecture Mumbai", "CEPT University Ahmedabad"],
    entranceExams: ["NATA (National Aptitude Test in Architecture)", "JEE Main Paper 2"],
    eligibility: "Class 12 with Physics, Chemistry, and Mathematics (PCM) minimum 50%",
    feesRange: "₹1.8 - ₹3.2 Lakhs per year",
    scholarships: ["AICTE Pragati Scholarship", "CEPT Merit-cum-Means Tuition Waiver", "Tata Scholarship"]
  },
  "psychologist": {
    colleges: ["Tata Institute of Social Sciences (TISS) Mumbai", "Delhi University (LSR/MH)", "Christ University Bangalore"],
    entranceExams: ["CUET UG", "CUET PG", "TISSNET"],
    eligibility: "Class 12 in any stream with minimum 55% (Psychology background preferred)",
    feesRange: "₹40,000 - ₹1.5 Lakhs per year",
    scholarships: ["Post Graduate Indira Gandhi Scholarship", "Christ Merit Scholarships", "State Welfare Aid"]
  },
  "journalist": {
    colleges: ["Indian Institute of Mass Communication (IIMC) Delhi", "Asian College of Journalism (ACJ) Chennai", "Symbiosis Institute (SIMC) Pune"],
    entranceExams: ["IIMC Entrance Exam", "ACJ Entrance Exam", "SET (Symbiosis Entrance Test)"],
    eligibility: "Graduation in any stream (BA Journalism preferred), Class 12 minimum 50%",
    feesRange: "₹80,000 - ₹2.2 Lakhs per year",
    scholarships: ["ACJ Merit-cum-Means Fellowships", "Press Club of India Scholarships", "Times Group Grants"]
  },
  "pilot": {
    colleges: ["Indira Gandhi Rashtriya Uran Akademi (IGRUA) Amethi", "National Flying Training Institute (NFTI) Gondia", "Bombay Flying Club"],
    entranceExams: ["IGRUA Entrance Exam & Pilot Aptitude Test", "DGCA Class 1 Medical Clearance"],
    eligibility: "Class 12 with Physics and Mathematics (PCM) minimum 50%",
    feesRange: "₹40 - ₹55 Lakhs total training program fees",
    scholarships: ["Air India Cadet Pilot Sponsor Allowances (limited)", "State Scheduled Caste/Tribe Pilot Schemes"]
  },
  "entrepreneur": {
    colleges: ["BITS Pilani Incubator", "IIT Madras Incubation Cell", "Ashoka University Sonepat"],
    entranceExams: ["JEE Main", "SAT India", "Ashoka Aptitude Test"],
    eligibility: "Class 12 in any stream with high creative and leadership inclination",
    feesRange: "₹2.5 - ₹5.0 Lakhs per year",
    scholarships: ["Ashoka Need-Based Financial Aid", "BITS Pilani Seed Fund Grants", "Startup India Seed Fund Schemes"]
  },
  "teacher": {
    colleges: ["Lady Irwin College (DU)", "Jamia Millia Islamia Delhi", "Kasturi Ram College of Education"],
    entranceExams: ["CUET B.Ed", "State B.Ed Entrance Exams"],
    eligibility: "Graduation in any school subject with minimum 50% + B.Ed degree",
    feesRange: "₹15,000 - ₹45,000 per year",
    scholarships: ["Kothari Fellowship", "Prime Minister's Scholarship Scheme", "Central Sector Scheme of Scholarships"]
  },
  "graphic-designer": {
    colleges: ["National Institute of Design (NID) Ahmedabad", "IDC School of Design (IIT Bombay)", "Srishti Manipal Institute Bangalore"],
    entranceExams: ["NID DAT", "UCEED Exam"],
    eligibility: "Class 12 in any stream (Science/Commerce/Arts) minimum 50%",
    feesRange: "₹2.0 - ₹3.8 Lakhs per year",
    scholarships: ["NID Tuition Waivers", "Srishti Merit Scholarships", "AICTE Tuition Fee Waiver Scheme"]
  },
  "content-creator": {
    colleges: ["Whistling Woods International Mumbai", "Xavier Institute of Communications (XIC)", "St. Pauls Institute"],
    entranceExams: ["WWI Entrance Test", "XIC OET (Online Entrance Test)"],
    eligibility: "Class 12 in any stream with digital portfolio or creative expression",
    feesRange: "₹1.5 - ₹3.0 Lakhs per year",
    scholarships: ["Whistling Woods Scholarship Schemes", "Xavier Merit Awards", "YouTube Creator Grant Programs (Private)"]
  },
  "chartered-accountant": {
    colleges: ["The Institute of Chartered Accountants of India (ICAI) - Correspondence + Articleship"],
    entranceExams: ["CA Foundation", "CA Intermediate", "CA Final"],
    eligibility: "Class 12 in any stream (Commerce preferred with Accountancy & Math)",
    feesRange: "₹40,000 - ₹60,000 total registration and exam fees",
    scholarships: ["ICAI Board of Studies Scholarship", "CA Students Benevolent Fund", "State Merit Scholarship"]
  }
};

export function getCollegeDetails(careerId: string): CollegeDetails {
  return COLLEGE_DATA[careerId] || {
    colleges: ["Standard National University", "State Professional College"],
    entranceExams: ["National Common Entrance Test"],
    eligibility: "Class 12 in relevant subjects with minimum 50%",
    feesRange: "₹1.0 - ₹2.5 Lakhs per year",
    scholarships: ["State Merit-cum-Means Scholarships", "Alumni Association Grants"]
  };
}
