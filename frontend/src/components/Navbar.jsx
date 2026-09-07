import React from 'react';
import { Sparkles, Key, Clock, Plus, Zap } from 'lucide-react';

export default function Navbar({
  apiKey,
  onOpenApiKeyModal,
  onOpenHistory,
  historyCount = 0,
  onNewDocument,
  hasActiveDoc = false,
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewDocument}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Transform<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Multi-Format Document Repurposing
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Engine Status Badge */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              apiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
            }`}
            title="Click to configure Gemini API Key"
          >
            <Zap className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <span className="hidden md:inline">
              {apiKey ? 'Gemini 2.5 Flash Active' : 'Intelligent Fallback Engine'}
            </span>
            <span className="md:hidden">
              {apiKey ? 'Gemini' : 'Offline'}
            </span>
          </button>

          {/* API Key Modal Trigger */}
          <button
            onClick={onOpenApiKeyModal}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="API Key Settings"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Document Reset */}
          {hasActiveDoc && (
            <button
              onClick={onNewDocument}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Document</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
