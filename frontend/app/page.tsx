"use client";

import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ChevronRight,
  Database,
  RefreshCw,
  GitBranch,
  Play
} from "lucide-react";
import OutputFormatCard from "@/components/OutputFormatCard";
import { fetchFormats } from "@/lib/api";
import { FormatMetadata } from "@/types";

export default function LandingPage() {
  const [formats, setFormats] = useState<FormatMetadata[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string>("executive_summary");

  useEffect(() => {
    fetchFormats()
      .then(setFormats)
      .catch(() => {
        // Fallback static list if backend is starting
        setFormats([
          { id: "executive_summary", name: "Executive Summary", description: "Strategic C-level briefing and risk matrix", icon: "Briefcase", category: "Leadership" },
          { id: "security_advisory", name: "Security Advisory", description: "Incident post-mortem, IoCs & containment steps", icon: "ShieldAlert", category: "Technical" },
          { id: "social_media", name: "Social Media Suite", description: "Twitter/X threads, LinkedIn & Instagram copy", icon: "Share2", category: "Marketing" },
          { id: "video_script", name: "Video Script", description: "Timestamped broadcast narration & camera directions", icon: "Video", category: "Media" },
          { id: "presentation", name: "Presentation Content", description: "8-10 Slide deck blueprints with speaker notes", icon: "Layout", category: "Communication" },
          { id: "infographic", name: "Infographic Blueprint", description: "Data hierarchy, stat callouts & visual layout", icon: "BarChart3", category: "Design" },
          { id: "press_release", name: "Press Release", description: "AP-standard newswire announcement with quotes", icon: "Newspaper", category: "PR" },
          { id: "key_points", name: "Key Takeaways", description: "Scannable digest highlighting crucial facts & dates", icon: "CheckSquare", category: "Productivity" },
          { id: "faq", name: "Interactive FAQ", description: "Foundational, operational & strategic Q&As", icon: "HelpCircle", category: "Education" },
          { id: "custom_output", name: "Custom Transformation", description: "User-defined custom instructions & structure", icon: "Sparkles", category: "Custom" },
        ]);
      });
  }, []);

  return (
    <div className="w-full space-y-24 py-12 sm:py-16">
      
      {/* 1. HERO SECTION (Inspired by clear-path Templates: Serif typography, luminous glass, curved lines) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Subtle decorative curved ambient stroke */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 pointer-events-none opacity-20">
          <svg viewBox="0 0 1000 300" className="w-full h-full text-emerald-400 fill-none stroke-current" strokeWidth="1.5">
            <path d="M 0,150 C 250,20 750,280 1000,100" />
          </svg>
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          
          {/* Platform Innovation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>GenAI Multi-Format Transformation Engine</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Transform <span className="text-emerald-600 dark:text-emerald-400">One Source</span> Into Every Story.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One master document in. <strong className="font-semibold text-slate-900 dark:text-white">10 audience-calibrated, verified deliverables out.</strong>
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="/workspace"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-400/30 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Start Transforming</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>

            <a
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm border border-slate-300 dark:border-emerald-900/40 shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>View Dashboard</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

        </div>

        {/* 2. FLOATING FROSTED GLASS HERO PREVIEW */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-emerald-500/20 shadow-xl relative overflow-hidden">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Left Column: Source Input Card */}
              <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-emerald-900/40 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <FileText className="w-3.5 h-3.5" /> MASTER SOURCE
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">1,420 words</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono line-clamp-4 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  INCIDENT POST-MORTEM & TECHNICAL INVESTIGATION REPORT: INC-2026-APEX-8841. Zero-day vulnerability in legacy cryptographic module exploited across GovCloud...
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span>Modality: PDF / TXT / DOCX</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready ✓</span>
                </div>
              </div>

              {/* Center Column: Autonomous Multi-Agent Orchestration Core */}
              <div className="text-center space-y-3 px-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-md">
                  <GitBranch className="w-6 h-6 animate-pulse-subtle" />
                </div>
                <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-white">
                  Autonomous 7-Stage Core
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Autonomous context extraction, parallel multi-format planning, and multi-metric fact auditing.
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono border border-emerald-200 dark:border-emerald-800">
                  99.2% Fact Grounding
                </div>
              </div>

              {/* Right Column: Generated Deliverable Stack */}
              <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-emerald-900/40 space-y-2.5 shadow-sm">
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                  SIMULTANEOUS DELIVERABLES
                </div>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-sans">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                    <span>Executive Summary</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">98% Verified</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Security Advisory & IoCs</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">96% Verified</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Social Media Suite (X/LinkedIn)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">95% Verified</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span>Video Production Script</span>
                    <span className="text-emerald-400 text-[10px] font-mono">94% Verified</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 3. IMPACT STATS GRID (Directly inspired by clear-path Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-y border-slate-200 dark:border-emerald-900/30 py-12">
          
          <div className="max-w-3xl mb-8">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              From raw source records to verified deliverables, these numbers reflect the speed of autonomous transformation.
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                450+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Transformations completed
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                80+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Enterprise documents processed
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                10+
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Supported publication formats
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                99.2%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                AI verification accuracy score
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SUPPORTED OUTPUT FORMATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-emerald-400 uppercase font-semibold">
            Comprehensive Deliverables
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            10 Intelligent Formats for Every Audience Tier
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From technical engineering teams to C-suite executives and the general public, each output is structurally calibrated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {formats.map((fmt) => (
            <OutputFormatCard
              key={fmt.id}
              id={fmt.id}
              name={fmt.name}
              description={fmt.description}
              iconName={fmt.icon}
              category={fmt.category}
              isSelected={selectedPreview === fmt.id}
              onToggle={(id) => setSelectedPreview(id)}
            />
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA CALLOUT */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Experience Autonomous Content Transformation Today.
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Try our realistic Cyber Incident report or paste any document to test the full pipeline.
        </p>
        <a
          href="/workspace"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-md transition-all border border-emerald-400/30 hover:scale-105"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Open Transformation Workspace</span>
        </a>
      </section>

    </div>
  );
}
