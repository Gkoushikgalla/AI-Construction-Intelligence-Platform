"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Calendar, Plus, ChevronRight, Layers, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" /> Construction Projects Directory
          </h1>
          <p className="text-xs text-slate-400">Organization: Hyderabad Infrastructure Ltd</p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create New Construction Project</span>
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-slate-400 py-12 text-center">Loading construction projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isDelayed = proj.name.includes("Tower A");
            const isAtRisk = proj.name.includes("Kondapur");

            return (
              <div key={proj.id} className="glass-panel p-6 space-y-4 hover:border-cyan-500/40 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                      {proj.project_type || "Commercial / High-Rise"}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      {proj.name}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{proj.description}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      isDelayed
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : isAtRisk
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {isDelayed ? "🔴 CRITICAL DELAY" : isAtRisk ? "🟠 AT RISK" : "🟢 ON TRACK"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{proj.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target: {proj.target_completion_date || "2026-12-20"}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Reconciled Progress:</span>
                    <span className="text-cyan-300">{proj.avg_progress || (isDelayed ? 67.5 : 72.0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isDelayed ? "bg-rose-500" : isAtRisk ? "bg-amber-500" : "bg-gradient-to-r from-cyan-500 to-emerald-400"
                      }`}
                      style={{ width: `${proj.avg_progress || (isDelayed ? 67.5 : 72.0)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    {proj.building_count || 2} Buildings | {proj.activity_count || 4} Active Activities
                  </span>

                  <Link
                    href={`/projects/${proj.id}`}
                    className="text-xs bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 font-semibold px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center space-x-1 transition-colors"
                  >
                    <span>View Spatial Hierarchy</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
