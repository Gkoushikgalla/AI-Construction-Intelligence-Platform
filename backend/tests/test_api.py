import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.seed import init_db

# Ensure DB is created and seeded before running tests
init_db()

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "SiteMind AI"

def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@sitemind.ai", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@sitemind.ai"

def test_login_failed():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@sitemind.ai", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_projects_flow():
    # Login
    auth_resp = client.post("/api/v1/auth/login", json={"email": "pm@hyderabadinfra.com", "password": "admin123"})
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get Projects
    resp = client.get("/api/v1/projects", headers=headers)
    assert resp.status_code == 200
    projects = resp.json()
    assert len(projects) >= 1
    assert projects[0]["name"] == "Hyderabad Tower A"

def test_reconcile_truth_layer():
    auth_resp = client.post("/api/v1/auth/login", json={"email": "engineer@hyderabadinfra.com", "password": "admin123"})
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Reconcile Activity 1
    resp = client.get("/api/v1/progress/reconcile/1", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "reconciled_progress" in data
    assert "evidence_ledger" in data
    assert data["evidence_ledger"]["total_evidence_items"] >= 1

def test_assistant_query():
    auth_resp = client.post("/api/v1/auth/login", json={"email": "pm@hyderabadinfra.com", "password": "admin123"})
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.post(
        "/api/v1/assistant/query",
        headers=headers,
        json={"project_id": 1, "query": "Which activities are delayed in Tower A?"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "answer" in data
    assert len(data["tools_called"]) >= 1
