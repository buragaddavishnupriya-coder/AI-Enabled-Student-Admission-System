# Seshadri Rao Gudlavalleru Engineering College (SRGEC) - AI-Enabled Student Admission System

An enterprise-grade, college-specific admission portal and virtual counseling ecosystem customized for **Seshadri Rao Gudlavalleru Engineering College (SRGEC)**, Gudlavalleru, Krishna District, Andhra Pradesh, India.

- **Institution:** Seshadri Rao Gudlavalleru Engineering College (Autonomous)
- **Affiliation:** Permanently Affiliated to JNTUK, Kakinada | Approved by AICTE, New Delhi
- **Accreditation:** NAAC Accredited with 'A+' Grade | NBA Accredited Programmes
- **State Counselling Codes:**
  - **AP EAPCET (UG B.Tech):** `GECW`
  - **AP ECET (Lateral Entry):** `GECW`
  - **AP ICET (MBA):** `GECW`
  - **AP PGECET (M.Tech):** `GECW1`

---

## Table of Contents

- [Core Capabilities](#core-capabilities)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Centralized Institution Configuration](#centralized-institution-configuration)
- [Project Directory Structure](#directory-structure)
- [Local Setup & Running](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Endpoints Specification](#api-endpoints-specification)
- [External Integrations & Fallbacks](#external-integrations--fallbacks)
- [Demo Counselor Credentials](#demo-counselor-credentials)
- [License](#license)

---

## Core Capabilities

1. **Brand-Specific Engineering College Portal**:
   - Modern, responsive navy-and-gold design system tailored for engineering college admissions.
   - Comprehensive program showcase for all 9 B.Tech branches, M.Tech specializations, MBA, and Ph.D. research centres.
   - Transparent AP Higher Education Regulatory Commission fee structures and Andhra Pradesh Jagananna Vidya Deevena (JVD) scholarship criteria.

2. **4-Step Admission Registration Wizard (`/apply`)**:
   - **Step 1:** Personal identity, reservation category, and contact details.
   - **Step 2:** Academic marks (10th / 12th / Diploma) and entrance scores (AP EAPCET/ECET/JEE).
   - **Step 3:** Primary and secondary branch selection with scholarship quota.
   - **Step 4:** **Review-Before-Submit** verification step allowing candidates to inspect details prior to committing.
   - Real-time inline field validation, phone/email format checks, duplicate submission protection, and server reference generation (`SRGEC-2026-AXXXXX`).

3. **Public Application Status Tracking (`/status`)**:
   - Direct search capability using Registration Reference ID or student mobile phone number.
   - Displays real-time status (Approved, Pending, Under Review) and branch allotment details without requiring counselor authorization.

4. **Nemo Virtual Admissions Advisor (AI Assistant)**:
   - Grounded in verified SRGEC handbook data, branch capacities, and counseling guidelines.
   - **Dual Execution Engine**:
     - *Online AI Mode:* Connects to Google Gemini API for natural streaming dialogue via Server-Sent Events (SSE).
     - *Built-In Knowledge Fallback:* When `GEMINI_API_KEY` is not provided, Nemo gracefully answers questions using keyword-matched institutional data without failing or requiring paid services.
   - Intelligent Advisor Handoff: Captures student mobile number and triggers admissions officer callbacks.

5. **Counselor & Dean Management Drawer (`/counselor`)**:
   - JWT-authenticated secure counselor portal (`counselor` / `counselor@srgec`).
   - Application queue review, approval/rejection overrides, AI priority scoring, and financial risk evaluation.

---

## Architecture & Tech Stack

```mermaid
graph TD
    Client[Candidate / Parent / Counselor] -->|HTTP / HTTPS| FE[Next.js 15 App Router Frontend]
    FE -->|Client Routing| Pages[Home / About / Programmes / Apply / Status / Scholarships / Help]
    FE -->|SSE / REST| BE[Node.js Admissions Server :8080]
    BE -->|Optional Stream| Gemini[Google Gemini 2.5 Flash]
    BE -->|Knowledge Engine| KB[Embedded SRGEC Handbook & FAQ Store]
    BE -->|Optional OAuth2| Salesforce[Salesforce CRM Sandbox]
    BE -->|Optional REST| Twilio[Twilio WhatsApp Gateway]
    BE -->|Persistence| DB[PostgreSQL / Local JSON Store data/]
```

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Radix UI primitives.
- **Backend Server:** Node.js HTTP Server (`Backend/mock-server/server.js`) with native HMAC-SHA256 JWT, zero external runtime framework overhead, and robust local JSON cache fallbacks.

---

## Centralized Institution Configuration

All institution-specific data is centralized to prevent scattered, hardcoded strings:
- **Frontend Configuration:** `Frontend/lib/college-config.ts`
- **Backend Configuration:** `Backend/mock-server/college-config.js`

Fields configured:
- Full college name, short name (`SRGEC`), founding year (1998), autonomous status, NAAC 'A+' grade.
- AP EAPCET counselling code: **`GECW`**
- All 9 B.Tech branches, M.Tech specializations, and MBA intake and fee data.
- Campus address in Gudlavalleru, Krishna District, AP.
- Admissions phone numbers (`+91 8674-273737`, `+91 9848779121`) and verified email endpoints (`admissions@gecgudlavalleru.ac.in`).

---

## Directory Structure

```
AI-Enabled-Student-Admission-System/
├── Backend/
│   └── mock-server/
│       ├── data/
│       │   ├── enrollments.json     # Local store for student applications
│       │   └── leads.json           # Local store for enquiry leads
│       ├── .env.example             # Safe template with placeholder values
│       ├── college-config.js        # Mirrored institution configuration
│       ├── server.js                # Core API, SSE Proxy, & Auth logic
│       └── package.json
│
├── Frontend/
│   ├── app/
│   │   ├── about/                   # SRGEC history, society, accreditations
│   │   ├── apply/                   # 4-step Admission Registration Wizard
│   │   ├── counselor/               # Counselor Login, Dashboard, & Screen Flow
│   │   ├── get-help/                # Admissions contact desk & FAQ accordion
│   │   ├── programmes/              # Programmes overview, UG (B.Tech), PG, Ph.D
│   │   ├── scholarships/            # JVD Government scheme & merit concessions
│   │   ├── status/                  # Public Application Status tracking
│   │   ├── globals.css              # Tailwind CSS v4 design tokens
│   │   ├── layout.tsx               # Root layout & SRGEC metadata
│   │   └── page.tsx                 # Main application state machine
│   ├── components/
│   │   ├── header.tsx               # SRGEC Navigation Header & Mobile Drawer
│   │   ├── inquiry-form.tsx         # Admissions Enquiry Lead modal
│   │   ├── logo-srgec.tsx           # Vector SVG SRGEC emblem & crest logo
│   │   ├── srgec-landing-page.tsx   # Modernized landing page
│   │   └── nemo/                    # AI Chatbot Interface, Messages, Input
│   ├── lib/
│   │   ├── college-config.ts        # Centralized institutional data layer
│   │   ├── config.ts                # API client environment configuration
│   │   └── agent-client.ts          # SSE streaming client
│   ├── env.example                  # Safe template for Next.js
│   └── package.json
│
├── run-local.ps1                    # One-click PowerShell local development launcher
├── LICENSE                          # MIT License
└── README.md                        # Documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/)

### Step 1: Start the Backend Mock Server

Open a terminal window:

```bash
cd Backend/mock-server
npm install
node server.js
```

The server will initialize on `http://localhost:8080`.

### Step 2: Start the Next.js Frontend Dev Server

Open a second terminal window:

```bash
cd Frontend
npm install
npm run dev
```

Browse to [http://localhost:3000](http://localhost:3000) to access the portal.

### Quick Launch (Windows PowerShell)

Alternatively, launch both frontend and backend concurrently in separate windows by running:

```powershell
.\run-local.ps1
```

---

## Environment Configuration

Both frontend and backend include safe `.env.example` templates with no real secrets exposed.

### Backend (`Backend/mock-server/.env.example`)

```env
PORT=8080
COUNSELOR_USERNAME=counselor
COUNSELOR_PASSWORD=counselor@srgec
JWT_SECRET=srgecSecretKey2026!

# Optional Database (Default: uses local data/enrollments.json automatically)
# DATABASE_URL=postgresql://user:password@localhost:5432/srgec_admissions

# Optional Google Gemini Key for AI Chatbot
# (If omitted, Nemo runs in honest built-in knowledge base mode)
# GEMINI_API_KEY=your_gemini_api_key_here

# Optional Salesforce CRM Integration (If omitted, leads are stored locally in data/leads.json)
# SF_CLIENT_ID=your_client_id
# SF_CLIENT_SECRET=your_client_secret
# SF_MY_DOMAIN=yourorg.my.salesforce.com

# Optional Twilio WhatsApp Sandbox (If omitted, notifications are simulated in console)
# TWILIO_ACCOUNT_SID=your_account_sid
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_PHONE_NUMBER=+14155238886
```

### Frontend (`Frontend/env.example`)

```env
NEXT_PUBLIC_FORM_SUBMISSION_API=http://localhost:8080/
NEXT_PUBLIC_AGENT_PROXY_URL=http://localhost:8080/
```

---

## API Endpoints Specification

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | AI Chatbot SSE stream (Gemini API or built-in SRGEC KB fallback) | No |
| `POST` | `/createFormLead` | Captures admission lead (Syncs to Salesforce or local `leads.json`) | No |
| `GET` | `/api/courses` | Returns all verified SRGEC academic branches & fee figures | No |
| `GET` | `/api/enrollments/status` | Candidate application status check by `id` or `phone` | No |
| `POST` | `/api/enrollments` | Submits new 4-step admission application | No |
| `POST` | `/api/counselor/login` | Authenticates counselor credentials and issues 1-hour JWT | No |
| `GET` | `/api/enrollments` | Retrieves all registered student applications | Yes (`Bearer JWT`) |
| `GET` | `/api/enrollments/ai-insights` | Generates admission risk and financial summaries | Yes (`Bearer JWT`) |
| `POST` | `/api/enrollments/action` | Approves or rejects candidate admission seat | Yes (`Bearer JWT`) |

---

## External Integrations & Fallbacks

- **Google Gemini AI**: If `GEMINI_API_KEY` is configured in `Backend/mock-server/.env`, Nemo streams responses directly from Gemini. If missing or invalid, the backend immediately activates its embedded SRGEC Knowledge Base to accurately answer questions regarding fees, codes (`GECW`), and admissions without crashing.
- **Salesforce CRM**: If Salesforce credentials are valid, leads and tasks are synchronized to the Salesforce developer sandbox. If missing, the backend saves leads to `Backend/mock-server/data/leads.json` and sets `syncedToSalesforce: false`.
- **Twilio WhatsApp**: Outbound WhatsApp notifications are sent if credentials exist; otherwise, messages are logged safely in the terminal without interrupting the application flow.

---

## Demo Counselor Credentials

For evaluating the Counselor Dashboard and Opportunity Flow:
- **Login URL:** [http://localhost:3000/counselor/login](http://localhost:3000/counselor/login)
- **Username:** `counselor`
- **Password:** `counselor@srgec`

---

## License

This project is licensed under the [MIT License](./LICENSE). All modifications made to customize this application for **Seshadri Rao Gudlavalleru Engineering College (SRGEC)** are preserved under open-source standards.
