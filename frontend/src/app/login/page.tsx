"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Lock, Mail, ArrowRight, Zap, Shield, Building2, BarChart3 } from "lucide-react";
import { api } from "@/lib/api";

const FEATURES = [
  { icon: Zap,       text: "AI Truth Layer reconciles visual evidence, schedules & reports" },
  { icon: Shield,    text: "RBAC multi-tenant security for 6 user roles" },
  { icon: Building2, text: "Monitor Hyderabad construction sites in real-time" },
  { icon: BarChart3, text: "Delay propagation & root cause analysis engine" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("pm@hyderabadinfra.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login({ email, password });
      localStorage.setItem("sitemind_token", data.access_token);
      localStorage.setItem("sitemind_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogins = [
    { role: "ORG_ADMIN",        email: "orgadmin@hyderabadinfra.com",   name: "Kiran Reddy",   sub: "Org Director" },
    { role: "PROJECT_MANAGER",  email: "pm@hyderabadinfra.com",          name: "Suresh Varma",  sub: "PM" },
    { role: "SITE_ENGINEER",    email: "engineer@hyderabadinfra.com",    name: "Ramesh Kumar",  sub: "Engineer" },
    { role: "CONTRACTOR",       email: "contractor@xyzconstructions.com", name: "XYZ Lead",     sub: "Contractor" },
    { role: "EXECUTIVE",        email: "executive@hyderabadinfra.com",   name: "Board View",    sub: "Executive" },
    { role: "SUPER_ADMIN",      email: "admin@sitemind.ai",              name: "Platform",      sub: "Super Admin" },
  ];

  return (
    <div
      className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--canvas)" }}
    >
      {/* Background radial glows */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)",
          transform: "translateY(-30%)"
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
          transform: "translateY(30%)"
        }}
      />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 animate-scale-in">

        {/* ── LEFT: Product Info Panel ── */}
        <div
          className="hidden md:flex flex-col justify-between p-10 rounded-l-2xl"
          style={{
            background: "linear-gradient(135deg, var(--surface-1), var(--surface-2))",
            border: "1px solid var(--border)",
            borderRight: "none"
          }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--amber-400), var(--amber-600))", boxShadow: "0 4px 16px rgba(245,158,11,0.25)" }}
              >
                <HardHat className="w-5 h-5 text-[#0a0c10]" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display text-[18px] block" style={{ color: "var(--ink)" }}>SiteMind AI</span>
                <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>Construction Intelligence Platform</span>
              </div>
            </div>

            <div className="space-y-2 mb-10">
              <h2
                className="font-display text-[28px] leading-tight"
                style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}
              >
                Construction Truth.<br />
                <span style={{ color: "var(--amber-400)" }}>AI-Verified.</span>
              </h2>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                The AI intelligence layer that reconciles schedules, site evidence, contractor reports, and operational data into objective project truth.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 animate-fade-right"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.18)" }}
                  >
                    <f.icon className="w-3.5 h-3.5" style={{ color: "var(--amber-400)" }} />
                  </div>
                  <span className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>
              Serving construction companies in Telangana & Andhra Pradesh
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="live-dot" />
              <span className="text-[11px] font-semibold" style={{ color: "var(--emerald-400)" }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Login Form ── */}
        <div
          className="p-8 rounded-r-2xl md:rounded-l-none rounded-2xl"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)"
          }}
        >
          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--amber-400), var(--amber-600))" }}
            >
              <HardHat className="w-4 h-4 text-[#0a0c10]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[16px]" style={{ color: "var(--ink)" }}>SiteMind AI</span>
          </div>

          <div className="mb-7">
            <h1 className="text-[20px] font-bold" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Sign in to your workspace
            </h1>
            <p className="text-[13px] mt-1" style={{ color: "var(--ink-subtle)" }}>
              Hyderabad Infrastructure Ltd · Production Environment
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-[12.5px] font-medium"
              style={{
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.22)",
                color: "var(--rose-400)"
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11.5px] font-semibold block mb-1.5" style={{ color: "var(--ink-muted)" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-subtle)" }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-semibold block mb-1.5" style={{ color: "var(--ink-muted)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-subtle)" }} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input pl-9"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
              style={{ padding: "11px 20px", fontSize: "13px" }}
            >
              {loading ? (
                <span className="animate-pulse">Authenticating…</span>
              ) : (
                <>
                  <span>Sign in to SiteMind AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Personas */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-3 text-center" style={{ color: "var(--ink-subtle)" }}>
              1-Click Demo Personas
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickLogins.map((item) => (
                <button
                  key={item.role}
                  onClick={() => { setEmail(item.email); setPassword("admin123"); }}
                  className="text-left px-3 py-2 rounded-lg transition-all"
                  style={{
                    background: "var(--surface-0)",
                    border: "1px solid var(--border)",
                    color: "var(--ink-muted)"
                  }}
                >
                  <span className="text-[11px] font-bold block" style={{ color: "var(--amber-400)" }}>
                    {item.name}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--ink-subtle)" }}>
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
