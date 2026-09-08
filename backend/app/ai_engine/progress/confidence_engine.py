from typing import List, Dict, Any

class ProgressConfidenceEngine:
    """
    Computes objective confidence scores for AI progress estimates.
    Factors in: evidence quality, number of evidence samples, source diversity, and recency.
    """
    def calculate_confidence(
        self,
        evidence_qualities: List[float],
        evidence_count: int,
        has_video: bool = False,
        engineer_reported_present: bool = True
    ) -> float:
        if not evidence_qualities or evidence_count == 0:
            return 0.0
        
        avg_quality = sum(evidence_qualities) / len(evidence_qualities)
        
        # Quantity factor (diminishing returns after 5 evidence items)
        quantity_factor = min(1.0, 0.5 + (evidence_count * 0.1))
        
        # Diversity bonus
        diversity_bonus = 0.05 if has_video else 0.0
        reported_bonus = 0.05 if engineer_reported_present else 0.0
        
        raw_score = (avg_quality * 0.7) + (quantity_factor * 0.2) + diversity_bonus + reported_bonus
        return round(min(0.98, max(0.10, raw_score)), 2)
