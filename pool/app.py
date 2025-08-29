import os
import json
import re
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import pandas as pd

# Google GenAI (Gemini) SDK
from google import genai

# ------------------- CONFIG -------------------
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
    except Exception:
        pass
client = genai.Client()

app = FastAPI(title="PDF -> Gemini -> JSON Extractor")

# ✅ Allow React frontend (vite on 5173) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Fixed path to your test PDF
PDF_PATH = r"E:\ALBERT8050\pool\pool1.pdf"
RESULTS_JSON = os.path.abspath("results.json")

# ------------------- PROMPT -------------------
DEFAULT_PROMPT = """
You are a structured-data extractor. I will give you the full text extracted from a semester-results PDF.

👉 Task:
- Extract data student-wise.
- Each student must be a JSON object.
- Return an array of such student objects.
- Do not add extra commentary, code fences, or prose.

👉 JSON Schema:
[
  {
    "seat_no": "T400070223",
    "name": "ADE ROHIT UTTAM",
    "mother": "REKHA",
    "prn": "72224777L",
    "college": "PVGP[7]",
    "semesters": [
      {
        "semester": 5,
        "subjects": [
          {
            "subject_code": "304181",
            "subject_name": "DIGITAL COMMUNICATION",
            "ise": "015/030",
            "ese": "033/070",
            "total": "048/100",
            "grade": "C",
            "gp": 5,
            "cp": 15
          },
          {
            "subject_code": "304182",
            "subject_name": "ELECTROMAGNETIC FIELD THEORY",
            "ise": "012/030",
            "ese": "011/070",
            "total": "023/100",
            "grade": "F",
            "gp": 0,
            "cp": 0
          }
        ]
      },
      {
        "semester": 6,
        "subjects": []
      }
    ],
    "third_year_sgpa": "8.33",
    "total_credits_earned": 42
  }
]

👉 Notes:
- Always return valid JSON (array).
- Keep numbers like "015/030" as strings.
- If a field is missing, use null.
- If "AC" appears (Audit Course), set grade = "AC".
- Include all semesters, all subjects, all marks.

Now extract from this RAW_TEXT between triple quotes:
\"\"\"{RAW_TEXT}\"\"\"
"""

# ------------------- HELPERS -------------------
def extract_text_from_pdf(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"file not found: {path}")
    pages = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            txt = page.extract_text()
            if txt:
                pages.append(txt)
    return "\n\n".join(pages)

def build_prompt(raw_text: str, template: str) -> str:
    MAX_CHARS = 400_000
    if len(raw_text) > MAX_CHARS:
        raw_text = raw_text[:MAX_CHARS] + "\n\n[TRUNCATED]"
    return template.replace("{RAW_TEXT}", raw_text)

def try_load_json_from_text(text: str) -> Any:
    try:
        return json.loads(text)
    except Exception:
        pass
    m = re.search(r"(\[.*\])", text, re.S)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    m2 = re.search(r"(\{.*\})", text, re.S)
    if m2:
        try:
            return json.loads(m2.group(1))
        except Exception:
            pass
    raise ValueError("Could not parse JSON from model output.")

# ------------------- ENDPOINTS -------------------
@app.get("/extract")
async def extract():
    """Extracts data from fixed PDF path using Gemini."""
    try:
        raw_text = extract_text_from_pdf(PDF_PATH)
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))

    prompt = build_prompt(raw_text, DEFAULT_PROMPT)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        model_text = getattr(response, "text", None) or str(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM call failed: {e}")

    try:
        records = try_load_json_from_text(model_text)
    except Exception as e:
        return {"ok": False, "error": "Failed to parse JSON", "raw": model_text, "parse_error": str(e)}

    # Save JSON + CSV
    with open(RESULTS_JSON, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    try:
        df = pd.json_normalize(records)
        df.to_csv("results.csv", index=False)
    except Exception:
        with open("results_raw_model_output.txt", "w", encoding="utf-8") as f:
            f.write(model_text)

    return {"ok": True, "n_records": len(records)}

@app.get("/students")
async def get_students():
    """Return all extracted students JSON."""
    if not os.path.exists(RESULTS_JSON):
        raise HTTPException(status_code=404, detail="No results.json found. Run /extract first.")
    with open(RESULTS_JSON, "r", encoding="utf-8") as f:
        records = json.load(f)
    return {"records": records}

@app.get("/students/{seat_no}")
async def get_student(seat_no: str):
    """Return a single student's data by seat number."""
    if not os.path.exists(RESULTS_JSON):
        raise HTTPException(status_code=404, detail="No results.json found. Run /extract first.")
    with open(RESULTS_JSON, "r", encoding="utf-8") as f:
        records = json.load(f)
    student = next((s for s in records if s.get("seat_no") == seat_no), None)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with seat_no {seat_no} not found")
    return student
