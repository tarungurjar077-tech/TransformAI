import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../utils/sampleDocuments';

export default function DocumentUpload({ onUploadComplete, isProcessing }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const wordCount = pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0;
  const charCount = pastedText.length;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'docx', 'txt', 'md', 'doc'].includes(ext)) {
        setFile(droppedFile);
        setErrorMessage('');
      } else {
        setErrorMessage('Unsupported format. Please upload a PDF, DOCX, TXT, or Markdown file.');
      }
    }
  };

  const handleSelectPreset = (preset) => {
    setActiveTab('paste');
    setPastedTitle(preset.title);
    setPastedText(preset.text);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (activeTab === 'upload') {
      if (!file) {
        setErrorMessage('Please select or drop a document to proceed.');
        return;
      }
      onUploadComplete({ type: 'file', file });
    } else {
      if (!pastedText.trim()) {
        setErrorMessage('Please paste or write your document content.');
        return;
      }
      onUploadComplete({
        type: 'text',
        title: pastedTitle.trim() || 'Untitled Document',
        text: pastedText.trim(),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Hero Welcome */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Content Repurposing Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transform 1 Master Document into <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">6 High-Impact Formats</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Upload any PDF, DOCX, whitepaper, or meeting notes. TransformAI analyzes the source and automatically generates executive summaries, social threads, study guides, articles, slide outlines, and email campaigns in one click.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 pb-4 mb-6 justify-between items-center flex-wrap gap-4">
          <div className="flex space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => { setActiveTab('upload'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Document (PDF, DOCX, TXT)
            </button>
            <button
              onClick={() => { setActiveTab('paste'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'paste'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Raw Text / Markdown
            </button>
          </div>

          {/* Quick Presets Prompt */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Try sample:</span>
            <div className="flex gap-1.5 flex-wrap">
              {SAMPLE_DOCUMENTS.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectPreset(doc)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 text-slate-300 rounded border border-slate-700 text-[11px] transition-colors"
                >
                  Preset {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: File Dropzone */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-cyan-400 bg-cyan-950/20'
                : file
                ? 'border-emerald-500/60 bg-emerald-950/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt,.md,.markdown"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 ring-1 ring-cyan-500/30">
              <UploadCloud className="w-8 h-8" />
            </div>

            {file ? (
              <div>
                <p className="text-emerald-400 font-semibold text-lg">{file.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB &bull; Click or drop another file to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-base font-medium text-slate-200">
                  Drag and drop your document here, or <span className="text-cyan-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Supports PDF, Microsoft Word (.docx), Plain Text (.txt), and Markdown (.md)
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Paste Raw Text */
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Document Title (e.g. Q3 Strategic Planning Memo)"
              value={pastedTitle || ''}
              onChange={(e) => setPastedTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <div className="relative">
              <textarea
                rows={10}
                placeholder="Paste your source document, transcript, research findings, or memo text here..."
                value={pastedText || ''}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono resize-y"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 px-2 py-1">
                <span>{wordCount} words &bull; {charCount} characters</span>
                {wordCount > 0 && (
                  <span className="text-cyan-400">~{Math.max(1, Math.ceil(wordCount / 225))} min read</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Processing Document & Synthesizing 6 Outputs...</span>
              </>
            ) : (
              <>
                <span>Analyze & Transform Document</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
