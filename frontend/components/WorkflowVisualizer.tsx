"use client";

import React from "react";
import { 
  FileText, 
  Search, 
  Network, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface WorkflowVisualizerProps {
  currentStage?: string;
  isTransforming?: boolean;
  completedStages?: string[];
}

const STAGES = [
  { id: "source_ingestion", name: "Source Ingestion", desc: "Text & file extraction, word/char indexing", icon: FileText },
  { id: "content_analysis", name: "Content Analysis", desc: "Core thesis, semantic domain categorization", icon: Search },
  { id: "context_extraction", name: "Context Extraction", desc: "Facts, entities, dates & metrics isolation", icon: Network },
  { id: "output_planning", name: "Output Planning", desc: "Format-specific prompt & parameter strategy", icon: Compass },
  { id: "content_generation", name: "Multi-Agent Generation", desc: "OpenAI GPT-5.6 generation across all outputs", icon: Sparkles },
  { id: "quality_validation", name: "Quality Validation", desc: "Fact consistency, hallucination risk audit", icon: ShieldCheck },
  { id: "final_formatting", name: "Final Formatting", desc: "Markdown compilation & export packaging", icon: Layers },
];

export default function WorkflowVisualizer({
  currentStage,
  isTransforming = false,
  completedStages = []
}: WorkflowVisualizerProps) {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 shadow-glow-sage relative overflow-hidden border border-emerald-800/30">
      
      {/* Decorative flowing curved SVG stroke */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-15">
        <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-400 fill-none stroke-current" strokeWidth="1">
          <path d="M 0,100 C 60,20 140,180 200,100" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              Autonomous Pipeline Orchestration
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous 7-Stage Multi-Output Orchestration
          </h3>
        </div>
        
        {isTransforming && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>AI Pipeline Active: Processing Nodes...</span>
          </div>
        )}
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative z-10">
        {STAGES.map((stg, idx) => {
          const Icon = stg.icon;
          const isCompleted = completedStages.includes(stg.id);
          const isCurrent = currentStage === stg.id;

          let statusClass = "bg-slate-900/50 border-slate-800/80 text-slate-400";
          if (isCompleted) {
            statusClass = "bg-emerald-950/40 border-emerald-600/40 text-emerald-300 shadow-sm";
          } else if (isCurrent) {
            statusClass = "bg-emerald-900/60 border-emerald-400 text-white ring-2 ring-emerald-500/40 shadow-glow-emerald";
          }

          return (
            <div
              key={stg.id}
              className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${statusClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCurrent ? "bg-emerald-500 text-slate-950" : isCompleted ? "bg-emerald-900/80 text-emerald-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    {isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                </div>

                <h4 className="text-xs font-semibold text-white mb-1 leading-snug">
                  {stg.name}
                </h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {stg.desc}
                </p>
              </div>

              {/* Progress pill */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[9px] font-mono uppercase tracking-wider">
                {isCurrent ? (
                  <span className="text-emerald-400 font-bold">Executing</span>
                ) : isCompleted ? (
                  <span className="text-emerald-500">Verified</span>
                ) : (
                  <span className="text-slate-400">Ready</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
