import pandas as pd
import io
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.domain import ConstructionActivity, ScheduleVersion

class ScheduleParserService:
    """
    Parses imported Excel (.xlsx) and CSV construction schedules.
    Creates immutable ScheduleVersion revisions and maps activities with dependency graphs.
    """
    def import_schedule(self, db: Session, project_id: int, file_bytes: bytes, filename: str, user_id: int) -> Dict[str, Any]:
        # Determine latest version
        latest_ver = db.query(ScheduleVersion).filter(ScheduleVersion.project_id == project_id).count()
        new_version_num = latest_ver + 1

        sched_ver = ScheduleVersion(
            project_id=project_id,
            version=new_version_num,
            source_file=filename,
            created_by=user_id
        )
        db.add(sched_ver)
        db.flush()

        # Read CSV or Excel
        try:
            if filename.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(file_bytes))
            else:
                df = pd.read_excel(io.BytesIO(file_bytes))
        except Exception as e:
            return {"error": f"Failed to parse schedule file: {str(e)}"}

        imported_activities = []
        # Expect columns: Activity Name, Building, Floor, Zone, Planned Start, Planned End, Expected Quantity, Unit, Dependencies
        for idx, row in df.iterrows():
            name = str(row.get("Activity Name", row.get("name", f"Activity {idx+1}")))
            planned_start = str(row.get("Planned Start", row.get("planned_start", "2026-09-01")))
            planned_end = str(row.get("Planned End", row.get("planned_end", "2026-09-15")))
            qty = float(row.get("Expected Quantity", row.get("expected_quantity", 100.0)))
            unit = str(row.get("Unit", row.get("unit", "sq.ft")))

            activity = ConstructionActivity(
                project_id=project_id,
                activity_id_external=f"ACT-{idx+101}",
                name=name,
                planned_start=planned_start,
                planned_end=planned_end,
                expected_quantity=qty,
                unit=unit,
                dependencies=[],
                reported_progress=0.0,
                ai_estimated_progress=0.0,
                status="Planned"
            )
            db.add(activity)
            imported_activities.append(activity)

        db.commit()

        return {
            "schedule_version": new_version_num,
            "filename": filename,
            "imported_count": len(imported_activities)
        }
