import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Edit3,
  Eye,
  Columns,
  FileArchive,
  Save,
  Loader2,
  FileText,
  Sparkles
} from 'lucide-react';
import { TRANSFORMATION_ITEMS } from '../utils/constants';
import {
  TwitterThreadMockup,
  LinkedInMockup,
  SlideDeckPlayer,
  EmailClientMockup,
  FaqAccordionMockup,
  ExecutiveMemoMockup
} from './ChannelMockups';

// Lightweight, resilient Markdown renderer without external AST dependencies
function SimpleMarkdownRenderer({ content }) {
  if (!content) {
    return (
      <div className="text-slate-500 italic py-12 text-center">
        No content generated yet. Click "Tweak" or run transformation.
      </div>
    );
  }

  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inCode = false;
  let codeBlock = [];

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const [header, _divider, ...body] = tableRows;
      const parseCells = (row) =>
        row
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());

      const headers = header ? parseCells(header) : [];

      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-4 rounded-xl border border-slate-800 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-cyan-300">
                {headers.map((h, i) => (
                  <th key={i} className="p-3 border-b border-slate-700 font-semibold">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {body.map((rowStr, rIdx) => {
                const cells = parseCells(rowStr);
                return (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-300 leading-relaxed">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const flushCode = (key) => {
    if (codeBlock.length > 0) {
      elements.push(
        <pre
          key={`code-${key}`}
          className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-cyan-200 my-4"
        >
          <code>{codeBlock.join('\n')}</code>
        </pre>
      );
      codeBlock = [];
      inCode = false;
    }
  };

  function renderInline(text) {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCode) {
        flushCode(i);
      } else {
        if (inTable) flushTable(i);
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBlock.push(line);
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl sm:text-3xl font-extrabold text-white mt-6 mb-4 tracking-tight pb-2 border-b border-slate-800">
          {renderInline(line.replace('# ', ''))}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl font-bold text-cyan-300 mt-6 mb-3 tracking-tight">
          {renderInline(line.replace('## ', ''))}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base sm:text-lg font-semibold text-slate-100 mt-5 mb-2">
          {renderInline(line.replace('### ', ''))}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-cyan-500 bg-cyan-950/20 px-4 py-3 my-3 rounded-r-xl text-slate-300 text-sm italic"
        >
          {renderInline(line.replace('> ', ''))}
        </blockquote>
      );
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-sm text-slate-300 my-1 leading-relaxed">
          {renderInline(line.replace(/^[-•*]\s+/, ''))}
        </li>
      );
    } else if (/^\d+\.\s+/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
      elements.push(
        <li key={i} className="ml-5 list-decimal text-sm text-slate-300 my-1 leading-relaxed">
          {renderInline(match ? match[2] : line)}
        </li>
      );
    } else if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={i} className="border-slate-800 my-6" />);
    } else if (line.trim().length > 0) {
      elements.push(
        <p key={i} className="text-sm text-slate-300 my-2.5 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }

  if (inTable) flushTable('end');
  if (inCode) flushCode('end');

  return <div className="space-y-1">{elements}</div>;
}

export default function OutputPackViewer({
  docTitle,
  sourceText = '',
  activeTab,
  content = '',
  isGenerating = false,
  onSaveContent,
  onOpenDownloadModal,
}) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('mockup'); // 'mockup' | 'document' | 'split' | 'edit'
  const [editableContent, setEditableContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [socialSubTab, setSocialSubTab] = useState('twitter'); // 'twitter' | 'linkedin'

  useEffect(() => {
    setEditableContent(content);
  }, [content, activeTab]);

  const activeMeta = TRANSFORMATION_ITEMS.find((t) => t.id === activeTab) || {
    label: 'Transformation',
    short: 'Output'
  };

  const outputWords = (editableContent || '').trim() ? (editableContent || '').trim().split(/\s+/).length : 0;
  const sourceWords = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 1;
  const compressionRatio = Math.round((outputWords / sourceWords) * 100);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadSingleMd = () => {
    const blob = new Blob([editableContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}_${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveContent(activeTab, editableContent);
      setViewMode('document');
    } finally {
      setIsSaving(false);
    }
  };

  // Render the channel-specific mockup
  const renderChannelMockup = () => {
    if (activeTab === 'executive_summary') {
      return <ExecutiveMemoMockup content={editableContent} title={docTitle} />;
    }
    if (activeTab === 'social_media') {
      return (
        <div className="space-y-4">
          {/* Sub-channel switcher */}
          <div className="flex justify-center space-x-2 pb-2">
            <button
              onClick={() => setSocialSubTab('twitter')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                socialSubTab === 'twitter'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🐦 Twitter / X Thread Feed
            </button>
            <button
              onClick={() => setSocialSubTab('linkedin')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                socialSubTab === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              💼 LinkedIn Feed Post
            </button>
          </div>

          {socialSubTab === 'twitter' ? (
            <TwitterThreadMockup content={editableContent} title={docTitle} />
          ) : (
            <LinkedInMockup content={editableContent} title={docTitle} />
          )}
        </div>
      );
    }
    if (activeTab === 'presentation_deck') {
      return <SlideDeckPlayer content={editableContent} title={docTitle} />;
    }
    if (activeTab === 'email_newsletter') {
      return <EmailClientMockup content={editableContent} title={docTitle} />;
    }
    if (activeTab === 'faq_study_guide') {
      return <FaqAccordionMockup content={editableContent} />;
    }
    if (activeTab === 'blog_post') {
      return (
        <div className="max-w-2xl mx-auto my-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Editorial Article &bull; ~{Math.max(1, Math.ceil(outputWords / 225))} min read
            </span>
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                TA
              </div>
              <div>
                <p className="text-xs font-bold text-white">TransformAI Staff Writer</p>
                <p className="text-[11px] text-slate-400">Published in Strategic Insights &bull; Verified AI Review</p>
              </div>
            </div>
          </div>
          <div className="prose prose-invert max-w-none text-slate-200">
            <SimpleMarkdownRenderer content={editableContent} />
          </div>
        </div>
      );
    }
    return <SimpleMarkdownRenderer content={editableContent} />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[620px] backdrop-blur-xl">
      {/* Studio Header Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">{activeMeta.label}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                {outputWords} words
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {compressionRatio}% of source size &bull; ~{Math.max(1, Math.ceil(outputWords / 225))} min read
            </p>
          </div>
        </div>

        {/* View Mode Switcher (USP Feature) */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('mockup')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mockup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Interactive simulated channel preview"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Channel Mockup</span>
          </button>

          <button
            onClick={() => setViewMode('document')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'document'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Standard Markdown Document View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Side-by-side comparison with original source"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Compare</span>
          </button>

          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'edit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Direct text editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Save edits if in edit mode */}
          {viewMode === 'edit' && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Edits</span>
            </button>
          )}

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Copy formatted markdown to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download Single Markdown */}
          <button
            onClick={handleDownloadSingleMd}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Download this transformation as .md"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">.md</span>
          </button>

          {/* 1-Click Output Pack Modal Trigger */}
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all active:scale-95"
            title="Download complete ZIP package with all 6 transformations"
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span>Output Pack (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Source Document (when Split View is enabled) */}
        {viewMode === 'split' && (
          <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-950/60">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold px-4">
              <span>Original Master Source Document</span>
              <span>{sourceWords.toLocaleString()} words</span>
            </div>
            <div className="p-6 overflow-y-auto max-h-[750px] text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-wrap select-text">
              {sourceText || 'No source text available.'}
            </div>
          </div>
        )}

        {/* Right Side / Main Viewport */}
        <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col p-6 sm:p-8 overflow-y-auto max-h-[780px]`}>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Synthesizing {activeMeta.label}...</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                TransformAI is repurposing the core ideas, figures, and narrative into a publication-ready output.
              </p>
            </div>
          ) : viewMode === 'edit' ? (
            <div className="flex-1 flex flex-col">
              <div className="text-xs text-amber-400 font-medium mb-2 flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editing Mode: Make adjustments below, then click "Save Edits" above to persist.</span>
              </div>
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={22}
                className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-y leading-relaxed"
              />
            </div>
          ) : viewMode === 'mockup' ? (
            <div>{renderChannelMockup()}</div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <SimpleMarkdownRenderer content={editableContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
