const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { SRGEC_CONFIG } = require("./college-config");

const PORT = process.env.PORT || 8080;

const COURSES = SRGEC_CONFIG.courses;

// Zero-dependency .env parser helper
try {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
        for (const line of lines) {
            if (line.trim().startsWith("#")) continue;
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let val = match[2] || "";
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                process.env[key] = val.trim();
            }
        }
    }
} catch (err) {
    console.error("[ENV PARSER] Error reading .env file:", err);
}

const enrollments = [];
const leads = [];
const DB_FILE = path.join(__dirname, "data", "enrollments.json");
const LEADS_FILE = path.join(__dirname, "data", "leads.json");

// Security settings
const JWT_SECRET = process.env.JWT_SECRET || "srgecSecretKey2026!";
const COUNSELOR_USER = process.env.COUNSELOR_USERNAME || "counselor";
const COUNSELOR_PASS = process.env.COUNSELOR_PASSWORD || "counselor@srgec";

function signJwt(payload, secret) {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token, secret) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const [headerPart, payloadPart, signaturePart] = parts;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${headerPart}.${payloadPart}`)
            .digest("base64url");
        if (signaturePart !== expectedSignature) return null;

        const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf-8"));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}

// Database Layer
let pgClient = null;
let useDatabase = false;

async function initPostgres() {
    if (!process.env.DATABASE_URL) {
        console.log("[MOCK DB] DATABASE_URL not set in .env. Using local json store.");
        loadDb();
        loadLeadsDb();
        return;
    }

    let connectionString = process.env.DATABASE_URL;
    const { Client } = require("pg");

    try {
        let client = new Client({
            connectionString,
            ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
                ? false
                : { rejectUnauthorized: false }
        });

        try {
            await client.connect();
        } catch (connErr) {
            if (connErr.code === '3D000') {
                console.log(`📡 [MOCK DB] Database does not exist. Attempting to create database dynamically.`);
                const urlMatch = connectionString.match(/\/([a-zA-Z0-9_-]+)(?:\?.*)?$/);
                const targetDbName = urlMatch ? urlMatch[1] : null;

                if (targetDbName) {
                    const defaultConnString = connectionString.replace(/\/([a-zA-Z0-9_-]+)(?:\?.*)?$/, "/postgres");
                    const adminClient = new Client({
                        connectionString: defaultConnString,
                        ssl: defaultConnString.includes("localhost") || defaultConnString.includes("127.0.0.1")
                            ? false
                            : { rejectUnauthorized: false }
                    });
                    await adminClient.connect();
                    await adminClient.query(`CREATE DATABASE ${targetDbName}`);
                    await adminClient.end();
                    console.log(`📡 [MOCK DB] Created database '${targetDbName}' successfully.`);

                    client = new Client({
                        connectionString,
                        ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
                            ? false
                            : { rejectUnauthorized: false }
                    });
                    await client.connect();
                } else {
                    throw connErr;
                }
            } else {
                throw connErr;
            }
        }

        await client.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id VARCHAR(50) PRIMARY KEY,
                fullName VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                expectedStartDate VARCHAR(20) NOT NULL,
                choiceOption1 VARCHAR(50) NOT NULL,
                courseName VARCHAR(200) NOT NULL,
                courseCategory VARCHAR(55),
                courseFee INTEGER,
                discountPercentage NUMERIC,
                finalPayableAmount NUMERIC,
                enrollmentStatus VARCHAR(50) DEFAULT 'Draft',
                approvalStatus VARCHAR(50) DEFAULT 'Pending',
                aiPriorityScore INTEGER,
                riskLevel VARCHAR(30),
                createdDate VARCHAR(50)
            );
        `);
        pgClient = client;
        useDatabase = true;
        console.log("🐘 [MOCK DB] Connected to PostgreSQL. Initialized table.");

        const res = await pgClient.query("SELECT * FROM enrollments ORDER BY createdDate DESC");
        enrollments.length = 0;
        for (const row of res.rows) {
            enrollments.push({
                id: row.id,
                fullName: row.fullname,
                email: row.email,
                phone: row.phone,
                expectedStartDate: row.expectedstartdate,
                choiceOption1: row.choiceoption1,
                courseName: row.coursename,
                courseCategory: row.coursecategory,
                courseFee: parseInt(row.coursefee) || 0,
                discountPercentage: parseFloat(row.discountpercentage) || 0,
                finalPayableAmount: parseFloat(row.finalpayableamount) || 0,
                enrollmentStatus: row.enrollmentstatus,
                approvalStatus: row.approvalstatus,
                aiPriorityScore: parseInt(row.aipriorityscore) || 0,
                riskLevel: row.risklevel,
                createdDate: row.createddate
            });
        }
        console.log(`🐘 [MOCK DB] Loaded ${enrollments.length} records dynamically from Postgres table query.`);
    } catch (err) {
        console.error("🐘 [MOCK DB] PostgreSQL initialization failed:", err.message);
        console.log("[MOCK DB] Gracefully falling back to local JSON database caching.");
        loadDb();
        loadLeadsDb();
    }
}

function saveDb() {
    try {
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(enrollments, null, 2), "utf8");
        console.log(`[MOCK DB] Saved ${enrollments.length} records to local cache backup: ${DB_FILE}`);
    } catch (err) {
        console.error("[MOCK DB] Error writing database backup:", err);
    }
}

