"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Camera,
  Activity,
  Bot,
  BarChart3,
} from "lucide-react";
import { api } from "@/lib/api";

/* ─── Metric Card ─── */
function MetricCard({
  label,
  value,
  sub,
  color,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: "amber" | "emerald" | "rose" | "muted";
  trend?: "up" | "down" | "neutral";
  icon?: React.ElementType;
}) {
  const valueColor: Record<string, string> = {
    amber: "var(--amber-400)",
    emerald: "var(--emerald-400)",
    rose: "var(--rose-400)",
    muted: "var(--ink)",
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--ink-subtle)", textTransform: "none", letterSpacing: "normal" }}
        >
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4" style={{ color: "var(--ink-subtle)" }} />}
      </div>
      <div className="text-2xl font-bold mt-1.5" style={{ color: valueColor[color] }}>
        {value}
      </div>
      <div
        className="flex items-center gap-1 mt-1"
        style={{ color: trend === "down" ? "var(--rose-400)" : trend === "up" ? "var(--emerald-400)" : "var(--ink-subtle)" }}
      >
        {trend === "down" && <TrendingDown className="w-3 h-3" />}
        {trend === "up" && <TrendingUp className="w-3 h-3" />}
        <span className="text-[11px]">{sub}</span>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function RiskBadge({ status }: { status: string }) {
  if (status === "CRITICAL")
    return (
      <span className="badge badge-critical">
        <span className="w-1.5 h-1.5 rounded-full bg-current" /> Critical delay
      </span>
    );
  if (status === "AT RISK")
    return (
      <span className="badge badge-risk">
        <span className="w-1.5 h-1.5 rounded-full bg-current" /> At risk
      </span>
    );
  return (
    <span className="badge badge-ok">
      <span className="w-1.5 h-1.5 rounded-full bg-current" /> On track
    </span>
  );
}

/* ─── Mini Progress Bar ─── */
function MiniProgress({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="progress-track flex-1" style={{ height: "5px" }}>
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-semibold tabular-nums w-9 text-right" style={{ color: "var(--ink)" }}>
        {pct}%
      </span>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const tableProjects = [
    { id: 1, name: "Hyderabad Tower A", location: "HITEC City", reconciled: 67.5, planned: 72.0, status: "CRITICAL" },
    { id: 2, name: "Hyderabad Tower B", location: "Financial District", reconciled: 72.0, planned: 73.0, status: "ON TRACK" },
    { id: 3, name: "Kondapur Residential Proj.", location: "Kondapur", reconciled: 41.0, planned: 47.0, status: "AT RISK" },
    { id: 4, name: "Gachibowli Villa Project", location: "Gachibowli", reconciled: 55.0, planned: 55.5, status: "ON TRACK" },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* ── Page Header ── */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--emerald-400)" }} />
              <span className="text-[11px] font-medium" style={{ color: "var(--ink-subtle)" }}>
                Reconciled with site photos as of {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST, {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>
            <h1 className="page-title">Portfolio overview</h1>
            <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>
              Project schedules, site evidence, and material logs — Hyderabad Infrastructure Ltd
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/reports" className="btn btn-secondary" style={{ fontSize: "12px" }}>
              <BarChart3 className="w-3.5 h-3.5" />
              Daily report
            </Link>
            <Link href="/assistant" className="btn btn-primary" style={{ fontSize: "12px" }}>
              <Bot className="w-3.5 h-3.5" />
              Ask assistant
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard label="Total projects" value="4" sub="Telangana region" color="muted" icon={Building2} />
        <MetricCard label="On track" value="2" sub="Within schedule" color="emerald" icon={CheckCircle2} trend="up" />
        <MetricCard label="At risk" value="1" sub="Emerging lag" color="amber" icon={Clock} />
        <MetricCard label="Critically delayed" value="1" sub="Tower A, Floor 8" color="rose" icon={AlertTriangle} trend="down" />
        <MetricCard label="Avg. progress" value="67.5%" sub="Verified from photos" color="muted" icon={Activity} />
        <MetricCard label="Schedule variance" value="-4.5%" sub="Behind baseline" color="rose" icon={TrendingDown} trend="down" />
        <MetricCard label="High-risk activities" value="17" sub="Downstream bottlenecks" color="amber" icon={ShieldAlert} />
      </div>

      {/* ── Projects Table ── */}
      <div className="card">
        <div className="section-header px-5 pt-5 mb-0" style={{ borderBottom: "none", paddingBottom: "12px" }}>
          <div className="section-title">
            <Building2 className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Active projects
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-[12px] font-medium transition-colors"
            style={{ color: "var(--ink-subtle)" }}
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr style={{ textTransform: "none", letterSpacing: "normal" } as React.CSSProperties}>
                <th className="text-left pl-5" style={{ textTransform: "none", letterSpacing: "normal" }}>Project</th>
                <th className="text-left" style={{ textTransform: "none", letterSpacing: "normal" }}>Location</th>
                <th className="text-right" style={{ textTransform: "none", letterSpacing: "normal" }}>Reconciled</th>
                <th className="text-right" style={{ textTransform: "none", letterSpacing: "normal" }}>Planned</th>
                <th style={{ textTransform: "none", letterSpacing: "normal" }}>Progress</th>
                <th className="text-right" style={{ textTransform: "none", letterSpacing: "normal" }}>Variance</th>
                <th className="text-center" style={{ textTransform: "none", letterSpacing: "normal" }}>Status</th>
                <th className="text-right pr-5" style={{ textTransform: "none", letterSpacing: "normal" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableProjects.map((p) => {
                const variance = +(p.reconciled - p.planned).toFixed(1);
                const progressColor =
                  p.status === "CRITICAL" ? "progress-rose" : p.status === "AT RISK" ? "progress-amber" : "progress-emerald";

                return (
                  <tr key={p.id}>
                    <td className="pl-5">
                      <span className="font-semibold text-[13px]" style={{ color: "var(--ink)" }}>
                        {p.name}
                      </span>
                    </td>
                    <td style={{ color: "var(--ink-subtle)", fontSize: "12px" }}>{p.location}</td>
                    <td className="text-right">
                      <span className="font-semibold text-[13px]" style={{ color: "var(--ink)" }}>
                        {p.reconciled}%
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-[13px]" style={{ color: "var(--ink-muted)" }}>
                        {p.planned}%
                      </span>
                    </td>
                    <td className="w-32">
                      <MiniProgress pct={p.reconciled} color={progressColor} />
                    </td>
                    <td className="text-right">
                      <span
                        className="font-semibold text-[13px]"
                        style={{ color: variance >= 0 ? "var(--emerald-400)" : "var(--rose-400)" }}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance}%
                      </span>
                    </td>
                    <td className="text-center">
                      <RiskBadge status={p.status} />
                    </td>
                    <td className="text-right pr-5">
                      <Link
                        href={`/projects/${p.id}`}
                        className="btn btn-ghost text-[11.5px] font-semibold"
                        style={{ padding: "5px 10px", color: "var(--amber-400)" }}
                      >
                        Inspect
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Feed Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent site photos */}
        <div className="card p-5">
          <div className="section-header" style={{ marginBottom: "8px" }}>
            <div className="section-title">
              <Camera className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
              Recent site photos
            </div>
          </div>

          <div className="space-y-0">
            {[
              { zone: "Floor 8, Zone A — Blockwork", confidence: 89, pct: 79, uploader: "Ramesh Kumar", time: "2h ago", dot: "warn" },
              { zone: "Floor 7 — Electrical conduit", confidence: 91, pct: 87, uploader: "Ramesh Kumar", time: "5h ago", dot: "ok" },
              { zone: "Floor 9 — RCC slab casting", confidence: 95, pct: 98, uploader: "Suresh Varma", time: "1d ago", dot: "ok" },
            ].map((obs, i) => (
              <div key={i} className="feed-item">
                <div className={`feed-dot feed-dot-${obs.dot} mt-1`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
                      {obs.zone}
                    </span>
                    <span className="badge badge-ok flex-shrink-0">{obs.confidence}% match</span>
                  </div>
                  <div className="mt-1">
                    <MiniProgress pct={obs.pct} color="progress-amber" />
                  </div>
                  <span className="text-[11px] mt-1 block" style={{ color: "var(--ink-subtle)" }}>
                    {obs.uploader} · {obs.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="card p-5">
          <div className="section-header" style={{ marginBottom: "8px" }}>
            <div className="section-title">
              <ShieldAlert className="w-4 h-4" style={{ color: "var(--rose-400)" }} />
              Alerts
            </div>
            <span className="text-[11px] font-medium" style={{ color: "var(--ink-subtle)" }}>
              3 need action
            </span>
          </div>

          <div className="space-y-0">
            <div className="feed-item">
              <div className="feed-dot feed-dot-critical mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
                    High delay risk — Floor 8 blockwork
                  </span>
                  <span className="badge badge-critical flex-shrink-0">9 days</span>
                </div>
                <p className="text-[12px] mt-1" style={{ color: "var(--ink-muted)" }}>
                  Predicted downstream impact: 14 days on electrical and plastering.
                </p>
                <div className="mt-1.5 text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                  Root cause: <span style={{ color: "var(--ink)", fontWeight: 600 }}>Manpower shortage (34%)</span>
                </div>
              </div>
            </div>

            <div className="feed-item">
              <div className="feed-dot feed-dot-warn mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
                    Material variance — Ultratech OPC cement
                  </span>
                  <span className="badge badge-risk flex-shrink-0">+11%</span>
                </div>
                <p className="text-[12px] mt-1" style={{ color: "var(--ink-muted)" }}>
                  1,110 bags consumed vs. 1,000 planned. Flagged for review.
                </p>
              </div>
            </div>

            <div className="feed-item" style={{ borderBottom: "none" }}>
              <div className="feed-dot feed-dot-warn mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
                    PPE violation — Floor 8, Zone A
                  </span>
                  <span className="badge badge-risk flex-shrink-0">1 worker</span>
                </div>
                <p className="text-[12px] mt-1" style={{ color: "var(--ink-muted)" }}>
                  Site photo shows one worker without a safety helmet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
