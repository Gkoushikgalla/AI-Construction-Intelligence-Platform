"use client";

import React, { useState } from "react";
import { Camera, Sparkles, Upload, Eye, CheckCircle2, Tag, ScanLine } from "lucide-react";
import { VisionOverlayModal } from "@/components/VisionOverlayModal";

const evidenceItems = [
  {
    id: 1,
    title: "Floor 8 Blockwork Masonry — North Wing",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    uploader: "Ramesh Kumar",
    role: "Site Engineer",
    date: "06 Sep 2026",
    quality: 93,
    qualityLabel: "Pristine",
    aiProgress: 79.0,
    confidence: 89,
    detected: ["brick_wall_section", "concrete_blocks", "mason_worker", "hardhat", "safety_vest"],
  },
  {
    id: 2,
    title: "Floor 7 PVC Conduit Electrical Installation",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    uploader: "Ramesh Kumar",
    role: "Site Engineer",
    date: "06 Sep 2026",
    quality: 91,
    qualityLabel: "High",
    aiProgress: 87.0,
    confidence: 91,
    detected: ["pvc_conduits", "junction_boxes", "electrician_worker", "hardhat", "safety_vest"],
  },
  {
    id: 3,
    title: "Floor 9 RCC Concrete Slab Casting Verification",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    uploader: "Suresh Varma",
    role: "Project Manager",
    date: "30 Aug 2026",
    quality: 95,
    qualityLabel: "Pristine",
    aiProgress: 98.0,
    confidence: 95,
    detected: ["concrete_slab", "rebar_mesh", "concrete_pump_truck", "concrete_workers", "hardhat"],
  },
];

function QualityBar({ pct }: { pct: number }) {
  return (
    <div className="progress-track" style={{ height: "3px" }}>
      <div
        className="progress-fill"
        style={{
          width: `${pct}%`,
          background: pct >= 90 ? "var(--emerald-500)" : pct >= 75 ? "var(--amber-400)" : "var(--rose-400)"
        }}
      />
    </div>
  );
}

export default function EvidencePage() {
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all");

  const handleOpenInspection = (item: any) => {
    setSelectedEvidence(item);
    setModalOpen(true);
  };

  const filtered = evidenceItems.filter((e) => {
    if (filter === "high") return e.quality >= 90;
    if (filter === "medium") return e.quality < 90;
    return true;
  });

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
              <Camera className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            </div>
            <h1 className="page-title">Site Evidence Gallery</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            AI Computer Vision Bounding Box Overlay · YOLOv8x Detection Engine
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {/* Filter tabs */}
          <div
            className="flex items-center rounded-lg p-1"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            {(["all", "high", "medium"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-md text-[11.5px] font-semibold capitalize transition-all"
                style={{
                  background: filter === f ? "var(--surface-raised)" : "transparent",
                  color: filter === f ? "var(--ink)" : "var(--ink-subtle)",
                  border: filter === f ? "1px solid var(--border-strong)" : "1px solid transparent"
                }}
              >
                {f === "all" ? "All" : f === "high" ? "High Quality" : "Medium"}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ fontSize: "12px" }}>
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {[
          { label: "Total Evidence",    value: "9",  sub: "Photos & Videos",   color: "var(--ink)" },
          { label: "Avg. Quality",      value: "93%",sub: "Pristine Threshold", color: "var(--emerald-400)" },
          { label: "AI Observations",   value: "9",  sub: "YOLOv8x Verified",  color: "var(--amber-300)" },
        ].map((s, i) => (
          <div
            key={i}
            className="card p-4 text-center animate-fade-up"
            style={{ animationDelay: `${100 + i * 60}ms` }}
          >
            <span className="stat-label">{s.label}</span>
            <span className="stat-value" style={{ fontSize: "22px", color: s.color }}>{s.value}</span>
            <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Evidence Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="card overflow-hidden flex flex-col animate-fade-up group"
            style={{ animationDelay: `${200 + idx * 80}ms` }}
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden" style={{ background: "var(--canvas)" }}>
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ opacity: 0.85 }}
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(8,10,15,0.65)", backdropFilter: "blur(4px)" }}
              >
                <button
                  onClick={() => handleOpenInspection(item)}
                  className="btn btn-primary text-[12px]"
                  style={{ padding: "8px 14px" }}
                >
                  <ScanLine className="w-4 h-4" />
                  Inspect AI Vision
                </button>
              </div>

              {/* Top badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold"
                  style={{
                    background: "rgba(8,10,15,0.85)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    color: "var(--amber-300)",
                    backdropFilter: "blur(8px)"
                  }}
                >
                  AI VERIFIED
                </span>
              </div>

              {/* Bottom confidence */}
              <div
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold"
                style={{
                  background: "rgba(8,10,15,0.85)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "var(--emerald-400)",
                  backdropFilter: "blur(8px)"
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                {item.confidence}% conf.
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col">
              <h3
                className="text-[13.5px] font-semibold mb-3 leading-snug"
                style={{ color: "var(--ink)" }}
              >
                {item.title}
              </h3>

              {/* Quality score */}
              <div className="mb-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: "var(--ink-subtle)" }}>Quality: <strong style={{ color: "var(--ink)" }}>{item.qualityLabel}</strong></span>
                  <span style={{ color: "var(--ink-subtle)" }}>AI Progress: <strong style={{ color: "var(--amber-300)" }}>{item.aiProgress}%</strong></span>
                </div>
                <QualityBar pct={item.quality} />
              </div>

              {/* Detected classes */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3 h-3" style={{ color: "var(--ink-subtle)" }} />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-subtle)" }}>
                    Detected ({item.detected.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.detected.map((cls, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: "var(--ink-muted)",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="mt-3 pt-3 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                  {item.uploader} · {item.date}
                </span>
                <button
                  onClick={() => handleOpenInspection(item)}
                  className="btn btn-ghost text-[11px]"
                  style={{ padding: "4px 10px", color: "var(--amber-400)" }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Why {item.aiProgress}%?
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vision Inspection Modal */}
      <VisionOverlayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
}
