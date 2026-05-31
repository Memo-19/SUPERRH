from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_connection, release_connection

router = APIRouter()

class StatutUpdate(BaseModel):
    statut: str

VALID_STATUTS = ["nouveau", "accepté", "refusé", "en_revue"]

# ─── UPDATE STATUT ────────────────────────────────────
@router.put("/applications/{candidate_id}/statut")
def update_statut(candidate_id: int, data: StatutUpdate):
    if data.statut not in VALID_STATUTS:
        raise HTTPException(
            status_code=400,
            detail=f"Statut invalide. Options: {VALID_STATUTS}"
        )
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE candidates SET statut = %s WHERE id = %s",
            (data.statut, candidate_id)
        )
        cur.execute(
            "UPDATE applications SET statut = %s WHERE candidate_id = %s",
            (data.statut, candidate_id)
        )
        conn.commit()
        cur.close()
        return {"message": f"Statut mis à jour: {data.statut}"}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)

# ─── DELETE CANDIDATE ─────────────────────────────────
@router.delete("/applications/{candidate_id}")
def delete_candidate(candidate_id: int):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Récupérer le chemin du CV
        cur.execute(
            "SELECT cv_path FROM candidates WHERE id = %s",
            (candidate_id,)
        )
        result = cur.fetchone()

        # Supprimer les applications liées
        cur.execute(
            "DELETE FROM applications WHERE candidate_id = %s",
            (candidate_id,)
        )
        # Supprimer le candidat
        cur.execute(
            "DELETE FROM candidates WHERE id = %s",
            (candidate_id,)
        )
        conn.commit()
        cur.close()

        # Supprimer le fichier CV du disque
        if result and result[0]:
            import os
            try:
                if os.path.exists(result[0]):
                    os.remove(result[0])
            except Exception:
                pass  # Pas critique si le fichier n'existe pas

        return {"message": "Candidat supprimé avec succès"}
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        release_connection(conn)