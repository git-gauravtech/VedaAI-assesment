# VedaAI Assessment Creator

VedaAI is an AI-powered platform for teachers to automatically generate high-quality assessments, quizzes, and lesson plans from uploaded files (PDFs, images, and text) or topics.

## 🚀 Deployed Links
- **Frontend App**: (Add your Vercel URL here once deployed)
- **Backend API**: (Add your Render/Heroku URL here once deployed)

## 🛠 Features
- **AI Assessment Generation**: Uses Google's Gemini Flash to read uploaded files and generate structured questions (MCQ, Short Answer, True/False, Fill in the Blanks, etc.).
- **OCR Support**: Uses Tesseract.js to read text from uploaded images.
- **Customizable Difficulty & Languages**: Generate tests in English, Hindi, Spanish, etc.
- **Export to PDF**: Beautiful, branded PDF generation of the assignments.
- **Modern UI**: Smooth animations, dark-mode styling, and fully responsive mobile layout.

## 💻 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Zustand (State Management), Lucide React (Icons).
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB Atlas.
- **AI Integration**: `@google/genai` (Gemini API).
- **File Handling**: Multer & Tesseract.js.

## 📦 How to Deploy from Desktop to Production

Since your code is currently on your desktop, you first need to push it to a GitHub repository, and then deploy it to free hosting platforms.

### Step 1: Push to GitHub
1. Create a GitHub account (if you don't have one) at github.com.
2. Click **New Repository**. Name it `vedaai-assessment`. Don't add a README or `.gitignore`.
3. Open your terminal (PowerShell) on your desktop in the `vedaai-assessment-creator` folder.
4. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vedaai-assessment.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Render (Free)
1. Go to [Render.com](https://render.com) and log in with GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**: Add your `.env` variables from your `apps/api/.env` file (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `PORT`, `FRONTEND_URL`).
6. Click **Create Web Service**. Wait for it to build and copy the generated URL (e.g., `https://vedaai-api.onrender.com`).

### Step 3: Deploy Frontend to Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `vedaai-assessment` repository.
4. Settings:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
5. **Environment Variables**: Add your environment variable:
   - `NEXT_PUBLIC_API_URL` = (The Render URL from Step 2, e.g., `https://vedaai-api.onrender.com/api`)
6. Click **Deploy**. Vercel will build and host your frontend!

---

### Running Locally (For Testing)

**Backend:**
```bash
cd apps/api
npm install
npm run dev
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
