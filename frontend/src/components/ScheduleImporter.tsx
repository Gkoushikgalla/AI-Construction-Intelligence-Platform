"use client";

import React, { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export function ScheduleImporter({
  projectId,
  onImportSuccess,
}: {
  projectId: number;
  onImportSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("project_id", projectId.toString());
    formData.append("file", file);

    try {
      const res = await api.importSchedule(formData);
      setMessage(`Imported ${res.imported_count} activities as schedule version v${res.schedule_version}.`);
      setFile(null);
      if (onImportSuccess) onImportSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to import schedule file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      <div>
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--ink)" }}>
          <FileSpreadsheet className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
          Import schedule
        </h3>
        <span className="text-xs" style={{ color: "var(--ink-subtle)" }}>
          Supports Excel (.xlsx) and CSV exports from MS Project or Primavera
        </span>
      </div>

      <div
        className="rounded-xl p-6 text-center cursor-pointer transition-colors"
        style={{ border: "2px dashed var(--border)", background: "var(--surface-1)" }}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="schedule-file-input"
        />
        <label htmlFor="schedule-file-input" className="cursor-pointer flex flex-col items-center space-y-2">
          <Upload className="w-7 h-7" style={{ color: "var(--ink-subtle)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
            {file ? file.name : "Click or drag a schedule file here"}
          </span>
          <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
            Up to 25MB
          </span>
        </label>
      </div>

      {error && (
        <div
          className="p-3 text-xs rounded-lg flex items-center gap-2"
          style={{ background: "rgba(244,63,94,0.08)", border: "1px solid var(--border)", color: "var(--rose-400)" }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          className="p-3 text-xs rounded-lg flex items-center gap-2"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid var(--border)", color: "var(--emerald-400)" }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn w-full justify-center"
        style={
          file && !loading
            ? { background: "var(--amber-500)", color: "#0a0c10", fontWeight: 600 }
            : { background: "var(--surface-2)", color: "var(--ink-subtle)", cursor: "not-allowed" }
        }
      >
        {loading ? "Importing..." : "Import schedule"}
      </button>
    </div>
  );
}
