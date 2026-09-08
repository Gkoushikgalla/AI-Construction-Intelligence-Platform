const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sitemind_token") : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "API Error" }));
    throw new Error(errorData.detail || "API request failed");
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: any) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => fetchApi("/auth/me"),

  // Projects
  getProjects: () => fetchApi("/projects"),
  getProject: (id: number) => fetchApi(`/projects/${id}`),
  createProject: (data: any) => fetchApi("/projects", { method: "POST", body: JSON.stringify(data) }),

  // Hierarchy
  getBuildings: (projectId: number) => fetchApi(`/buildings?project_id=${projectId}`),
  getFloors: (buildingId: number) => fetchApi(`/floors?building_id=${buildingId}`),
  getZones: (floorId: number) => fetchApi(`/zones?floor_id=${floorId}`),

  // Activities & Schedule
  getActivities: (projectId: number) => fetchApi(`/activities?project_id=${projectId}`),
  getActivity: (id: number) => fetchApi(`/activities/${id}`),
  updateActivity: (id: number, data: any) => fetchApi(`/activities/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  importSchedule: (formData: FormData) => fetchApi("/schedules/import", { method: "POST", body: formData }),

  // Evidence & Vision
  getEvidence: (projectId: number, activityId?: number) =>
    fetchApi(`/evidence?project_id=${projectId}${activityId ? `&activity_id=${activityId}` : ""}`),
  uploadEvidence: (formData: FormData) => fetchApi("/evidence/upload", { method: "POST", body: formData }),
  getEvidenceAnalysis: (id: number) => fetchApi(`/evidence/${id}/analysis`),

  // Truth Layer & Progress
  getReconciledProgress: (activityId: number) => fetchApi(`/progress/reconcile/${activityId}`),
  getTemporalProgress: (activityId: number) => fetchApi(`/progress/temporal/${activityId}`),
  verifyProgress: (data: any) => fetchApi("/progress/verify", { method: "POST", body: JSON.stringify(data) }),

  // Risks & Delays
  getRisks: (projectId: number) => fetchApi(`/risks?project_id=${projectId}`),

  // Contractors & Materials
  getContractors: () => fetchApi("/contractors"),
  getMaterials: (projectId: number) => fetchApi(`/materials?project_id=${projectId}`),
  getSafetyEvents: (projectId: number) => fetchApi(`/safety?project_id=${projectId}`),

  // Reports
  getReports: (projectId: number) => fetchApi(`/reports?project_id=${projectId}`),
  generateReport: (projectId: number) => fetchApi(`/reports/generate/${projectId}`, { method: "POST" }),

  // Assistant
  queryAssistant: (projectId: number, query: string) =>
    fetchApi("/assistant/query", { method: "POST", body: JSON.stringify({ project_id: projectId, query }) }),
};
