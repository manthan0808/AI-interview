# ⚡ InterviewAI: Your Personal Job Prep Copilot

![InterviewAI Dashboard Banner](client/public/hero-illustration.png)

**InterviewAI** is a robust, full-stack SaaS platform specifically designed to automate the entire job interview preparation workflow. Built for the modern job seeker, it leverages the power of Gemini AI to critically analyze your resume and generate highly tailored, professional mock-interviews.

---

## 🚀 Premium Features

### 🎙️ Voice-Activated Answering (STT)
Integrated with the **Web Speech API**, users can dictate their answers verbally. The system converts speech to text in real-time, simulating the natural flow of a real interview and reducing typing friction.

### ⏱️ Timed Stress-Test Mode
Simulate the pressure of a real technical screen. When enabled, users have exactly **120 seconds** to formulate and submit their answer before the system auto-submits it for AI grading.

### 📊 Skills Radar Breakdown
Utilizing **Recharts**, the platform generates a 5-point Radar Chart after every session. It visualizes your competency in:
- **Technical Accuracy**
- **Communication Quality**
- **STAR Method Context**
- **Logic & Problem Solving**
- **Candidate Confidence**

### 🎭 Specialized Interviewer Personas
Choose the "vibe" of your session:
- **Friendly HR Manager**: Focuses on "culture fit" and encouraging behavioral feedback.
- **Strict FAANG Engineer**: Deep technical rigor focusing on complexity, edge cases, and performance.

### ⭐ STAR Method Evaluation
HR and behavioral questions are graded explicitly on the **Situation-Task-Action-Result** framework. The AI provides detailed critique if any part of the STAR context is missing.

### 🔄 Lifecycle & Resume Logic
- **Navigation Guard**: In-game security prevents you from accidentally leaving an interview by locking navigation links.
- **Safe Exit & Resume**: Leave an interview safely and pick up exactly where you left off via the **History Page**.
- **Filtered Reports**: Incomplete sessions generate "Clean Reports" that only show the questions you actually answered.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **React.js** (Vite Engine)
- **Tailwind CSS** (Strict professional B2B design standard, minimal radius UI)
- **Redux Toolkit** (Global state for Auth, Credits, and Interview logic)
- **Recharts** (Performance Radar visualization)
- **Framer Motion** (Fluid page transitions and micro-animations)

### Backend Architecture
- **Node.js & Express.js**
- **MongoDB** (User ledgers, Interview sessions, AI feedback logs)
- **Google GenAI Studio (Gemini)** (Technical grading and question generation)
- **PDF-Parse** (Resume extraction)
- **Firebase Admin SDK** (Token verification and security)

---

## 💻 Local Installation & Setup

### 1. Dependency Installation
Initialize the repositories from the root directory:
```bash
npm run install:all
```

### 2. Environment Variables
**Server (`/server/.env`):**
```env
PORT=5050
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
FIREBASE_SERVICE_ACCOUNT_JSON=your_firebase_key_json
```

**Client (`/client/.env`):**
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Boot the Platform
```bash
# Serves frontend at :5173 and backend at :5050
npm run dev
```

---

## 🛡️ License
Built meticulously for Web Technology scope. Professional SaaS architecture. All rights reserved.
