from typing import List, Dict, Any
from app.ai_engine.intelligence.delay_engine import ConstructionDelayEngine
from app.ai_engine.intelligence.root_cause_engine import ConstructionRootCauseEngine
from app.models.domain import RiskSeverity

class ConstructionRiskEngine:
    """
    Evaluates project activity risks, delay probabilities, downstream impacts, and recommended management actions.
    """
    def __init__(self):
        self.delay_engine = ConstructionDelayEngine()
        self.root_cause_engine = ConstructionRootCauseEngine()

    def evaluate_project_risks(self, activities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        delay_res = self.delay_engine.propagate_delays(activities)
        risks = []

        for item in delay_res["delayed_activities"]:
            root_causes = self.root_cause_engine.analyze_root_cause(
                activity_name=item["activity_name"],
                variance=item["variance"]
            )

            # Determine severity
            if item["downstream_impact_days"] >= 12 or item["variance"] <= -12.0:
                severity = RiskSeverity.HIGH.value
                probability = 0.88
            elif item["downstream_impact_days"] >= 5 or item["variance"] <= -6.0:
                severity = RiskSeverity.MEDIUM.value
                probability = 0.65
            else:
                severity = RiskSeverity.LOW.value
                probability = 0.35

            risk_entry = {
                "activity_id": item["activity_id"],
                "activity_name": item["activity_name"],
                "risk_type": f"Schedule Delay & Downstream Impact ({item['activity_name']})",
                "probability": probability,
                "estimated_delay_days": item["estimated_delay_days"],
                "downstream_impact_days": item["downstream_impact_days"],
                "severity": severity,
                "variance": item["variance"],
                "root_causes": root_causes,
                "confidence": 0.86,
                "recommended_action": f"Deploy 5 additional workers to {item['activity_name']} and expedite material delivery to prevent {item['downstream_impact_days']}-day critical path delay."
            }
            risks.append(risk_entry)

        return risks
