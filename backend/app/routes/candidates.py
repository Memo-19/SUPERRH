from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.database import get_connection
from app.services.matcher import calculate_match_score
import pdfplumber
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# مسارات مباشرة
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r'C:\poppler-25.12.0\Library\bin'

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""

    # محاولة 1 — pdfplumber
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + " "
                words = page.extract_words()
                if words:
                    text += " ".join([w['text'] for w in words]) + " "
    except Exception as e:
        print(f"pdfplumber error: {e}")

    # محاولة 2 — OCR إلا ما لقاش نص
    if len(text.strip()) < 50:
        print("Trying OCR...")
        try:
            images = convert_from_path(
                pdf_path,
                dpi=200,
                poppler_path=POPPLER_PATH
            )
            for image in images:
                ocr_text = pytesseract.image_to_string(image, lang='fra+eng')
                text += ocr_text + " "
            print(f"OCR extracted: {len(text)} chars")
        except Exception as e:
            print(f"OCR error: {e}")

    return text.strip()

@router.post("/apply")
def apply(
    nom: str = Form(...),
    email: str = Form(...),
    telephone: str = Form(...),
    job_id: int = Form(...),
    cv: UploadFile = File(...)
):
    cv_path = f"{UPLOAD_DIR}/{cv.filename}"
    with open(cv_path, "wb") as buffer:
        shutil.copyfileobj(cv.file, buffer)

    cv_text = extract_text_from_pdf(cv_path)
    print(f"Total text extracted: {len(cv_text)} chars")
    print(f"Preview: {cv_text[:300]}")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT description, competences FROM jobs WHERE id = %s",
        (job_id,)
    )
    job = cur.fetchone()

    if not job:
        raise HTTPException(status_code=404, detail="Poste non trouvé")

    job_text = f"{job[0]} {job[1]}"
    score = calculate_match_score(cv_text, job_text)

    cur.execute(
        "INSERT INTO candidates (nom, email, telephone, cv_path) VALUES (%s, %s, %s, %s) RETURNING id",
        (nom, email, telephone, cv_path)
    )
    candidate_id = cur.fetchone()[0]

    cur.execute(
        "INSERT INTO applications (candidate_id, job_id, match_score, statut) VALUES (%s, %s, %s, %s)",
        (candidate_id, job_id, score, "nouveau")
    )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Candidature soumise avec succès",
        "candidate_id": candidate_id,
        "match_score": score
    }

@router.get("/")
def get_candidates():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT c.id, c.nom, c.email, c.telephone,
               a.job_id, a.match_score, a.statut
        FROM candidates c
        JOIN applications a ON c.id = a.candidate_id
        ORDER BY a.match_score DESC
    """)
    candidates = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": c[0],
            "nom": c[1],
            "email": c[2],
            "telephone": c[3],
            "job_id": c[4],
            "match_score": c[5],
            "statut": c[6]
        }
        for c in candidates
    ]