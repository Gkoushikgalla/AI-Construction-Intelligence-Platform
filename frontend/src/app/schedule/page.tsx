"use client";

import React, { useState } from "react";
import { CalendarDays, FileSpreadsheet, Layers, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ScheduleImporter } from "@/components/ScheduleImporter";

export default function SchedulePage() {
  const [activeVersion, setActiveVersion] = useState(1);

  const activities = [
    { id: 1, name: "Floor 8 Blockwork Masonry", start: "Sep 01", end: "Sep 07", planned: 91, reported: 82, ai: 79, status: "Delayed", contractor: "XYZ Civil" },
    { id: 2, name: "Floor 7 Electrical PVC Conduit", start: "Sep 02", end: "Sep 08", planned: 85, reported: 88, ai: 87, status: "On Track", contractor: "Apex Electricals" },
    { id: 3, name: "Floor 8 Internal Plastering", start: "Sep 08", end: "Sep 14", planned: 60, reported: 45, ai: 42, status: "At Risk", contractor: "Telangana Plastering" },
    { id: 4, name: "Floor 9 Concrete Slab Casting", start: "Aug 20", end: "Aug 30", planned: 100, reported: 100, ai: 98, status: "Completed", contractor: "XYZ Civil" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-cyan-400" /> Construction Schedule Manager
          </h1>
          <p className="text-xs text-slate-400">Imported Schedule Versions & Gantt Dependency Visualizer</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Active Version:</span>
          <span className="text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg">
            Schedule v1.2 (Latest Revision)
          </span>
        </div>
      </div>

      {/* Excel/CSV Schedule Importer */}
      <ScheduleImporter projectId={1} />

      {/* Gantt Timeline View */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Activity Timeline & Planned vs Reported vs AI Progress
          </h2>
          <span className="text-xs text-slate-400 font-mono">September 2026 Baseline</span>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{act.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {act.contractor}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block font-mono mt-0.5">
                    Planned: {act.start} – {act.end}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Planned Baseline</span>
                    <span className="font-bold text-slate-200">{act.planned}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Engineer Reported</span>
                    <span className="font-bold text-slate-300">{act.reported}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">AI Visual Estimate</span>
                    <span className="font-bold text-cyan-300">{act.ai}%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Progress Bar comparison */}
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
                  {/* Planned Baseline Marker */}
                  <div className="absolute top-0 bottom-0 bg-slate-700/60" style={{ width: `${act.planned}%` }}></div>
                  {/* AI Progress Overlay */}
                  <div
                    className={`h-full relative z-10 transition-all ${
                      act.status === "Delayed"
                        ? "bg-rose-500"
                        : act.status === "At Risk"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${act.ai}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
