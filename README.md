# Smart Resume Screening & Candidate Ranking Tool 🚀

A production-grade, AI-powered recruitment platform (ATS) designed for recruiters and hiring managers. Automatically extract job criteria, parse candidate resumes (PDF & DOCX), compute multi-criteria weighted match scores, rank applicants, perform skill gap analysis, compare candidates side-by-side, and generate tailored interview prep sheets.

---

## 🌟 Key Features

1. **Role-Based Authentication & Security**:
   - Recruiter & Admin roles with JWT authentication, bcrypt password hashing, HTTP security headers (Helmet), rate limiting, and CORS protection.

2. **AI Job Description Criteria Extraction**:
   - Paste raw job descriptions and automatically extract required skills, preferred skills, responsibilities, required experience, education, and keywords using Groq LLM (with rule-based fallback).

3. **PDF & DOCX Resume Processing**:
   - Extracts plain text from uploaded PDF (`pdf-parse`) and Word (`mammoth`) documents.
   - Parses structured candidate profiles (Contact, Skills, Experience, Education, Projects, Certifications).

4. **Multi-Criteria ATS Scoring Engine (0 - 100)**:
   - Configurable weighted algorithm:
     - **Semantic Similarity** (30%): Cosine term frequency similarity.
     - **Required Skills** (25%): Matched vs missing skills breakdown.
     - **Experience Score** (15%): Normalization against target years.
     - **Education Score** (10%): Degree qualification level matching.
     - **Keyword Match Score** (10%): Match ratio against job keywords.
     - **Projects & Certifications Score** (10%): Verification bonus.

5. **Skill Gap Analysis**:
   - Clear visual breakdown of **Matched Skills**, **Missing Required Skills**, **Missing Preferred Skills**, and **Additional Bonus Skills**.

6. **Candidate Ranking & Filtering**:
   - Automated rank ordering (#1, #2, #3...) by ATS Final Score.
   - Filters by score threshold, skill search, location, and experience.

7. **Side-by-Side Candidate Comparison Matrix**:
   - Select 2 to 4 candidates to compare scores, sub-scores, projects, and skill gaps in tabular format and Recharts radar/bar graphs.

8. **AI Interview Question Generator**:
   - Automatically generates **5 Technical**, **3 Behavioral**, **3 Project**, and **3 Skill Gap** questions with evaluation rubrics for recruiters.

9. **Recruiter Dashboard Analytics**:
   - Interactive charts built with Recharts: Score Distribution Pie Chart, Applicants per Job Bar Chart, and KPI metric summary cards.

10. **Responsible AI & Fair Hiring**:
    - Ranking is strictly based on job-relevant qualifications. Personal protected attributes (gender, race, age, religion) are excluded.

---

## 🏗️ Architecture & Stack

### Frontend
- **React 19** + **Vite 6**
- **Tailwind CSS 4** (Modern SaaS Dark/Glassmorphism theme)
- **Lucide React Icons**
- **Recharts** (Interactive data visualization)
- **Axios** (API communication)
- **React Router 7**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Groq SDK** (`llama-3.3-70b-versatile`) with safe JSON parsing & schema validation
- **Multer** (Multi-file upload)
- **Cloudinary** (Resume file storage)
- **pdf-parse** & **mammoth** (Document text extractors)

---

## 📁 Repository Structure

```
smart-resume-screening/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (ScoreBadge, SkillGapCard, BulkUploadModal, Navbar, Sidebar, FairnessNote)
│   │   ├── context/            # AuthContext session provider
│   │   ├── pages/              # Dashboard, JobsList, CreateJob, JobDetails, CandidatesList, CandidateProfile, CompareCandidates, InterviewPrep, AdminPanel
│   │   ├── App.jsx             # React Router definitions & protected routes
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind imports & custom glassmorphism utilities
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── ai/                 # AI service abstractions (Groq integration, job/resume/interview handlers)
│   │   ├── config/             # MongoDB connection & Cloudinary setup
│   │   ├── controllers/        # Auth, Job, Candidate, Screening, Ranking, Interview, Analytics, Admin
│   │   ├── embeddings/         # Cosine Similarity & Vector feature generator
│   │   ├── middlewares/        # Auth JWT, Role RBAC, Multer upload, Centralized Error Handler
│   │   ├── models/             # Mongoose schemas (User, Job, Candidate, Application, Interview)
│   │   ├── parsers/            # PDF & DOCX text extractors
│   │   ├── ranking/            # ATS Multi-Criteria scoring & ranking services
│   │   ├── routes/             # REST API Express routes
│   │   └── server.js           # Server startup script
│   ├── tests/                  # Jest unit/integration test suites
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB server (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 2. Environment Variables Setup
Copy `.env.example` into `.env` at root or inside `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/smart_resume_db
JWT_SECRET=super_secret_jwt_key_smart_resume_2026
GROQ_API_KEY=gsk_your_groq_api_key_here
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef123456
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
From root directory:
```bash
npm run install:all
```

### 4. Running Locally
Start both Server and Client concurrently:

In Terminal 1 (Backend):
```bash
npm run server
```

In Terminal 2 (Frontend):
```bash
npm run client
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Running Unit & Integration Tests

Run backend Jest test suite:
```bash
npm --prefix server test
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register Recruiter/Admin account | Public |
| `POST` | `/api/auth/login` | Login user & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Protected |
| `POST` | `/api/jobs` | Create job position & trigger AI analysis | Recruiter/Admin |
| `GET` | `/api/jobs` | Get all job positions with application stats | Recruiter/Admin |
| `GET` | `/api/jobs/:id` | Get job details & top candidate rankings | Recruiter/Admin |
| `POST` | `/api/candidates/upload` | Upload single/bulk resumes (.pdf, .docx) | Recruiter/Admin |
| `GET` | `/api/candidates` | Get candidate directory with filters | Recruiter/Admin |
| `GET` | `/api/candidates/:id` | Get candidate profile & score breakdown | Recruiter/Admin |
| `POST` | `/api/screening/:jobId/screen-all` | Screen all database candidates against job | Recruiter/Admin |
| `GET` | `/api/ranking/:jobId` | Fetch ranked candidate leaderboard | Recruiter/Admin |
| `POST` | `/api/interview/generate` | Generate AI interview questions & rubrics | Recruiter/Admin |
| `GET` | `/api/analytics/dashboard` | Fetch KPI metrics & graph datasets | Recruiter/Admin |
| `GET` | `/api/admin/users` | Manage user roles & view system stats | Admin Only |

---

## ⚖️ Responsible AI & Fair Hiring Disclosure

The ATS scoring engine computes candidate match relevance strictly using verified technical qualifications, skills, experience, education, and keyword metrics. Personal characteristics (gender, race, age, religion, disability) are completely excluded from calculation algorithms. AI recommendations serve as an intelligent decision assist for human recruiters.
