"use client";

import React from "react";
import { Users, Award, ShieldCheck, Clock, TrendingUp, AlertTriangle } from "lucide-react";

const contractors = [
  {
    name: "XYZ Civil Contractors",
    trade: "Civil & Masonry",
    adherence: 82,
    productivity: 76,
    quality: 91,
    safety: 88,
    overall: 82,
    status: "Needs Monitoring",
    statusColor: "amber" as const,
    initials: "XYZ"
  },
  {
    name: "Apex Electricals & MEP Services",
    trade: "Electrical & Plumbing",
    adherence: 91,
    productivity: 88,
    quality: 94,
    safety: 92,
    overall: 91,
    status: "High Performing",
    statusColor: "emerald" as const,
    initials: "APX"
  },
  {
    name: "Telangana Plastering & Finishes",
    trade: "Internal & External Plastering",
    adherence: 85,
    productivity: 82,
    quality: 89,
    safety: 90,
    overall: 86,
    status: "Satisfactory",
    statusColor: "blue" as const,
    initials: "TPF"
  }
];

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span style={{ color: "var(--ink-subtle)" }}>{label}</span>
        <span className="font-bold" style={{ color: "var(--ink)" }}>{value}%</span>
      </div>
      <div className="progress-track" style={{ height: "4px" }}>
        <div
          className="progress-fill"
          style={{
            width: `${value}%`,
            background: value >= 90 ? "var(--emerald-500)" : value >= 80 ? "var(--amber-400)" : "var(--rose-400)"
          }}
        />
      </div>
    </div>
  );
}

export default function ContractorsPage() {
  const colorMap = {
    amber:   { badge: "badge-risk",     ring: "rgba(245,158,11,0.22)",   border: "rgba(245,158,11,0.15)" },
    emerald: { badge: "badge-ok",       ring: "rgba(16,185,129,0.22)",   border: "rgba(16,185,129,0.15)" },
    blue:    { badge: "badge-ai",       ring: "rgba(59,130,246,0.22)",   border: "rgba(59,130,246,0.15)" },
  };

  return (
    <div className="space-y-5 pb-6">

      {/* ── Header ── */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
          >
            <Users className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
          </div>
          <h1 className="page-title">Contractor Performance Scorecards</h1>
        </div>
        <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
          Schedule adherence, productivity metrics, quality inspections, and safety ratings per contractor.
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contractors.map((c, idx) => {
          const colors = colorMap[c.statusColor];
          return (
            <div
              key={idx}
              className="card p-5 flex flex-col gap-4 animate-fade-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] flex-shrink-0"
                  style={{
                    background: `rgba(245,158,11,0.10)`,
                    border: `1px solid ${colors.border}`,
                    color: "var(--amber-400)"
                  }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[13.5px] font-bold truncate" style={{ color: "var(--ink)" }}>
                    {c.name}
                  </h2>
                  <span
                    className="text-[10.5px] font-semibold"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--ink-subtle)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "inline-block",
                      marginTop: "3px"
                    }}
                  >
                    {c.trade}
                  </span>
                </div>
              </div>

              {/* Overall Score */}
              <div
                className="text-center py-3 rounded-xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <span className="stat-label">Overall Score</span>
                <div
                  className="font-display text-[38px] font-black mt-1"
                  style={{
                    color: c.overall >= 90 ? "var(--emerald-400)" : c.overall >= 80 ? "var(--amber-300)" : "var(--rose-400)",
                    letterSpacing: "-0.05em"
                  }}
                >
                  {c.overall}
                  <span style={{ fontSize: "16px", color: "var(--ink-subtle)", fontWeight: 600 }}>/100</span>
                </div>
                <span className={`badge ${colors.badge} mt-2 inline-flex`}>{c.status}</span>
              </div>

              {/* Score bars */}
              <div className="space-y-2.5">
                <ScoreBar label="Schedule Adherence" value={c.adherence} color="amber" />
                <ScoreBar label="Productivity Rating" value={c.productivity} color="amber" />
                <ScoreBar label="Quality Inspection"  value={c.quality}    color="emerald" />
                <ScoreBar label="Safety PPE Rating"   value={c.safety}     color="emerald" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