function saveLeadsDb() {
    try {
        const dir = path.dirname(LEADS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
        console.log(`[LOCAL LEADS DB] Saved ${leads.length} leads to ${LEADS_FILE}`);
    } catch (err) {
        console.error("[LOCAL LEADS DB] Error writing leads backup:", err);
    }
}

function loadLeadsDb() {
    try {
        if (fs.existsSync(LEADS_FILE)) {
            const data = fs.readFileSync(LEADS_FILE, "utf8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                leads.length = 0;
                leads.push(...parsed);
                console.log(`[LOCAL LEADS DB] Loaded ${leads.length} leads from cache.`);
            }
        }
    } catch (err) {
        console.error("[LOCAL LEADS DB] Error reading leads file:", err);
    }
}

async function saveEnrollmentDb(record) {
    if (useDatabase && pgClient) {
        try {
            await pgClient.query(`
                INSERT INTO enrollments (
                    id, fullName, email, phone, expectedStartDate, choiceOption1, 
                    courseName, courseCategory, courseFee, discountPercentage, 
                    finalPayableAmount, enrollmentStatus, approvalStatus, aiPriorityScore, riskLevel, createdDate
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT (id) DO UPDATE SET
                    fullName = EXCLUDED.fullName,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    expectedStartDate = EXCLUDED.expectedStartDate,
                    choiceOption1 = EXCLUDED.choiceOption1,
                    courseName = EXCLUDED.courseName,
                    courseCategory = EXCLUDED.courseCategory,
                    courseFee = EXCLUDED.courseFee,
                    discountPercentage = EXCLUDED.discountPercentage,
                    finalPayableAmount = EXCLUDED.finalPayableAmount,
                    enrollmentStatus = EXCLUDED.enrollmentStatus,
                    approvalStatus = EXCLUDED.approvalStatus,
                    aiPriorityScore = EXCLUDED.aiPriorityScore,
                    riskLevel = EXCLUDED.riskLevel,
                    createdDate = EXCLUDED.createdDate
            `, [
                record.id, record.fullName, record.email, record.phone, record.expectedStartDate, record.choiceOption1,
                record.courseName, record.courseCategory, record.courseFee, record.discountPercentage,
                record.finalPayableAmount, record.enrollmentStatus, record.approvalStatus, record.aiPriorityScore, record.riskLevel, record.createdDate
            ]);
            console.log(`🐘 [MOCK DB] Synchronized record ${record.id} in PostgreSQL backend database.`);
        } catch (err) {
            console.error(`🐘 [MOCK DB] Failed to sync record ${record.id} in Postgres:`, err.message);
        }
    }
    saveDb();
}

function loadDb() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, "utf8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                enrollments.length = 0;
                enrollments.push(...parsed);
                console.log(`[MOCK DB] Loaded ${enrollments.length} records from local cache fallback: ${DB_FILE}`);
            }
        }
    } catch (err) {
        console.error("[MOCK DB] Error loading database cache fallback:", err);
    }
}

// Initialize datastores
initPostgres();

// Setup CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": 2592000,
};

// Session store for multi-turn conversations
const sessions = new Map();

// Salesforce OAuth 2.0 token caching and helper
let cachedToken = null;
let tokenExpiry = 0;
let cachedInstanceUrl = "";

async function getSalesforceConnection() {
    const clientId = process.env.SF_CLIENT_ID;
    const clientSecret = process.env.SF_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return null;
    }

    if (cachedToken && Date.now() < tokenExpiry - 300000) {
        return { accessToken: cachedToken, instanceUrl: cachedInstanceUrl };
    }

    console.log("[SALESFORCE] Authenticating with Salesforce using Client Credentials Flow...");
    let myDomain = process.env.SF_MY_DOMAIN || "";

    if (myDomain && !myDomain.startsWith("http")) {
        myDomain = "https://" + myDomain;
    }
    if (myDomain && myDomain.endsWith("/")) {
        myDomain = myDomain.slice(0, -1);
    }

    const tokenUrl = myDomain
        ? `${myDomain}/services/oauth2/token`
        : "https://login.salesforce.com/services/oauth2/token";

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    });

    const tokenData = await response.json();
    if (!response.ok) {
        throw new Error("Salesforce authentication failed: " + JSON.stringify(tokenData));
    }

    cachedToken = tokenData.access_token;
    cachedInstanceUrl = tokenData.instance_url;
    tokenExpiry = Date.now() + 7200000;

    console.log("[SALESFORCE] Authentication successful. Token cached.");
    return { accessToken: cachedToken, instanceUrl: cachedInstanceUrl };
}

async function sendTwilioWhatsApp(toPhone, messageBody) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER || "+14155238886";

    if (!accountSid || !authToken) {
        console.log(`[TWILIO API] (Notice: Twilio credentials not configured. WhatsApp simulation for ${toPhone}: "${messageBody.slice(0, 50)}...")`);
        return;
    }

    console.log(`[TWILIO API] Sending outbound WhatsApp to ${toPhone}...`);

    const formatFrom = fromPhone.startsWith("whatsapp:") ? fromPhone : `whatsapp:${fromPhone}`;
    const formatTo = toPhone.startsWith("whatsapp:") ? toPhone : `whatsapp:${toPhone}`;

    const authString = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams();
    params.append("From", formatFrom);
    params.append("To", formatTo);
    params.append("Body", messageBody);

    try {
        const res = await fetch(twilioUrl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const data = await res.json();
        if (res.ok) {
            console.log(`[TWILIO API] Message sent successfully. SID: ${data.sid}`);
        } else {
            console.error("[TWILIO API] Failed to send message:", data);
        }
    } catch (err) {
        console.error("[TWILIO API] Error hitting Twilio REST API:", err);
    }
}

