from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import Building, User
from app.schemas.schemas import BuildingOut, BuildingCreate

router = APIRouter(prefix="/buildings", tags=["Buildings"])

@router.get("", response_model=List[BuildingOut])
def list_buildings(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Building).filter(Building.project_id == project_id).all()

@router.post("", response_model=BuildingOut)
def create_building(b_in: BuildingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    b = Building(project_id=b_in.project_id, name=b_in.name, number_of_floors=b_in.number_of_floors)
    db.add(b)
    db.commit()
    db.refresh(b)
    return b
