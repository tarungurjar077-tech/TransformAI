import React, { useState } from 'react';
import { BarChart3, Clock, BookOpen, Tag, ChevronDown, ChevronUp, FileText, Compass } from 'lucide-react';

export default function SourceAnalysis({ analysis, docTitle, wordCount }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!analysis) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Source Document Intelligence</span>
              <span className="text-[11px] font-normal text-slate-400">({docTitle})</span>
            </h2>
            <p className="text-xs text-slate-400">Linguistic profile, reading level & key thematic extraction</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-4">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Words</span>
              </div>
              <p className="text-lg font-bold text-white">
                {(analysis.word_count || wordCount || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Reading Time</span>
              </div>
              <p className="text-lg font-bold text-white">
                {analysis.reading_time_mins || 1} min
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Readability Level</span>
              </div>
              <p className="text-sm font-bold text-white">
                {analysis.reading_level || 'General'}
                <span className="text-[11px] text-slate-400 font-normal ml-1">
                  (Grade {analysis.flesch_kincaid_grade})
                </span>
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Detected Tone</span>
              </div>
              <p className="text-sm font-bold text-white truncate">
                {analysis.detected_tone || 'Informative'}
              </p>
            </div>
          </div>

          {/* Key Themes Badges */}
          {analysis.key_themes && analysis.key_themes.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap gap-y-2 pt-1">
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                <span>Core Themes:</span>
              </span>
              {analysis.key_themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-cyan-300 border border-slate-700"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {/* Executive Snapshot */}
          {analysis.executive_snapshot && (
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-200/90 leading-relaxed italic">
              &ldquo;{analysis.executive_snapshot}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
