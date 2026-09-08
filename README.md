# SiteMind AI — Construction Project Intelligence Platform

SiteMind AI is an **AI-powered construction project monitoring, progress verification, risk detection, and management intelligence platform**.

It reconciles project schedules, site evidence (photographs/videos), contractor reports, and attendance data into an objective **Construction Truth Layer**.

---

## Key Features

1. **Multi-Tenant RBAC Security**: Organization data isolation supporting 6 roles (`SUPER_ADMIN`, `ORG_ADMIN`, `PROJECT_MANAGER`, `SITE_ENGINEER`, `CONTRACTOR`, `EXECUTIVE`).
2. **Spatial Hierarchy**: Organization $\rightarrow$ Project $\rightarrow$ Building / Block $\rightarrow$ Floor $\rightarrow$ Zone $\rightarrow$ Construction Activity.
3. **Schedule Manager**: Excel (`.xlsx`) & CSV parser with dependency graph parsing and schedule versioning (`ScheduleVersion`).
4. **AI Construction Vision Engine**: Bounding box object detection (Structures, Materials, Equipment, Workers, PPE hardhats/vests) with visual quality scoring.
5. **Construction Truth Layer**: Reconciles `Planned Progress` vs `Reported Progress` vs `AI Visual Estimate`, producing `Reconciled Progress` with confidence scores and evidence ledgers ("Why AI says X%?").
6. **Risk & Delay Propagation Engine**: Downstream delay propagation trees, delay probability %, and root cause analysis with confirmed vs inferred classifications.
7. **Daily AI Site Intelligence Reports**: Auto-generated executive summaries and printable/PDF reports.
8. **AI Management Assistant**: Fact-grounded natural-language assistant backed by 11 database tools preventing hallucination.
9. **Mobile Site Engineer Mode**: 3-click photo capture and upload flow for site engineers.

---

## Quick Start Guide

### 1. Prerequisites
- Python 3.11+
- Node.js v18+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
python app/core/seed.py
uvicorn main:app --reload --port 8000
```
Backend Swagger API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Web Application: `http://localhost:3000`

---

## Demo Credentials (Hyderabad Infrastructure Ltd)

| Role | Email | Password |
|---|---|---|
| **SUPER_ADMIN** | `admin@sitemind.ai` | `admin123` |
| **ORG_ADMIN** | `orgadmin@hyderabadinfra.com` | `admin123` |
| **PROJECT_MANAGER** | `pm@hyderabadinfra.com` | `admin123` |
| **SITE_ENGINEER** | `engineer@hyderabadinfra.com` | `admin123` |
| **CONTRACTOR** | `contractor@xyzconstructions.com` | `admin123` |
| **EXECUTIVE** | `executive@hyderabadinfra.com` | `admin123` |

---

## Verification & Tests

- **Run Backend Pytest Suite**:
  ```bash
  cd backend
  python -m pytest tests/test_api.py
  ```

- **Build Frontend**:
  ```bash
  cd frontend
  npm run build
  ```
