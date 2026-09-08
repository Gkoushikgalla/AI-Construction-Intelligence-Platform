from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, DelayRisk, ConstructionActivity
from app.ai_engine.intelligence.risk_engine import ConstructionRiskEngine
from app.schemas.schemas import DelayRiskOut

router = APIRouter(prefix="/risks", tags=["Risks & Delay Intelligence"])

@router.get("", response_model=List[DelayRiskOut])
def list_project_risks(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    risks = db.query(DelayRisk).filter(DelayRisk.project_id == project_id).all()
    res = []
    for r in risks:
        act_name = None
        if r.activity_id:
            act = db.query(ConstructionActivity).filter(ConstructionActivity.id == r.activity_id).first()
            if act:
                act_name = act.name
        
        res.append({
            "id": r.id,
            "project_id": r.project_id,
            "activity_id": r.activity_id,
            "activity_name": act_name,
            "risk_type": r.risk_type,
            "probability": r.probability,
            "estimated_delay_days": r.estimated_delay_days,
            "downstream_impact_days": r.downstream_impact_days,
            "severity": r.severity,
            "root_causes": r.root_causes,
            "confidence": r.confidence,
            "created_at": r.created_at
        })
    return res

@router.post("/evaluate/{project_id}")
def evaluate_risks(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    activities = db.query(ConstructionActivity).filter(ConstructionActivity.project_id == project_id).all()
    act_dicts = [
        {
            "id": a.id,
            "name": a.name,
            "planned_progress": 90.0 if "Blockwork" in a.name or "Slab" in a.name else 70.0,
            "reported_progress": a.reported_progress,
            "dependencies": a.dependencies or []
        }
        for a in activities
    ]
    risk_engine = ConstructionRiskEngine()
    evaluated = risk_engine.evaluate_project_risks(act_dicts)
    return {"project_id": project_id, "evaluated_risks": evaluated}