// Seshadri Rao Gudlavalleru Engineering College (SRGEC) Handbook
const SRGEC_HANDBOOK = `
SESHADRI RAO GUDLAVALLERU ENGINEERING COLLEGE (SRGEC) HANDBOOK:
- Institution Name: Seshadri Rao Gudlavalleru Engineering College (Short Name: SRGEC).
- Location: Seshadri Rao Knowledge Village, Gudlavalleru, Krishna District, Andhra Pradesh, India (PIN: 521356).
- Status & Accreditation: Established in 1998; Autonomous Institution approved by AICTE, New Delhi; Permanently affiliated to JNTUK, Kakinada; Accredited by NAAC with 'A+' Grade; NBA Accredited B.Tech Programmes.
- EAPCET Counselling Code: GECW (for B.Tech).
- ECET Counselling Code: GECW (for Lateral Entry).
- ICET Counselling Code: GECW (for MBA).
- PGECET Counselling Code: GECW1 (for M.Tech).
- Academic Programmes Offered:
  * Undergraduate (B.Tech - 4 Years):
    - Computer Science & Engineering (CSE) - Code: CSE
    - CSE (Artificial Intelligence & Machine Learning) - Code: CSM
    - CSE (Data Science) - Code: CSD
    - CSE (Internet of Things) - Code: CSO
    - Information Technology (IT) - Code: INF
    - Electronics & Communication Engineering (ECE) - Code: ECE
    - Electrical & Electronics Engineering (EEE) - Code: EEE
    - Mechanical Engineering (ME) - Code: MEC
    - Civil Engineering (CE) - Code: CIV
  * Postgraduate (M.Tech - 2 Years & MBA - 2 Years):
    - M.Tech in Computer Science & Engineering (JKCSEG)
    - M.Tech in VLSI Design & Embedded Systems (JKVLSI)
    - M.Tech in Power Electronics & Drives (JKPELD)
    - Master of Business Administration - MBA (JKMBAG)
  * Doctoral Studies (Ph.D): Recognized Research Centres in CSE, ECE, EEE, and Mechanical Engineering.
- Fee Structure:
  * B.Tech Convener Quota: ₹70,000 to ₹1,03,000 per year (as per AP Higher Education Regulatory and Monitoring Commission norms).
  * M.Tech: ₹72,200 per year.
  * MBA: ₹55,000 per year.
- Scholarships & Financial Aid:
  * Jagananna Vidya Deevena (JVD) - Full tuition fee reimbursement for eligible AP convener quota students (SC/ST < ₹2L, BC/EBC/Minority < ₹1L family income).
  * SRGEC Merit Concessions: Fee waivers for top EAPCET/ECET rankers (< 5,000 rank: 50% waiver; < 15,000 rank: 30% waiver; < 30,000 rank: 15% waiver).
  * Sports & Special Endowment fee concessions.
- Admissions Requirements:
  * B.Tech Category-A: Through AP EAPCET state rank and online web counselling using college code GECW.
  * B.Tech Category-B (Management / NRI): Based on JEE Main / EAPCET merit or 10+2 Intermediate MPC aggregate.
  * Documents Required: 10th marks memo, Intermediate marks memo & TC, EAPCET rank card & hall ticket, Study certificates (7 years), Aadhaar cards, Caste/Income certificates (if applicable).
- Working Hours: Monday to Saturday: 9:00 AM – 5:00 PM.
- Official Contacts:
  * Admissions Email: admissions@gecgudlavalleru.ac.in
  * Support Email: support-portal@gecgudlavalleru.ac.in
  * Phone: +91 8674-273737, +91 9848779121
  * Official Website: https://gecgudlavalleru.ac.in
`;

// System Prompt for Nemo
const NEMO_SYSTEM_PROMPT = `
You are a friendly, courteous, and knowledgeable university admissions virtual assistant named Nemo at Seshadri Rao Gudlavalleru Engineering College (SRGEC), Gudlavalleru, Krishna District, Andhra Pradesh.
Your primary role is to answer questions from prospective students and parents accurately using the verified SRGEC handbook details below, guide them through the admission process, explain eligibility and EAPCET counselling code (GECW), and connect them with an admissions advisor when requested.

${SRGEC_HANDBOOK}

## Core Guidelines
1. Ground every answer in the verified SRGEC information above. Never invent cutoffs, fake fees, or unverified claims.
2. Clearly mention the college EAPCET counselling code "GECW" when discussing engineering admissions.
3. Be transparent, polite, and helpful.
4. If a student wants an advisor handoff or personalized guidance, request their mobile number and preferred contact time ("within 2 hours" or "during business hours 9am-5pm").
5. Only when you have their contact phone number AND contact timing, prefix your response with:
[TRIGGER_ADVISOR_HANDOFF]
followed by the confirmation message for the student.
`;

