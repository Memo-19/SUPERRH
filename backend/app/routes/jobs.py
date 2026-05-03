from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_connection

router = APIRouter()

class JobData(BaseModel):
    titre: str
    description: str
    competences: str

class JobUpdate(BaseModel):
    titre: str
    description: str
    competences: str

@router.get("/")
def get_jobs():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, titre, description, competences, statut FROM jobs")
    jobs = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": j[0],
            "titre": j[1],
            "description": j[2],
            "competences": j[3],
            "statut": j[4]
        }
        for j in jobs
    ]

@router.post("/")
def create_job(data: JobData):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO jobs (titre, description, competences) VALUES (%s, %s, %s) RETURNING id",
        (data.titre, data.description, data.competences)
    )
    job_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Poste créé avec succès", "job_id": job_id}

@router.put("/{job_id}")
def update_job(job_id: int, data: JobUpdate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE jobs SET titre = %s, description = %s, competences = %s WHERE id = %s",
        (data.titre, data.description, data.competences, job_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Poste mis à jour"}

@router.delete("/{job_id}")
def delete_job(job_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM applications WHERE job_id = %s", (job_id,))
    cur.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Poste supprimé"}