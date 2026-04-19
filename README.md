# ⚡ InterviewAI: Your Personal Job Prep Copilot

![InterviewAI Dashboard Banner](client/public/hero-illustration.png)

**InterviewAI** is a robust, full-stack SaaS platform specifically designed to automate the entire job interview preparation workflow. Built for the modern job seeker, it leverages the power of generative AI to critically analyze your uploaded resume and generate highly tailored, highly realistic mock-interview questions. 

It provides instant feedback, grades your responses, tracks your historical performance, and runs on a dynamic credit-based system.

---

## 🚀 Key Features

* **Smart Resume Analysis:** Upload your resume (PDF) natively into the platform. A secure parser extracts your real-world text, routing it to the core AI engine to generate unique mock questions specifically targeted exactly to your actual skillset.
* **Custom Question Mixing:** Whether you are prepping for a strictly technical coding screen or a behavioral culture-fit round, our dual-slider architecture lets you control the exact ratio of Technical vs. HR questions.
* **Instant AI Feedback Engine:** After submitting your answer to a prompt, the Gemini processor grades your response out of 10 and provides extensive actionable feedback on your weaknesses.
* **Credit Billing System:** Comes pre-packaged with a functioning SaaS credit ledger. New users securely registering automatically receive a starting grant of `50 Credits` (where 1 Answer = 1 Credit). 
* **Persistent History & Analytics:** A dedicated reporting suite tracks all past interviews natively to Mongoose ledgers so you can watch your scores organically improve over time.
* **Authentication Suite:** Secured via Firebase Authentication, supporting both native Email/Password configurations and single-click seamless Google OAuth workflows.

---

## 🛠️ Technology Stack

### Frontend Architecture
The client connects to a fast, dynamically scaling interface built for modern execution:
- **React.js** (via Vite)
- **Tailwind CSS** (Strict professional B2B design standard, minimal radius UI)
- **Redux Toolkit** (Global state management for Auth, Interview ledgers, and Loaders)
- **Framer Motion** (Fluid page transitions and micro-animations)
- **React Router v6** (Securely protected routing and history)
- **Firebase UI** (Client-side auth persistence)

### Backend Architecture
The core engine executing the artificial intelligence and maintaining user persistence:
- **Node.js & Express.js**
- **MongoDB** via **Mongoose** (User ledgers, Interview sessions, AI feedback logs)
- **Google GenAI Studio (Gemini)** (Providing the heavy lifting behind natural language processing and technical grading schemas)
- **PDF-Parse** (Safely converting Buffer streams of uploaded resumes into plaintext strings)
- **Firebase Admin SDK** (Verifying JWT tokens and protecting native backend access)

---

## 💻 Local Installation & Setup

You can fully boot up and clone this workspace. You will need to spin up both the front-end interface and the back-end processor. 

### 1. Requirements
Ensure you have the following installed locally on your machine:
* [Node.js](https://nodejs.org/) (Standard LTS v18+)
* [MongoDB](https://www.mongodb.com/) (Local server or remote Atlas connection)

### 2. Dependency Installation
Initialize the repositories via standard npm processes. From the root directory:
```bash
npm run install:all
```
*(This triggers a concurrent script that will simultaneously install the root dependencies, `server` dependencies, and `client` dependencies in one sweep.)*

### 3. Environment Variables
You must configure the `.env` security tokens for both environments.

**Create `.env` in `/server`:**
```env
PORT=5050
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/ai-interview
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_JSON=Paste_your_entire_raw_firebase_json_object_here
```

**Create `.env` in `/client`:**
```env
# Intentionally blank. Vite is configured natively to proxy requests on /api directly.
VITE_API_URL=
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 4. Boot the Full Platform
In the root directory, simply run:
```bash
npm run dev
```
Both servers are natively configured via Concurrently to boot sequentially. The interface will be served at `http://localhost:5173` and the backend will attach to `http://localhost:5050`.

---

## 🛡️ License

Built meticulously for the Web Technology execution scope. All rights reserved by the original author.
