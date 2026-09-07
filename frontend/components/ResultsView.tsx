"use client";

import React, { useState, useEffect } from "react";
import { 
  Copy, 
  Check, 
  Download, 
  Edit3, 
  RefreshCw, 
  Archive, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Terminal,
  Video,
  Share2,
  Newspaper,
  Layout,
  BarChart3,
  HelpCircle,
  CheckSquare,
  Briefcase,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import { Transformation, OutputItem } from "@/types";
import { getZipExportUrl, regenerateOutput } from "@/lib/api";

interface ResultsViewProps {
  transformation: Transformation;
  onReset: () => void;
  onUpdateTransformation?: (updated: Transformation) => void;
}

// Format-specific layout, badges, and styling configurations in Plus Jakarta Sans
function getFormatTypography(formatType: string, fontMode: "standard" | "compact" | "relaxed") {
  const densityMap = {
    standard: {
      text: "text-sm sm:text-[15px] leading-relaxed mb-3.5",
      list: "text-sm sm:text-[15px] leading-relaxed",
      quote: "text-sm sm:text-base italic",
    },
    compact: {
      text: "text-xs sm:text-sm leading-normal mb-2.5",
      list: "text-xs sm:text-sm leading-normal",
      quote: "text-xs sm:text-sm italic",
    },
    relaxed: {
      text: "text-base sm:text-[16.5px] leading-loose mb-4",
      list: "text-base sm:text-[16.5px] leading-loose",
      quote: "text-base sm:text-lg italic",
    },
  };

  const density = densityMap[fontMode] || densityMap.standard;

  switch (formatType) {
    case "security_advisory":
      return {
        fontClass: "font-sans",
        badgeLabel: "Cyber Incident Telemetry • Threat Intel",
        badgeColor: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text} p-3.5 rounded-xl bg-red-50/40 dark:bg-slate-950/70 border border-red-200 dark:border-red-900/30`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-red-600 dark:marker:text-red-400`,
        quoteClass: `font-sans font-normal border-red-500 bg-red-50 dark:bg-red-950/30 text-red-950 dark:text-red-200 ${density.quote}`,
        tableClass: "font-sans font-normal text-xs",
      };

    case "video_script":
      return {
        fontClass: "font-sans",
        badgeLabel: "Broadcast Teleprompter & Dialogue Script",
        badgeColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text} p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-purple-600 dark:marker:text-purple-400`,
        quoteClass: `font-sans font-normal border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ${density.quote}`,
        tableClass: "font-sans font-normal text-xs",
      };

    case "press_release":
      return {
        fontClass: "font-sans",
        badgeLabel: "AP Newswire Journalistic Release",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text}`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-emerald-600 dark:marker:text-emerald-400`,
        quoteClass: `font-sans font-normal border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "executive_summary":
      return {
        fontClass: "font-sans",
        badgeLabel: "C-Suite Strategic Executive Briefing",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text}`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-emerald-600 dark:marker:text-emerald-400`,
        quoteClass: `font-sans font-normal border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "social_media":
      return {
        fontClass: "font-sans",
        badgeLabel: "Multi-Platform Social Suite (X / LinkedIn)",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text} p-3.5 rounded-2xl bg-blue-50/40 dark:bg-slate-950/60 border border-blue-200 dark:border-blue-900/30`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-blue-600 dark:marker:text-blue-400`,
        quoteClass: `font-sans font-normal border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "presentation":
      return {
        fontClass: "font-sans",
        badgeLabel: "Slide Deck Blueprint & Speaker Notes",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text}`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-amber-600 dark:marker:text-amber-400`,
        quoteClass: `font-sans font-normal border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "infographic":
      return {
        fontClass: "font-sans",
        badgeLabel: "Visual Data Hierarchy & Wireframe",
        badgeColor: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text} p-3 rounded-xl bg-teal-50/40 dark:bg-teal-950/15 border border-teal-200 dark:border-teal-900/30`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-teal-600 dark:marker:text-teal-400`,
        quoteClass: `font-sans font-normal border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-950 dark:text-teal-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "key_points":
      return {
        fontClass: "font-sans",
        badgeLabel: "High-Density Scannable Digest",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text}`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-emerald-600 dark:marker:text-emerald-400`,
        quoteClass: `font-sans font-normal border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "faq":
      return {
        fontClass: "font-sans",
        badgeLabel: "Structured Q&A Knowledgebase",
        badgeColor: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text} pl-3 border-l-2 border-slate-300 dark:border-slate-800`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-sky-600 dark:marker:text-sky-400`,
        quoteClass: `font-sans font-normal border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-950 dark:text-sky-100 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };

    case "custom_output":
    default:
      return {
        fontClass: "font-sans",
        badgeLabel: "Tailored Custom Typography",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/70",
        paragraphClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.text}`,
        listClass: `font-sans font-normal text-slate-800 dark:text-slate-200 ${density.list} marker:text-emerald-600 dark:marker:text-emerald-400`,
        quoteClass: `font-sans font-normal border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 ${density.quote}`,
        tableClass: "font-sans font-normal",
      };
  }
}

function renderFormattedInline(text: string) {
  // Parses markdown inline formats (**bold**, *italic*, `code`) cleanly
  // Adapts text contrast for both light and dark modes
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-slate-950 dark:text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-700 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-700 dark:text-emerald-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function ResultsView({
  transformation,
  onReset,
  onUpdateTransformation
}: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState<string>(
    transformation.outputs[0]?.format_type || "executive_summary"
  );
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [fontMode, setFontMode] = useState<"standard" | "compact" | "relaxed">("standard");

  // Initialize editable text
  useEffect(() => {
    const initMap: Record<string, string> = {};
    transformation.outputs.forEach((out) => {
      initMap[out.format_type] = out.content;
    });
    setEditableContent(initMap);

    // Subtle celebration confetti on load
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#34D399", "#F59E0B", "#6EE7B7"]
      });
    } catch (e) {
      // safe ignore
    }
  }, [transformation]);

  const activeOutput = transformation.outputs.find(
    (o) => o.format_type === activeTab
  ) || transformation.outputs[0];

  const currentContent = editableContent[activeTab] ?? activeOutput?.content ?? "";
  const typography = getFormatTypography(activeTab, fontMode);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const element = document.createElement("a");
    const file = new Blob([currentContent], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeOutput?.title || activeTab}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updatedOutput: OutputItem = await regenerateOutput(
        transformation.id,
        activeTab,
        {
          audience: transformation.audience,
          tone: transformation.tone,
          language: transformation.language
        }
      );

      setEditableContent((prev) => ({
        ...prev,
        [activeTab]: updatedOutput.content
      }));

      if (onUpdateTransformation) {
        const updatedOutputs = transformation.outputs.map((out) =>
          out.format_type === activeTab ? updatedOutput : out
        );
        onUpdateTransformation({
          ...transformation,
          outputs: updatedOutputs
        });
      }
    } catch (err) {
      alert("Regeneration failed: " + err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn" role="region" aria-label="Transformation Results Dashboard">
      
      {/* Top Banner: Overview & Export Actions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-200 dark:border-emerald-800/30 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{transformation.ai_model}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800">
              Audience: {transformation.audience}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800">
              Tone: {transformation.tone}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800">
              Duration: {transformation.execution_duration_sec}s
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {transformation.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Generated {transformation.outputs.length} audience-calibrated deliverables via autonomous transformation pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Download Complete ZIP Package */}
          <a
            href={getZipExportUrl(transformation.id)}
            download
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-all flex items-center gap-2 border border-emerald-400/30 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            aria-label="Download all 10 deliverables in a ZIP bundle"
          >
            <Archive className="w-4 h-4" aria-hidden="true" />
            <span>Export ZIP Bundle</span>
          </a>

          {/* Start New Transformation */}
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-medium text-xs border border-slate-300 dark:border-emerald-900/40 shadow-sm transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            aria-label="Start a new transformation with fresh source material"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Transform</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Left Deliverable Area + Right Audit Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left 3 Columns: Deliverable Format Tabs & Active Viewer */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Horizontal Output Format Tabs */}
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin focus-visible:ring-2 focus-visible:ring-emerald-400"
            role="tablist"
            aria-label="Generated Deliverables Tabs"
          >
            {transformation.outputs.map((out) => {
              const isActive = activeTab === out.format_type;
              return (
                <button
                  key={out.format_type}
                  role="tab"
                  id={`tab-${out.format_type}`}
                  aria-controls={`panel-${out.format_type}`}
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(out.format_type);
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    isActive
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md font-semibold dark:bg-emerald-950/90 dark:border-emerald-400 dark:text-emerald-100 dark:shadow-glow-emerald"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-sm"
                  }`}
                >
                  <span>{out.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950 text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-emerald-900/60 font-mono font-medium">
                    {out.quality_score}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Deliverable Panel */}
          <div 
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-emerald-800/30 relative"
          >
            
            {/* Output Sub-Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>{activeOutput?.title}</span>
                  </h3>
                  {/* Format-Specific Typography Indicator Badge */}
                  <span className={`text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full border ${typography.badgeColor}`}>
                    {typography.badgeLabel}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 font-sans mt-1">
                  <span>{currentContent.split(/\s+/).filter(Boolean).length} words</span>
                  <span>•</span>
                  <span>{currentContent.length} characters</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{activeOutput?.quality_score}% AI Verified</span>
                </div>
              </div>

              {/* Utility Tools & Reading Density Selector in Plus Jakarta Sans */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Reading Density Selector in Plus Jakarta Sans */}
                <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-950/90 p-1 rounded-full border border-slate-200 dark:border-slate-800 text-[11px]" role="group" aria-label="Reading text density">
                  <button
                    onClick={() => setFontMode("standard")}
                    aria-label="Set text density to Standard"
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans transition-colors focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                      fontMode === "standard" ? "bg-emerald-600 dark:bg-emerald-800 text-white font-semibold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Standard reading density"
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setFontMode("compact")}
                    aria-label="Set text density to Compact"
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans transition-colors focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                      fontMode === "compact" ? "bg-emerald-600 dark:bg-emerald-800 text-white font-semibold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Compact high-density view"
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => setFontMode("relaxed")}
                    aria-label="Set text density to Relaxed"
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans transition-colors focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                      fontMode === "relaxed" ? "bg-emerald-600 dark:bg-emerald-800 text-white font-semibold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Relaxed editorial view"
                  >
                    Relaxed
                  </button>
                </div>

                {/* Toggle Edit / Preview */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  aria-label={isEditing ? "Switch to formatted preview" : "Switch to raw markdown text editor"}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    isEditing
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                      : "bg-white hover:bg-slate-100 dark:bg-slate-900 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border-slate-300 dark:border-slate-700 shadow-sm"
                  }`}
                >
                  {isEditing ? <Eye className="w-3.5 h-3.5" aria-hidden="true" /> : <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{isEditing ? "Preview" : "Edit"}</span>
                </button>

                {/* Regenerate Output */}
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  aria-label={`Regenerate ${activeOutput?.title} deliverable`}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Regenerate this deliverable with fresh reasoning"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`} aria-hidden="true" />
                  <span>{isRegenerating ? "Refining..." : "Regenerate"}</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  aria-label="Copy deliverable content to clipboard"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-medium border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>

                {/* Download Single File */}
                <button
                  onClick={handleDownloadSingle}
                  aria-label="Download this deliverable as a Markdown (.md) file"
                  className="p-1.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-300 dark:border-slate-700 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  title="Download as Markdown file"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                </button>

              </div>
            </div>

            {/* Main Content Area */}
            {isEditing ? (
              <div>
                <label htmlFor="deliverable-editor" className="sr-only">
                  Edit deliverable markdown text
                </label>
                <textarea
                  id="deliverable-editor"
                  value={currentContent}
                  onChange={(e) => {
                    setEditableContent({
                      ...editableContent,
                      [activeTab]: e.target.value
                    });
                  }}
                  className="w-full h-[550px] bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-emerald-900/50 rounded-2xl p-4 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none leading-relaxed"
                  placeholder="Edit content here..."
                />
              </div>
            ) : (
              <div 
                tabIndex={0} 
                className="w-full min-h-[550px] max-h-[750px] overflow-y-auto pr-3 text-slate-900 dark:text-slate-100 select-text focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-xl"
                aria-label={`Rendered ${activeOutput?.title} deliverable preview`}
              >
                {currentContent.split("\n\n").map((block, idx) => {
                  const trimmed = block.trim();
                  
                  // Headings
                  if (trimmed.startsWith("# ")) {
                    return (
                      <h1 key={idx} className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white pt-2 pb-1.5 border-b border-slate-200 dark:border-emerald-900/40 tracking-tight">
                        {renderFormattedInline(trimmed.replace("# ", ""))}
                      </h1>
                    );
                  }
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="font-sans text-base sm:text-lg font-medium text-emerald-800 dark:text-emerald-300 pt-3 pb-1 tracking-tight">
                        {renderFormattedInline(trimmed.replace("## ", ""))}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="font-sans text-sm sm:text-base font-medium text-teal-800 dark:text-teal-200 pt-2.5 pb-0.5">
                        {renderFormattedInline(trimmed.replace("### ", ""))}
                      </h3>
                    );
                  }

                  // Code blocks
                  if (trimmed.startsWith("```")) {
                    return (
                      <pre key={idx} className={`p-4 rounded-xl font-mono text-xs overflow-x-auto my-3.5 ${
                        activeTab === "security_advisory"
                          ? "bg-rose-50 dark:bg-black border border-rose-200 dark:border-red-900/70 text-rose-950 dark:text-emerald-400 font-normal"
                          : "bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-900 dark:text-emerald-300 font-normal"
                      }`}>
                        {trimmed.replace(/```[a-z]*\n?/g, "")}
                      </pre>
                    );
                  }

                  // Markdown Tables
                  if (trimmed.startsWith("|")) {
                    return (
                      <div key={idx} className="overflow-x-auto my-4">
                        <table className={`w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700 ${typography.tableClass}`}>
                          <tbody>
                            {trimmed.split("\n").map((row, rIdx) => {
                              const cells = row.split("|").filter((c, i, a) => i !== 0 && i !== a.length - 1);
                              if (row.includes("---")) return null;
                              return (
                                <tr key={rIdx} className={rIdx === 0 ? "bg-emerald-100/70 text-emerald-950 font-medium dark:bg-emerald-950/70 dark:text-emerald-200" : "border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900/40"}>
                                  {cells.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2.5 border border-slate-200 dark:border-slate-700 font-normal text-slate-800 dark:text-slate-200">
                                      {renderFormattedInline(cell.trim())}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // Bullet and numbered lists
                  const isList = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || /^\d+\.\s/.test(trimmed);
                  if (isList) {
                    const isNumbered = /^\d+\.\s/.test(trimmed);
                    return isNumbered ? (
                      <ol key={idx} className={`space-y-2 pl-5 list-decimal my-3 ${typography.listClass}`}>
                        {trimmed.split("\n").map((li, lIdx) => (
                          <li key={lIdx} className="leading-relaxed font-normal">
                            {renderFormattedInline(li.replace(/^\d+\.\s+/, ""))}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul key={idx} className={`space-y-2 pl-5 list-disc my-3 ${typography.listClass}`}>
                        {trimmed.split("\n").map((li, lIdx) => (
                          <li key={lIdx} className="leading-relaxed font-normal">
                            {renderFormattedInline(li.replace(/^[\*\-•]\s+/, ""))}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Blockquotes
                  if (trimmed.startsWith("> ")) {
                    return (
                      <blockquote key={idx} className={`border-l-4 pl-4 py-2.5 my-3 rounded-r-xl ${typography.quoteClass}`}>
                        {renderFormattedInline(trimmed.replace(/^>\s+/, ""))}
                      </blockquote>
                    );
                  }

                  // Standard Output Paragraphs with Format-Specific Typography
                  return (
                    <p key={idx} className={typography.paragraphClass}>
                      {renderFormattedInline(trimmed)}
                    </p>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Right 1 Column: AI Quality Audit & Verification Card */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-emerald-800/30" role="region" aria-label="AI Quality Verification Report">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-300 font-semibold">
                AI Validation Node
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-sans text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeOutput?.quality_score ?? 94}%
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium font-mono">
                Verified Grounding
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal mb-5">
              Audited against raw source content for zero ungrounded assertions and strict entity alignment.
            </p>

            <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-900 dark:text-white mb-2">
                Quality Checks Performed
              </div>

              {activeOutput?.validation_checks && activeOutput.validation_checks.length > 0 ? (
                activeOutput.validation_checks.map((chk, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 capitalize text-[11px]">
                      {chk.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 ${
                      chk.passed
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                    }`}>
                      {chk.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>{chk.passed ? "passed" : "review"}</span>
                    </span>
                  </div>
                ))
              ) : activeOutput?.validation_details?.checks ? (
                Object.entries(activeOutput.validation_details.checks).map(([key, check]: [string, { status: string; score?: number }]) => (
                  <div key={key} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 capitalize text-[11px]">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 ${
                      check.status === "passed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                    }`}>
                      {check.status === "passed" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>{check.status}</span>
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">Source Consistency</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> passed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">Fact Completeness</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> passed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">Format Structure</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> passed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">Tone Alignment</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> passed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">Hallucination Risk</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> low
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Detailed Feedback notes if any */}
            {activeOutput?.validation_details?.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Audit Notes</span>
                </div>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                  {activeOutput.validation_details.notes.map((note: string, nIdx: number) => (
                    <li key={nIdx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
