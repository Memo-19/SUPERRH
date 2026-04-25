from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_connection
import bcrypt

router = APIRouter()

class LoginData(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginData):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, nom, password, role FROM users WHERE email = %s",
        (data.email,)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Email incorrect")

    if not bcrypt.checkpw(data.password.encode(), user[2].encode()):
        raise HTTPException(status_code=401, detail="Password incorrect")

    return {
        "message": "Connexion réussie",
        "user": {
            "id": user[0],
            "nom": user[1],
            "role": user[3]
        }
    }