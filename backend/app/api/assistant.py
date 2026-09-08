from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User
from app.ai_engine.assistant.assistant_engine import AIAssistantEngine
from app.schemas.schemas import AssistantQueryRequest, AssistantQueryResponse

router = APIRouter(prefix="/assistant", tags=["AI Management Assistant"])

@router.post("/query", response_model=AssistantQueryResponse)
def query_assistant(request: AssistantQueryRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    engine = AIAssistantEngine(db)
    res = engine.process_query(project_id=request.project_id, query=request.query)
    return res
