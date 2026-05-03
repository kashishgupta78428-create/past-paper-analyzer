from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pdf_parser import extract_text_from_pdf
from analyzer import analyze_papers

app = FastAPI(title="Past Paper Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Past Paper Analyzer API is running!"}

@app.post("/analyze")
async def analyze(
    papers: List[UploadFile] = File(...),
    syllabus: UploadFile = File(...)
):
    """
    Upload multiple past papers (PDF) and a syllabus (PDF).
    Returns AI-powered analysis with topic frequency, study plan, etc.
    """
    papers_text = []
    for paper in papers:
        content = await paper.read()
        text = extract_text_from_pdf(content)
        papers_text.append(text)

    syllabus_bytes = await syllabus.read()
    syllabus_text = extract_text_from_pdf(syllabus_bytes)

    result = analyze_papers(papers_text, syllabus_text)
    return result
