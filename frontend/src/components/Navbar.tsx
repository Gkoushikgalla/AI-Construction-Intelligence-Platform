"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HardHat, Bell, Search, ShieldCheck, Smartphone, ChevronDown } from "lucide-react";

export function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 nav-surface px-5 py-0 flex items-center justify-between h-[56px]">
      {/* LEFT — Brand */}
      <div className="flex items-center gap-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--amber-500)" }}
          >
            <HardHat className="w-4 h-4 text-[#0a0c10]" strokeWidth={2.5} />
          </div>

          <div className="hidden sm:block">
            <span
              className="font-display text-[15px] font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              SiteMind
            </span>
            <span
              className="text-[10px] block -mt-0.5"
              style={{ color: "var(--ink-subtle)", letterSpacing: "-0.01em" }}
            >
              Construction Intelligence
            </span>
          </div>
        </Link>

        <div className="h-5 w-px hidden md:block" style={{ background: "var(--border)" }} />

        {/* Org switcher */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--ink-muted)",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          <div className="w-4 h-4 rounded" style={{ background: "var(--blue-600)" }} />
          <span style={{ color: "var(--ink)" }}>Hyderabad Infrastructure Ltd</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* CENTER — Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--ink-subtle)" }}
          />
          <input
            type="text"
            placeholder="Search projects, floors, activities..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input text-[12.5px] pl-9 pr-4 h-8"
            style={{
              background: "var(--surface-0)",
              borderColor: searchFocused ? "var(--amber-500)" : "var(--border)",
            }}
          />
        </div>
      </div>

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/mobile"
          className="btn btn-secondary hidden sm:inline-flex"
          style={{ padding: "6px 12px", fontSize: "12px" }}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Field Mode</span>
        </Link>

        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink-muted)" }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--rose-500)" }}
          />
        </button>

        <div className="flex items-center gap-2.5 pl-3 ml-1" style={{ borderLeft: "1px solid var(--border)" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: "var(--blue-600)", color: "white" }}
          >
            SV
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[12px] font-semibold block" style={{ color: "var(--ink)" }}>
              Suresh Varma
            </span>
            <span
              className="text-[10px] flex items-center gap-1 font-medium"
              style={{ color: "var(--ink-subtle)" }}
            >
              <ShieldCheck className="w-3 h-3" />
              Project Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
