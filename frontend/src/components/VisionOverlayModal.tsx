"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Box } from "lucide-react";

interface VisionOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: any;
  analysis?: any;
}

export function VisionOverlayModal({ isOpen, onClose, evidence, analysis }: VisionOverlayModalProps) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  if (!isOpen || !evidence) return null;

  const boxes = analysis?.vision_analysis?.bounding_boxes || [
    { label: "brick_wall_section", category: "structure", bbox_normalized: [0.15, 0.2, 0.75, 0.85], confidence: 0.94 },
    { label: "concrete_blocks", category: "material", bbox_normalized: [0.2, 0.4, 0.45, 0.6], confidence: 0.89 },
    { label: "mason_worker", category: "person", bbox_normalized: [0.35, 0.25, 0.65, 0.45], confidence: 0.91 },
    { label: "hardhat", category: "ppe", bbox_normalized: [0.36, 0.25, 0.42, 0.32], confidence: 0.93 },
    { label: "safety_vest", category: "ppe", bbox_normalized: [0.43, 0.26, 0.58, 0.44], confidence: 0.9 },
  ];

  const quality = analysis?.quality || { overall_quality: 0.93, resolution_score: 0.94, lighting_score: 0.92 };

  const categoryColor: Record<string, string> = {
    ppe: "var(--emerald-400)",
    person: "var(--amber-400)",
    structure: "var(--blue-400)",
    material: "var(--blue-400)",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        style={{ background: "var(--surface-0)", border: "1px solid var(--border)" }}
      >
        {/* Image with detections */}
        <div className="flex-1 bg-black p-4 relative flex items-center justify-center min-h-[350px]">
          <div className="relative max-w-full max-h-[70vh] overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
            <img
              src={
                evidence.file_url ||
                "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80"
              }
              alt="Site evidence"
              className="max-h-[65vh] object-contain"
            />

            {showBoundingBoxes &&
              boxes.map((box: any, idx: number) => {
                const [ymin, xmin, ymax, xmax] = box.bbox_normalized;
                const color = categoryColor[box.category] || "var(--ink-subtle)";

                return (
                  <div
                    key={idx}
                    className="absolute rounded pointer-events-none"
                    style={{
                      top: `${ymin * 100}%`,
                      left: `${xmin * 100}%`,
                      width: `${(xmax - xmin) * 100}%`,
                      height: `${(ymax - ymin) * 100}%`,
                      border: `2px solid ${color}`,
                    }}
                  >
                    <span
                      className="absolute -top-5 left-0 text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ background: "var(--surface-0)", border: "1px solid var(--border)", color: "var(--ink)" }}
                    >
                      {box.label} ({Math.round(box.confidence * 100)}%)
                    </span>
                  </div>
                );
              })}
          </div>

          <div
            className="absolute top-6 left-6 px-2 py-1.5 rounded-lg"
            style={{ background: "var(--surface-0)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="px-2 py-1 rounded text-[11px] font-medium transition-colors"
              style={
                showBoundingBoxes
                  ? { background: "var(--amber-500)", color: "#0a0c10" }
                  : { background: "var(--surface-2)", color: "var(--ink-subtle)" }
              }
            >
              {showBoundingBoxes ? "Detections on" : "Detections off"}
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="w-full md:w-96 p-6 flex flex-col justify-between overflow-y-auto"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: "var(--ink)" }}>
                  Site inspection
                </h3>
                <span className="text-xs" style={{ color: "var(--ink-subtle)" }}>
                  Floor 8 blockwork — Zone A
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "var(--surface-2)", color: "var(--ink-subtle)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-panel p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                  Why 79% complete
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: "var(--surface-2)", color: "var(--ink-subtle)" }}
                >
                  89% confidence
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ink-muted)" }}>
                Segmentation found 18 partition wall sections: 15 fully completed masonry layers and
                3 still in progress.
              </p>
              <div className="space-y-1.5 text-[11px]" style={{ color: "var(--ink-subtle)" }}>
                <div className="flex justify-between">
                  <span>Visual quality</span>
                  <span style={{ color: "var(--emerald-400)", fontWeight: 600 }}>
                    {Math.round(quality.overall_quality * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lighting / resolution</span>
                  <span style={{ color: "var(--ink)" }}>Good</span>
                </div>
                <div className="flex justify-between">
                  <span>Workers on site</span>
                  <span style={{ color: "var(--ink)" }}>4 (4 wearing PPE)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                Detected elements
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {boxes.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs px-3 py-1.5 rounded"
                    style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-3.5 h-3.5" style={{ color: "var(--ink-subtle)" }} />
                      <span style={{ color: "var(--ink)" }}>{b.label}</span>
                    </div>
                    <span style={{ color: "var(--ink-subtle)" }}>{Math.round(b.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={onClose}
              className="w-full font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{ background: "var(--amber-500)", color: "#0a0c10" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
