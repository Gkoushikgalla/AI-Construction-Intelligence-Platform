from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import Optional, List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, SiteEvidence, EvidenceQuality, AIVisionAnalysis
from app.services.evidence_service import EvidenceProcessingService
from app.schemas.schemas import EvidenceOut

router = APIRouter(prefix="/evidence", tags=["Site Evidence & Vision"])

@router.get("", response_model=List[EvidenceOut])
def list_evidence(
    project_id: int,
    activity_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(SiteEvidence).filter(SiteEvidence.project_id == project_id)
    if activity_id:
        query = query.filter(SiteEvidence.activity_id == activity_id)
    return query.order_by(SiteEvidence.id.desc()).all()

@router.post("/upload")
async def upload_evidence(
    project_id: int = Form(...),
    building_id: Optional[int] = Form(None),
    floor_id: Optional[int] = Form(None),
    zone_id: Optional[int] = Form(None),
    activity_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    service = EvidenceProcessingService()
    res = await service.save_and_process_evidence(
        db=db,
        file_bytes=contents,
        filename=file.filename,
        project_id=project_id,
        uploader_id=current_user.id,
        building_id=building_id,
        floor_id=floor_id,
        zone_id=zone_id,
        activity_id=activity_id,
        description=description,
        latitude=latitude,
        longitude=longitude
    )
    return res

@router.get("/{evidence_id}/analysis")
def get_evidence_analysis(evidence_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quality = db.query(EvidenceQuality).filter(EvidenceQuality.evidence_id == evidence_id).first()
    vision = db.query(AIVisionAnalysis).filter(AIVisionAnalysis.evidence_id == evidence_id).first()
    
    if not vision:
        raise HTTPException(status_code=404, detail="Vision analysis not ready for this evidence.")
    
    return {
        "evidence_id": evidence_id,
        "quality": {
            "overall_quality": quality.overall_quality if quality else 0.90,
            "resolution_score": quality.resolution_score if quality else 0.90,
            "lighting_score": quality.lighting_score if quality else 0.90,
            "warnings": quality.warnings if quality else []
        },
        "vision_analysis": {
            "model_name": vision.model_name,
            "model_version": vision.model_version,
            "detected_objects": vision.detected_objects,
            "bounding_boxes": vision.bounding_boxes,
            "observations": vision.observations,
            "confidence": vision.confidence
        }
    }
