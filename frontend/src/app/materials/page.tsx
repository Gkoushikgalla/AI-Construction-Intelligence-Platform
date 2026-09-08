"use client";

import React from "react";
import { PackageCheck, AlertTriangle, CheckCircle2, Truck, Box, TrendingUp, TrendingDown } from "lucide-react";

const materials = [
  {
    material: "Ultratech OPC Cement Bags",
    ordered: 1200,
    received: 1200,
    consumed: 1110,
    expected: 1000,
    unit: "bags",
    supplier: "Ultratech Hyderabad Depot",
    variance: "+11.0%",
    isAlert: true,
    status: "Review Required",
  },
  {
    material: "AAC Masonry Blocks (600×200×150mm)",
    ordered: 5000,
    received: 4200,
    consumed: 3800,
    expected: 4000,
    unit: "units",
    supplier: "Godrej Construction Materials",
    variance: "−5.0%",
    isAlert: false,
    status: "Normal",
  },
  {
    material: "16mm TMT Steel Reinforcement Bars",
    ordered: 25.0,
    received: 25.0,
    consumed: 22.4,
    expected: 22.0,
    unit: "MT",
    supplier: "Tata Tiscon Hyderabad",
    variance: "+1.8%",
    isAlert: false,
    status: "Normal",
  },
];

export default function MaterialsPage() {
  return (
    <div className="space-y-5 pb-6">

      {/* ── Header ── */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
          >
            <PackageCheck className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
          </div>
          <h1 className="page-title">Material Intelligence & Variance Tracking</h1>
        </div>
        <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
          Ordered vs received vs consumed quantities against visual progress baseline.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {[
          { label: "Materials Tracked", value: "3",  sub: "Active Categories",  color: "var(--ink)" },
          { label: "Alerts",            value: "1",  sub: "Over Baseline",       color: "var(--rose-400)" },
          { label: "Avg. Variance",     value: "+2.6%", sub: "Across all items", color: "var(--amber-300)" },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center animate-fade-up" style={{ animationDelay: `${100 + i * 60}ms` }}>
            <span className="stat-label">{s.label}</span>
            <span className="font-display text-[24px] font-black block mt-1" style={{ color: s.color, letterSpacing: "-0.04em" }}>{s.value}</span>
            <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Material Cards ── */}
      <div className="space-y-3">
        {materials.map((m, idx) => {
          const consumed_pct = Math.round((m.consumed / m.received) * 100);
          return (
            <div
              key={idx}
              className="card p-5 animate-fade-up"
              style={{
                animationDelay: `${200 + idx * 80}ms`,
                borderColor: m.isAlert ? "rgba(245,158,11,0.25)" : "var(--border)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Icon & Name */}
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: m.isAlert ? "rgba(245,158,11,0.10)" : "var(--surface-2)",
                      border: `1px solid ${m.isAlert ? "rgba(245,158,11,0.22)" : "var(--border)"}`
                    }}
                  >
                    <Box className="w-4 h-4" style={{ color: m.isAlert ? "var(--amber-400)" : "var(--ink-subtle)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[13.5px] font-semibold" style={{ color: "var(--ink)" }}>
                        {m.material}
                      </span>
                      {m.isAlert ? (
                        <span className="badge badge-risk">
                          <AlertTriangle className="w-3 h-3" /> {m.status}
                        </span>
                      ) : (
                        <span className="badge badge-ok">
                          <CheckCircle2 className="w-3 h-3" /> {m.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3" style={{ color: "var(--ink-subtle)" }} />
                      <span className="text-[12px]" style={{ color: "var(--ink-subtle)" }}>{m.supplier}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
                  {[
                    { label: "Ordered",  value: `${m.ordered} ${m.unit}`,  color: "var(--ink)" },
                    { label: "Received", value: `${m.received} ${m.unit}`, color: "var(--ink)" },
                    { label: "Consumed", value: `${m.consumed} ${m.unit}`, color: "var(--ink)" },
                    { label: "Expected", value: `${m.expected} ${m.unit}`, color: "var(--ink-muted)" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-2.5 rounded-lg"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--ink-subtle)" }}>
                        {stat.label}
                      </span>
                      <span className="text-[12.5px] font-bold block mt-0.5" style={{ color: stat.color }}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Variance pill */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                    style={{
                      background: m.isAlert ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                      border: `1px solid ${m.isAlert ? "rgba(245,158,11,0.22)" : "rgba(16,185,129,0.20)"}`,
                    }}
                  >
                    {m.isAlert
                      ? <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--amber-400)" }} />
                      : <TrendingDown className="w-3.5 h-3.5" style={{ color: "var(--emerald-400)" }} />
                    }
                    <span
                      className="font-display text-[16px] font-black"
                      style={{ color: m.isAlert ? "var(--amber-300)" : "var(--emerald-400)", letterSpacing: "-0.03em" }}
                    >
                      {m.variance}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                    {consumed_pct}% consumed
                  </span>
                </div>
              </div>

              {/* Consumption bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                  <span>Consumption Rate ({consumed_pct}%)</span>
                  <span>{m.consumed} / {m.received} {m.unit}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(consumed_pct, 100)}%`,
                      background: consumed_pct > 100
                        ? "var(--rose-500)"
                        : m.isAlert
                        ? "var(--amber-500)"
                        : "var(--emerald-500)"
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
