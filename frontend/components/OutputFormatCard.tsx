"use client";

import React from "react";
import { 
  Briefcase, 
  ShieldAlert, 
  Share2, 
  Video, 
  Layout, 
  BarChart3, 
  Newspaper, 
  CheckSquare, 
  HelpCircle, 
  Sparkles,
  Check
} from "lucide-react";

interface OutputFormatCardProps {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Briefcase,
  ShieldAlert,
  Share2,
  Video,
  Layout,
  BarChart3,
  Newspaper,
  CheckSquare,
  HelpCircle,
  Sparkles,
};

export default function OutputFormatCard({
  id,
  name,
  description,
  iconName,
  category,
  isSelected,
  onToggle
}: OutputFormatCardProps) {
  const IconComponent = ICON_MAP[iconName] || Sparkles;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${name}: ${description}. ${isSelected ? "Currently selected" : "Currently not selected"}`}
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all glass-card-hover border select-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
        isSelected
          ? "bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500/40 dark:bg-emerald-950/50 dark:border-emerald-400/80 dark:shadow-glow-emerald dark:ring-emerald-500/50"
          : "glass-panel border-slate-200 hover:border-emerald-500/60 hover:bg-slate-50 dark:border-emerald-900/30 dark:hover:border-emerald-600/60 dark:hover:bg-slate-900/50"
      }`}
    >
      {/* Top row: Icon, Category & Selection Checkbox */}
      <div className="flex items-center justify-between mb-3">
        <div 
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 dark:bg-emerald-500 dark:text-slate-950 dark:shadow-emerald-500/40"
              : "bg-slate-100 dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-900/50"
          }`}
          aria-hidden="true"
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-medium">
            {category}
          </span>
          <div 
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isSelected
                ? "bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-400 text-white dark:text-slate-950"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950/60 text-transparent"
            }`}
            aria-hidden="true"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
        {name}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[36px]">
        {description}
      </p>

      {/* Subtle bottom indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px]">
        <span className="font-mono text-slate-500 dark:text-slate-400">Target Deliverable</span>
        <span className={isSelected ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-slate-500 dark:text-slate-400"}>
          {isSelected ? "Selected ✓" : "Press to select"}
        </span>
      </div>
    </div>
  );
}
