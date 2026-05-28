# VedaAI Assessment Creator 🚀

VedaAI is an enterprise-grade, full-stack AI assessment generation system. It enables educators to automatically create high-quality, customized question papers, quizzes, and structured examinations from uploaded study materials (PDFs, images) or raw topics in seconds. 

By leveraging cutting-edge LLM fallback protocols, real-time WebSocket streams, background message queues, and a self-healing custom DSL parser, VedaAI provides an incredibly fast, premium, and zero-compromise exam creation experience.

---

## 🔗 Production Deployed Links
- **Frontend Application (Vercel)**: [https://vedaai-assessment-creator-web.vercel.app](https://vedaai-assessment-creator-web.vercel.app) *(Deploy URL placeholder)*
- **Backend API Server (Render)**: [https://vedaai-api.onrender.com](https://vedaai-api.onrender.com) *(Deploy URL placeholder)*

---

## ✨ Key Premium Features

*   **⚡ Async Worker Architecture**: Processes large documents and coordinates AI generation using a background message queue (BullMQ + Redis) to completely avoid HTTP request timeouts.
*   **📡 Real-Time Progress Stream**: Connects to the backend worker via Socket.io to show fine-grained status logs ("Reading PDF", "Invoking Gemini", "Compiling Diagrams", "Saving Paper") as they happen.
*   **📊 MCQ Option Grids**: Automatically parses MCQs and renders them in beautiful, responsive 2x2 interactive option grids.
*   **🛡️ Auto-Healing Diagrams**: Mandates and parses structural Mermaid.js flowcharts. If the LLM generates a broken syntax label containing parentheses—like `D[Voting Classifier (Soft Voting)]`—our client-side regex engine sanitizes it into standard `D["Voting Classifier (Soft Voting)"]` format on-the-fly.
*   **💔 Premium Diagram Fallback UI**: If a diagram suffers from severe structural errors, the UI shows a modern, soft-crimson fallback block with an active **"Show Diagram Details"** toggle that opens a styled code block containing the raw chart text.
*   **🧠 Dual-LLM Resilient Failover**: If the primary AI engine (Google Gemini 2.5 Flash) experiences high demand or returns a 503 error, the system automatically routes the generation task to our Groq (LLaMA-3.1-8B-Instant) pipeline.
*   **💾 Self-Healing DSL Engine**: Requests papers using a compact Domain Specific Language (DSL) that is 3x faster than heavy JSON. If the syntax contains errors, an automated repair parser corrects the layout before compiling.
*   **📁 OCR & Document Scrapers**: Extracts data from standard PDFs (`pdf-parse`) and processes text in images (PNG/JPG) using an optimized Tesseract.js OCR routine.
*   **📄 Branded PDF Exporter**: Lets teachers export finished papers instantly into clean, high-fidelity printable PDFs.

---

## 💻 Tech Stack

### Frontend Monorepo (`/apps/web`)
- **Core Framework**: Next.js 16 (App Router) & React 19
- **Styling & Theme**: Tailwind CSS 4 (Curated sleek dark/light color palettes)
- **State Store**: Zustand (stateless authentication and session tracking)
- **Visual Engine**: Mermaid.js v10 (flowchart compiler)
- **Real-Time Client**: Socket.io-client

### Backend Monorepo (`/apps/api`)
- **Runtime Environment**: Node.js & Express (written in pure TypeScript)
- **Background Broker**: Redis & BullMQ
- **Database Engine**: MongoDB (Mongoose schemas)
- **AI Integrations**: Google Generative AI SDK, Groq SDK
- **File & OCR Scrapers**: `pdf-parse`, `tesseract.js`, `multer`

---

## 📂 Project Structure

```text
vedaai-assessment-creator/
├── apps/
│   ├── web/                     # Next.js App Router Frontend
│   │   ├── src/
│   │   │   ├── app/             # Application Pages (Login, Create, Result)
│   │   │   ├── components/      # Shared components (Mermaid, Form inputs)
│   │   │   └── hooks/           # Websocket, auth, custom react hooks
│   │   └── package.json
│   │
│   └── api/                     # Node.js/TypeScript Express Backend
│       ├── src/
│       │   ├── models/          # Mongoose DB Schemas (Assignment, Paper)
│       │   ├── services/        # Business Logic (AI Generator, DSL Parser)
│       │   ├── workers/         # BullMQ Workers (fileWorker, generationWorker)
│       │   └── server.ts        # Express App & WebSocket Setup
│       └── package.json
│
├── package.json                 # Monorepo Workspace Configuration
└── README.md
```

---

## 🛠 Local Development Setup

To run VedaAI on your local machine, ensure you have **Node.js (v18+)** and **Redis Server** installed.

### 1. Clone & Set Up Workspaces
From the root of the project, install all workspace dependencies:
```bash
npm install
```

### 2. Configure Environment Variables

Create an `.env` file inside `/apps/api/.env`:
```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/vedaai
JWT_SECRET=your_super_secret_jwt_key
REDIS_URL=redis://127.0.0.1:6379
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
```

Create an `.env.local` file inside `/apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Spin Up Local Services
1. Ensure your local **Redis** instance is running:
   ```bash
   # Windows (via WSL or installed service)
   redis-server
   ```
2. Start the Backend API (and background workers) in watch mode:
   ```bash
   cd apps/api
   npm run dev
   ```
3. Start the Next.js Dev Server in another terminal:
   ```bash
   cd apps/web
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 🚀 Production Deployment Blueprint

Here is the exact setup recipe for deploying the desktop project to free cloud tiers.

### Step 1: Initialize Git and Push to GitHub
1. Create a blank repository on GitHub named `vedaai-assessment`. Do NOT initialize with a README or gitignore.
2. In your local terminal, run the following to commit and push:
   ```bash
   git init
   git add .
   git commit -m "feat: implement resilient AI pipeline with custom DSL and worker queues"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/vedaai-assessment.git
   git push -u origin main
   ```

### Step 2: Deploy Redis & Database
1. **Database**: Spin up a free shared cluster on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and copy the connection string.
2. **Redis Broker**: Spin up a free Redis database instance on [Upstash Redis](https://upstash.com) or [Render Redis](https://render.com). Copy the `rediss://...` connection URL.

### Step 3: Deploy Backend to Render (Free)
1. Sign in to [Render.com](https://render.com) using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. Input the following configurations:
   *   **Name**: `vedaai-api`
   *   **Root Directory**: `apps/api`
   *   **Build Command**: `npm install && npm run build`
   *   **Start Command**: `npm start`
5. **Environment Variables**: Add all keys from your local `apps/api/.env` file. Be sure to link the production Redis URL (`REDIS_URL`) and MongoDB URI (`MONGO_URI`).
6. Click **Create Web Service**. Once built, copy the server URL (e.g., `https://vedaai-api.onrender.com`).

### Step 4: Deploy Frontend to Vercel (Free)
1. Sign in to [Vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import your `vedaai-assessment` repository.
4. Input the following configurations:
   *   **Root Directory**: `apps/web`
   *   **Framework Preset**: Next.js
5. **Environment Variables**: Add a single variable:
   *   `NEXT_PUBLIC_API_URL` = `https://vedaai-api.onrender.com/api` (Use the Render URL copied in Step 3)
6. Click **Deploy**. Vercel will compile and launch the production application!
