/**
 * Centralized Institution Configuration for SRGEC
 * Seshadri Rao Gudlavalleru Engineering College
 * Gudlavalleru, Krishna District, Andhra Pradesh, India
 */

export interface ProgrammeBranch {
  id: string
  name: string
  code: string
  degree: "B.Tech" | "M.Tech" | "MBA" | "Ph.D"
  intake: number
  catA: number // Convener Quota (AP EAPCET / ECET)
  catB: number // Management / NRI Quota
  feePerYear: number
  cutoffEapcet?: number
  cutoffEcet?: number
  duration: string
  description?: string
}

export interface CollegeConfig {
  institution: {
    fullName: string
    shortName: string
    establishedYear: number
    affiliation: string
    autonomousStatus: string
    accreditation: string
    logoPath: string
    eapcetCounsellingCode: string
    ecetCounsellingCode: string
    icetCounsellingCode: string
    pgecetCounsellingCode: string
    tagline: string
    campusLocation: {
      addressLine1: string
      village: string
      mandal: string
      district: string
      state: string
      country: string
      pincode: string
    }
    contact: {
      admissionsEmail: string
      supportEmail: string
      principalEmail: string
      phone: string
      mobileAdmissions: string
      workingHours: string
      websiteUrl: string
    }
  }
  academicYear: string
  programmes: {
    ug: ProgrammeBranch[]
    pg: ProgrammeBranch[]
    phd: {
      name: string
      department: string
      duration: string
    }[]
  }
  admissionSteps: {
    step: number
    title: string
    description: string
  }[]
  requiredDocuments: {
    category: string
    documents: string[]
  }[]
  scholarships: {
    schemeName: string
    authority: string
    coverage: string
    eligibility: string
  }[]
  faqs: {
    category: string
    question: string
    answer: string
  }[]
}

