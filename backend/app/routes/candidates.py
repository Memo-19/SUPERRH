from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.database import get_connection
from app.services.matcher import calculate_match_score
import pdfplumber
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

    cv_text = ""
    with pdfplumber.open(cv_path) as pdf:
        for page in pdf.pages:
            cv_text += page.extract_text() or ""

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