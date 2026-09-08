"use client";

import React, { useState } from "react";
import {
  AlertTriangle, TrendingDown, GitMerge, ShieldAlert,
  Sparkles, CheckCircle2, Brain, ArrowRight, ChevronDown, ChevronUp
} from "lucide-react";

/* Cause classification badge */
function CauseBadge({ type }: { type: "CONFIRMED" | "CALCULATED" | "AI INFERRED" }) {
  const styles = {
    "CONFIRMED":   { bg: "rgba(16,185,129,0.10)",  color: "var(--emerald-400)", border: "rgba(16,185,129,0.22)" },
    "CALCULATED":  { bg: "rgba(59,130,246,0.10)",   color: "var(--blue-300)",    border: "rgba(59,130,246,0.20)" },
    "AI INFERRED": { bg: "rgba(139,92,246,0.10)",   color: "var(--violet-400)",  border: "rgba(139,92,246,0.20)" },
  };
  const s = styles[type];
  return (
    <span
      className="text-[10.5px] px-2.5 py-0.5 rounded-full font-bold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: "0.02em" }}
    >
      {type}
    </span>
  );
}

/* Root Cause Bar */
function CauseBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="progress-track" style={{ height: "4px" }}>
      <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* Propagation node */
function PropNode({
  label, days, severity, arrow
}: { label: string; days: string; severity: "critical" | "warn" | "neutral"; arrow?: boolean }) {
  const sev = {
    critical: { border: "rgba(244,63,94,0.35)", bg: "rgba(244,63,94,0.06)", color: "var(--rose-400)" },
    warn:     { border: "rgba(245,158,11,0.30)", bg: "rgba(245,158,11,0.06)", color: "var(--amber-400)" },
    neutral:  { border: "var(--border)",          bg: "var(--surface-1)",     color: "var(--ink-muted)" },
  };
  const s = sev[severity];

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        className="w-full p-3 rounded-xl text-center"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <span className="text-[12px] font-bold block" style={{ color: "var(--ink)" }}>{label}</span>
        <span className="text-[11px] font-semibold" style={{ color: s.color }}>{days}</span>
      </div>
      {arrow && (
        <div className="hidden md:flex items-center absolute" style={{ right: "-14px", top: "50%", transform: "translateY(-50%)" }}>
          <ArrowRight className="w-4 h-4" style={{ color: "var(--ink-faint)" }} />
        </div>
      )}
    </div>
  );
}

