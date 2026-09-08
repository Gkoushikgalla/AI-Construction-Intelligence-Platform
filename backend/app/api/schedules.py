from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, ScheduleVersion
from app.services.schedule_parser import ScheduleParserService

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.post("/import")
async def import_schedule(
    project_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Invalid schedule file type. Please upload Excel (.xlsx) or CSV (.csv).")

    contents = await file.read()
    service = ScheduleParserService()
    res = service.import_schedule(db, project_id, contents, file.filename, current_user.id)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res

@router.get("/versions")
def list_schedule_versions(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ScheduleVersion).filter(ScheduleVersion.project_id == project_id).order_by(ScheduleVersion.version.desc()).all()
