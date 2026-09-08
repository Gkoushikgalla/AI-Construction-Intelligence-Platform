from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import ConstructionActivity, User
from app.schemas.schemas import ActivityOut, ActivityCreate, ActivityUpdate

router = APIRouter(prefix="/activities", tags=["Construction Activities"])

@router.get("", response_model=List[ActivityOut])
def list_activities(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ConstructionActivity).filter(ConstructionActivity.project_id == project_id).all()

@router.get("/{activity_id}", response_model=ActivityOut)
def get_activity(activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    act = db.query(ConstructionActivity).filter(ConstructionActivity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    return act

@router.post("", response_model=ActivityOut)
def create_activity(act_in: ActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    act = ConstructionActivity(
        project_id=act_in.project_id,
        building_id=act_in.building_id,
        floor_id=act_in.floor_id,
        zone_id=act_in.zone_id,
        activity_id_external=act_in.activity_id_external,
        name=act_in.name,
        description=act_in.description,
        contractor_id=act_in.contractor_id,
        planned_start=act_in.planned_start,
        planned_end=act_in.planned_end,
        expected_quantity=act_in.expected_quantity or 100.0,
        unit=act_in.unit or "sq.ft",
        dependencies=act_in.dependencies or [],
        reported_progress=0.0,
        ai_estimated_progress=0.0,
        status="Planned"
    )
    db.add(act)
    db.commit()
    db.refresh(act)
    return act

@router.patch("/{activity_id}", response_model=ActivityOut)
def update_activity(activity_id: int, act_in: ActivityUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    act = db.query(ConstructionActivity).filter(ConstructionActivity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    if act_in.reported_progress is not None:
        act.reported_progress = act_in.reported_progress
    if act_in.ai_estimated_progress is not None:
        act.ai_estimated_progress = act_in.ai_estimated_progress
    if act_in.status is not None:
        act.status = act_in.status

    db.commit()
    db.refresh(act)
    return act
