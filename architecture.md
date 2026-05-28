# VedaAI Architecture & Approach

This document outlines the high-level architecture and technical approach used in the VedaAI Assessment Creator platform.

## 🏗 System Architecture

The platform follows a modern, decoupled Client-Server architecture:
1. **Client (Frontend)**: A Next.js (App Router) application responsible for the user interface, routing, and state management.
2. **Server (Backend)**: A Node.js/Express REST API responsible for business logic, authentication, AI orchestration, and file processing.
3. **Database**: MongoDB for persistent data storage.

### Architecture Flow

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef ai fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef db fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    classDef user fill:#64748b,stroke:#334155,stroke-width:2px,color:#fff

    User((Teacher)):::user
    
    subgraph Frontend [Next.js Web Application]
        UI[User Interface & Forms]:::frontend
        Store[Zustand State Store]:::frontend
        PDFGen[Client-side PDF Generator]:::frontend
    end
    
    subgraph Backend [Node.js / Express API]
        Auth[JWT Authentication]:::backend
        Upload[Multer File Uploads & OCR]:::backend
        Controller[Assignment Controller]:::backend
    end
    
    subgraph External Services
        Gemini[Google Gemini Flash API]:::ai
        MongoDB[(MongoDB Atlas)]:::db
    end

    User -->|Interacts| UI
    UI <-->|Manages State| Store
    UI -->|HTTP POST Form Data| Auth
    
    Auth -->|Token Valid| Upload
    Upload -->|Extracts Text from PDF/Img| Controller
    
    Controller -->|Sends Prompt & Text| Gemini
    Gemini -->|Returns Structured JSON| Controller
    
    Controller -->|Saves Generated Quiz| MongoDB
    MongoDB -->|Returns Saved Document| Controller
    
    Controller -->|HTTP 200 JSON| UI
    UI -->|Triggers Download| PDFGen
    PDFGen -->|Creates PDF| User
```

## 🛠 Approach & Technologies Used

### 1. Frontend Approach
- **Framework**: Next.js App Router for optimized routing and SEO.
- **Styling**: Tailwind CSS for rapid, responsive UI development. Custom gradients and micro-animations provide a premium feel.
- **State Management**: Zustand for lightweight, un-opinionated global state (used heavily for Authentication state across the app).
- **Icons & Graphics**: SVGs and Lucide-React icons for crisp, scalable vectors.

### 2. Backend Approach
- **Runtime & Framework**: Node.js with Express.
- **Language**: TypeScript for strict typing and fewer runtime errors.
- **Security**: JWT (JSON Web Tokens) for stateless authentication. Passwords are encrypted using bcrypt.

### 3. File Processing & AI Pipeline
- **File Uploads**: Handled via `multer`. We process the file into a buffer without persisting heavily on the disk.
- **Optical Character Recognition (OCR)**: For images (PNG/JPG), the backend uses `tesseract.js` to extract text.
- **PDF Extraction**: `pdf-parse` is used to scrape text content from uploaded PDFs.
- **Generative AI**: The extracted text is bundled into an engineered prompt and sent to **Google's Gemini API**. The prompt strictly instructs Gemini to return a raw JSON structure matching our database schema.

### 4. Database Schema
- **MongoDB** is used via Mongoose. The schema is highly flexible, storing an array of mixed question types (`MCQ`, `Short Answer`, `Fill in the Blanks`, `True/False`) directly inside the `Assignment` document.

## 🚀 Why this Approach?
- **Speed & Scale**: The decoupling of frontend and backend allows them to scale independently on platforms like Vercel and Render.
- **Cost Efficiency**: Using free-tier compatible tools (Vercel, Render, MongoDB Atlas, Gemini Free Tier) keeps the project easily maintainable for individuals and small teams.
- **Reliable AI Parsing**: By explicitly asking Gemini for JSON instead of plain text, the frontend can seamlessly map the data to beautiful UI components (like multiple-choice radio buttons) rather than rendering a block of text.
