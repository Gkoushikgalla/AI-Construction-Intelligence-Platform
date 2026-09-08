"use client";

import React from "react";
import { FileText, Sparkles, Printer, CheckCircle2, AlertTriangle, Calendar, Download, TrendingDown, Zap } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
            >
              <FileText className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            </div>
            <h1 className="page-title">Daily AI Site Intelligence Reports</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            Auto-generated executive daily monitoring & action summaries
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => window.print()}
            className="btn btn-secondary text-[12px]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
          <button className="btn btn-primary text-[12px]">
            <Sparkles className="w-3.5 h-3.5" />
            Generate Today's Report
          </button>
        </div>
      </div>

      {/* ── Report Document ── */}
      <div
        className="card animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {/* Report header */}
        <div
          className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="truth-pill">
                <Zap className="w-3 h-3" />
                DAILY SITE INTELLIGENCE REPORT
              </span>
              <span
                className="font-mono-sm px-2 py-0.5 rounded"
                style={{ background: "var(--surface-2)", color: "var(--ink-subtle)", border: "1px solid var(--border)" }}
              >
                RPT-2026-0908
              </span>
            </div>
            <h2 className="text-[18px] font-bold" style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}>
              Hyderabad Tower A
            </h2>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>
              HITEC City, Hyderabad, Telangana
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5" style={{ color: "var(--amber-400)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                08 September 2026
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-1.5">
              <span className="live-dot" />
              <span className="text-[11.5px] font-semibold" style={{ color: "var(--emerald-400)" }}>
                Verified Truth Layer
              </span>
            </div>
          </div>
        </div>

        {/* KPI metrics */}
        <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Reconciled Progress", value: "67.5%", color: "var(--amber-300)" },
              { label: "Planned Baseline",     value: "72.0%", color: "var(--ink)" },
              { label: "Schedule Variance",    value: "−4.5%", color: "var(--rose-400)" },
            ].map((m, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl"
                style={{
                  background: "var(--surface-2)",
                  border: `1px solid ${m.label === "Schedule Variance" ? "rgba(244,63,94,0.22)" : "var(--border)"}`,
                }}
              >
                <span className="stat-label text-[10px]">{m.label}</span>
                <span
                  className="font-display text-[26px] font-black block mt-1"
                  style={{ color: m.color, letterSpacing: "-0.04em" }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Activities */}
        <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 className="section-title mb-4">
            <CheckCircle2 className="w-4 h-4" style={{ color: "var(--emerald-400)" }} />
            Activities Completed Today
          </h3>
          <div className="space-y-2">
            {[
              "Floor 7 Blockwork Masonry — Zone A (Completed & Cured)",
              "Floor 6 Electrical PVC Conduit Trunking (Verified by Site Engineer)",
              "Basement 2 Plumbing Drain Lines Connection"
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border-subtle)" }}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--emerald-400)" }} />
                <span className="text-[12.5px]" style={{ color: "var(--ink)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delayed Activities */}
        <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 className="section-title mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--rose-400)" }} />
            Delayed Activities & Downstream Impact
          </h3>
          <div
            className="p-4 rounded-xl space-y-2"
            style={{
              background: "rgba(244,63,94,0.04)",
              border: "1px solid rgba(244,63,94,0.20)"
            }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--rose-400)" }} />
              <span className="text-[13px] font-bold" style={{ color: "var(--rose-400)" }}>
                Floor 8 Blockwork Masonry — 9 Days Behind Schedule
              </span>
            </div>
            <p className="text-[12.5px] ml-6" style={{ color: "var(--ink-muted)" }}>
              Downstream delay propagation: Plastering and electrical finishing pushed by 14 days.
            </p>
            <div className="text-[12px] ml-6 flex flex-wrap gap-1.5 mt-1">
              <span>Root Causes:</span>
              <span className="badge badge-risk">Manpower Deficit 34%</span>
              <span className="badge badge-risk">AAC Block Delivery Lag 27%</span>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="p-5">
          <h3 className="section-title mb-4">
            <Sparkles className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Recommended Management Actions
          </h3>
          <div className="space-y-2">
            {[
              "Deploy 4 additional blockwork masons to Tower A Floor 8 immediately to restore progress velocity.",
              "Expedite AAC Block receipt from Godrej Construction Materials supplier — escalate to procurement.",
              "Conduct safety toolbox talk regarding elevator shaft hardhat compliance on Floor 8."
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "var(--amber-400)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[12.5px]" style={{ color: "var(--ink)" }}>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
