from typing import List, Dict, Any

class ConstructionDelayEngine:
    """
    Analyzes activity schedule variances, models dependency networks, and calculates downstream delay propagation.
    """
    def propagate_delays(self, activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        activities: list of dicts with id, name, dependencies (list of int ids), planned_end, reconciled_progress, status
        """
        if not activities:
            return {"delayed_activities": [], "max_downstream_delay": 0, "dependency_tree": []}

        activity_map = {a["id"]: a for a in activities}
        delayed_activities = []
        max_downstream = 0

        for a in activities:
            planned = a.get("planned_progress", 0.0)
            reconciled = a.get("reconciled_progress", a.get("reported_progress", 0.0))
            variance = reconciled - planned

            if variance < -5.0:  # More than 5% behind planned baseline
                # Calculate estimated delay in days (assuming typical activity duration 14 days)
                estimated_delay_days = round(abs(variance) * 0.4)
                
                # Propagate downstream impact through dependencies
                downstream_count = sum(1 for other in activities if a["id"] in other.get("dependencies", []))
                downstream_impact_days = estimated_delay_days + (downstream_count * 3)

                max_downstream = max(max_downstream, downstream_impact_days)

                delayed_activities.append({
                    "activity_id": a["id"],
                    "activity_name": a["name"],
                    "planned_progress": planned,
                    "reconciled_progress": reconciled,
                    "variance": round(variance, 1),
                    "estimated_delay_days": estimated_delay_days,
                    "downstream_impact_days": downstream_impact_days,
                    "dependent_activities_count": downstream_count
                })

        return {
            "delayed_activities": delayed_activities,
            "total_delayed_count": len(delayed_activities),
            "max_downstream_delay": max_downstream,
            "overall_status": "CRITICAL_DELAY" if max_downstream > 10 else ("WARNING" if max_downstream > 0 else "ON_TRACK")
        }
