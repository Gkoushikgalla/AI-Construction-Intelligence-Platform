"use client";

import React, { useState } from "react";
import { ArrowLeftRight, Calendar } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--ink)" }}>
            <ArrowLeftRight className="w-4 h-4" style={{ color: "var(--amber-400)" }} />
            Before &amp; After
          </h3>
          <span className="text-xs" style={{ color: "var(--ink-subtle)" }}>
            Floor 8, Zone A blockwork — Sept 1 vs Sept 8
          </span>
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--emerald-400)" }}>
          +5.3% per day
        </span>
      </div>

      <div
        className="relative w-full h-72 rounded-xl overflow-hidden select-none"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* After (Sept 8) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80')",
          }}
        >
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            style={{ background: "var(--surface-0)", border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: "var(--ink-subtle)" }} />
            Sept 8 — 79% complete
          </div>
        </div>

        {/* Before (Sept 1) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80')",
            width: `${sliderPos}%`,
            borderRight: "2px solid var(--amber-400)",
          }}
        >
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            style={{ background: "var(--surface-0)", border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: "var(--ink-subtle)" }} />
            Sept 1 — 42% complete
          </div>
        </div>

        {/* Drag handle */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />

        <div
          className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPos}%`, background: "var(--amber-400)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--amber-500)", color: "#0a0c10" }}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
