from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import Project, Building, ConstructionActivity, User
from app.schemas.schemas import ProjectOut, ProjectCreate

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.organization_id == current_user.organization_id).all()
    res = []
    for p in projects:
        b_count = db.query(Building).filter(Building.project_id == p.id).count()
        acts = db.query(ConstructionActivity).filter(ConstructionActivity.project_id == p.id).all()
        avg_p = (sum(a.reported_progress for a in acts) / len(acts)) if acts else 0.0
        
        p_dict = {
            "id": p.id,
            "organization_id": p.organization_id,
            "name": p.name,
            "description": p.description,
            "location": p.location,
            "developer": p.developer,
            "project_type": p.project_type,
            "start_date": p.start_date,
            "target_completion_date": p.target_completion_date,
            "status": p.status,
            "created_at": p.created_at,
            "building_count": b_count,
            "activity_count": len(acts),
            "avg_progress": round(avg_p, 1)
        }
        res.append(p_dict)
    return res

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    b_count = db.query(Building).filter(Building.project_id == p.id).count()
    acts = db.query(ConstructionActivity).filter(ConstructionActivity.project_id == p.id).all()
    avg_p = (sum(a.reported_progress for a in acts) / len(acts)) if acts else 0.0

    return {
        "id": p.id,
        "organization_id": p.organization_id,
        "name": p.name,
        "description": p.description,
        "location": p.location,
        "developer": p.developer,
        "project_type": p.project_type,
        "start_date": p.start_date,
        "target_completion_date": p.target_completion_date,
        "status": p.status,
        "created_at": p.created_at,
        "building_count": b_count,
        "activity_count": len(acts),
        "avg_progress": round(avg_p, 1)
    }

@router.post("", response_model=ProjectOut)
def create_project(proj_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(
        organization_id=current_user.organization_id,
        name=proj_in.name,
        description=proj_in.description,
        location=proj_in.location,
        developer=proj_in.developer,
        project_type=proj_in.project_type,
        start_date=proj_in.start_date,
        target_completion_date=proj_in.target_completion_date
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    return {
        "id": project.id,
        "organization_id": project.organization_id,
        "name": project.name,
        "description": project.description,
        "location": project.location,
        "developer": project.developer,
        "project_type": project.project_type,
        "start_date": project.start_date,
        "target_completion_date": project.target_completion_date,
        "status": project.status,
        "created_at": project.created_at,
        "building_count": 0,
        "activity_count": 0,
        "avg_progress": 0.0
    }
