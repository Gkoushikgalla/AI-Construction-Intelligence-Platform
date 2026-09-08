from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import Floor, User
from app.schemas.schemas import FloorOut, FloorCreate

router = APIRouter(prefix="/floors", tags=["Floors"])

@router.get("", response_model=List[FloorOut])
def list_floors(building_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Floor).filter(Floor.building_id == building_id).all()

@router.post("", response_model=FloorOut)
def create_floor(f_in: FloorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    f = Floor(building_id=f_in.building_id, name=f_in.name, floor_number=f_in.floor_number)
    db.add(f)
    db.commit()
    db.refresh(f)
    return f
