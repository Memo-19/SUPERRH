from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.candidates import router as candidates_router
from app.routes.applications import router as applications_router

app = FastAPI(title="ATS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
app.include_router(candidates_router, prefix="/candidates", tags=["Candidates"])
app.include_router(applications_router, prefix="/applications", tags=["Applications"])

@app.get("/")
def root():
    return {"message": "ATS API is running!"}

@app.get("/health")
def health():
    return {"status": "ok"}