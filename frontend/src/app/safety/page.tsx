"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Eye, Shield } from "lucide-react";

const events = [
  {
    id: 1,
    type: "PPE Violation",
    subtype: "Missing Hardhat",
    severity: "Medium",
    location: "Tower A — Floor 8 Zone A",
    time: "10:43 AM, 06 Sep 2026",
    desc: "Worker detected near elevator shaft opening without protective hardhat. Immediate advisory issued to site supervisor.",
    confidence: 88,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    isViolation: true,
  },
  {
    id: 2,
    type: "PPE Compliance",
    subtype: "Full Compliance Verified",
    severity: "OK",
    location: "Tower A — Floor 7 Zone A",
    time: "09:15 AM, 06 Sep 2026",
    desc: "100% hardhat & safety vest compliance detected across active electrician crew (4 workers). No violations detected.",
    confidence: 94,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    isViolation: false,
  },
  {
    id: 3,
    type: "PPE Compliance",
    subtype: "Full Compliance Verified",
    severity: "OK",
    location: "Tower A — Floor 9 Zone B",
    time: "08:30 AM, 06 Sep 2026",
    desc: "Concrete casting crew detected with full PPE compliance. 6 workers, 6 hardhats, 6 safety vests detected.",
    confidence: 95,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    isViolation: false,
  },
];

export default function SafetyPage() {
  const violations = events.filter((e) => e.isViolation);
  const compliant = events.filter((e) => !e.isViolation);

  return (
    <div className="space-y-5 pb-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.22)" }}
            >
              <ShieldAlert className="w-4 h-4" style={{ color: "var(--rose-400)" }} />
            </div>
            <h1 className="page-title">Site Safety Intelligence</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            Advisory computer vision detection of PPE compliance — hardhats, safety vests & site access observations.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <span
            className="badge badge-critical text-[11px]"
            style={{ padding: "6px 12px", borderRadius: "8px" }}
          >
            <AlertTriangle className="w-3 h-3" />
            {violations.length} Violation{violations.length !== 1 ? "s" : ""}
          </span>
          <span
            className="badge badge-ok text-[11px]"
            style={{ padding: "6px 12px", borderRadius: "8px" }}
          >
            <CheckCircle2 className="w-3 h-3" />
            {compliant.length} Compliant
          </span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {[
          { label: "PPE Scans Today", value: "9", sub: "Automated AI Detection",    color: "var(--ink)" },
          { label: "Violations",       value: "1", sub: "Requires attention",        color: "var(--rose-400)" },
          { label: "Compliance Rate",  value: "89%", sub: "Above 85% target",        color: "var(--emerald-400)" },
        ].map((s, i) => (
          <div
            key={i}
            className="card p-4 text-center animate-fade-up"
            style={{ animationDelay: `${100 + i * 60}ms` }}
          >
            <span className="stat-label">{s.label}</span>
            <span
              className="font-display block text-[26px] font-black mt-1"
              style={{ color: s.color, letterSpacing: "-0.04em" }}
            >
              {s.value}
            </span>
            <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Violations ── */}
      {violations.length > 0 && (
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h2 className="section-title">
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--rose-400)" }} />
            PPE Violations — Action Required
          </h2>
          {violations.map((evt) => (
            <div
              key={evt.id}
              className="card overflow-hidden animate-fade-up"
              style={{
                borderColor: "rgba(244,63,94,0.25)",
                borderLeftWidth: "3px",
                borderLeftColor: "var(--rose-500)"
              }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-36 md:h-auto overflow-hidden flex-shrink-0" style={{ background: "var(--canvas)" }}>
                  <img
                    src={evt.image}
                    alt={evt.type}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="p-5 space-y-2.5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-critical">{evt.type}</span>
                        <span className="text-[11.5px] font-semibold" style={{ color: "var(--ink)" }}>{evt.location}</span>
                      </div>
                      <p className="text-[11.5px]" style={{ color: "var(--ink-subtle)" }}>{evt.time}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Eye className="w-3.5 h-3.5" style={{ color: "var(--ink-subtle)" }} />
                      <span className="text-[11.5px] font-bold" style={{ color: "var(--ink-muted)" }}>
                        {evt.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>{evt.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Compliance Records ── */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <h2 className="section-title">
          <Shield className="w-4 h-4" style={{ color: "var(--emerald-400)" }} />
          Compliance Records
        </h2>
        {compliant.map((evt) => (
          <div
            key={evt.id}
            className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up"
            style={{ borderLeftWidth: "3px", borderLeftColor: "var(--emerald-500)" }}
          >
            <div className="flex items-center gap-3 flex-1">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--emerald-400)" }} />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="badge badge-ok">{evt.subtype}</span>
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>{evt.location}</span>
                </div>
                <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>{evt.desc}</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--ink-subtle)" }}>{evt.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Eye className="w-3.5 h-3.5" style={{ color: "var(--ink-subtle)" }} />
              <span className="text-[12px] font-bold" style={{ color: "var(--ink-muted)" }}>
                {evt.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
