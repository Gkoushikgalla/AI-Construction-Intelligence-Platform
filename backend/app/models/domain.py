import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORG_ADMIN = "ORG_ADMIN"
    PROJECT_MANAGER = "PROJECT_MANAGER"
    SITE_ENGINEER = "SITE_ENGINEER"
    CONTRACTOR = "CONTRACTOR"
    EXECUTIVE = "EXECUTIVE"

class ObservationClassification(str, enum.Enum):
    OBSERVED = "OBSERVED"
    REPORTED = "REPORTED"
    CALCULATED = "CALCULATED"
    INFERRED = "INFERRED"
    PREDICTED = "PREDICTED"

class ProcessingStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class RiskSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(100), default="Construction & Infrastructure")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")
    contractors = relationship("Contractor", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.SITE_ENGINEER.value)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    contact_details = Column(String(255), nullable=True)
    active = Column(Boolean, default=True)

    organization = relationship("Organization", back_populates="contractors")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    developer = Column(String(255), nullable=True)
    project_type = Column(String(100), default="Commercial / Residential Tower")
    start_date = Column(String(50), nullable=True)
    target_completion_date = Column(String(50), nullable=True)
    status = Column(String(50), default="Active")
    project_manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="projects")
    buildings = relationship("Building", back_populates="project", cascade="all, delete-orphan")
    activities = relationship("ConstructionActivity", back_populates="project", cascade="all, delete-orphan")
    evidence = relationship("SiteEvidence", back_populates="project", cascade="all, delete-orphan")

class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    number_of_floors = Column(Integer, default=1)
    status = Column(String(50), default="In Progress")

    project = relationship("Project", back_populates="buildings")
    floors = relationship("Floor", back_populates="building", cascade="all, delete-orphan")

class Floor(Base):
    __tablename__ = "floors"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    name = Column(String(255), nullable=False)
    floor_number = Column(Integer, default=1)
    status = Column(String(50), default="In Progress")

    building = relationship("Building", back_populates="floors")
    zones = relationship("Zone", back_populates="floor", cascade="all, delete-orphan")

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)

    floor = relationship("Floor", back_populates="zones")

class ConstructionActivity(Base):
    __tablename__ = "construction_activities"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    activity_id_external = Column(String(100), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=True)
    planned_start = Column(String(50), nullable=True)
    planned_end = Column(String(50), nullable=True)
    actual_start = Column(String(50), nullable=True)
    actual_end = Column(String(50), nullable=True)
    expected_quantity = Column(Float, default=100.0)
    unit = Column(String(50), default="sq.ft")
    dependencies = Column(JSON, default=list)  # list of activity IDs
    reported_progress = Column(Float, default=0.0)
    ai_estimated_progress = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    status = Column(String(50), default="Not Started")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="activities")

class ScheduleVersion(Base):
    __tablename__ = "schedule_versions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    version = Column(Integer, default=1)
    source_file = Column(String(255), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SiteEvidence(Base):
    __tablename__ = "site_evidence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=True)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), default="image/jpeg")
    captured_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    processing_status = Column(String(50), default=ProcessingStatus.PENDING.value)

    project = relationship("Project", back_populates="evidence")

class EvidenceQuality(Base):
    __tablename__ = "evidence_qualities"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("site_evidence.id"), nullable=False)
    resolution_score = Column(Float, default=0.9)
    lighting_score = Column(Float, default=0.95)
    visibility_score = Column(Float, default=0.88)
    relevance_score = Column(Float, default=0.92)
    duplicate_probability = Column(Float, default=0.01)
    overall_quality = Column(Float, default=0.91)
    warnings = Column(JSON, default=list)

class AIVisionAnalysis(Base):
    __tablename__ = "ai_vision_analyses"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("site_evidence.id"), nullable=False)
    model_name = Column(String(100), default="SiteMind-Vision-YOLOv8x")
    model_version = Column(String(50), default="v2.4")
    detected_objects = Column(JSON, default=list)
    bounding_boxes = Column(JSON, default=list)
    segmentation_data = Column(JSON, default=dict)
    observations = Column(JSON, default=list)
    confidence = Column(Float, default=0.88)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProgressSnapshot(Base):
    __tablename__ = "progress_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=False)
    date = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    planned_progress = Column(Float, default=0.0)
    reported_progress = Column(Float, default=0.0)
    ai_progress = Column(Float, default=0.0)
    reconciled_progress = Column(Float, default=0.0)
    confidence = Column(Float, default=0.85)
    evidence_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProgressVerification(Base):
    __tablename__ = "progress_verifications"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=False)
    ai_estimate = Column(Float, nullable=False)
    verified_value = Column(Float, nullable=False)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    verification_status = Column(String(50), default="Verified")
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIObservation(Base):
    __tablename__ = "ai_observations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=True)
    observation_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    evidence_id = Column(Integer, ForeignKey("site_evidence.id"), nullable=True)
    confidence = Column(Float, default=0.85)
    classification = Column(String(50), default=ObservationClassification.OBSERVED.value)

class DelayRisk(Base):
    __tablename__ = "delay_risks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=True)
    risk_type = Column(String(100), nullable=False)
    probability = Column(Float, default=0.5)
    estimated_delay_days = Column(Integer, default=0)
    downstream_impact_days = Column(Integer, default=0)
    severity = Column(String(50), default=RiskSeverity.MEDIUM.value)
    root_causes = Column(JSON, default=list)  # list of objects {cause: str, percentage: float, type: str}
    confidence = Column(Float, default=0.85)
    created_at = Column(DateTime, default=datetime.utcnow)

class MaterialLog(Base):
    __tablename__ = "material_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("construction_activities.id"), nullable=True)
    material = Column(String(255), nullable=False)
    quantity_ordered = Column(Float, default=0.0)
    quantity_received = Column(Float, default=0.0)
    quantity_consumed = Column(Float, default=0.0)
    expected_consumption = Column(Float, default=0.0)
    supplier = Column(String(255), nullable=True)
    delivery_date = Column(String(50), nullable=True)
    variance = Column(Float, default=0.0)  # % variance vs expected
    alert_status = Column(String(50), default="Normal")

class SafetyEvent(Base):
    __tablename__ = "safety_events"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=True)
    evidence_id = Column(Integer, ForeignKey("site_evidence.id"), nullable=True)
    event_type = Column(String(100), default="PPE Violation")
    severity = Column(String(50), default="Medium")
    description = Column(Text, nullable=False)
    confidence = Column(Float, default=0.88)
    created_at = Column(DateTime, default=datetime.utcnow)

class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    report_date = Column(String(50), nullable=False)
    markdown_content = Column(Text, nullable=False)
    structured_json = Column(JSON, default=dict)
    generated_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    entity = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=True)
    previous_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50), nullable=True)
