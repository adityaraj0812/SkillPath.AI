# ⚡ SkillPath AI — Gemma 4 Career & Skill-Roadmap Assistant

> **AI Hackathon Edition** | Powered by **Gemma 4** through the Google Gemini API & Firebase.

SkillPath AI is an intelligent, personalized career and skill-roadmap assistant built for developers, students, and career switchers. By analyzing an individual's current skillset, target role, experience level, and daily study capacity, SkillPath AI leverages **Gemma 4** to synthesize dynamic, milestone-driven, structured learning paths tailored to real-world expectations.

---

## 🌟 Key Features

1. **Precision Skill Gap Assessment**: Evaluates current capabilities against industry standards for any target tech role and assigns a 1-100 Foundation Score.
2. **Pace-Calibrated Timelines**: Automatically calculates weekly milestone durations based strictly on available daily study hours (1h–8h/day).
3. **Structured JSON AI Engine**: Uses Gemma 4 to output clean structured JSON directly consumed by an interactive glassmorphic dashboard.
4. **Interactive Learning Roadmap**: Includes step-by-step phases, core topics, checked progress tracking, and curated documentation links.
5. **Resume-Building Projects**: Suggests hands-on real-world projects with tech stacks and estimated build hours.
6. **Actionable 48-Hour Plan**: Provides immediate execution items, daily routine breakdowns, and Gemma 4 strategic pro-tips.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla Modern CSS (Glassmorphic dark design system, gradient accents, responsive typography)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database / Cloud**: Firebase Admin SDK & Firestore integration (with in-memory fallback)
- **AI Core**: `@google/generative-ai` Node SDK (Gemma 4 / Gemini API)

---

## 📁 Project Structure

```
HACTOBERFEST_HACKATHON/
├── client/                      # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FeatureCards.jsx
│   │   │   ├── RoadmapForm.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SkillAssessment.jsx
│   │   │   ├── SkillGaps.jsx
│   │   │   ├── RoadmapTimeline.jsx
│   │   │   ├── RecommendedProjects.jsx
│   │   │   └── NextSteps.jsx
│   │   ├── services/
│   │   │   └── api.js           # Client API service
│   │   ├── App.jsx
│   │   └── index.css            # Custom CSS Tokens & Glassmorphism
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express + Firebase Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js      # Firebase Admin initialization
│   │   ├── services/
│   │   │   └── geminiService.js # Gemma 4 API client & prompt builder
│   │   ├── routes/
│   │   │   └── roadmap.js       # Express routes
│   │   └── server.js            # Express app entrypoint
│   ├── firebase.json            # Firebase hosting/firestore config
│   └── package.json
├── .env.example                 # Environment variables template
├── .env                         # Server environment configuration
├── .gitignore
└── README.md
```

---

## 🤖 How Gemma 4 is Used

Gemma 4 serves as the core intelligence engine of SkillPath AI. Rather than generating simple unformatted text, the backend sends a structured system prompt asking Gemma 4 to analyze:
- Current skill depth vs. target role gap
- Total estimated time commitment mapped to daily study hours
- Phased learning topics and exercises
- Resume-worthy hands-on project specifications

Gemma 4 responds with a strict structured JSON schema, allowing the React frontend to reliably render interactive timelines, gap matrices, and progress trackers.

---

## 🔑 Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your **Gemini API Key**:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemma-2-27b-it
   PORT=5001
   FIREBASE_PROJECT_ID=skillpath-ai-hackathon
   ```

> ⚠️ **Security Warning**: The API key is stored strictly on the Node.js backend server and is never exposed in frontend client code.

---

## 🚀 Running Locally

### 1. Install Dependencies

Install root dependencies for both client and server:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Start the Backend Server

```bash
cd server
npm start
```
The server will start at `http://localhost:5001` (Health check at `http://localhost:5001/api/health`).

### 3. Start the Frontend Client

In a separate terminal window:

```bash
cd client
npm run dev
```
The frontend app will launch at `http://localhost:5173`.

---

## 🏆 MVP Verification Flow

1. Open `http://localhost:5173`.
2. View the Landing Page explaining SkillPath AI.
3. Click **"Create My Roadmap"** (or choose one of the quick demo preset pills).
4. Fill in current skills, target role, experience level, and daily study hours.
5. Click **"Generate Gemma 4 Roadmap"**.
6. View the dynamic loading screen while Gemma 4 evaluates your profile.
7. Explore your custom dashboard with Skill Assessment, Skill Gaps, Roadmap Timeline, Recommended Projects, and 48-Hour Next Steps!
