from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, SafetyEvent
from app.schemas.schemas import SafetyEventOut

router = APIRouter(prefix="/safety", tags=["Safety Intelligence"])

@router.get("", response_model=List[SafetyEventOut])
def list_safety_events(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SafetyEvent).filter(SafetyEvent.project_id == project_id).all()
