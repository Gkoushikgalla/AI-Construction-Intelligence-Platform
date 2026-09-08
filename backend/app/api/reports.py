from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, DailyReport
from app.services.report_service import DailyReportService
from app.schemas.schemas import DailyReportOut

router = APIRouter(prefix="/reports", tags=["Daily AI Reports"])

@router.get("", response_model=List[DailyReportOut])
def list_reports(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(DailyReport).filter(DailyReport.project_id == project_id).order_by(DailyReport.id.desc()).all()

@router.post("/generate/{project_id}", response_model=DailyReportOut)
def generate_report(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = DailyReportService()
    return service.generate_daily_report(db, project_id)
