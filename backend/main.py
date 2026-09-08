import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.services.seed_service import seed_demo_database
from app.core.logging import logger

from app.api import (
    auth, organizations, projects, buildings, floors, zones,
    activities, schedules, evidence, progress, risks, contractors,
    materials, safety, reports, assistant
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="SiteMind AI - Construction Monitoring & Intelligence Platform REST API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists and mount as static route
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.STORAGE_DIR), name="uploads")

# Startup DB Init
@app.on_event("startup")
def startup_event():
    logger.info("Initializing SiteMind AI Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_database(db)
    finally:
        db.close()
    logger.info("SiteMind AI Backend Ready!")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "Online",
        "docs_url": "/docs"
    }

# Include API Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(organizations.router, prefix=api_v1)
app.include_router(projects.router, prefix=api_v1)
app.include_router(buildings.router, prefix=api_v1)
app.include_router(floors.router, prefix=api_v1)
app.include_router(zones.router, prefix=api_v1)
app.include_router(activities.router, prefix=api_v1)
app.include_router(schedules.router, prefix=api_v1)
app.include_router(evidence.router, prefix=api_v1)
app.include_router(progress.router, prefix=api_v1)
app.include_router(risks.router, prefix=api_v1)
app.include_router(contractors.router, prefix=api_v1)
app.include_router(materials.router, prefix=api_v1)
app.include_router(safety.router, prefix=api_v1)
app.include_router(reports.router, prefix=api_v1)
app.include_router(assistant.router, prefix=api_v1)
