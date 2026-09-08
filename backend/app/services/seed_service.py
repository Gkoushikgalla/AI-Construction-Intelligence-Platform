from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.domain import (
    UserRole, ObservationClassification, RiskSeverity, ProcessingStatus,
    Organization, User, Contractor, Project, Building, Floor, Zone,
    ConstructionActivity, ScheduleVersion, SiteEvidence, EvidenceQuality,
    AIVisionAnalysis, ProgressSnapshot, DelayRisk, MaterialLog, SafetyEvent, DailyReport
)

def seed_demo_database(db: Session):
    # Check if already seeded
    if db.query(Organization).filter(Organization.name == "Hyderabad Infrastructure Ltd").first():
        return

    # 1. Organization
    org = Organization(
        name="Hyderabad Infrastructure Ltd",
        industry="Real Estate & High-Rise Construction"
    )
    db.add(org)
    db.flush()

    # 2. Users (6 RBAC Roles)
    hashed_pwd = get_password_hash("admin123")
    users = [
        User(organization_id=org.id, name="Platform Admin", email="admin@sitemind.ai", password_hash=hashed_pwd, role=UserRole.SUPER_ADMIN.value),
        User(organization_id=org.id, name="Kiran Reddy (Org Director)", email="orgadmin@hyderabadinfra.com", password_hash=hashed_pwd, role=UserRole.ORG_ADMIN.value),
        User(organization_id=org.id, name="Suresh Varma (Project Manager)", email="pm@hyderabadinfra.com", password_hash=hashed_pwd, role=UserRole.PROJECT_MANAGER.value),
        User(organization_id=org.id, name="Ramesh Kumar (Site Engineer)", email="engineer@hyderabadinfra.com", password_hash=hashed_pwd, role=UserRole.SITE_ENGINEER.value),
        User(organization_id=org.id, name="XYZ Contractors Lead", email="contractor@xyzconstructions.com", password_hash=hashed_pwd, role=UserRole.CONTRACTOR.value),
        User(organization_id=org.id, name="Executive Board View", email="executive@hyderabadinfra.com", password_hash=hashed_pwd, role=UserRole.EXECUTIVE.value)
    ]
    db.add_all(users)
    db.flush()

    # 3. Contractors
    contractors = [
        Contractor(organization_id=org.id, name="XYZ Civil Contractors", contact_details="+91 98765 43210"),
        Contractor(organization_id=org.id, name="Apex Electricals & MEP", contact_details="+91 98765 43211"),
        Contractor(organization_id=org.id, name="Telangana Plastering & Finishes", contact_details="+91 98765 43212")
    ]
    db.add_all(contractors)
    db.flush()

    # 4. Projects
    proj1 = Project(
        organization_id=org.id,
        name="Hyderabad Tower A",
        description="32-Story Premium Commercial & Residential Skyscraper",
        location="HITEC City, Hyderabad, Telangana",
        developer="Hyderabad Infrastructure Ltd",
        project_type="High-Rise Residential",
        start_date="2026-01-10",
        target_completion_date="2026-12-20",
        status="Active",
        project_manager_id=users[2].id
    )
    proj2 = Project(
        organization_id=org.id,
        name="Hyderabad Tower B",
        description="28-Story Commercial IT Park Tower",
        location="Financial District, Hyderabad, Telangana",
        developer="Hyderabad Infrastructure Ltd",
        project_type="Commercial IT Park",
        start_date="2026-02-01",
        target_completion_date="2027-01-15",
        status="Active",
        project_manager_id=users[2].id
    )
    proj3 = Project(
        organization_id=org.id,
        name="Kondapur Residential Project",
        description="Gated Community Premium Apartments (4 Blocks)",
        location="Kondapur, Hyderabad, Telangana",
        developer="Hyderabad Infrastructure Ltd",
        project_type="Residential Complex",
        start_date="2026-03-15",
        target_completion_date="2027-04-30",
        status="Active"
    )
    proj4 = Project(
        organization_id=org.id,
        name="Gachibowli Villa Project",
        description="Luxury Gated Villas (24 Units)",
        location="Gachibowli, Hyderabad, Telangana",
        developer="Hyderabad Infrastructure Ltd",
        project_type="Luxury Villas",
        start_date="2026-04-01",
        target_completion_date="2027-05-31",
        status="Active"
    )
    db.add_all([proj1, proj2, proj3, proj4])
    db.flush()

    # 5. Buildings
    b1 = Building(project_id=proj1.id, name="Tower A Main Tower", number_of_floors=32, status="In Progress")
    b2 = Building(project_id=proj1.id, name="Tower A Podium & Parking", number_of_floors=4, status="In Progress")
    db.add_all([b1, b2])
    db.flush()

    # 6. Floors
    f7 = Floor(building_id=b1.id, name="Floor 7", floor_number=7, status="Finishing")
    f8 = Floor(building_id=b1.id, name="Floor 8", floor_number=8, status="In Progress")
    f9 = Floor(building_id=b1.id, name="Floor 9", floor_number=9, status="Slab Completed")
    db.add_all([f7, f8, f9])
    db.flush()

    # 7. Zones
    z_a = Zone(floor_id=f8.id, name="Zone A (North Wing)", description="Residential Units 801-804")
    z_b = Zone(floor_id=f8.id, name="Zone B (South Wing)", description="Residential Units 805-808")
    db.add_all([z_a, z_b])
    db.flush()

    # 8. Construction Activities
    act1 = ConstructionActivity(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f8.id,
        zone_id=z_a.id,
        activity_id_external="ACT-801",
        name="Floor 8 Blockwork",
        description="Masonry blockwork installation for internal partition walls",
        contractor_id=contractors[0].id,
        planned_start="2026-09-01",
        planned_end="2026-09-07",
        expected_quantity=1500.0,
        unit="sq.ft",
        dependencies=[],
        reported_progress=82.0,
        ai_estimated_progress=79.0,
        confidence=0.87,
        status="Delayed"
    )
    act2 = ConstructionActivity(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f7.id,
        zone_id=z_a.id,
        activity_id_external="ACT-702",
        name="Floor 7 Electrical Conduit Installation",
        description="PVC conduit embedding in ceiling and walls",
        contractor_id=contractors[1].id,
        planned_start="2026-09-02",
        planned_end="2026-09-08",
        expected_quantity=2200.0,
        unit="m",
        dependencies=[],
        reported_progress=88.0,
        ai_estimated_progress=87.0,
        confidence=0.91,
        status="On Track"
    )
    act3 = ConstructionActivity(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f8.id,
        zone_id=z_a.id,
        activity_id_external="ACT-803",
        name="Floor 8 Internal Plastering",
        description="Base and finish coat plastering on blockwork walls",
        contractor_id=contractors[2].id,
        planned_start="2026-09-08",
        planned_end="2026-09-14",
        expected_quantity=1500.0,
        unit="sq.ft",
        dependencies=[1],  # Dependent on Blockwork
        reported_progress=45.0,
        ai_estimated_progress=42.0,
        confidence=0.84,
        status="At Risk"
    )
    act4 = ConstructionActivity(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f9.id,
        zone_id=z_a.id,
        activity_id_external="ACT-901",
        name="Floor 9 RCC Slab Concrete Casting",
        description="Reinforced concrete casting and curing",
        contractor_id=contractors[0].id,
        planned_start="2026-08-20",
        planned_end="2026-08-30",
        expected_quantity=4500.0,
        unit="sq.ft",
        dependencies=[],
        reported_progress=100.0,
        ai_estimated_progress=98.0,
        confidence=0.95,
        status="Completed"
    )
    db.add_all([act1, act2, act3, act4])
    db.flush()

    # 9. Schedule Version
    sched_ver = ScheduleVersion(
        project_id=proj1.id,
        version=1,
        source_file="Hyderabad_Tower_A_Master_Schedule_Sep2026.xlsx",
        created_by=users[2].id
    )
    db.add(sched_ver)

    # 10. Site Evidence & AI Vision Analysis
    evidence1 = SiteEvidence(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f8.id,
        zone_id=z_a.id,
        activity_id=act1.id,
        file_url="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
        file_type="image/jpeg",
        captured_at=datetime.utcnow() - timedelta(days=2),
        uploader_id=users[3].id,
        latitude=17.4486,
        longitude=78.3808,
        description="Floor 8 Blockwork Masonry Inspection Photo - North Wing",
        processing_status=ProcessingStatus.COMPLETED.value
    )
    db.add(evidence1)
    db.flush()

    quality1 = EvidenceQuality(
        evidence_id=evidence1.id,
        resolution_score=0.94,
        lighting_score=0.92,
        visibility_score=0.89,
        relevance_score=0.96,
        duplicate_probability=0.01,
        overall_quality=0.93,
        warnings=[]
    )
    db.add(quality1)

    vision1 = AIVisionAnalysis(
        evidence_id=evidence1.id,
        model_name="SiteMind-Vision-YOLOv8x",
        model_version="v2.4",
        detected_objects=[
            {"class_name": "brick_wall_section", "category": "structure", "confidence": 0.94},
            {"class_name": "concrete_blocks", "category": "material", "confidence": 0.89},
            {"class_name": "mason_worker", "category": "person", "confidence": 0.91},
            {"class_name": "hardhat", "category": "ppe", "confidence": 0.93},
            {"class_name": "safety_vest", "category": "ppe", "confidence": 0.90}
        ],
        bounding_boxes=[
            {"label": "brick_wall_section", "category": "structure", "bbox_normalized": [0.15, 0.20, 0.75, 0.85], "confidence": 0.94},
            {"label": "concrete_blocks", "category": "material", "bbox_normalized": [0.20, 0.40, 0.45, 0.60], "confidence": 0.89},
            {"label": "mason_worker", "category": "person", "bbox_normalized": [0.35, 0.25, 0.65, 0.45], "confidence": 0.91},
            {"label": "hardhat", "category": "ppe", "bbox_normalized": [0.36, 0.25, 0.42, 0.32], "confidence": 0.93},
            {"label": "safety_vest", "category": "ppe", "bbox_normalized": [0.43, 0.26, 0.58, 0.44], "confidence": 0.90}
        ],
        observations=[
            {"description": "Visual surface completion estimated at 79.0% across Floor 8 Zone A.", "classification": ObservationClassification.OBSERVED.value, "confidence": 0.88},
            {"description": "Detected 4 workers on site (4 hardhats, 4 safety vests). Manpower deficit vs baseline.", "classification": ObservationClassification.OBSERVED.value, "confidence": 0.92}
        ],
        confidence=0.89
    )
    db.add(vision1)

    # 11. Snapshots
    for d_offset, planned, reported, ai_val, rec in [
        (7, 40.0, 42.0, 41.0, 41.5),
        (4, 65.0, 65.0, 62.0, 63.5),
        (1, 91.0, 82.0, 79.0, 80.0)
    ]:
        snap = ProgressSnapshot(
            activity_id=act1.id,
            date=(datetime.utcnow() - timedelta(days=d_offset)).strftime("%Y-%m-%d"),
            planned_progress=planned,
            reported_progress=reported,
            ai_progress=ai_val,
            reconciled_progress=rec,
            confidence=0.87,
            evidence_count=3
        )
        db.add(snap)

    # 12. Delay Risks
    risk1 = DelayRisk(
        project_id=proj1.id,
        activity_id=act1.id,
        risk_type="Floor 8 Blockwork Schedule Delay & Downstream Propagation",
        probability=0.78,
        estimated_delay_days=9,
        downstream_impact_days=14,
        severity=RiskSeverity.HIGH.value,
        root_causes=[
            {"cause": "Blockwork Manpower Shortage (4 masons vs 8 planned)", "percentage": 34.0, "type": "CONFIRMED"},
            {"cause": "AAC Block Material Delivery Lag", "percentage": 27.0, "type": "CONFIRMED"},
            {"cause": "Electrical Preceding Activity Lag", "percentage": 21.0, "type": "CALCULATED"},
            {"cause": "Contractor Productivity Decline", "percentage": 12.0, "type": "INFERRED"}
        ],

        confidence=0.86
    )
    db.add(risk1)

    # 13. Material Logs
    mat1 = MaterialLog(
        project_id=proj1.id,
        activity_id=act1.id,
        material="Ultratech OPC Cement Bags",
        quantity_ordered=1200.0,
        quantity_received=1200.0,
        quantity_consumed=1110.0,
        expected_consumption=1000.0,
        supplier="Ultratech Hyderabad Depot",
        delivery_date="2026-08-28",
        variance=11.0,
        alert_status="Review Required (+11% Over Baseline)"
    )
    mat2 = MaterialLog(
        project_id=proj1.id,
        activity_id=act1.id,
        material="AAC Masonry Blocks (600x200x150mm)",
        quantity_ordered=5000.0,
        quantity_received=4200.0,
        quantity_consumed=3800.0,
        expected_consumption=4000.0,
        supplier="Godrej Construction Materials",
        delivery_date="2026-09-02",
        variance=-5.0,
        alert_status="Normal"
    )
    db.add_all([mat1, mat2])

    # 14. Safety Events
    safety1 = SafetyEvent(
        project_id=proj1.id,
        building_id=b1.id,
        floor_id=f8.id,
        evidence_id=evidence1.id,
        event_type="PPE Violation (Missing Helmet)",
        severity="Medium",
        description="Worker detected near elevator shaft opening without protective hardhat.",
        confidence=0.88
    )
    db.add(safety1)

    # 15. Daily Report
    report1 = DailyReport(
        project_id=proj1.id,
        report_date=datetime.utcnow().strftime("%Y-%m-%d"),
        markdown_content=f"""
# DAILY SITE INTELLIGENCE REPORT
**Project**: Hyderabad Tower A  
**Date**: {datetime.utcnow().strftime('%d %B %Y')}  

---

### Executive Progress Summary
* **Overall Reconciled Progress**: `67.5%`
* **Planned Schedule Baseline**: `72.0%`
* **Schedule Variance**: `-4.5%` (Behind Schedule)

---

### Key Delayed Activity & Risk
🔴 **High Risk**: Floor 8 Blockwork is **9 days behind schedule**.  
Estimated downstream impact on plastering and finishes: **14 days**.

#### Primary Root Causes Identified:
1. Blockwork Manpower Shortage — 34% (Confirmed)
2. Material Delivery Delays — 27% (Confirmed)
3. Electrical Contractor Lag — 21% (Calculated)

---

### Recommended Management Actions
• Deploy 4 additional blockwork masons to Floor 8 immediately.  
• Expedite cement and block delivery.  
• Review contractor productivity.
        """.strip(),
        structured_json={
            "overall_progress": 67.5,
            "planned_progress": 72.0,
            "variance": -4.5,
            "high_risk_activities": ["Floor 8 Blockwork"]
        }
    )
    db.add(report1)

    db.commit()

