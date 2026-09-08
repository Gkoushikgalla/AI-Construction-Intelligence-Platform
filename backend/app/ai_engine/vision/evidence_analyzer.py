from typing import Dict, Any, List
from app.ai_engine.vision.detector import ConstructionVisionDetector
from app.ai_engine.vision.segmentation import ConstructionSegmentationEngine
from app.ai_engine.vision.evidence_quality import EvidenceQualityAnalyzer
from app.models.domain import ObservationClassification

class EvidenceAnalyzer:
    """
    Unified analyzer that orchestrates quality check, object detection, segmentation, and observation extraction.
    """
    def __init__(self):
        self.detector = ConstructionVisionDetector()
        self.segmentor = ConstructionSegmentationEngine()
        self.quality_evaluator = EvidenceQualityAnalyzer()

    def process_evidence(self, file_path: str, activity_name: str = "Blockwork", file_type: str = "image/jpeg") -> Dict[str, Any]:
        # 1. Quality evaluation
        quality_res = self.quality_evaluator.evaluate_quality(file_path, file_type)
        
        if not quality_res["is_valid_for_analysis"]:
            return {
                "quality": quality_res,
                "ai_estimated_progress": None,
                "confidence": 0.0,
                "observations": [
                    {
                        "description": "Insufficient visual evidence to estimate progress reliably.",
                        "classification": ObservationClassification.OBSERVED.value,
                        "confidence": 1.0
                    }
                ],
                "bounding_boxes": [],
                "detected_objects": []
            }

        # 2. Object detection
        detection_res = self.detector.detect_objects(file_path, activity_name)
        
        # 3. Segmentation completion analysis
        segment_res = self.segmentor.analyze_surface_completion(file_path, activity_name)
        
        # 4. Formulate structured observations
        observations = [
            {
                "description": f"Visual surface completion estimated at {segment_res['completion_percentage']}% across active zone.",
                "classification": ObservationClassification.OBSERVED.value,
                "confidence": 0.88
            },
            {
                "description": f"Detected {detection_res['worker_count']} workers on site with {detection_res['ppe_count']} PPE compliance items.",
                "classification": ObservationClassification.OBSERVED.value,
                "confidence": 0.91
            },
            {
                "description": f"Identified construction elements: {', '.join(set([o['class_name'] for o in detection_res['detected_objects']]))}.",
                "classification": ObservationClassification.OBSERVED.value,
                "confidence": 0.89
            }
        ]

        return {
            "quality": quality_res,
            "ai_estimated_progress": segment_res["completion_percentage"],
            "confidence": round(quality_res["overall_quality"] * 0.95, 2),
            "observations": observations,
            "bounding_boxes": detection_res["bounding_boxes"],
            "detected_objects": detection_res["detected_objects"],
            "segmentation": segment_res
        }
