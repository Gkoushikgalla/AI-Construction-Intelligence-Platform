from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, MaterialLog
from app.schemas.schemas import MaterialLogOut

router = APIRouter(prefix="/materials", tags=["Material Intelligence"])

@router.get("", response_model=List[MaterialLogOut])
def list_material_logs(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MaterialLog).filter(MaterialLog.project_id == project_id).all()
