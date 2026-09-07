import React from 'react';
import { X, FileArchive, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TRANSFORMATION_ITEMS } from '../utils/constants';
import { api } from '../services/api';

export default function DownloadModal({
  isOpen,
  onClose,
  docId,
  docTitle = 'Document',
  transformations = {},
  analysis = {}
}) {
  if (!isOpen) return null;

  const handleDownloadZip = () => {
    const url = api.getPackDownloadUrl(docId);
    window.open(url, '_blank');
  };

  const handleDownloadSingle = (type) => {
    const url = api.getSingleDownloadUrl(docId, type);
    window.open(url, '_blank');
  };

  const totalWords = Object.values(transformations).reduce((acc, text) => {
    return acc + (text ? text.trim().split(/\s+/).length : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <FileArchive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Export Output Pack</h2>
              <p className="text-xs text-slate-400">
                Download all 6 repurposed assets for <span className="text-slate-200 font-semibold">{docTitle}</span> in one structured archive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary ZIP Action Box */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 uppercase">
                Recommended
              </span>
              <h3 className="text-base font-bold text-white mt-1">Complete Output Pack (.zip)</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Contains all 6 formatted Markdown files, metadata analysis JSON, and a README usage manifest.
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-3">
                <span>
                  {analysis?.word_count ? `${analysis.word_count.toLocaleString()} source words • ` : ''}
                  {totalWords.toLocaleString()} repurposed words
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ready to deploy</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP Bundle</span>
            </button>
          </div>
        </div>

        {/* Pack Manifest Preview */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Package Manifest Contents
          </h4>
          <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 divide-y divide-slate-800/60 text-xs">
            {TRANSFORMATION_ITEMS.map((item, index) => {
              const content = transformations[item.id] || '';
              const words = content ? content.trim().split(/\s+/).length : 0;
              return (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-medium text-slate-200">{item.label}</span>
                      <span className="text-[11px] text-slate-500 ml-2 font-mono">
                        0{index + 1}_{item.id}.md
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-[11px]">{words} words</span>
                    <button
                      onClick={() => handleDownloadSingle(item.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>.md</span>
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-3 flex items-center justify-between text-slate-400 bg-slate-950/80">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>analysis_report.json &amp; README.md</span>
              </div>
              <span className="text-[11px] text-slate-500">Metadata &amp; documentation</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