export default function RisksPage() {
  const [expanded, setExpanded] = useState(true);

  const causes = [
    {
      rank: 1,
      title: "Blockwork Manpower Shortage",
      pct: 34,
      type: "CONFIRMED" as const,
      color: "progress-emerald",
      detail: "Site attendance log and AI visual worker count verified 4 masons present vs 8 planned baseline.",
      icon: ShieldAlert
    },
    {
      rank: 2,
      title: "AAC Block Material Delivery Lag",
      pct: 27,
      type: "CONFIRMED" as const,
      color: "progress-blue",
      detail: "Delivery receipt #MAT-8842 confirmed AAC block batch arrived 2.5 days after scheduled start.",
      icon: TrendingDown
    },
    {
      rank: 3,
      title: "Preceding Electrical Activity Lag",
      pct: 21,
      type: "CALCULATED" as const,
      color: "progress-amber",
      detail: "Dependency network analysis calculated 2-day handoff delay from electrical conduit embedment.",
      icon: GitMerge
    },
    {
      rank: 4,
      title: "Contractor Productivity Decline",
      pct: 12,
      type: "AI INFERRED" as const,
      color: "progress-rose",
      detail: "AI velocity engine inferred 8% productivity drop compared to contractor baseline performance.",
      icon: Brain
    },
    {
      rank: 5,
      title: "Residual / Unclassified",
      pct: 6,
      type: "CALCULATED" as const,
      color: "progress-rose",
      detail: "Remaining variance unattributed to above causes.",
      icon: Sparkles
    },
  ];

  return (
    <div className="space-y-5 pb-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.22)" }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: "var(--rose-400)" }} />
            </div>
            <h1 className="page-title">Risks, Delays & Root Cause Analysis</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            Downstream delay propagation and root cause decomposition with strict fact classification.
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0 flex-wrap">
          <span
            className="badge badge-critical text-[11px]"
            style={{ padding: "6px 12px", borderRadius: "8px" }}
          >
            <AlertTriangle className="w-3 h-3" />
            1 HIGH RISK
          </span>
          <span
            className="badge badge-risk text-[11px]"
            style={{ padding: "6px 12px", borderRadius: "8px" }}
          >
            14 Days Downstream
          </span>
        </div>
      </div>

      {/* ── Primary Risk Card ── */}
      <div
        className="card animate-fade-up"
        style={{
          animationDelay: "100ms",
          borderColor: "rgba(244,63,94,0.25)",
          background: "linear-gradient(135deg, var(--surface-1), rgba(120,11,11,0.04))"
        }}
      >
        {/* Card header */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-critical">
                <AlertTriangle className="w-3 h-3" /> HIGH RISK · 78% Probability
              </span>
              <span className="font-mono-sm px-2 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-subtle)" }}>
                ACT-801
              </span>
            </div>
            <h2
              className="text-[18px] font-bold"
              style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
            >
              Tower A — Floor 8 Blockwork Masonry Delay
            </h2>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>
              Current Progress: 80.0% vs Planned 91.0%
            </p>
          </div>

          <div className="flex gap-3">
            <div
              className="text-center p-4 rounded-xl min-w-[90px]"
              style={{ background: "var(--canvas)", border: "1px solid var(--border)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--ink-subtle)" }}>
                Activity
              </span>
              <span
                className="font-display text-[28px]"
                style={{ color: "var(--rose-400)", letterSpacing: "-0.04em" }}
              >
                9d
              </span>
              <span className="text-[10px] block" style={{ color: "var(--rose-400)" }}>behind</span>
            </div>
            <div
              className="text-center p-4 rounded-xl min-w-[90px]"
              style={{
                background: "rgba(244,63,94,0.06)",
                border: "1px solid rgba(244,63,94,0.25)"
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--ink-subtle)" }}>
                Downstream
              </span>
              <span
                className="font-display text-[28px]"
                style={{ color: "var(--rose-400)", letterSpacing: "-0.04em" }}
              >
                14d
              </span>
              <span className="text-[10px] block" style={{ color: "var(--rose-400)" }}>impact</span>
            </div>
          </div>
        </div>

        {/* Root Cause decomposition */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">
              <Sparkles className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
              Root Cause Decomposition
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn btn-ghost text-[11px]"
              style={{ padding: "4px 8px" }}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>

          {expanded && (
            <div className="space-y-3 animate-fade-up">
              {causes.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl animate-fade-up"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
                        >
                          <Icon className="w-3 h-3" style={{ color: "var(--ink-muted)" }} />
                        </div>
                        <div>
                          <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                            {c.rank}. {c.title}
                          </span>
                          <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-muted)" }}>
                            {c.detail}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <CauseBadge type={c.type} />
                        <span className="font-display text-[18px] font-bold" style={{ color: "var(--amber-300)", letterSpacing: "-0.03em" }}>
                          {c.pct}%
                        </span>
                      </div>
                    </div>
                    <CauseBar pct={c.pct * (100 / 34)} color={c.color} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Propagation tree */}
        <div
          className="p-5"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <h3 className="section-title mb-4">
            <GitMerge className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Downstream Delay Propagation
          </h3>

          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {[
              { label: "Floor 8 Blockwork",      days: "9 Days Behind",  sev: "critical" as const },
              { label: "Floor 8 Plastering",      days: "→ 11 Days Push", sev: "warn" as const },
              { label: "Electrical & Plumbing",   days: "→ 13 Days Push", sev: "warn" as const },
              { label: "Paint & Finishes",        days: "→ 14 Days Push", sev: "neutral" as const },
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div className="flex-1">
                  <PropNode {...node} arrow={i < 3} />
                </div>
                {i < 3 && (
                  <div className="flex items-center justify-center md:w-6 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" style={{ color: "var(--ink-faint)" }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        className="card p-4 animate-fade-up"
        style={{ animationDelay: "400ms" }}
      >
        <h3 className="text-[11.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ink-subtle)" }}>
          Classification Legend
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { type: "CONFIRMED" as const,   desc: "Directly evidenced by logs, receipts, or inspection data" },
            { type: "CALCULATED" as const,  desc: "Derived mathematically from dependency network analysis" },
            { type: "AI INFERRED" as const, desc: "Inferred by AI velocity model — not directly confirmed" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CauseBadge type={item.type} />
              <p className="text-[11.5px]" style={{ color: "var(--ink-subtle)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
