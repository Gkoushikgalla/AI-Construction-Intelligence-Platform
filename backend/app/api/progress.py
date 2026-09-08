from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, ConstructionActivity, ProgressSnapshot, ProgressVerification, SiteEvidence, EvidenceQuality
from app.ai_engine.intelligence.truth_layer import ConstructionTruthLayer
from app.ai_engine.progress.temporal_comparator import TemporalProgressComparator
from app.schemas.schemas import TruthLayerReconciliationOut, ProgressVerificationCreate

router = APIRouter(prefix="/progress", tags=["Construction Truth Layer & Progress"])

@router.get("/reconcile/{activity_id}", response_model=TruthLayerReconciliationOut)
def get_reconciled_progress(activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    act = db.query(ConstructionActivity).filter(ConstructionActivity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    evidence_list = db.query(SiteEvidence).filter(SiteEvidence.activity_id == activity_id).all()
    quality_scores = []
    for e in evidence_list:
        q = db.query(EvidenceQuality).filter(EvidenceQuality.evidence_id == e.id).first()
        if q:
            quality_scores.append(q.overall_quality)

    truth_engine = ConstructionTruthLayer()
    res = truth_engine.reconcile_progress(
        activity_id=act.id,
        activity_name=act.name,
        planned_progress=90.0 if "Blockwork" in act.name else 70.0,
        reported_progress=act.reported_progress,
        ai_visual_estimate=act.ai_estimated_progress or act.reported_progress,
        confidence_score=act.confidence or 0.85,
        evidence_list=[{"file_type": e.file_type} for e in evidence_list],
        quality_scores=quality_scores or [0.90]
    )
    return res

@router.get("/temporal/{activity_id}")
def get_temporal_progress(activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    snaps = db.query(ProgressSnapshot).filter(ProgressSnapshot.activity_id == activity_id).order_by(ProgressSnapshot.date.asc()).all()
    snap_dicts = [
        {
            "date": s.date,
            "planned_progress": s.planned_progress,
            "reported_progress": s.reported_progress,
            "ai_progress": s.ai_progress,
            "reconciled_progress": s.reconciled_progress
        }
        for s in snaps
    ]
    comparator = TemporalProgressComparator()
    return comparator.compare_snapshots(snap_dicts)

@router.post("/verify")
def verify_progress(verify_in: ProgressVerificationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    act = db.query(ConstructionActivity).filter(ConstructionActivity.id == verify_in.activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    pv = ProgressVerification(
        activity_id=verify_in.activity_id,
        ai_estimate=act.ai_estimated_progress,
        verified_value=verify_in.verified_value,
        verified_by=current_user.id,
        reason=verify_in.reason or "Human verification by Site Engineer"
    )
    db.add(pv)
    act.reported_progress = verify_in.verified_value
    db.commit()
    return {"message": "Progress verification recorded successfully", "verified_value": verify_in.verified_value}
