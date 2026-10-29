/**
 * Centralized Institution Configuration for Backend (Node.js CommonJS)
 * Seshadri Rao Gudlavalleru Engineering College (SRGEC)
 */

const SRGEC_CONFIG = {
  institution: {
    fullName: "Seshadri Rao Gudlavalleru Engineering College",
    shortName: "SRGEC",
    establishedYear: 1998,
    affiliation: "Permanently Affiliated to JNTUK, Kakinada",
    autonomousStatus: "Autonomous Institution Approved by AICTE",
    accreditation: "NAAC 'A+' Grade | NBA Accredited Programmes",
    logoPath: "/logo-srgec.png",
    eapcetCounsellingCode: "GECW",
    ecetCounsellingCode: "GECW",
    icetCounsellingCode: "GECW",
    pgecetCounsellingCode: "GECW1",
    tagline: "SRGEC AI-Enabled Student Admission System",
    location: "Seshadri Rao Knowledge Village, Gudlavalleru, Krishna District, Andhra Pradesh - 521356, India",
    contactEmail: "admissions@gecgudlavalleru.ac.in",
    supportEmail: "support-portal@gecgudlavalleru.ac.in",
    contactPhone: "+91 8674-273737 / +91 9848779121",
    workingHours: "Monday to Saturday: 9:00 AM – 5:00 PM",
    website: "https://gecgudlavalleru.ac.in"
  },
  courses: [
    { id: "cse", name: "Computer Science & Engineering (CSE)", code: "CSE", fee: 103000, category: "Technical" },
    { id: "cse-aiml", name: "CSE (Artificial Intelligence & Machine Learning)", code: "CSM", fee: 103000, category: "Technical" },
    { id: "cse-ds", name: "CSE (Data Science)", code: "CSD", fee: 103000, category: "Technical" },
    { id: "cse-iot", name: "CSE (Internet of Things)", code: "CSO", fee: 95000, category: "Technical" },
    { id: "it", name: "Information Technology (IT)", code: "INF", fee: 95000, category: "Technical" },
    { id: "ece", name: "Electronics & Communication Engineering (ECE)", code: "ECE", fee: 90000, category: "Technical" },
    { id: "eee", name: "Electrical & Electronics Engineering (EEE)", code: "EEE", fee: 80000, category: "Technical" },
    { id: "mech", name: "Mechanical Engineering (ME)", code: "MEC", fee: 75000, category: "Technical" },
    { id: "civil", name: "Civil Engineering (CE)", code: "CIV", fee: 70000, category: "Technical" },
    { id: "mtech-cse", name: "M.Tech Computer Science & Engineering", code: "JKCSEG", fee: 72200, category: "Postgraduate" },
    { id: "mtech-vlsi", name: "M.Tech VLSI Design & Embedded Systems", code: "JKVLSI", fee: 72200, category: "Postgraduate" },
    { id: "mba", name: "Master of Business Administration (MBA)", code: "JKMBAG", fee: 55000, category: "Management" }
  ]
};

module.exports = { SRGEC_CONFIG };
