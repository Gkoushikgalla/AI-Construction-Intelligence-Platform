from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import Zone, User
from app.schemas.schemas import ZoneOut, ZoneCreate

router = APIRouter(prefix="/zones", tags=["Zones"])

@router.get("", response_model=List[ZoneOut])
def list_zones(floor_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Zone).filter(Zone.floor_id == floor_id).all()

@router.post("", response_model=ZoneOut)
def create_zone(z_in: ZoneCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    z = Zone(floor_id=z_in.floor_id, name=z_in.name, description=z_in.description)
    db.add(z)
    db.commit()
    db.refresh(z)
    return z
