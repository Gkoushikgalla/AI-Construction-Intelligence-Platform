from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, Contractor
from app.schemas.schemas import ContractorOut, ContractorCreate

router = APIRouter(prefix="/contractors", tags=["Contractors"])

@router.get("", response_model=List[ContractorOut])
def list_contractors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Contractor).filter(Contractor.organization_id == current_user.organization_id).all()

@router.post("", response_model=ContractorOut)
def create_contractor(c_in: ContractorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    c = Contractor(organization_id=current_user.organization_id, name=c_in.name, contact_details=c_in.contact_details)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c
