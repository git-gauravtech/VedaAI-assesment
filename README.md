# VedaAI Assessment Creator 🚀

VedaAI is an enterprise-grade, full-stack AI assessment generation system. It enables educators to automatically create high-quality, customized question papers, quizzes, and structured examinations from uploaded study materials (PDFs, images) or raw topics in seconds. 

By leveraging cutting-edge LLM fallback protocols, real-time WebSocket streams, background message queues, and a self-healing custom DSL parser, VedaAI provides an incredibly fast, premium, and zero-compromise exam creation experience.

---

## 🔗 Production Deployed Links
- **Frontend Application (Vercel)**: [https://veda-ai-assesment-web.vercel.app]
- **Backend API Server (Render)**: [https://vedaai-backend-mvvp.onrender.com]

---

---

## 🛠 Architecture plan

for architecture and flowdiagram of project just refer to the [Architecture Document](./architecture.md).

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
