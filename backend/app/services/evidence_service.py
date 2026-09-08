import os
import aiofiles
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.domain import SiteEvidence, EvidenceQuality, AIVisionAnalysis, ProgressSnapshot, ConstructionActivity, ProcessingStatus
from app.ai_engine.vision.evidence_analyzer import EvidenceAnalyzer
from app.ai_engine.intelligence.truth_layer import ConstructionTruthLayer

class EvidenceProcessingService:
    """
    Manages asynchronous site evidence storage, quality analysis, vision object detection, and Truth Layer reconciliation.
    """
    def __init__(self):
        self.analyzer = EvidenceAnalyzer()
        self.truth_layer = ConstructionTruthLayer()

    async def save_and_process_evidence(
        self,
        db: Session,
        file_bytes: bytes,
        filename: str,
        project_id: int,
        uploader_id: int,
        building_id: Optional[int] = None,
        floor_id: Optional[int] = None,
        zone_id: Optional[int] = None,
        activity_id: Optional[int] = None,
        description: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None
    ) -> Dict[str, Any]:
        
        os.makedirs(settings.STORAGE_DIR, exist_ok=True)
        file_path = os.path.join(settings.STORAGE_DIR, f"{int(datetime.utcnow().timestamp())}_{filename}")
        
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_bytes)

        file_type = "image/jpeg" if filename.lower().endswith((".jpg", ".jpeg", ".png", ".heic")) else "video/mp4"

        evidence = SiteEvidence(
            project_id=project_id,
            building_id=building_id,
            floor_id=floor_id,
            zone_id=zone_id,
            activity_id=activity_id,
            file_url=file_path,
            file_type=file_type,
            uploader_id=uploader_id,
            latitude=latitude,
            longitude=longitude,
            description=description,
            processing_status=ProcessingStatus.PROCESSING.value
        )
        db.add(evidence)
        db.flush()

        # Run AI evidence analysis
        activity_name = "Blockwork"
        if activity_id:
            act = db.query(ConstructionActivity).filter(ConstructionActivity.id == activity_id).first()
            if act:
                activity_name = act.name

        analysis_res = self.analyzer.process_evidence(file_path, activity_name, file_type)
        quality_info = analysis_res["quality"]

        # Store Evidence Quality
        quality = EvidenceQuality(
            evidence_id=evidence.id,
            resolution_score=quality_info["resolution_score"],
            lighting_score=quality_info["lighting_score"],
            visibility_score=quality_info["visibility_score"],
            relevance_score=quality_info["relevance_score"],
            duplicate_probability=quality_info["duplicate_probability"],
            overall_quality=quality_info["overall_quality"],
            warnings=quality_info["warnings"]
        )
        db.add(quality)

        # Store AI Vision Analysis
        vision_analysis = AIVisionAnalysis(
            evidence_id=evidence.id,
            detected_objects=analysis_res["detected_objects"],
            bounding_boxes=analysis_res["bounding_boxes"],
            observations=analysis_res["observations"],
            confidence=analysis_res["confidence"]
        )
        db.add(vision_analysis)

        evidence.processing_status = ProcessingStatus.COMPLETED.value

        # Update Activity Progress & Truth Layer Reconciliation if activity linked
        reconciliation_res = None
        if activity_id and act:
            act.ai_estimated_progress = analysis_res["ai_estimated_progress"] or act.ai_estimated_progress
            act.confidence = analysis_res["confidence"]
            
            reconciliation_res = self.truth_layer.reconcile_progress(
                activity_id=act.id,
                activity_name=act.name,
                planned_progress=90.0 if "Blockwork" in act.name else 70.0,
                reported_progress=act.reported_progress,
                ai_visual_estimate=act.ai_estimated_progress,
                confidence_score=act.confidence,
                evidence_list=[{"file_type": file_type}],
                quality_scores=[quality_info["overall_quality"]]
            )

            # Record Progress Snapshot
            snap = ProgressSnapshot(
                activity_id=act.id,
                planned_progress=reconciliation_res["planned_progress"],
                reported_progress=act.reported_progress,
                ai_progress=act.ai_estimated_progress,
                reconciled_progress=reconciliation_res["reconciled_progress"],
                confidence=act.confidence,
                evidence_count=1
            )
            db.add(snap)

        db.commit()

        return {
            "evidence_id": evidence.id,
            "processing_status": evidence.processing_status,
            "quality": quality_info,
            "analysis": {
                "confidence": analysis_res["confidence"],
                "observations": analysis_res["observations"],
                "detected_objects_count": len(analysis_res["detected_objects"])
            },
            "reconciliation": reconciliation_res
        }
