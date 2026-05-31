from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.database import get_connection, release_connection
from app.services.matcher import analyze_cv_with_ai
import os
import uuid
import json
import pdfplumber
import math
from dotenv import load_dotenv

# --- IMPORTATIONS POUR L'EMAIL ---
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Chargement des variables d'environnement (.env)
load_dotenv()

# --- CONFIGURATION OCR (Optionnel : pour lire les CV en image) ---
try:
    import pytesseract
    from pdf2image import convert_from_path
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    POPPLER_PATH = r'C:\poppler-25.12.0\Library\bin'
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

router = APIRouter()

# --- CONFIGURATION DES FICHIERS ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # Limite de 5 Mo

# ==========================================
# 🛠️ FONCTIONS UTILITAIRES
# ==========================================

def safe_float(val) -> float:
    """Protège le serveur contre les erreurs de conversion de nombres (ex: NaN)."""
    try:
        if val is None or val == "":
            return 0.0
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return 0.0
        return round(f, 2)
    except Exception:
        return 0.0

def extract_text_from_file(file_path: str) -> str:
    """Extrait le texte du CV (PDF) pour l'envoyer à l'IA."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        if len(text.strip()) < 50 and OCR_AVAILABLE:
            images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
            for image in images:
                ocr_text = pytesseract.image_to_string(image, lang='fra+eng')
                text += ocr_text + "\n"
    except Exception as e:
        print(f"Erreur d'extraction du texte: {e}")
    return text.strip()

def envoyer_email_candidat(email_dest: str, nom: str, statut: str, job_titre: str, missing_skills: list):
    """Génère et envoie un email personnalisé au candidat en utilisant les données du fichier .env."""
    subject = f"Suite à votre candidature pour le poste : {job_titre}"
    
    if statut == 'accepté':
        body = f"""Bonjour {nom},

Nous avons le plaisir de vous informer que votre candidature pour le poste de {job_titre} a retenu notre attention.
Votre profil et vos compétences correspondent parfaitement à nos attentes.

Notre équipe RH vous contactera très prochainement pour planifier un entretien.

Cordialement,
L'équipe Recrutement
"""
    else:
        raisons = ", ".join(missing_skills) if missing_skills else "certaines compétences techniques spécifiques requises"
        body = f"""Bonjour {nom},

Nous vous remercions pour l'intérêt que vous portez à notre entreprise pour le poste de {job_titre}.

Après une étude attentive de votre profil par notre système d'analyse IA et notre équipe RH, nous avons décidé de ne pas retenir votre candidature pour le moment. Actuellement, nous recherchons un profil ayant plus d'expertise sur les points suivants : 
👉 {raisons}.

Nous conserverons votre CV dans notre base de données et n'hésiterons pas à vous recontacter si une opportunité correspondant mieux à votre profil se présente. Nous vous souhaitons une excellente continuation.

Cordialement,
L'équipe Recrutement
"""

    print("\n" + "="*50)
    print(f"📧 TENTATIVE D'ENVOI D'EMAIL À : {email_dest}")
    print(f"SUJET : {subject}")
    print("="*50)

    # Récupération sécurisée des identifiants depuis le fichier .env
    SENDER_EMAIL = os.getenv("EMAIL_USER")
    SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("⚠️ AVERTISSEMENT : Les identifiants email (EMAIL_USER / EMAIL_PASSWORD) sont introuvables dans le fichier .env.")
        return body

    try:
        # Envoi réel de l'email via le serveur SMTP de Gmail
        msg = MIMEMultipart()
        msg['From'] = f"SUPERRH <{SENDER_EMAIL}>"
        msg['To'] = email_dest
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ EMAIL ENVOYÉ AVEC SUCCÈS À {email_dest}")
    except Exception as e:
        print(f"❌ ERREUR LORS DE L'ENVOI DE L'EMAIL: {e}")
        
    return body

# ==========================================
# 🚀 ROUTES API (ENDPOINTS)
# ==========================================

@router.post("/candidates/apply")
async def apply(
    nom: str = Form(...),
    email: str = Form(...),
    telephone: str = Form(...),
    job_id: int = Form(...),
    cv: UploadFile = File(...)
):
    """Reçoit le CV, l'analyse avec l'IA et le sauvegarde dans la base de données."""
    if cv.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé.")

    content = await cv.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Fichier trop volumineux (Max 5Mo).")

    safe_filename = f"{uuid.uuid4()}.pdf"
    save_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(save_path, "wb") as f:
        f.write(content)

    cv_text = extract_text_from_file(save_path)
    if not cv_text:
        cv_text = f"CV de {nom}"

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT titre, description, competences FROM jobs WHERE id = %s", (job_id,))
        job = cur.fetchone()
        if not job:
            raise HTTPException(status_code=404, detail="Offre d'emploi introuvable")

        job_description = f"{job[0]} {job[1] or ''} {job[2]}"

        ai_result = analyze_cv_with_ai(cv_text, job_description)
        final_score = safe_float(ai_result.get("score", 0.0))

        cur.execute(
            """INSERT INTO candidates (nom, email, telephone, cv_path, match_score, statut, job_id)
               VALUES (%s, %s, %s, %s, %s, 'nouveau', %s) RETURNING id""",
            (nom, email, telephone, save_path, final_score, job_id)
        )
        candidate_id = cur.fetchone()[0]

        cur.execute(
            """INSERT INTO applications (candidate_id, job_id, statut, ai_analysis)
               VALUES (%s, %s, 'nouveau', %s)""",
            (candidate_id, job_id, json.dumps(ai_result))
        )

        conn.commit()
        cur.close()
        return {"message": "Candidature soumise avec succès", "candidate_id": candidate_id, "match_score": final_score}

    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

@router.get("/candidates/")
def get_candidates():
    """Récupère la liste de tous les candidats pour le tableau de bord."""
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, nom, email, telephone, cv_path, match_score, statut, job_id 
            FROM candidates ORDER BY id DESC
        """)
        rows = cur.fetchall()
        cur.close()
        
        results = []
        for r in rows:
            results.append({
                "id": r[0], "nom": r[1] or "", "email": r[2] or "",
                "telephone": r[3] or "", "cv_path": r[4] or "",
                "match_score": safe_float(r[5]), "statut": r[6] or "nouveau",
                "job_id": r[7] if len(r) > 7 else 0
            })
        return results
    except Exception as e:
        print(f"🚨 ERREUR SQL : {e}")
        return [] 
    finally:
        release_connection(conn)

