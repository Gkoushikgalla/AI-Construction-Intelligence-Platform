from datetime import datetime
from typing import List, Dict, Any

class TemporalProgressComparator:
    """
    Compares construction evidence and progress across dates.
    Calculates progress velocity, trends, and completion trajectory.
    """
    def compare_snapshots(self, snapshots: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        snapshots format: list of dicts with 'date' (YYYY-MM-DD), 'reconciled_progress' (float 0-100)
        """
        if not snapshots:
            return {
                "velocity_per_day": 0.0,
                "trend": "INSUFFICIENT_DATA",
                "trajectory_days_remaining": 0,
                "history": []
            }

        sorted_snaps = sorted(snapshots, key=lambda x: x["date"])
        
        if len(sorted_snaps) < 2:
            return {
                "velocity_per_day": 0.0,
                "trend": "STABLE",
                "trajectory_days_remaining": 0,
                "history": sorted_snaps
            }

        first = sorted_snaps[0]
        last = sorted_snaps[-1]

        try:
            d1 = datetime.strptime(first["date"], "%Y-%m-%d")
            d2 = datetime.strptime(last["date"], "%Y-%m-%d")
            days_diff = max(1, (d2 - d1).days)
        except Exception:
            days_diff = 7

        progress_diff = last["reconciled_progress"] - first["reconciled_progress"]
        velocity = round(progress_diff / days_diff, 2)  # % progress per day

        remaining_progress = 100.0 - last["reconciled_progress"]
        trajectory_days = round(remaining_progress / velocity) if velocity > 0 else 999

        if velocity >= 2.5:
            trend = "ACCELERATING"
        elif velocity >= 1.0:
            trend = "STEADY"
        elif velocity > 0.0:
            trend = "SLOWING"
        else:
            trend = "STAGNANT"

        return {
            "velocity_per_day": velocity,
            "trend": trend,
            "trajectory_days_remaining": trajectory_days,
            "current_progress": last["reconciled_progress"],
            "first_date": first["date"],
            "last_date": last["date"],
            "history": sorted_snaps
        }