export const SRGEC_CONFIG: CollegeConfig = {
  institution: {
    fullName: "Seshadri Rao Gudlavalleru Engineering College",
    shortName: "SRGEC",
    establishedYear: 1998,
    affiliation: "Permanently Affiliated to JNTUK, Kakinada",
    autonomousStatus: "Autonomous Institution Approved by AICTE, New Delhi",
    accreditation: "Accredited by NAAC with 'A+' Grade | NBA Accredited Programmes",
    logoPath: "/logo-srgec.png",
    eapcetCounsellingCode: "GECW",
    ecetCounsellingCode: "GECW",
    icetCounsellingCode: "GECW",
    pgecetCounsellingCode: "GECW1",
    tagline: "SRGEC AI-Enabled Student Admission System",
    campusLocation: {
      addressLine1: "Seshadri Rao Knowledge Village",
      village: "Gudlavalleru",
      mandal: "Gudlavalleru",
      district: "Krishna District",
      state: "Andhra Pradesh",
      country: "India",
      pincode: "521356",
    },
    contact: {
      admissionsEmail: "admissions@gecgudlavalleru.ac.in",
      supportEmail: "support-portal@gecgudlavalleru.ac.in",
      principalEmail: "principal@gecgudlavalleru.ac.in",
      phone: "+91 8674-273737",
      mobileAdmissions: "+91 9848779121",
      workingHours: "Monday to Saturday: 9:00 AM – 5:00 PM",
      websiteUrl: "https://gecgudlavalleru.ac.in",
    },
  },
  academicYear: "2026-2027",
  programmes: {
    ug: [
      {
        id: "cse",
        name: "Computer Science & Engineering",
        code: "CSE",
        degree: "B.Tech",
        intake: 240,
        catA: 168,
        catB: 72,
        feePerYear: 103000,
        cutoffEapcet: 9500,
        cutoffEcet: 900,
        duration: "4 Years",
        description: "Specialized in software development, cloud computing, artificial intelligence fundamentals, and system architecture.",
      },
      {
        id: "cse-aiml",
        name: "CSE (Artificial Intelligence & Machine Learning)",
        code: "CSM",
        degree: "B.Tech",
        intake: 180,
        catA: 126,
        catB: 54,
        feePerYear: 103000,
        cutoffEapcet: 12500,
        cutoffEcet: 1100,
        duration: "4 Years",
        description: "Focus on neural networks, deep learning algorithms, computer vision, and natural language processing.",
      },
      {
        id: "cse-ds",
        name: "CSE (Data Science)",
        code: "CSD",
        degree: "B.Tech",
        intake: 120,
        catA: 84,
        catB: 36,
        feePerYear: 103000,
        cutoffEapcet: 15000,
        cutoffEcet: 1300,
        duration: "4 Years",
        description: "Big data engineering, predictive modeling, statistical learning, and business intelligence analytics.",
      },
      {
        id: "cse-iot",
        name: "CSE (Internet of Things)",
        code: "CSO",
        degree: "B.Tech",
        intake: 60,
        catA: 42,
        catB: 18,
        feePerYear: 95000,
        cutoffEapcet: 22000,
        cutoffEcet: 1800,
        duration: "4 Years",
        description: "Smart connected embedded sensors, edge computing, wireless sensor networks, and IoT cloud platforms.",
      },
      {
        id: "it",
        name: "Information Technology",
        code: "INF",
        degree: "B.Tech",
        intake: 120,
        catA: 84,
        catB: 36,
        feePerYear: 95000,
        cutoffEapcet: 18000,
        cutoffEcet: 1500,
        duration: "4 Years",
        description: "Enterprise software systems, web engineering, cybersecurity, and distributed database networks.",
      },
      {
        id: "ece",
        name: "Electronics & Communication Engineering",
        code: "ECE",
        degree: "B.Tech",
        intake: 180,
        catA: 126,
        catB: 54,
        feePerYear: 90000,
        cutoffEapcet: 24000,
        cutoffEcet: 2100,
        duration: "4 Years",
        description: "VLSI design, embedded systems, telecommunications, signal processing, and RF engineering.",
      },
      {
        id: "eee",
        name: "Electrical & Electronics Engineering",
        code: "EEE",
        degree: "B.Tech",
        intake: 90,
        catA: 63,
        catB: 27,
        feePerYear: 80000,
        cutoffEapcet: 38000,
        cutoffEcet: 3200,
        duration: "4 Years",
        description: "Renewable energy systems, electric vehicle technology, power electronics, and smart grid automation.",
      },
      {
        id: "mech",
        name: "Mechanical Engineering",
        code: "MEC",
        degree: "B.Tech",
        intake: 90,
        catA: 63,
        catB: 27,
        feePerYear: 75000,
        cutoffEapcet: 55000,
        cutoffEcet: 4500,
        duration: "4 Years",
        description: "Robotics, CAD/CAM automation, thermal engineering, manufacturing technology, and mechatronics.",
      },
      {
        id: "civil",
        name: "Civil Engineering",
        code: "CIV",
        degree: "B.Tech",
        intake: 60,
        catA: 42,
        catB: 18,
        feePerYear: 70000,
        cutoffEapcet: 75000,
        cutoffEcet: 6000,
        duration: "4 Years",
        description: "Structural design, transportation systems, environmental engineering, GIS surveying, and smart city infrastructure.",
      },
    ],
    pg: [
      {
        id: "mtech-cse",
        name: "M.Tech in Computer Science & Engineering",
        code: "JKCSEG",
        degree: "M.Tech",
        intake: 18,
        catA: 12,
        catB: 6,
        feePerYear: 72200,
        duration: "2 Years",
        description: "Advanced computing architectures, distributed algorithms, machine learning research, and cloud systems.",
      },
      {
        id: "mtech-vlsi",
        name: "M.Tech in VLSI Design & Embedded Systems",
        code: "JKVLSI",
        degree: "M.Tech",
        intake: 18,
        catA: 12,
        catB: 6,
        feePerYear: 72200,
        duration: "2 Years",
        description: "ASIC/FPGA design, low-power CMOS circuits, system-on-chip (SoC) architectures, and verification.",
      },
      {
        id: "mtech-pe",
        name: "M.Tech in Power Electronics & Drives",
        code: "JKPELD",
        degree: "M.Tech",
        intake: 12,
        catA: 8,
        catB: 4,
        feePerYear: 72200,
        duration: "2 Years",
        description: "Solid-state power converters, industrial electrical drives, renewable energy integration, and EV charging circuits.",
      },
      {
        id: "mba",
        name: "Master of Business Administration (MBA)",
        code: "JKMBAG",
        degree: "MBA",
        intake: 60,
        catA: 42,
        catB: 18,
        feePerYear: 55000,
        duration: "2 Years",
        description: "Dual specialization in Marketing, Finance, Human Resource Management, and Business Analytics.",
      },
    ],
    phd: [
      { name: "Computer Science & Engineering", department: "Department of CSE", duration: "3-5 Years (Full/Part Time)" },
      { name: "Electronics & Communication Engineering", department: "Department of ECE", duration: "3-5 Years (Full/Part Time)" },
      { name: "Electrical & Electronics Engineering", department: "Department of EEE", duration: "3-5 Years (Full/Part Time)" },
      { name: "Mechanical Engineering", department: "Department of ME", duration: "3-5 Years (Full/Part Time)" },
    ],
  },
  admissionSteps: [
    {
      step: 1,
      title: "Explore Programmes & Eligibility",
      description: "Review accredited UG B.Tech, PG M.Tech, and MBA programmes, their intake, syllabus, and eligibility guidelines.",
    },
    {
      step: 2,
      title: "Submit Online Admission Registration",
      description: "Complete the step-by-step registration wizard with your personal credentials, entrance rank (EAPCET/ECET/JEE), and branch preference.",
    },
    {
      step: 3,
      title: "Counselling & Verification",
      description: "Participate in state-level counselling (Code: GECW) or attend direct document verification for Category-B / Management Quota.",
    },
    {
      step: 4,
      title: "Fee Payment & Seat Confirmation",
      description: "Finalize your admission via official allotment order or college confirmation voucher, submit original certificates, and receive student onboarding kit.",
    },
  ],
  requiredDocuments: [
    {
      category: "Mandatory Academic Certificates",
      documents: [
        "SSC / 10th Standard Marks Memo & Passing Certificate",
        "Intermediate (10+2) / Diploma Marks Memo & Provisional Certificate",
        "AP EAPCET / ECET / ICET Rank Card & Hall Ticket (if applicable)",
        "Transfer Certificate (TC) from previous institution",
        "Study / Bonafide Certificates for the last 7 consecutive years of study",
        "Conduct / Character Certificate",
      ],
    },
    {
      category: "Identification & Category Certificates",
      documents: [
        "Aadhaar Card Copies (Student, Father, and Mother)",
        "Integrated Community / Caste Certificate (issued by Meeseva / Tahsildar for SC/ST/BC)",
        "Income Certificate / White Ration Card (for fee reimbursement / EWS eligibility)",
        "Recent Passport Size Photographs (6 copies)",
      ],
    },
  ],
  scholarships: [
    {
      schemeName: "Jagananna Vidya Deevena (JVD)",
      authority: "Government of Andhra Pradesh",
      coverage: "Complete Tuition Fee Reimbursement for eligible convener quota students",
      eligibility: "SC/ST candidates with family annual income < ₹2.00 Lakhs; BC/EBC/Minority/Kapu candidates with family income < ₹1.00 Lakh, admitted through Convener Quota.",
    },
    {
      schemeName: "SRGEC Merit Excellence Concession",
      authority: "SRGEC Institutional Management",
      coverage: "Tuition Fee Concessions up to 50% for top rankers",
      eligibility: "Students scoring top ranks in AP EAPCET (< 5,000 rank: 50% waiver; 5,001 - 15,000 rank: 30% waiver; 15,001 - 30,000 rank: 15% waiver).",
    },
    {
      schemeName: "Sports & Extra-Curricular Endowment",
      authority: "SRGEC Trust Endowment",
      coverage: "20% Tuition Fee Concession + Sports Facility Sponsorship",
      eligibility: "National or State-level medalists in recognized school/inter-collegiate games.",
    },
  ],
  faqs: [
    {
      category: "General Admissions",
      question: "What is the AP EAPCET Counselling Code for SRGEC?",
      answer: "The official AP EAPCET counselling code for Seshadri Rao Gudlavalleru Engineering College is GECW. Please use this code while exercising web options.",
    },
    {
      category: "General Admissions",
      question: "Is SRGEC an Autonomous college?",
      answer: "Yes, SRGEC is an Autonomous institution approved by AICTE, New Delhi, and permanently affiliated to JNTUK, Kakinada. It holds an 'A+' Grade accreditation from NAAC.",
    },
    {
      category: "Branch Options",
      question: "Which B.Tech branches are available at SRGEC?",
      answer: "SRGEC offers B.Tech programmes in CSE, CSE (AI&ML), CSE (Data Science), CSE (IoT), Information Technology (IT), Electronics & Communication Engineering (ECE), Electrical & Electronics Engineering (EEE), Mechanical Engineering (ME), and Civil Engineering (CE).",
    },
    {
      category: "Category-B Admissions",
      question: "How do I apply under Category-B (Management) Quota?",
      answer: "Candidates seeking Category-B (Management / NRI) admissions can submit an online registration through this portal or visit our Admissions Desk on campus. Selection is based on JEE Main / EAPCET merit or Intermediate percentage.",
    },
    {
      category: "Hostel & Facilities",
      question: "Are hostel accommodations available on campus?",
      answer: "Yes, SRGEC provides dedicated, secure, and modern on-campus hostel facilities for both boys and girls with hygienic mess dining, Wi-Fi connectivity, and 24/7 security.",
    },
  ],
}
