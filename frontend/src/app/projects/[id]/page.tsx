"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  Plus
} from "lucide-react";
import { api } from "@/lib/api";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params?.id || 1);

  const [project, setProject] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const pData = await api.getProject(projectId);
        const aData = await api.getActivities(projectId);
        setProject(pData);
        setActivities(aData);
      } catch (err) {
        console.error("Failed to fetch project detail", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [projectId]);

  if (loading) {
    return <div className="text-xs text-slate-400 py-12 text-center">Loading spatial project hierarchy...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <span className="text-slate-300 font-semibold">Hyderabad Infrastructure Ltd</span>
        <span>/</span>
        <Link href="/projects" className="hover:text-cyan-300">Projects</Link>
        <span>/</span>
        <span className="text-cyan-400 font-bold">{project?.name || "Hyderabad Tower A"}</span>
      </div>

      {/* Project Banner Header */}
      <div className="glass-panel p-6 space-y-4 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-cyan-500/20 text-cyan-400 font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {project?.project_type || "32-Story Residential Tower"}
              </span>
              <span className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                🔴 CRITICAL SCHEDULE DELAY
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{project?.name || "Hyderabad Tower A"}</h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">{project?.description}</p>
          </div>

          <div className="flex space-x-2">
            <Link
              href="/schedule"
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Gantt Schedule</span>
            </Link>
            <Link
              href="/evidence"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Inspect Site Evidence</span>
            </Link>
          </div>
        </div>

        {/* Spatial Hierarchy Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
            <span className="font-semibold text-slate-200">{project?.location}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Manager</span>
            <span className="font-semibold text-cyan-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Suresh Varma
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
            <span className="font-semibold text-slate-200">{project?.start_date || "2026-01-10"}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Completion</span>
            <span className="font-semibold text-slate-200">{project?.target_completion_date || "2026-12-20"}</span>
          </div>
        </div>
      </div>

      {/* Buildings, Floors, Zones & Activity Hierarchy Cards */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Spatial Breakdown: Building → Floor → Zone → Activities
            </h2>
            <span className="text-xs text-slate-400">Select activities to inspect Truth Layer evidence ledger</span>
          </div>

          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Activity
          </button>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">ACTIVITY & LOCATION</th>
                <th className="py-3 px-3">CONTRACTOR</th>
                <th className="py-3 px-3">PLANNED DATES</th>
                <th className="py-3 px-3 text-right">REPORTED</th>
                <th className="py-3 px-3 text-right">AI VISUAL</th>
                <th className="py-3 px-3 text-right">RECONCILED</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-center">TRUTH LEDGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {activities.map((act) => {
                const isDelayed = act.status === "Delayed" || act.name.includes("Blockwork");
                const isCompleted = act.reported_progress >= 95;

                return (
                  <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-white block">{act.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        Tower A Main Tower • Floor 8 • Zone A
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      XYZ Civil Contractors
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                      {act.planned_start || "01 Sep"} – {act.planned_end || "07 Sep"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-300">{act.reported_progress}%</td>
                    <td className="py-3.5 px-3 text-right font-semibold text-cyan-300">
                      {act.ai_estimated_progress || 79.0}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      {isCompleted ? "99.0%" : "80.0%"}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDelayed
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : isCompleted
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Link
                        href={`/progress?activity_id=${act.id}`}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        Why AI says {act.ai_estimated_progress || 79}%?
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