// Rule-based knowledge base fallback for Nemo when GEMINI_API_KEY is not configured
function generateRuleBasedAnswer(prompt, history) {
    const p = prompt.toLowerCase();

    // Check for advisor handoff trigger if phone number is detected
    const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b\d{10}\b/;
    const hasPhone = phoneRegex.test(prompt);

    if (p.includes("call me") || p.includes("advisor") || p.includes("counselor") || p.includes("talk to someone") || p.includes("human") || hasPhone) {
        if (hasPhone || (p.includes("hour") || p.includes("business"))) {
            return `[TRIGGER_ADVISOR_HANDOFF]\nThank you for providing your contact details. An SRGEC Admissions Advisor has been notified and will reach out to you directly to guide you through branch selection, counselling procedures, and fee structures. In the meantime, feel free to explore our Programmes or submit an official Admission Application through the portal!`;
        }
        return `I would be delighted to connect you with an SRGEC Admissions Advisor! Could you please share your **10-digit mobile number** and your preferred contact timing (e.g. *within 2 hours* or *during business hours: 9 AM - 5 PM*)?`;
    }

    if (p.includes("code") || p.includes("counselling") || p.includes("eapcet") || p.includes("eamcet")) {
        return `**SRGEC Counselling Codes for AP State Admissions:**\n\n* **AP EAPCET (B.Tech UG):** **\`GECW\`**\n* **AP ECET (Lateral Entry B.Tech):** **\`GECW\`**\n* **AP ICET (MBA):** **\`GECW\`**\n* **AP PGECET / GATE (M.Tech):** **\`GECW1\`**\n\nWhen entering your web options in the state counselling portal, search for **Seshadri Rao Gudlavalleru Engineering College (GECW)**.`;
    }

    if (p.includes("branch") || p.includes("course") || p.includes("programme") || p.includes("department") || p.includes("btech") || p.includes("cse") || p.includes("it")) {
        return `**Academic Programmes at SRGEC (A.Y. 2026-2027):**\n\n**Undergraduate (B.Tech - 4 Years):**\n1. **Computer Science & Engineering (CSE)** (Code: CSE, Intake: 240)\n2. **CSE (Artificial Intelligence & Machine Learning)** (Code: CSM, Intake: 180)\n3. **CSE (Data Science)** (Code: CSD, Intake: 120)\n4. **CSE (Internet of Things)** (Code: CSO, Intake: 60)\n5. **Information Technology (IT)** (Code: INF, Intake: 120)\n6. **Electronics & Communication Engineering (ECE)** (Code: ECE, Intake: 180)\n7. **Electrical & Electronics Engineering (EEE)** (Code: EEE, Intake: 90)\n8. **Mechanical Engineering (ME)** (Code: MEC, Intake: 90)\n9. **Civil Engineering (CE)** (Code: CIV, Intake: 60)\n\n**Postgraduate & MBA:**\n* M.Tech in CSE, VLSI & Embedded Systems, Power Electronics & Drives\n* MBA (Dual specialization)\n\nWould you like more details about any specific branch?`;
    }

    if (p.includes("fee") || p.includes("tuition") || p.includes("cost") || p.includes("how much")) {
        return `**SRGEC Fee Structure (A.Y. 2026-2027):**\n\n* **B.Tech (UG Programmes):** Standard tuition fee is approximately **₹70,000 to ₹1,03,000 per year** (as fixed by the AP Higher Education Regulatory Commission).\n* **M.Tech (PG):** **₹72,200 per year**.\n* **MBA:** **₹55,000 per year**.\n\n*Note:* Students eligible for **Jagananna Vidya Deevena (JVD)** receive 100% tuition fee reimbursement from the State Government. Institutional merit concessions are also available for top EAPCET rankers.`;
    }

    if (p.includes("scholarship") || p.includes("reimbursement") || p.includes("jvd") || p.includes("concession")) {
        return `**Scholarship Policies at SRGEC:**\n\n1. **Jagananna Vidya Deevena (JVD):** Complete tuition fee reimbursement for eligible AP convener quota students (SC/ST family income < ₹2.00 Lakhs; BC/EBC/Minority < ₹1.00 Lakh).\n2. **SRGEC Merit Concessions:**\n   * EAPCET Rank 1 to 5,000: **50% tuition waiver**\n   * EAPCET Rank 5,001 to 15,000: **30% tuition waiver**\n   * EAPCET Rank 15,001 to 30,000: **15% tuition waiver**\n3. **Sports & Special Endowment:** 20% concession for state/national level athletes.`;
    }

    if (p.includes("document") || p.includes("certificate") || p.includes("eligibility") || p.includes("requirement")) {
        return `**Required Admission Documents for SRGEC:**\n\n* SSC / 10th Class Marks Memo\n* Intermediate (10+2) / Diploma Marks Memo & Transfer Certificate (TC)\n* AP EAPCET / ECET / ICET Rank Card & Hall Ticket\n* Study / Bonafide Certificates (for previous 7 consecutive years)\n* Aadhaar Cards (Student & Parents)\n* Caste & Income Certificate (issued by MeeSeva, if seeking reservation or JVD reimbursement)\n* 6 Recent Passport-size Photographs`;
    }

    if (p.includes("contact") || p.includes("phone") || p.includes("email") || p.includes("address") || p.includes("location") || p.includes("where")) {
        return `**SRGEC Admissions Contact Details:**\n\n* **Address:** Seshadri Rao Knowledge Village, Gudlavalleru, Krishna District, Andhra Pradesh - 521356, India.\n* **Admissions Phone:** +91 8674-273737 / +91 9848779121\n* **Admissions Email:** admissions@gecgudlavalleru.ac.in\n* **Working Hours:** Monday to Saturday, 9:00 AM – 5:00 PM\n* **Website:** https://gecgudlavalleru.ac.in`;
    }

    if (p.includes("apply") || p.includes("register") || p.includes("how to") || p.includes("step")) {
        return `**How to Apply for Admission at SRGEC:**\n\n1. **Step 1:** Click on **"Apply Now"** in the top navigation to access the 4-step Admission Registration Wizard.\n2. **Step 2:** Fill in your personal details, academic scores, and AP EAPCET rank.\n3. **Step 3:** Select your primary and secondary branch preferences.\n4. **Step 4:** Review your details and submit to obtain an official Registration Reference ID.\n\nFor Category-A seats, ensure you participate in AP State EAPCET counselling with code **\`GECW\`**.`;
    }

    // Default friendly fallback
    return `Hello! I am Nemo, your Admissions Assistant at **Seshadri Rao Gudlavalleru Engineering College (SRGEC)**, Gudlavalleru.\n\nI can help you with:\n* **Programmes & Branches** (B.Tech, M.Tech, MBA)\n* **EAPCET Counselling Code** (\`GECW\`)\n* **Fee Structures & Scholarships (JVD)**\n* **Required Documents & Eligibility Criteria**\n* **Connecting with an Admissions Advisor**\n\nWhat would you like to know today?`;
}

