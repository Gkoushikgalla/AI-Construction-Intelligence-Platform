"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Camera,
  Layers,
  AlertTriangle,
  Users,
  PackageCheck,
  ShieldAlert,
  FileText,
  Bot,
  Smartphone,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Projects", href: "/projects", icon: Building2 },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { label: "Schedule", href: "/schedule", icon: CalendarDays },
      { label: "Site Photos", href: "/evidence", icon: Camera },
      { label: "Progress", href: "/progress", icon: Layers },
      { label: "Risks & Delays", href: "/risks", icon: AlertTriangle, badge: 4 },
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Contractors", href: "/contractors", icon: Users },
      { label: "Materials", href: "/materials", icon: PackageCheck },
      { label: "Safety", href: "/safety", icon: ShieldAlert },
      { label: "Daily Reports", href: "/reports", icon: FileText },
    ]
  },
  {
    label: "Assistant",
    items: [
      { label: "AI Assistant", href: "/assistant", icon: Bot },
      { label: "Mobile Mode", href: "/mobile", icon: Smartphone },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[220px] flex-shrink-0 hidden md:flex flex-col h-[calc(100vh-56px)] sticky top-[56px] overflow-y-auto"
      style={{
        background: "var(--surface-0)",
        borderRight: "1px solid var(--border-subtle)"
      }}
    >
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon
                    className="nav-icon w-4 h-4 flex-shrink-0"
                    style={{ color: isActive ? "var(--accent)" : "var(--ink-subtle)" }}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{
                        background: "var(--surface-2)",
                        color: "var(--ink-subtle)"
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom status — simple, no animation, no fake telemetry */}
      <div className="px-3 pb-4">
        <div
          className="rounded-lg px-3 py-2.5 flex items-center justify-between"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)"
          }}
        >
          <span className="text-[11.5px]" style={{ color: "var(--ink-subtle)" }}>
            Vision Engine
          </span>
          <span className="text-[11px] font-medium" style={{ color: "var(--emerald-400)" }}>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}