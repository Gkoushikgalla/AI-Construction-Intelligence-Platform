from typing import List, Dict, Any

class ConstructionFactRetriever:
    """
    RAG & Intent matching retriever for SiteMind natural language questions.
    Maps user prompts to appropriate tool execution and fact context.
    """
    def identify_intents(self, query: str) -> List[str]:
        q = query.lower()
        tools = []

        if any(w in q for w in ["status", "overview", "current state"]):
            tools.append("get_project_status")
            tools.append("get_project_progress")
        if any(w in q for w in ["delay", "behind", "late", "slow"]):
            tools.append("get_delayed_activities")
            tools.append("get_project_risks")
        if any(w in q for w in ["contractor", "subcontractor", "performance"]):
            tools.append("get_contractor_performance")
        if any(w in q for w in ["material", "cement", "steel", "wastage"]):
            tools.append("get_material_variance")
        if any(w in q for w in ["risk", "danger", "problem"]):
            tools.append("get_project_risks")
        if any(w in q for w in ["safety", "ppe", "helmet", "violation"]):
            tools.append("get_safety_events")
        if any(w in q for w in ["report", "daily"]):
            tools.append("get_daily_report")

        if not tools:
            tools = ["get_project_status", "get_project_risks"]

        return list(set(tools))
