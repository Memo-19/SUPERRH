from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_connection, release_connection
import bcrypt
import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ─── PARAMÈTRES JWT (SÉCURITÉ) ───────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_pfe_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# ─── MODELS ──────────────────────────────────────────
class LoginData(BaseModel):
    email: str
    password: str

class RegisterData(BaseModel):
    nom: str
    email: str
    password: str

class UpdateUser(BaseModel):
    nom: str
    email: str

class UpdatePassword(BaseModel):
    current_password: str
    new_password: str

class AISettings(BaseModel):
    blind_hiring: bool = False
    ai_threshold: float = 75.0

# ─── REGISTER (Création de compte) ───────────────────
@router.post("/register")
def register(data: RegisterData):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Vérifier si l'email existe déjà
        cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

        # Hacher le mot de passe avec bcrypt
        hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

        # Insérer le nouvel utilisateur
        cur.execute(
            "INSERT INTO users (nom, email, password) VALUES (%s, %s, %s)",
            (data.nom, data.email, hashed_password)
        )
        conn.commit()
        cur.close()
        return {"message": "Compte créé avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── LOGIN & JWT GENERATION ──────────────────────────
@router.post("/login")
def login(data: LoginData):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, nom, email, password FROM users WHERE email = %s",
            (data.email,)
        )
        user = cur.fetchone()
        cur.close()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email ou mot de passe incorrect"
            )

        # Vérifier le mot de passe avec bcrypt
        stored_hash = user[3]
        if not bcrypt.checkpw(data.password.encode(), stored_hash.encode()):
            raise HTTPException(
                status_code=401,
                detail="Email ou mot de passe incorrect"
            )

        # Création du Token JWT
        payload = {
            "sub": str(user[0]),
            "email": user[2],
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {
            "message": "Connexion réussie",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user[0],
                "nom": user[1],
                "email": user[2]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── UPDATE PROFILE ───────────────────────────────────
@router.put("/users/{user_id}")
def update_user(user_id: int, data: UpdateUser):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET nom = %s, email = %s WHERE id = %s",
            (data.nom, data.email, user_id)
        )
        conn.commit()
        cur.close()
        return {"message": "Profil mis à jour avec succès"}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── UPDATE PASSWORD ──────────────────────────────────
@router.put("/users/{user_id}/password")
def update_password(user_id: int, data: UpdatePassword):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT password FROM users WHERE id = %s", (user_id,))
        result = cur.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        if not bcrypt.checkpw(data.current_password.encode(), result[0].encode()):
            raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")

        new_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()

        cur.execute("UPDATE users SET password = %s WHERE id = %s", (new_hash, user_id))
        conn.commit()
        cur.close()
        return {"message": "Mot de passe modifié avec succès"}

    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── AI SETTINGS ─────────────────────────────────────
@router.post("/settings/ai")
def save_ai_settings(data: AISettings):
    return {
        "message": "Paramètres IA sauvegardés",
        "blind_hiring": data.blind_hiring,
        "ai_threshold": data.ai_threshold
    }