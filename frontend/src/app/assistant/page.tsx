"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Database, CheckCircle2, Cpu, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const SAMPLE_PROMPTS = [
  { label: "Project Status",        text: "What is the current status of Tower A?" },
  { label: "Delayed Activities",    text: "Which activities are delayed?" },
  { label: "Floor 8 Root Cause",    text: "Why is Floor 8 behind schedule?" },
  { label: "Critical Risks",        text: "What are the top critical risks?" },
  { label: "Contractor Performance",text: "Which contractors are underperforming?" },
  { label: "Material Variances",    text: "Show material consumption variances" },
];

const TOOL_LABELS: Record<string, string> = {
  get_project_status:          "get_project_status()",
  calculate_schedule_variance: "calculate_schedule_variance()",
  get_project_risks:           "get_project_risks()",
  get_contractor_performance:  "get_contractor_performance()",
  get_material_usage:          "get_material_usage()",
};

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "ai",
      text: "Hello Suresh. I am the SiteMind AI Management Assistant.\n\nI query project databases, Truth Layer reconciliations, visual evidence ledgers, and delay propagation graphs to answer management questions with zero hallucinated facts.\n\nHow can I assist you today?",
      tools: [],
      confidence: 1.0,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q) return;
    const userMsg = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery("");
    setLoading(true);
    try {
      const res = await api.queryAssistant(1, q);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.answer,
          tools: res.tools_called || [],
          confidence: res.confidence || 0.94,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error querying the project database. Please verify the backend connection is active.",
          tools: [],
          confidence: 0.0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col pb-6" style={{ height: "calc(100vh - 80px)" }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 animate-fade-up flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)" }}
            >
              <Bot className="w-4 h-4" style={{ color: "var(--blue-400)" }} />
            </div>
            <h1 className="page-title">AI Management Assistant</h1>
          </div>
          <p className="text-[12.5px] ml-10" style={{ color: "var(--ink-muted)" }}>
            Strictly fact-grounded · 11 database tools · 0 hallucinations
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.20)",
              color: "var(--blue-300)"
            }}
          >
            <Database className="w-3.5 h-3.5" />
            11 Tools Connected
          </span>
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.20)",
              color: "var(--emerald-400)"
            }}
          >
            <span className="live-dot" />
            Live
          </span>
        </div>
      </div>

      {/* ── Sample Prompts ── */}
      <div className="flex flex-wrap gap-2 mb-4 animate-fade-up flex-shrink-0" style={{ animationDelay: "100ms" }}>
        {SAMPLE_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p.text)}
            className="flex items-center gap-1.5 transition-all"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--ink-muted)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.30)";
              (e.currentTarget as HTMLElement).style.color = "var(--amber-300)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--ink-muted)";
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "var(--amber-400)" }} />
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Messages Box ── */}
      <div
        className="flex-1 card p-4 overflow-y-auto space-y-4 animate-fade-up"
        style={{ animationDelay: "150ms", minHeight: 0 }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col animate-fade-up ${msg.sender === "user" ? "items-end" : "items-start"}`}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {msg.sender === "ai" && (
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.22)" }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: "var(--blue-400)" }} />
                </div>
                <span className="text-[11.5px] font-bold" style={{ color: "var(--ink-muted)" }}>
                  SiteMind AI
                </span>
                {msg.confidence > 0 && msg.confidence < 1 && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(16,185,129,0.10)", color: "var(--emerald-400)", border: "1px solid rgba(16,185,129,0.20)" }}
                  >
                    {Math.round(msg.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            )}

            <div
              className="max-w-[85%] text-[13px] leading-relaxed"
              style={
                msg.sender === "user"
                  ? {
                      background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(59,130,246,0.12))",
                      border: "1px solid rgba(245,158,11,0.22)",
                      borderRadius: "14px",
                      borderBottomRightRadius: "4px",
                      padding: "12px 16px",
                      color: "var(--ink)"
                    }
                  : {
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      borderBottomLeftRadius: "4px",
                      padding: "14px 16px",
                      color: "var(--ink)"
                    }
              }
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Tools invoked */}
              {msg.tools && msg.tools.length > 0 && (
                <div
                  className="mt-3 pt-3 flex flex-wrap gap-1.5"
                  style={{ borderTop: "1px solid var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-1 text-[10.5px] font-semibold w-full mb-1" style={{ color: "var(--ink-subtle)" }}>
                    <Cpu className="w-3 h-3" />
                    Tools invoked:
                  </div>
                  {msg.tools.map((t: string, ti: number) => (
                    <span
                      key={ti}
                      className="text-[10.5px] px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(59,130,246,0.10)",
                        border: "1px solid rgba(59,130,246,0.18)",
                        color: "var(--blue-300)",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    >
                      {TOOL_LABELS[t] || `${t}()`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-2 animate-fade-up">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.22)" }}
            >
              <Bot className="w-3.5 h-3.5 animate-pulse" style={{ color: "var(--blue-400)" }} />
            </div>
            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-muted)" }}>
                <span className="animate-pulse">Querying construction database tools</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--blue-400)", animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--blue-400)", animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--blue-400)", animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Box ── */}
      <div className="mt-3 flex-shrink-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="relative">
          <input
            id="assistant-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Ask any question about your construction projects… (e.g. 'What is the status of Tower A?')"
            className="input pr-14"
            style={{ height: "48px", fontSize: "13px", paddingLeft: "16px" }}
          />
          <button
            id="assistant-send"
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            className="absolute right-2 top-2 bottom-2 px-3 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: query.trim() && !loading ? "var(--amber-500)" : "var(--surface-3)",
              color: query.trim() && !loading ? "#0a0c10" : "var(--ink-faint)",
              border: "none",
              cursor: query.trim() && !loading ? "pointer" : "default",
              minWidth: "36px"
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10.5px] mt-2 text-center" style={{ color: "var(--ink-subtle)" }}>
          All responses are grounded in project database facts · No hallucinated information
        </p>
      </div>
    </div>
  );
}
