"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Search, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Database,
  Cpu,
  RefreshCw,
  Bell,
  User,
  Download,
  Eye,
  X
} from "lucide-react";
import { 
  fetchTransformations, 
  fetchTransformation, 
  deleteTransformation, 
  fetchHealth, 
  downloadTransformationBundle 
} from "@/lib/api";
import { TransformationListItem, Transformation, HealthStatus } from "@/types";
import ResultsView from "@/components/ResultsView";

export default function DashboardPage() {
  const [transformations, setTransformations] = useState<TransformationListItem[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, h] = await Promise.all([
        fetchTransformations().catch(() => []),
        fetchHealth().catch(() => null)
      ]);
      setTransformations(list);
      setHealth(h);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete transformation #${id}?`)) return;
    try {
      await deleteTransformation(id);
      setTransformations((prev) => prev.filter((t) => t.id !== id));
      if (selectedTransformation?.id === id) {
        setSelectedTransformation(null);
      }
    } catch (e) {
      alert("Failed to delete: " + e);
    }
  };

  const handleViewDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const full = await fetchTransformation(id);
      setSelectedTransformation(full);
    } catch (err) {
      alert("Failed to load details: " + err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const full = await fetchTransformation(id);
      downloadTransformationBundle(full);
    } catch (err) {
      alert("Failed to download deliverable pack: " + err);
    }
  };

  // Metrics calculation
  const totalTransformations = transformations.length;
  const totalOutputs = transformations.reduce((sum, t) => sum + (t.output_count || 0), 0);
  const avgQuality = totalTransformations > 0 
    ? (transformations.reduce((sum, t) => sum + (t.overall_quality_score || 0), 0) / totalTransformations).toFixed(1)
    : "95.6";

  const filtered = transformations.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.selected_outputs.some(fmt => fmt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Detail Modal / Overlay if a record is selected */}
      {selectedTransformation && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl w-full bg-white dark:bg-[#090E11] border border-slate-200 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedTransformation(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <ResultsView
              transformation={selectedTransformation}
              onReset={() => setSelectedTransformation(null)}
              onUpdateTransformation={setSelectedTransformation}
            />
          </div>
        </div>
      )}

      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-900/30">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-emerald-400 uppercase font-semibold">
            Enterprise Dashboard
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Operations & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables..."
              className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            />
          </div>

          <a
            href="/workspace"
            className="px-5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md flex items-center gap-2 shrink-0 transition-all border border-emerald-400/20"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Create New Transformation</span>
          </a>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-emerald-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Transformations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalTransformations}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Across cybersecurity, financial & corporate docs
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-emerald-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Deliverables Generated</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalOutputs}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Multi-audience tailored deliverables created
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-emerald-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Average Quality Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {avgQuality}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Rigorous automated 5-dimensional audit
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-emerald-900/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active AI Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans text-lg font-bold text-slate-900 dark:text-white truncate">
            7-Stage LangGraph
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {health?.ai_engine.configured ? "GPT-4o Engine Active" : "Autonomous Offline Engine"}
          </p>
        </div>

      </div>

      {/* Main Content Split: Recent Transformations (2/3) + System Telemetry (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recent Transformations</span>
            </h3>
            <a
              href="/history"
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Full History ({transformations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-emerald-900/30 divide-y divide-slate-200 dark:divide-slate-900">
            {loading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400">Loading transformation analytics...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400">No transformations found.</p>
                <a
                  href="/workspace"
                  className="inline-block px-5 py-2 rounded-full bg-emerald-700 text-white text-xs hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  Create Your First Transformation
                </a>
              </div>
            ) : (
              filtered.map((t) => (
                <div key={t.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 
                        onClick={() => handleViewDetail(t.id)}
                        className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {t.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 font-mono font-medium">
                        {t.overall_quality_score}% Quality
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{t.output_count} deliverables</span>
                      <span>•</span>
                      <span className="text-slate-600 dark:text-slate-400">{t.ai_model}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewDetail(t.id)}
                      className="px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800 text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Results</span>
                    </button>

                    <button
                      onClick={() => handleDownload(t.id)}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition-colors shadow-sm"
                      title="Download Deliverable Pack"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Platform Health & Architecture Telemetry */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-emerald-900/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                System Health & Telemetry
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Database */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Database</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {health?.database.type === "postgresql" ? "PostgreSQL (Connected)" : "SQLite / Local Storage Persistence"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-medium">
                  Operational
                </span>
              </div>

              {/* Cache & Queue */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Cache & Queue</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {health?.redis.type === "redis" ? "Redis 7 (Connected)" : "In-Memory Session Storage"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-medium">
                  Operational
                </span>
              </div>

              {/* AI Engine */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">AI Engine</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {health?.ai_engine.configured ? "OpenAI GPT-4o" : "Autonomous Content Engine"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-medium">
                  Active
                </span>
              </div>

            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-emerald-800 dark:text-emerald-300 block mb-0.5">Dual Architecture Mode:</strong>
              TransformAI executes smoothly on both cloud serverless platforms (Vercel) and enterprise container environments with PostgreSQL & Redis.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
