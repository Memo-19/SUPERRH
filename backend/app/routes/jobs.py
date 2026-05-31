from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import get_connection, release_connection

router = APIRouter()

class JobCreate(BaseModel):
    titre: str
    description: Optional[str] = ""
    competences: str
    statut: Optional[str] = "active"

# ─── GET ALL JOBS ─────────────────────────────────────
@router.get("/jobs/")
def get_jobs():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, titre, description, competences, statut FROM jobs ORDER BY id DESC"
        )
        rows = cur.fetchall()
        cur.close()
        return [
            {
                "id": r[0],
                "titre": r[1],
                "description": r[2] or "",
                "competences": r[3],
                "statut": r[4]
            }
            for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── GET ONE JOB ──────────────────────────────────────
@router.get("/jobs/{job_id}")
def get_job(job_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, titre, description, competences, statut FROM jobs WHERE id = %s",
            (job_id,)
        )
        row = cur.fetchone()
        cur.close()
        if not row:
            raise HTTPException(status_code=404, detail="Offre non trouvée")
        return {
            "id": row[0],
            "titre": row[1],
            "description": row[2] or "",
            "competences": row[3],
            "statut": row[4]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── CREATE JOB ───────────────────────────────────────
@router.post("/jobs/")
def create_job(job: JobCreate):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO jobs (titre, description, competences, statut)
               VALUES (%s, %s, %s, %s) RETURNING id""",
            (job.titre, job.description, job.competences, job.statut)
        )
        job_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        return {"message": "Offre créée", "job_id": job_id}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── UPDATE JOB ───────────────────────────────────────
@router.put("/jobs/{job_id}")
def update_job(job_id: int, job: JobCreate):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """UPDATE jobs
               SET titre = %s, description = %s,
                   competences = %s, statut = %s
               WHERE id = %s""",
            (job.titre, job.description, job.competences, job.statut, job_id)
        )
        conn.commit()
        cur.close()
        return {"message": "Offre mise à jour"}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── DELETE JOB ───────────────────────────────────────
@router.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        # Supprimer les candidats liés d'abord
        cur.execute(
            "DELETE FROM applications WHERE job_id = %s",
            (job_id,)
        )
        cur.execute(
            "DELETE FROM candidates WHERE job_id = %s",
            (job_id,)
        )
        cur.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
        conn.commit()
        cur.close()
        return {"message": "Offre supprimée"}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)