@router.get("/candidates/cv/{candidate_id}")
def get_cv(candidate_id: int):
    """Permet d'afficher le PDF directement dans le navigateur (inline)."""
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT cv_path, nom FROM candidates WHERE id = %s", (candidate_id,))
        result = cur.fetchone()
        cur.close()

        if not result or not result[0] or not os.path.exists(result[0]):
            raise HTTPException(status_code=404, detail="CV non trouvé")

        return FileResponse(
            result[0], 
            media_type="application/pdf", 
            headers={"Content-Disposition": f'inline; filename="CV_{result[1]}.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

@router.get("/candidates/{candidate_id}")
def get_candidate_details(candidate_id: int):
    """Récupère toutes les informations d'un candidat spécifique."""
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT c.id, c.nom, c.email, c.telephone, c.match_score, c.statut,
                   j.titre, a.ai_analysis
            FROM candidates c
            LEFT JOIN jobs j ON c.job_id = j.id
            LEFT JOIN applications a ON c.id = a.candidate_id
            WHERE c.id = %s
        """, (candidate_id,))
        r = cur.fetchone()
        cur.close()

        if not r:
            raise HTTPException(status_code=404, detail="Candidat introuvable")

        ai_data = {}
        if r[7]:
            try:
                ai_data = json.loads(r[7]) if isinstance(r[7], str) else r[7]
            except:
                pass

        return {
            "id": str(r[0]), "nom": r[1] or "Inconnu", "email": r[2] or "",
            "telephone": r[3] or "", "match_score": safe_float(r[4]),
            "status": r[5] or "nouveau", "job_titre": r[6] or "Candidature Spontanée",
            "ai_analysis": ai_data,
            "cv_url": f"http://127.0.0.1:8000/candidates/cv/{r[0]}" 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

class StatusUpdate(BaseModel):
    statut: str

@router.put("/candidates/{candidate_id}/status")
def update_status(candidate_id: int, data: StatusUpdate):
    """Met à jour le statut du candidat et déclenche l'envoi de l'email via SMTP."""
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT c.nom, c.email, j.titre, a.ai_analysis
            FROM candidates c
            LEFT JOIN jobs j ON c.job_id = j.id
            LEFT JOIN applications a ON c.id = a.candidate_id
            WHERE c.id = %s
        """, (candidate_id,))
        candidat = cur.fetchone()
        
        if not candidat:
            raise HTTPException(status_code=404, detail="Candidat introuvable")
            
        nom, email, job_titre, ai_analysis_raw = candidat
        
        missing_skills = []
        if ai_analysis_raw:
            try:
                ai_data = json.loads(ai_analysis_raw) if isinstance(ai_analysis_raw, str) else ai_analysis_raw
                missing_skills = ai_data.get("missing_skills") or ai_data.get("weaknesses") or ai_data.get("missing") or []
            except:
                pass
        
        cur.execute("UPDATE candidates SET statut = %s WHERE id = %s", (data.statut, candidate_id))
        cur.execute("UPDATE applications SET statut = %s WHERE candidate_id = %s", (data.statut, candidate_id))
        conn.commit()
        
        # Lancement de l'envoi d'email
        envoyer_email_candidat(email, nom, data.statut, job_titre or "Poste", missing_skills)
        
        cur.close()
        return {"message": f"Statut mis à jour et email envoyé à {nom}"}
    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)