// Helper to write JSON responses
const sendJson = (res, statusCode, data) => {
    res.writeHead(statusCode, {
        ...corsHeaders,
        "Content-Type": "application/json",
    });
    res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
    // Handle CORS Preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // Salesforce / Local Lead Submission Route
    if (req.method === "POST" && req.url === "/createFormLead") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                console.log("\n========================================");
                console.log("[LEAD API] Pushing Admission Enquiry Lead:");
                console.log(`  Name: ${payload.firstName} ${payload.lastName}`);
                console.log(`  Email: ${payload.email}`);
                console.log(`  Phone: ${payload.cellPhone}`);
                console.log(`  Program Interest: ${payload.programType}`);
                console.log(`  Location: ${payload.headquarters || "Gudlavalleru"}`);
                console.log("========================================\n");

                let leadId = "SRGEC-LEAD-" + Date.now();
                let syncedToSalesforce = false;

                // 1. Attempt Salesforce sync if credentials exist
                const sfConn = await getSalesforceConnection().catch(() => null);
                if (sfConn && sfConn.accessToken) {
                    try {
                        const leadPayload = {
                            FirstName: payload.firstName || "",
                            LastName: payload.lastName || "Unknown",
                            Company: "Seshadri Rao Gudlavalleru Engineering College (SRGEC)",
                            Email: payload.email || "",
                            Phone: payload.cellPhone || "",
                            Description: `Campus Location: ${payload.headquarters || "Gudlavalleru"}\nProgram Interest: ${payload.programType || ""}\nHome Phone: ${payload.homePhone || ""}\nData Authorization: ${payload.dataAuthorization || false}`
                        };

                        const leadResponse = await fetch(`${sfConn.instanceUrl}/services/data/v58.0/sobjects/Lead`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${sfConn.accessToken}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(leadPayload)
                        });

                        const leadResult = await leadResponse.json();
                        if (leadResponse.ok && leadResult.id) {
                            leadId = leadResult.id;
                            syncedToSalesforce = true;
                            console.log(`[SALESFORCE API] Lead created in Salesforce sandbox with ID: ${leadId}`);
                        } else {
                            console.warn("[SALESFORCE API] Warning: Salesforce lead creation returned non-ok:", leadResult);
                        }
                    } catch (sfErr) {
                        console.warn("[SALESFORCE API] Could not push to Salesforce CRM, saving locally:", sfErr.message);
                    }
                } else {
                    console.log("[SALESFORCE API] SF_CLIENT_ID not configured; saving lead locally in JSON store.");
                }

                // 2. Persist locally to leads.json
                const leadRecord = {
                    id: leadId,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    cellPhone: payload.cellPhone,
                    headquarters: payload.headquarters || "Gudlavalleru Campus",
                    programType: payload.programType,
                    syncedToSalesforce,
                    createdDate: new Date().toISOString()
                };
                leads.push(leadRecord);
                saveLeadsDb();

                // 3. Trigger WhatsApp notification via Twilio if configured
                const twilioMsg = `Hello ${payload.firstName}! Thank you for your inquiry regarding admissions at Seshadri Rao Gudlavalleru Engineering College (SRGEC). Our admissions desk (Code: GECW) has received your details and will assist you shortly.`;
                await sendTwilioWhatsApp(payload.cellPhone, twilioMsg);

                sendJson(res, 200, {
                    statusCode: 200,
                    message: "Enquiry submitted successfully",
                    data: {
                        leadId: leadId,
                    },
                    syncedToSalesforce
                });
            } catch (err) {
                console.error("[LEAD API] Error processing /createFormLead:", err);
                sendJson(res, 400, { error: err.message || "Failed to process admission inquiry" });
            }
        });
        return;
    }

    // AI Proxy SSE Stream (Gemini when GEMINI_API_KEY is configured, Rule-based Knowledge fallback when missing)
    if (req.method === "POST" && req.url === "/") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const requestData = JSON.parse(body);
                const runtimeSessionId = requestData.runtimeSessionId || "default-session";
                const payload = requestData.payload || {};
                const prompt = payload.prompt || "";
                const phoneNumber = payload.phone_number || "anonymous";

                console.log(`\n[NEMO AI PROXY] Message Request - Session ID: ${runtimeSessionId}`);
                console.log(`[NEMO AI PROXY] Query: "${prompt}"`);

                // Set Headers for SSE streaming output to client
                res.writeHead(200, {
                    ...corsHeaders,
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                });

                // Fetch history for this session
                if (!sessions.has(runtimeSessionId)) {
                    sessions.set(runtimeSessionId, []);
                }
                const sessionHistory = sessions.get(runtimeSessionId);

                const apiKey = process.env.GEMINI_API_KEY;

                if (apiKey) {
                    // LIVE GEMINI STREAMING FLOW
                    res.write(`data: ${JSON.stringify({ thinking: "🔍 Searching SRGEC Admissions Knowledge Base..." })}\n\n`);
                    await new Promise((resolve) => setTimeout(resolve, 400));

                    sessionHistory.push({
                        role: "user",
                        parts: [{ text: prompt }],
                    });

                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
                    const geminiPayload = {
                        contents: sessionHistory,
                        systemInstruction: {
                            parts: [{ text: NEMO_SYSTEM_PROMPT }],
                        },
                    };

                    const geminiResponse = await fetch(geminiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(geminiPayload),
                    });

                    if (!geminiResponse.ok) {
                        console.error("[GEMINI PROXY] API request failed with status:", geminiResponse.status);
                        // Fall back to rule-based answer
                        const fallbackReply = generateRuleBasedAnswer(prompt, sessionHistory);
                        res.write(`data: ${JSON.stringify({ response: fallbackReply })}\n\n`);
                        res.write(`data: ${JSON.stringify({ final_result: fallbackReply })}\n\n`);
                        res.end();
                        return;
                    }

                    const reader = geminiResponse.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = "";
                    let fullReply = "";
                    let isHandoffTriggered = false;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop();

                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (!trimmedLine.startsWith("data: ")) continue;

                            const jsonStr = trimmedLine.slice(6).trim();
                            if (!jsonStr) continue;

                            try {
                                const chunkData = JSON.parse(jsonStr);
                                let textChunk = chunkData.candidates?.[0]?.content?.parts?.[0]?.text;
                                if (textChunk) {
                                    fullReply += textChunk;
                                    if (fullReply.includes("[TRIGGER_ADVISOR_HANDOFF]")) {
                                        isHandoffTriggered = true;
                                        textChunk = textChunk.replace(/\[TRIGGER_ADVISOR_HANDOFF\]/gi, "");
                                    }
                                    if (textChunk) {
                                        res.write(`data: ${JSON.stringify({ response: textChunk })}\n\n`);
                                    }
                                }
                            } catch (pErr) {
                                console.error("[GEMINI PROXY] Chunk parse error:", pErr);
                            }
                        }
                    }

                    const cleanedReply = fullReply.replace(/\[TRIGGER_ADVISOR_HANDOFF\]/gi, "").trim();

                    if (isHandoffTriggered) {
                        console.log("\n------------------ SRGEC ADVISOR HANDOFF DETECTED ------------------");
                        res.write(`data: ${JSON.stringify({ tool_result: "Advisor Handoff initiated in SRGEC Admissions Desk." })}\n\n`);
                        const twilioMsg = `Hi! Thanks for your interest in Seshadri Rao Gudlavalleru Engineering College (SRGEC). An admissions counselor has been assigned and will contact you shortly.`;
                        await sendTwilioWhatsApp(phoneNumber, twilioMsg);
                    }

                    sessionHistory.push({
                        role: "model",
                        parts: [{ text: cleanedReply }],
                    });

                    res.write(`data: ${JSON.stringify({ final_result: cleanedReply })}\n\n`);
                    res.end();

                } else {
                    // GRACEFUL RULE-BASED FALLBACK (When GEMINI_API_KEY is not configured)
                    res.write(`data: ${JSON.stringify({ thinking: "🔍 Searching SRGEC Admissions Knowledge Base..." })}\n\n`);
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    sessionHistory.push({
                        role: "user",
                        parts: [{ text: prompt }],
                    });

                    const reply = generateRuleBasedAnswer(prompt, sessionHistory);
                    const isHandoff = reply.includes("[TRIGGER_ADVISOR_HANDOFF]");
                    const cleanReply = reply.replace(/\[TRIGGER_ADVISOR_HANDOFF\]/gi, "").trim();

                    // Stream words gradually to provide a realistic conversational feel
                    const words = cleanReply.split(" ");
                    for (let i = 0; i < words.length; i += 4) {
                        const slice = words.slice(i, i + 4).join(" ") + " ";
                        res.write(`data: ${JSON.stringify({ response: slice })}\n\n`);
                        await new Promise((resolve) => setTimeout(resolve, 60));
                    }

                    if (isHandoff) {
                        res.write(`data: ${JSON.stringify({ tool_result: "Advisor Handoff request noted for SRGEC Admissions team." })}\n\n`);
                        const twilioMsg = `Hi! Thanks for your interest in Seshadri Rao Gudlavalleru Engineering College (SRGEC). An admissions counselor has been notified and will contact you.`;
                        await sendTwilioWhatsApp(phoneNumber, twilioMsg);
                    }

                    sessionHistory.push({
                        role: "model",
                        parts: [{ text: cleanReply }],
                    });

                    res.write(`data: ${JSON.stringify({ final_result: cleanReply })}\n\n`);
                    res.end();
                }

            } catch (err) {
                console.error("[NEMO AI PROXY] Error processing request:", err);
                res.write(`data: ${JSON.stringify({ error: err.message || "Proxy exception occurred." })}\n\n`);
                res.end();
            }
        });
        return;
    }

    // Helper to query authorization header check
    function checkAuthorized(req, res) {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            sendJson(res, 401, { error: "Unauthorized access: Missing session token" });
            return null;
        }
        const token = authHeader.substring(7);
        const verified = verifyJwt(token, JWT_SECRET);
        if (!verified) {
            sendJson(res, 401, { error: "Unauthorized access: Session expired or invalid signature" });
            return null;
        }
        return verified;
    }

    // Counselor Authenticated Login Route
    if (req.method === "POST" && req.url === "/api/counselor/login") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const payload = JSON.parse(body);
                const { username, password } = payload;
                if (username === COUNSELOR_USER && password === COUNSELOR_PASS) {
                    const token = signJwt(
                        { username, role: "counselor", exp: Date.now() + 3600000 },
                        JWT_SECRET
                    );
                    sendJson(res, 200, { success: true, token });
                } else {
                    sendJson(res, 401, { success: false, error: "Invalid username or password credentials" });
                }
            } catch (err) {
                console.error("[AUTH] Counselor login error:", err);
                sendJson(res, 400, { error: "Invalid request payload" });
            }
        });
        return;
    }

    // 1. GET /api/courses
    if (req.method === "GET" && req.url === "/api/courses") {
        sendJson(res, 200, COURSES);
        return;
    }

    // 2. GET /api/enrollments/status (Public Student Application Status Check)
    if (req.method === "GET" && req.url.startsWith("/api/enrollments/status")) {
        const queryParams = new URLSearchParams(req.url.split("?")[1] || "");
        const searchId = (queryParams.get("id") || "").trim().toUpperCase();
        const searchPhone = (queryParams.get("phone") || "").replace(/[\s+-]/g, "");

        if (!searchId && !searchPhone) {
            sendJson(res, 400, { error: "Please provide a Registration ID or Phone Number to check status." });
            return;
        }

        const found = enrollments.find(e => {
            const idMatch = searchId && e.id && e.id.toUpperCase() === searchId;
            const phoneClean = (e.phone || "").replace(/[\s+-]/g, "");
            const phoneMatch = searchPhone && phoneClean && (phoneClean.includes(searchPhone) || searchPhone.includes(phoneClean));
            return idMatch || phoneMatch;
        });

        if (!found) {
            sendJson(res, 404, {
                found: false,
                message: `No application matching ${searchId || searchPhone} was found in the SRGEC admissions registry.`
            });
            return;
        }

        sendJson(res, 200, {
            found: true,
            enrollment: {
                id: found.id,
                fullName: found.fullName,
                courseName: found.courseName,
                courseCategory: found.courseCategory,
                courseFee: found.courseFee,
                discountPercentage: found.discountPercentage,
                finalPayableAmount: found.finalPayableAmount,
                enrollmentStatus: found.enrollmentStatus,
                approvalStatus: found.approvalStatus,
                expectedStartDate: found.expectedStartDate,
                createdDate: found.createdDate,
            }
        });
        return;
    }

    // 3. GET /api/enrollments (Authorized Counselor View)
    if (req.method === "GET" && req.url === "/api/enrollments") {
        if (!checkAuthorized(req, res)) return;
        sendJson(res, 200, enrollments);
        return;
    }

    // 4. GET /api/enrollments/ai-insights (Simulating AI Advisor prompt templates)
    if (req.method === "GET" && req.url.startsWith("/api/enrollments/ai-insights")) {
        if (!checkAuthorized(req, res)) return;
        const queryParams = new URLSearchParams(req.url.split("?")[1] || "");
        const enrollmentId = queryParams.get("id");
        const found = enrollments.find(e => e.id === enrollmentId);

        if (!found) {
            sendJson(res, 404, { error: "Enrollment not found" });
            return;
        }

        const studentName = found.fullName || "Applicant";
        const courseName = found.courseName || "Unknown Course";
        const courseFee = found.courseFee || 0;
        const discount = found.discountPercentage || 0;
        const finalPayable = found.finalPayableAmount || 0;
        const status = found.enrollmentStatus || "Draft";
        const aiScore = found.aiPriorityScore || 50;
        const riskLevel = found.riskLevel || "Low";

        const studentApplicationSummary = `SRGEC Student Application Evaluation:
* Applicant Name: ${studentName}
* Programme: ${courseName} (Standard fee: ₹${courseFee.toLocaleString('en-IN')})
* Financial Structure: Applied institutional discount of ${discount}% resulting in a Final Payable Amount of ₹${finalPayable.toLocaleString('en-IN')}.
* Admission Status: The application is currently marked as "${status}".
* AI Evaluation Rank: Evaluated with an AI priority score of ${aiScore}/100.
${aiScore >= 80 ? "⚠️ High priority applicant requiring priority counselor contact." : "✅ Normal priority - process through standard SRGEC admission counselling."}
* Risk indicators: Financial concession is within ${discount > 30 ? "exceptional approval levels" : "standard parameters"}.`;

        const admissionRiskAnalysis = `SRGEC Admission Risk Analysis & Recommendation:
1. Probability of Admission: Estimated at ${aiScore > 75 ? "92%" : "70%"} based on entrance rank and academic scores.
2. Financial Feasibility: ${discount > 30 ? "Review Required (Concession > 30%)" : "Standard approved structure"}.
3. Enrollment Health: ${riskLevel} Risk.
4. Recommendation: ${discount > 30 ? "⚠️ Require Principal/Dean approval before finalizing seat." : "✅ Recommended for seat confirmation in SRGEC admissions portal."}`;

        sendJson(res, 200, {
            id: enrollmentId,
            studentApplicationSummary,
            admissionRiskAnalysis
        });
        return;
    }

    // 5. POST /api/enrollments (New Student Application Submission)
    if (req.method === "POST" && req.url === "/api/enrollments") {
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const courseId = payload.choiceOption1 || "cse";
                const courseItem = COURSES.find(c => c.id === courseId) || COURSES[0];
                const fee = courseItem.fee;
                const discount = parseFloat(payload.discountPercentage) || 0;
                const finalPayable = Math.max(0, fee * (1 - (discount / 100)));
                const aiScore = Math.floor(45 + Math.random() * 55);

                let risk = "Low";
                if (discount > 30) risk = "High";
                else if (discount >= 15) risk = "Medium";

                let appStatus = "Approved";
                let enrollStatus = "Approved";
                if (discount > 30) {
                    appStatus = "Pending";
                    enrollStatus = "Submitted for Approval";
                }

                // SRGEC Registration Reference Format
                const randNum = Math.floor(10000 + Math.random() * 90000);
                const brandNew = {
                    id: `SRGEC-2026-A${randNum}`,
                    fullName: payload.fullName || "Student Applicant",
                    email: payload.email || "student@example.com",
                    phone: payload.phone || "0000000000",
                    expectedStartDate: payload.expectedStartDate || new Date().toISOString().split("T")[0],
                    choiceOption1: courseId,
                    courseName: courseItem.name,
                    courseCategory: courseItem.category || "Technical",
                    courseFee: fee,
                    discountPercentage: discount,
                    finalPayableAmount: finalPayable,
                    enrollmentStatus: enrollStatus,
                    approvalStatus: appStatus,
                    aiPriorityScore: aiScore,
                    riskLevel: risk,
                    createdDate: new Date().toISOString()
                };

                enrollments.unshift(brandNew);
                await saveEnrollmentDb(brandNew);
                console.log(`[SRGEC ADMISSIONS] Registered new Application: ${brandNew.id} for ${brandNew.fullName}`);

                // Send Twilio notification if configured
                const msg = `Congratulations ${brandNew.fullName}! Your SRGEC Admission Registration has been received. Your Registration ID is ${brandNew.id}. College Counselling Code: GECW.`;
                await sendTwilioWhatsApp(brandNew.phone, msg);

                sendJson(res, 201, brandNew);
            } catch (err) {
                console.error("Error parsing enrollment post:", err);
                sendJson(res, 400, { error: "Invalid JSON body" });
            }
        });
        return;
    }

    // 6. POST /api/enrollments/action
    if (req.method === "POST" && req.url === "/api/enrollments/action") {
        if (!checkAuthorized(req, res)) return;
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const enrollmentId = payload.id;
                const action = payload.action;
                const foundIndex = enrollments.findIndex(e => e.id === enrollmentId);

                if (foundIndex === -1) {
                    sendJson(res, 404, { error: "Enrollment not found" });
                    return;
                }

                if (action === "approve") {
                    enrollments[foundIndex].approvalStatus = "Approved";
                    enrollments[foundIndex].enrollmentStatus = "Approved";
                    console.log(`[SRGEC MOCK] Enrollment ${enrollmentId} APPROVED by Admissions Dean.`);
                } else if (action === "reject") {
                    enrollments[foundIndex].approvalStatus = "Rejected";
                    enrollments[foundIndex].enrollmentStatus = "Rejected";
                    console.log(`[SRGEC MOCK] Enrollment ${enrollmentId} REJECTED.`);
                }

                await saveEnrollmentDb(enrollments[foundIndex]);
                sendJson(res, 200, enrollments[foundIndex]);
            } catch (err) {
                console.error("Error parsing enrollment action post:", err);
                sendJson(res, 400, { error: "Invalid JSON body" });
            }
        });
        return;
    }

    // 404 Route
    res.writeHead(404, corsHeaders);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`🏛️ Seshadri Rao Gudlavalleru Engineering College (SRGEC) Admissions Server running at http://localhost:${PORT}`);
    console.log("Press Ctrl+C to terminate");
});
