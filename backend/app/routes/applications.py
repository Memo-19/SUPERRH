from fastapi import APIRouter
from app.database import get_connection
from pydantic import BaseModel

router = APIRouter()

class StatusUpdate(BaseModel):
    statut: str

@router.put("/{candidate_id}/statut")
def update_statut(candidate_id: int, data: StatusUpdate):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE applications SET statut = %s WHERE candidate_id = %s",
        (data.statut, candidate_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Statut mis à jour"}

@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM applications WHERE candidate_id = %s", (candidate_id,))
    cur.execute("DELETE FROM candidates WHERE id = %s", (candidate_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Candidat supprimé"}