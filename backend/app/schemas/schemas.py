from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from app.models.domain import UserRole, RiskSeverity, ProcessingStatus, ObservationClassification

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Organization
class OrganizationCreate(BaseModel):
    name: str
    industry: Optional[str] = "Construction & Infrastructure"

class OrganizationOut(BaseModel):
    id: int
    name: str
    industry: str
    created_at: datetime

    class Config:
        from_attributes = True

# User
class UserCreate(BaseModel):
    organization_id: int
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.SITE_ENGINEER

class UserOut(BaseModel):
    id: int
    organization_id: int
    name: str
    email: EmailStr
    role: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Contractor
class ContractorCreate(BaseModel):
    name: str
    contact_details: Optional[str] = None

class ContractorOut(BaseModel):
    id: int
    organization_id: int
    name: str
    contact_details: Optional[str] = None
    active: bool

    class Config:
        from_attributes = True

# Project
class ProjectCreate(BaseModel):
    organization_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    location: str
    developer: Optional[str] = None
    project_type: Optional[str] = "Commercial / Residential Tower"
    start_date: Optional[str] = None
    target_completion_date: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    organization_id: int
    name: str
    description: Optional[str] = None
    location: str
    developer: Optional[str] = None
    project_type: str
    start_date: Optional[str] = None
    target_completion_date: Optional[str] = None
    status: str
    created_at: datetime
    building_count: Optional[int] = 0
    activity_count: Optional[int] = 0
    avg_progress: Optional[float] = 0.0

    class Config:
        from_attributes = True

# Hierarchy
class BuildingCreate(BaseModel):
    project_id: int
    name: str
    number_of_floors: int = 1

class BuildingOut(BaseModel):
    id: int
    project_id: int
    name: str
    number_of_floors: int
    status: str

    class Config:
        from_attributes = True

class FloorCreate(BaseModel):
    building_id: int
    name: str
    floor_number: int

class FloorOut(BaseModel):
    id: int
    building_id: int
    name: str
    floor_number: int
    status: str

    class Config:
        from_attributes = True

class ZoneCreate(BaseModel):
    floor_id: int
    name: str
    description: Optional[str] = None

class ZoneOut(BaseModel):
    id: int
    floor_id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Activities
class ActivityCreate(BaseModel):
    project_id: int
    building_id: Optional[int] = None
    floor_id: Optional[int] = None
    zone_id: Optional[int] = None
    activity_id_external: Optional[str] = None
    name: str
    description: Optional[str] = None
    contractor_id: Optional[int] = None
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    expected_quantity: Optional[float] = 100.0
    unit: Optional[str] = "sq.ft"
    dependencies: Optional[List[int]] = []

class ActivityUpdate(BaseModel):
    reported_progress: Optional[float] = None
    ai_estimated_progress: Optional[float] = None
    status: Optional[str] = None

class ActivityOut(BaseModel):
    id: int
    project_id: int
    building_id: Optional[int] = None
    floor_id: Optional[int] = None
    zone_id: Optional[int] = None
    activity_id_external: Optional[str] = None
    name: str
    description: Optional[str] = None
    contractor_id: Optional[int] = None
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    expected_quantity: float
    unit: str
    dependencies: List[int]
    reported_progress: float
    ai_estimated_progress: float
    confidence: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Evidence
class EvidenceOut(BaseModel):
    id: int
    project_id: int
    building_id: Optional[int] = None
    floor_id: Optional[int] = None
    zone_id: Optional[int] = None
    activity_id: Optional[int] = None
    file_url: str
    file_type: str
    captured_at: datetime
    uploaded_at: datetime
    uploader_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    processing_status: str

    class Config:
        from_attributes = True

class EvidenceQualityOut(BaseModel):
    resolution_score: float
    lighting_score: float
    visibility_score: float
    relevance_score: float
    duplicate_probability: float
    overall_quality: float
    warnings: List[str]

class AIVisionAnalysisOut(BaseModel):
    id: int
    evidence_id: int
    model_name: str
    model_version: str
    detected_objects: List[Dict[str, Any]]
    bounding_boxes: List[Dict[str, Any]]
    segmentation_data: Dict[str, Any]
    observations: List[Dict[str, Any]]
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

# Truth Layer & Progress
class TruthLayerReconciliationOut(BaseModel):
    activity_id: int
    activity_name: str
    planned_progress: float
    reported_progress: float
    ai_visual_estimate: float
    reconciled_progress: float
    confidence_score: float
    variance_percentage: float
    evidence_ledger: Dict[str, Any]
    explanation_markdown: str

class ProgressVerificationCreate(BaseModel):
    activity_id: int
    verified_value: float
    reason: Optional[str] = None

# Risks & Delays
class DelayRiskOut(BaseModel):
    id: int
    project_id: int
    activity_id: Optional[int] = None
    activity_name: Optional[str] = None
    risk_type: str
    probability: float
    estimated_delay_days: int
    downstream_impact_days: int
    severity: str
    root_causes: List[Dict[str, Any]]
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

# Material & Safety
class MaterialLogOut(BaseModel):
    id: int
    project_id: int
    activity_id: Optional[int] = None
    material: str
    quantity_ordered: float
    quantity_received: float
    quantity_consumed: float
    expected_consumption: float
    supplier: Optional[str] = None
    delivery_date: Optional[str] = None
    variance: float
    alert_status: str

    class Config:
        from_attributes = True

class SafetyEventOut(BaseModel):
    id: int
    project_id: int
    building_id: Optional[int] = None
    floor_id: Optional[int] = None
    evidence_id: Optional[int] = None
    event_type: str
    severity: str
    description: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

class DailyReportOut(BaseModel):
    id: int
    project_id: int
    report_date: str
    markdown_content: str
    structured_json: Dict[str, Any]
    generated_at: datetime

    class Config:
        from_attributes = True

# Assistant
class AssistantQueryRequest(BaseModel):
    project_id: int
    query: str

class AssistantQueryResponse(BaseModel):
    query: str
    answer: str
    tools_called: List[str]
    evidence_references: List[Dict[str, Any]]
    confidence: float
