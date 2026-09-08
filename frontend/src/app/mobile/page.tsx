"use client";

import React, { useState } from "react";
import { Camera, Upload, CheckCircle2, Sparkles, MapPin, Building2, Smartphone } from "lucide-react";
import { api } from "@/lib/api";

export default function MobileSiteEngineerPage() {
  const [selectedActivity, setSelectedActivity] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activities = [
    { id: 1, name: "Floor 8 Blockwork Masonry", location: "Tower A • Floor 8 • Zone A" },
    { id: 2, name: "Floor 7 PVC Electrical Conduit", location: "Tower A • Floor 7 • Zone A" },
    { id: 3, name: "Floor 8 Plastering Base Coat", location: "Tower A • Floor 8 • Zone A" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("project_id", "1");
    formData.append("activity_id", selectedActivity.toString());
    formData.append("description", note || "Field engineer photo upload");
    formData.append("file", file);

    try {
      await api.uploadEvidence(formData);
      setSubmitted(true);
      setFile(null);
      setNote("");
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-2">
      {/* Mobile Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 rounded-2xl text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
            Mobile Field App
          </span>
          <h1 className="text-xl font-extrabold mt-1">Quick Site Capture</h1>
          <p className="text-xs text-emerald-100">Ramesh Kumar (Site Engineer)</p>
        </div>
        <Smartphone className="w-8 h-8 text-emerald-200" />
      </div>

      {submitted ? (
        <div className="glass-panel p-6 text-center space-y-4 border-emerald-500/30">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Evidence Submitted!</h2>
          <p className="text-xs text-slate-300">
            AI Vision Engine is analyzing object bounding boxes and updating the Construction Truth Layer.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-lg"
          >
            Upload Another Photo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-5 border-slate-800">
          {/* Step 1: Select Activity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Construction Activity (1 Tap)
            </label>
            <div className="space-y-2">
              {activities.map((act) => (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setSelectedActivity(act.id)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    selectedActivity === act.id
                      ? "bg-cyan-950/60 border-cyan-500 text-white font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <span className="block font-bold text-slate-100">{act.name}</span>
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5 font-mono">
                    <MapPin className="w-3 h-3" /> {act.location}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Camera / File Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Capture Photo / Select File
            </label>
            <div className="border-2 border-dashed border-cyan-500/40 rounded-2xl p-6 text-center bg-cyan-950/20 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="mobile-camera-input"
              />
              <label htmlFor="mobile-camera-input" className="cursor-pointer flex flex-col items-center space-y-2">
                <Camera className="w-10 h-10 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {file ? file.name : "Tap to Open Camera / Select Photo"}
                </span>
                <span className="text-[10px] text-slate-400">Auto-embeds GPS & Timestamp</span>
              </label>
            </div>
          </div>

          {/* Step 3: Optional Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Optional Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 4 masons present, AAC blocks delivered"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Step 4: Submit */}
          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3.5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center space-x-2 ${
              file && !loading
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "AI Processing Vision Evidence..." : "Submit to SiteMind AI Engine"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
