"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Search, 
  Trash2, 
  ExternalLink, 
  Download, 
  Archive, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Layers,
  ChevronRight,
  RefreshCw,
  Eye,
  X
} from "lucide-react";
import { 
  fetchTransformations, 
  fetchTransformation, 
  deleteTransformation, 
  downloadTransformationBundle 
} from "@/lib/api";
import { TransformationListItem, Transformation } from "@/types";
import ResultsView from "@/components/ResultsView";

export default function HistoryPage() {
  const [items, setItems] = useState<TransformationListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchTransformations();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete transformation #${id}?`)) return;
    try {
      await deleteTransformation(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedTransformation?.id === id) {
        setSelectedTransformation(null);
      }
    } catch (err) {
      alert("Delete failed: " + err);
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
      alert("Failed to download pack: " + err);
    }
  };

  const filtered = items.filter((item) => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.source_type.toLowerCase().includes(search.toLowerCase()) ||
    item.selected_outputs.some(o => o.toLowerCase().includes(search.toLowerCase()))
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-emerald-900/30">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-emerald-400 uppercase font-semibold">
            Audit Trail
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Transformation History
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            />
          </div>

          <button
            onClick={loadHistory}
            className="p-2 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-colors shadow-sm"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Table / Cards */}
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-emerald-900/30 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-600 dark:text-slate-400">Loading transformation history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No Transformations Recorded</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Execute a transformation in the workspace to see persistent history here.
            </p>
            <a
              href="/workspace"
              className="inline-block px-5 py-2 rounded-full bg-emerald-700 text-white text-xs hover:bg-emerald-600 transition-colors mt-2 shadow-sm"
            >
              Open Transformation Workspace
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Transformation Title</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Outputs</th>
                  <th className="py-3.5 px-4">Quality Score</th>
                  <th className="py-3.5 px-4">Engine</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-900/80 text-slate-700 dark:text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                    <td 
                      onClick={() => handleViewDetail(item.id)}
                      className="py-4 px-6 font-medium text-slate-900 dark:text-white max-w-xs truncate cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      {item.title}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 uppercase font-medium">
                        {item.source_type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {item.output_count} deliverables
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold">
                        {item.overall_quality_score}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.ai_model}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleViewDetail(item.id)}
                        className="px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800 text-xs font-medium transition-colors shadow-sm inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Results</span>
                      </button>

                      <button
                        onClick={() => handleDownload(item.id)}
                        className="p-1.5 inline-block rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition-colors align-middle shadow-sm"
                        title="Download Deliverable Pack"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors align-middle"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
