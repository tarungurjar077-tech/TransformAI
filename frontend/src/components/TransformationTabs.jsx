import React from 'react';
import { RefreshCw, Sparkles, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { ICON_MAP, TRANSFORMATION_ITEMS } from '../utils/constants';

export default function TransformationTabs({
  activeTab,
  onTabChange,
  transformations = {},
  generatingTypes = {},
  isBatchGenerating = false,
  selectedTone = 'balanced',
  onToneChange,
  selectedPersona = 'executive',
  onPersonaChange,
  selectedLength = 'standard',
  onLengthChange,
  onRegenerateCurrent,
  onRegenerateAll
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* The 6 Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-slate-700">
          {TRANSFORMATION_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.id] || FileText;
            const isReady = Boolean(transformations[item.id]);
            const isGenerating = Boolean(generatingTypes[item.id]);
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>

                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-1" />
                ) : isReady ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Persona, Length, Tone & Regeneration Controls */}
        <div className="flex items-center space-x-2 self-end lg:self-auto flex-wrap gap-y-2">
          {/* Persona Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Persona:</span>
            <select
              value={selectedPersona || 'executive'}
              onChange={(e) => onPersonaChange && onPersonaChange(e.target.value)}
              className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="executive" className="bg-slate-900 text-white">C-Suite Executive</option>
              <option value="technical" className="bg-slate-900 text-white">Technical Engineer</option>
              <option value="creator" className="bg-slate-900 text-white">Viral Creator / Social</option>
              <option value="investor" className="bg-slate-900 text-white">Investor / Board</option>
              <option value="customer" className="bg-slate-900 text-white">Customer / Client</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Tone:</span>
            <select
              value={selectedTone}
              onChange={(e) => onToneChange(e.target.value)}
              className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="balanced" className="bg-slate-900 text-white">Balanced</option>
              <option value="executive" className="bg-slate-900 text-white">Executive</option>
              <option value="conversational" className="bg-slate-900 text-white">Conversational</option>
              <option value="punchy" className="bg-slate-900 text-white">Viral / Punchy</option>
              <option value="technical" className="bg-slate-900 text-white">Deep-Dive</option>
            </select>
          </div>

          {/* Length Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Length:</span>
            <select
              value={selectedLength || 'standard'}
              onChange={(e) => onLengthChange && onLengthChange(e.target.value)}
              className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="concise" className="bg-slate-900 text-white">Concise (TL;DR)</option>
              <option value="standard" className="bg-slate-900 text-white">Standard</option>
              <option value="comprehensive" className="bg-slate-900 text-white">Comprehensive</option>
            </select>
          </div>

          {/* Regenerate Single */}
          <button
            onClick={onRegenerateCurrent}
            disabled={isBatchGenerating || generatingTypes[activeTab]}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
            title="Regenerate active transformation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generatingTypes[activeTab] ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Tweak</span>
          </button>

          {/* Regenerate All 6 */}
          <button
            onClick={onRegenerateAll}
            disabled={isBatchGenerating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="Regenerate all 6 transformations in parallel"
          >
            {isBatchGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Re-run 6</span>
          </button>
        </div>
      </div>
    </div>
  );
}
