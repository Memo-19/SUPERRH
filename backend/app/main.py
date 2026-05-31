from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import create_tables
from app.routes import auth, jobs, candidates, applications

app = FastAPI(
    title="SuperRH ATS API",
    description="Plateforme ATS avec IA — Projet PFE",
    version="1.0.0"
)

# ─── CORS ────────────────────────────────────────────
origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

# ─── ROUTES ──────────────────────────────────────────
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(auth.router, prefix="",      tags=["Users"])
app.include_router(jobs.router, prefix="",      tags=["Jobs"])
app.include_router(candidates.router, prefix="", tags=["Candidates"])
app.include_router(applications.router, prefix="", tags=["Applications"])

# ─── STARTUP ─────────────────────────────────────────
@app.on_event("startup")
def startup():
    create_tables()
    print("🚀 SuperRH API démarrée!")

@app.get("/")
def root():
    return {
        "message": "SuperRH ATS API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "ok"}