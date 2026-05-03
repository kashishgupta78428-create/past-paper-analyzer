# 📚 PaperLens — AI-Powered Past Paper Analyzer

> Built for the **AI DecodeX Hackathon** by UnsaidTalks Education

An AI-powered system that analyzes past question papers against a syllabus to identify topic frequency, rank high-yield topics, detect coverage gaps, and auto-generate a smart study plan.

---


demo video
https://drive.google.com/file/d/1-tu4dBFprsEVbCJDtFNY6zJTFB6V4s8n/view?usp=drive_link


---

## 🚀 Live App

> **[https://your-app.vercel.app](https://vercel.com/kashishgupta78428-creates-projects)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 Multi-paper Upload | Upload multiple past papers (PDF) + syllabus |
| 🤖 Claude AI Analysis | Deep pattern recognition via Anthropic Claude |
| 📊 Topic Frequency Map | Bar chart of most-tested topics |
| 🏆 High-Yield Ranking | Score-ranked topics with reasoning |
| ⚠️ Coverage Gap Detection | Syllabus topics missing from papers |
| 📅 Smart Study Planner | Week-by-week prioritized schedule |
| 🎯 Difficulty Distribution | Easy / Medium / Hard breakdown |
| 📝 Practice Questions | AI-generated questions per topic |
| 💡 Exam Strategy Tips | Personalized exam advice |

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Recharts (data visualization)
- Custom CSS (no Tailwind dependency)

**Backend**
- Python + FastAPI
- PyMuPDF (PDF text extraction)
- Anthropic Claude API (claude-sonnet-4-20250514)

**Hosting**
- Frontend → Vercel
- Backend → Render

---

## ⚙️ Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/past-paper-analyzer.git
cd past-paper-analyzer
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt

# Set your Anthropic API key
export ANTHROPIC_API_KEY=your_key_here   # Mac/Linux
set ANTHROPIC_API_KEY=your_key_here      # Windows

uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

### 3. Frontend setup
```bash
cd frontend
npm install

# Optional: set backend URL
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env

npm start
# Frontend runs at http://localhost:3000
```

---

## 🌐 Deployment

### Backend → Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set root to `backend/`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add environment variable: `ANTHROPIC_API_KEY`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo, set root to `frontend/`
3. Add environment variable: `REACT_APP_BACKEND_URL=https://your-render-url.onrender.com`
4. Deploy!

---

## 📁 Project Structure

```
past-paper-analyzer/
├── backend/
│   ├── main.py          # FastAPI app + /analyze endpoint
│   ├── pdf_parser.py    # PDF text extraction (PyMuPDF)
│   ├── analyzer.py      # Claude AI integration
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx              # Root component
│   │   ├── index.js
│   │   └── components/
│   │       ├── Upload.jsx       # File upload UI
│   │       └── Dashboard.jsx    # Results + charts
│   └── package.json
└── README.md
```

---

## 🏗️ How It Works

1. User uploads 1–N past papers (PDF) + official syllabus (PDF)
2. Backend extracts text from all PDFs using PyMuPDF
3. All text is sent to Claude Sonnet via Anthropic API with a structured prompt
4. Claude returns a detailed JSON analysis
5. Frontend renders charts, rankings, planner, and practice questions

---

## 👨‍💻 Built By

-kashish gupta-https://github.com/kashishgupta78428-create/past-paper-analyzer/edit/main/README.md#:~:text=kashishgupta78428%2Dcreate-,past%2Dpaper%2Danalyzer,-Type


