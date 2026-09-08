from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import Organization, User
from app.schemas.schemas import OrganizationOut, OrganizationCreate

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("", response_model=List[OrganizationOut])
def list_organizations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Multi-tenant isolation: Users see their own organization
    if current_user.role == "SUPER_ADMIN":
        return db.query(Organization).all()
    return db.query(Organization).filter(Organization.id == current_user.organization_id).all()

@router.post("", response_model=OrganizationOut)
def create_organization(org_in: OrganizationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org = Organization(name=org_in.name, industry=org_in.industry)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org
