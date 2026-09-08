"use client";

import React from "react";
import { Layers, Sparkles, CheckCircle2, FileText, Scale, Eye, Zap } from "lucide-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

/* Weight source pill */
function WeightPill({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div
      className="flex-1 p-3 rounded-xl text-center"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <span className="text-[10.5px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--ink-subtle)" }}>
        {label}
      </span>
      <span
        className="font-display text-[22px] font-bold block"
        style={{ color, letterSpacing: "-0.04em" }}
      >
        {pct}%
      </span>
    </div>
  );
}

/* Three-way comparison card */
function TripleCard({
  label, value, sub, accent, highlight = false
}: { label: string; value: string; sub: string; accent?: boolean; highlight?: boolean }) {
  return (
    <div
      className="p-4 rounded-xl space-y-1.5"
      style={{
        background: highlight ? "rgba(245,158,11,0.06)" : "var(--surface-2)",
        border: `1px solid ${highlight ? "rgba(245,158,11,0.22)" : "var(--border)"}`
      }}
    >
      <span
        className="text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5"
        style={{ color: highlight ? "var(--amber-400)" : "var(--ink-subtle)" }}
      >
        {highlight && <Sparkles className="w-3 h-3" />}
        {label}
      </span>
      <span
        className="font-display text-[30px] font-black block"
        style={{ color: highlight ? "var(--amber-300)" : "var(--ink)", letterSpacing: "-0.04em" }}
      >
        {value}
      </span>
      <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{sub}</span>
    </div>
  );
}

export default function TruthLayerProgressPage() {
  return (
    <div className="space-y-5 pb-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
            >
              <Layers className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            </div>
            <h1 className="page-title">Construction Truth Layer Engine</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            Objective progress reconciliation across project schedules, site evidence, and engineer reports.
          </p>
        </div>

        <div className="flex-shrink-0">
          <span className="truth-pill">
            <Zap className="w-3 h-3" />
            Visual Weight: 50% · Engineer: 35% · Schedule: 15%
          </span>
        </div>
      </div>

      {/* ── Reconciled Truth Card ── */}
      <div
        className="card animate-fade-up"
        style={{
          animationDelay: "100ms",
          borderColor: "rgba(245,158,11,0.20)",
          background: "linear-gradient(135deg, var(--surface-1), rgba(245,158,11,0.02))"
        }}
      >
        {/* Activity ID + Title row */}
        <div
          className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono-sm px-2 py-1 rounded" style={{ background: "var(--surface-2)", color: "var(--amber-400)", border: "1px solid var(--border)" }}>
                ACT-801 · Tower A Main Tower
              </span>
              <span className="badge badge-critical">
                −12% Behind Schedule
              </span>
            </div>
            <h2
              className="text-[18px] font-bold"
              style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
            >
              Floor 8 Blockwork Masonry Installation
            </h2>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>
              Contractor: XYZ Civil Contractors · Zone A (North Wing)
            </p>
          </div>

          {/* Reconciled score */}
          <div
            className="text-center p-4 rounded-xl min-w-[160px]"
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.22)"
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--ink-subtle)" }}>
              Reconciled Truth
            </span>
            <span
              className="font-display text-[36px] font-black block animate-count-up"
              style={{ color: "var(--emerald-400)", letterSpacing: "-0.04em" }}
            >
              80.0%
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--emerald-400)" }} />
              <span className="text-[11px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                Confidence: <span style={{ color: "var(--amber-400)" }}>87%</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="progress-track mt-2" style={{ height: "5px" }}>
              <div className="progress-fill progress-emerald" style={{ width: "80%" }} />
            </div>
          </div>
        </div>

        {/* Three-way comparison */}
        <div className="p-5 space-y-4">
          <h3 className="section-title">
            <Scale className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            3-Way Evidence Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TripleCard
              label="1. Planned Schedule Baseline"
              value="91.0%"
              sub="Imported Schedule v1.2"
            />
            <TripleCard
              label="2. Site Engineer Reported"
              value="82.0%"
              sub="Reported by Ramesh Kumar"
            />
            <TripleCard
              label="3. AI Visual Estimate"
              value="79.0%"
              highlight
              sub="YOLOv8x Bounding Box Inspection"
              accent
            />
          </div>

          {/* Weights visual */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <p className="text-[11px] font-semibold mb-3" style={{ color: "var(--ink-subtle)" }}>
              Truth Layer Evidence Weighting (High-Quality Evidence Mode)
            </p>
            <div className="flex gap-3">
              <WeightPill label="AI Visual"       pct={50} color="var(--amber-300)" />
              <WeightPill label="Engineer Report" pct={35} color="var(--blue-300)" />
              <WeightPill label="Schedule Plan"   pct={15} color="var(--ink-muted)" />
            </div>

            {/* Stacked progress bar */}
            <div className="relative h-2 mt-3 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
              <div
                className="absolute top-0 left-0 h-full rounded-l-full"
                style={{ width: "50%", background: "var(--amber-500)" }}
              />
              <div
                className="absolute top-0 h-full"
                style={{ left: "50%", width: "35%", background: "var(--blue-500)" }}
              />
              <div
                className="absolute top-0 h-full rounded-r-full"
                style={{ left: "85%", width: "15%", background: "var(--ink-faint)" }}
              />
            </div>
          </div>
        </div>

        {/* Evidence ledger */}
        <div
          className="p-5"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <h3 className="section-title mb-3">
            <FileText className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Evidence Ledger — Why AI & Truth Layer Reconciled to 80.0%?
          </h3>

          <div
            className="p-4 rounded-xl space-y-3"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              The Truth Layer evaluated{" "}
              <strong style={{ color: "var(--ink)" }}>7 photographs</strong> and{" "}
              <strong style={{ color: "var(--ink)" }}>2 site videos</strong> uploaded between Sept 01–06.
              Average evidence quality:{" "}
              <strong style={{ color: "var(--emerald-400)" }}>93% Pristine</strong> with{" "}
              <strong style={{ color: "var(--amber-300)" }}>89% computer vision confidence</strong>.
            </p>

            <div className="divider my-0" />

            <ul className="space-y-2.5">
              {[
                {
                  icon: Eye,
                  label: "Visual Observation",
                  detail: "18 partition wall sections detected. 15 complete, 3 sections active."
                },
                {
                  icon: Scale,
                  label: "Reconciliation Weighting",
                  detail: "High evidence quality triggered 50% AI Visual + 35% Engineer + 15% Schedule weighting."
                },
                {
                  icon: CheckCircle2,
                  label: "Manpower Audit",
                  detail: "4 masons present vs 8 required by schedule baseline — confirmed shortage."
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.18)" }}
                  >
                    <item.icon className="w-3 h-3" style={{ color: "var(--amber-400)" }} />
                  </div>
                  <div>
                    <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
                      {item.label}:{" "}
                    </span>
                    <span className="text-[12.5px]" style={{ color: "var(--ink-muted)" }}>
                      {item.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Temporal Comparison ── */}
      <div className="card animate-fade-up" style={{ animationDelay: "350ms" }}>
        <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 className="section-title">
            <Sparkles className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Temporal Progress Comparison — Before vs After
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-muted)" }}>
            Drag the slider to compare site conditions at different time points.
          </p>
        </div>
        <div className="p-5">
          <BeforeAfterSlider />
        </div>
      </div>
    </div>
  );
}
