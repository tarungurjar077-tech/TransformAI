"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  Zap, 
  RefreshCw, 
  Trash2, 
  Sliders, 
  ShieldAlert, 
  ArrowRight,
  AlertCircle,
  Loader2,
  ChevronRight,
  Database,
  CheckCircle2,
  BookmarkCheck
} from "lucide-react";
import OutputFormatCard from "@/components/OutputFormatCard";
import WorkflowVisualizer from "@/components/WorkflowVisualizer";
import ResultsView from "@/components/ResultsView";
import { 
  fetchFormats, 
  fetchCybersecuritySample, 
  uploadFile, 
  runTransformation 
} from "@/lib/api";
import { FormatMetadata, Transformation, DocumentUploadResult } from "@/types";

const STAGE_LABELS: Record<string, string> = {
  source_ingestion: "Ingesting & indexing source content...",
  content_analysis: "Semantic domain & category analysis...",
  context_extraction: "Extracting facts, entities, dates & metrics...",
  output_planning: "Formulating tailored multi-format prompt plans...",
  content_generation: "Multi-agent generation via OpenAI GPT-5.6...",
  quality_validation: "Validating fact consistency & hallucination risk...",
  final_formatting: "Compiling verified deliverables & export packs..."
};

export default function WorkspacePage() {
  // Step navigation: 1 = Source, 2 = Select Formats, 3 = Transform / Results
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // Source State
  const [sourceText, setSourceText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<DocumentUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [sampleLoadedNotice, setSampleLoadedNotice] = useState<string | null>(null);

  // Formats & Configuration State
  const [formats, setFormats] = useState<FormatMetadata[]>([]);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([
    "executive_summary",
    "security_advisory",
    "social_media",
    "video_script",
    "presentation"
  ]);
  const [audience, setAudience] = useState<string>("Executive");
  const [tone, setTone] = useState<string>("Professional");
  const [language, setLanguage] = useState<string>("English");
  const [detailLevel, setDetailLevel] = useState<string>("Detailed");
  const [customInstructions, setCustomInstructions] = useState<string>("");

  // Transformation Execution State
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<string>("source_ingestion");
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [transformationResult, setTransformationResult] = useState<Transformation | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Load Formats on mount
  useEffect(() => {
    fetchFormats()
      .then(setFormats)
      .catch(() => {
        setFormats([
          { id: "executive_summary", name: "Executive Summary", description: "Strategic C-suite briefing and risk matrix", icon: "Briefcase", category: "Leadership" },
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

  // Quick-load Cybersecurity Incident Report
  const handleLoadCyberSample = async () => {
    try {
      const sample = await fetchCybersecuritySample();
      setSourceText(sample.content);
      setSelectedOutputs(sample.recommended_outputs);
      setUploadedFile(null);
      setSourceError(null);
      setSampleLoadedNotice("Sample Cybersecurity Report loaded (1,420 words). Ready for configuration!");
      setTimeout(() => setSampleLoadedNotice(null), 4000);
    } catch (e) {
      alert("Could not load sample. Please check that the backend is running.");
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSourceError(null);

    try {
      const result = await uploadFile(file);
      setUploadedFile(result);
      setSourceText(result.content);
    } catch (err: any) {
      setSourceError(err.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSourceText("");
  };

  const handleToggleOutput = (id: string) => {
    setSelectedOutputs((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Preset Selection Helpers (Sensible additions)
  const applyPreset = (presetOutputs: string[], defaultAudience: string, defaultTone: string) => {
    setSelectedOutputs(presetOutputs);
    setAudience(defaultAudience);
    setTone(defaultTone);
  };

  // Execute Transformation Pipeline
  const handleStartTransform = async () => {
    if (!sourceText.trim() || sourceText.trim().length < 10) {
      setSourceError("Please provide source text (minimum 10 characters).");
      setActiveStep(1);
      return;
    }

    if (selectedOutputs.length === 0) {
      alert("Please select at least one output format to generate.");
      setActiveStep(2);
      return;
    }

    setIsTransforming(true);
    setExecutionError(null);
    setActiveStep(3);

    const stages = [
      "source_ingestion",
      "content_analysis",
      "context_extraction",
      "output_planning",
      "content_generation",
      "quality_validation",
      "final_formatting"
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length - 1) {
        currentIdx += 1;
        setCurrentStage(stages[currentIdx]);
        setCompletedStages(stages.slice(0, currentIdx));
      }
    }, 650);

    try {
      const result = await runTransformation({
        content: sourceText,
        source_type: uploadedFile ? "file_upload" : "text",
        selected_outputs: selectedOutputs,
        audience,
        tone,
        language,
        detail_level: detailLevel,
        custom_instructions: customInstructions,
      });

      clearInterval(interval);
      setCompletedStages(stages);
      setTransformationResult(result);
    } catch (err: any) {
      clearInterval(interval);
      setExecutionError(err.message || "An error occurred during transformation.");
    } finally {
      setIsTransforming(false);
    }
  };

  const handleReset = () => {
    setTransformationResult(null);
    setExecutionError(null);
    setActiveStep(1);
  };

  // Word / character counts and reading time
  const words = sourceText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = sourceText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* If Result exists, show ResultsView */}
      {transformationResult ? (
        <ResultsView 
          transformation={transformationResult} 
          onReset={handleReset}
          onUpdateTransformation={setTransformationResult}
        />
      ) : (
        <>
          {/* Top Header & 3-Step Wizard Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-emerald-900/30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-emerald-400 uppercase font-semibold">
                  Autonomous Studio
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Step {activeStep} of 3</span>
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Transformation Workspace
              </h1>
            </div>

            {/* Accessible Step Navigation Pills */}
            <nav 
              role="tablist" 
              aria-label="Transformation Wizard Steps"
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-full border border-slate-200 dark:border-emerald-900/40 shadow-inner"
            >
              <button
                role="tab"
                id="step-1-tab"
                aria-selected={activeStep === 1}
                onClick={() => setActiveStep(1)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                  activeStep === 1
                    ? "bg-emerald-600 dark:bg-emerald-800 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                1. Source Content
              </button>

              <button
                role="tab"
                id="step-2-tab"
                aria-selected={activeStep === 2}
                onClick={() => {
                  if (!sourceText.trim()) {
                    setSourceError("Please enter or upload source content first.");
                    return;
                  }
                  setActiveStep(2);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                  activeStep === 2
                    ? "bg-emerald-600 dark:bg-emerald-800 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                2. Configure Outputs
              </button>

              <button
                role="tab"
                id="step-3-tab"
                aria-selected={activeStep === 3}
                onClick={handleStartTransform}
                disabled={isTransforming || !sourceText.trim()}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                  activeStep === 3
                    ? "bg-emerald-600 dark:bg-emerald-700 text-white shadow-md font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-40"
                }`}
              >
                <Zap className="w-3 h-3 fill-current text-white dark:text-emerald-300" aria-hidden="true" />
                <span>3. Transform</span>
              </button>
            </nav>
          </div>

          {/* =====================================================================
              STEP 1: SOURCE CONTENT (Paste or Upload)
             ===================================================================== */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn" role="tabpanel" aria-labelledby="step-1-tab">
              

              {/* Sample Loaded Toast Notice */}
              {sampleLoadedNotice && (
                <div 
                  className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>{sampleLoadedNotice}</span>
                </div>
              )}

              {/* Source Input Workspace: Drag-Drop Box + Text Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Upload Box (Col 1) */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel rounded-3xl p-6 border border-emerald-900/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>File Extraction</span>
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">PDF, DOCX, TXT</span>
                    </div>

                    <label 
                      htmlFor="document-upload-input"
                      className="border-2 border-dashed border-slate-300 dark:border-emerald-900/60 hover:border-emerald-500/60 focus-within:border-emerald-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/60 hover:bg-slate-100/60 dark:bg-slate-950/40 dark:hover:bg-slate-900/40 text-center group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        ) : (
                          <FileText className="w-6 h-6" aria-hidden="true" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-1">
                        {isUploading ? "Extracting document..." : "Choose or drag document"}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Supports TXT, PDF, DOCX (Max 15MB)
                      </span>
                      <input
                        id="document-upload-input"
                        type="file"
                        accept=".txt,.pdf,.docx,.md"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="sr-only"
                        aria-label="Upload document file in TXT, PDF, or DOCX format"
                      />
                    </label>

                    {/* Uploaded File Info Card */}
                    {uploadedFile && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                          <div className="truncate">
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{uploadedFile.filename}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {(uploadedFile.file_size_bytes / 1024).toFixed(1)} KB • {uploadedFile.word_count} words
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                          aria-label="Remove uploaded file and clear content"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {sourceError && (
                      <div 
                        className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-200 flex items-start gap-2"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{sourceError}</span>
                      </div>
                    )}

                  </div>
                </div>

                {/* Text Editor Box (Cols 2-3) */}
                <div className="lg:col-span-2">
                  <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-emerald-900/30 flex flex-col h-[520px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Master Source Content</span>
                        <button
                          type="button"
                          onClick={handleLoadCyberSample}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-mono underline ml-2.5 focus-visible:ring-1 focus-visible:ring-emerald-400 rounded px-1"
                          title="Load sample document for evaluation"
                        >
                          (Load Sample)
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-300">
                        <span>{wordCount} words</span>
                        <span>•</span>
                        <span>{charCount} chars</span>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">~{readingTimeMin} min read</span>
                      </div>
                    </div>

                    <label htmlFor="source-content-editor" className="sr-only">
                      Master source content text editor
                    </label>
                    <textarea
                      id="source-content-editor"
                      value={sourceText}
                      onChange={(e) => {
                        setSourceText(e.target.value);
                        setSourceError(null);
                      }}
                      placeholder="Paste your source document, technical report, meeting transcript, or strategy memo here..."
                      className="w-full flex-1 bg-transparent p-4 text-xs sm:text-sm font-sans text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed mt-2"
                    />

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSourceText("");
                          setUploadedFile(null);
                        }}
                        disabled={!sourceText}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-2 py-1"
                        aria-label="Clear all content from editor"
                      >
                        Clear Editor
                      </button>

                      <button
                        onClick={() => {
                          if (!sourceText.trim()) {
                            setSourceError("Please enter or upload source content.");
                            return;
                          }
                          setActiveStep(2);
                        }}
                        className="px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium transition-all flex items-center gap-2 shadow-md shadow-emerald-950 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                        aria-label="Proceed to step 2: Configure Outputs"
                      >
                        <span>Configure Outputs</span>
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =====================================================================
              STEP 2: SELECT OUTPUTS & CONFIGURATION
             ===================================================================== */}
          {activeStep === 2 && (
            <div className="space-y-8 animate-fadeIn" role="tabpanel" aria-labelledby="step-2-tab">
              
              {/* Sensible Presets Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span className="font-semibold text-white">Sensible 1-Click Presets:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => applyPreset(
                      ["security_advisory", "executive_summary", "social_media", "video_script", "presentation"],
                      "Technical",
                      "Technical"
                    )}
                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  >
                    Cybersecurity (5)
                  </button>

                  <button
                    onClick={() => applyPreset(
                      ["executive_summary", "key_points", "press_release", "presentation"],
                      "Executive",
                      "Professional"
                    )}
                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  >
                    C-Suite Executive (4)
                  </button>

                  <button
                    onClick={() => applyPreset(
                      ["social_media", "video_script", "infographic", "faq"],
                      "General Public",
                      "Conversational"
                    )}
                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  >
                    Social & Media (4)
                  </button>

                  <button
                    onClick={() => setSelectedOutputs(formats.map(f => f.id))}
                    className="px-3 py-1 rounded-full bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-medium transition-colors"
                  >
                    Select All (10)
                  </button>
                </div>
              </div>

              {/* Output Selection Grid (10 Cards) */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-sans text-xl font-bold text-white">
                      Target Deliverables ({selectedOutputs.length} Selected)
                    </h2>
                    <p className="text-xs text-slate-300">
                      Select the formats to generate. Use Space or Enter to toggle cards.
                    </p>
                  </div>
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
                      isSelected={selectedOutputs.includes(fmt.id)}
                      onToggle={handleToggleOutput}
                    />
                  ))}
                </div>
              </div>

              {/* Delivery Calibration Controls */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-emerald-900/30 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Target Audience, Tone & Linguistic Calibration
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Audience */}
                  <div>
                    <label htmlFor="audience-select" className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Target Audience Tier
                    </label>
                    <select
                      id="audience-select"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Executive">Executive (C-Suite & Board)</option>
                      <option value="Technical">Technical (Engineering & IT)</option>
                      <option value="General Public">General Public (Universal)</option>
                      <option value="Government">Government (Policy & Regulatory)</option>
                      <option value="Students">Students (Educational & Learning)</option>
                      <option value="Media">Media (Press & Journalists)</option>
                    </select>
                  </div>

                  {/* Tone */}
                  <div>
                    <label htmlFor="tone-select" className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Writing Tone
                    </label>
                    <select
                      id="tone-select"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Professional">Professional (Authoritative & Crisp)</option>
                      <option value="Formal">Formal (Official & Rigorous)</option>
                      <option value="Simple">Simple (Plain Language)</option>
                      <option value="Technical">Technical (Analytical & Deep)</option>
                      <option value="Conversational">Conversational (Engaging & Direct)</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label htmlFor="language-select" className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Target Language
                    </label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Hinglish">Hinglish (Hindi-English Blend)</option>
                    </select>
                  </div>

                  {/* Detail Level */}
                  <div>
                    <label htmlFor="detail-select" className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Detail Depth
                    </label>
                    <select
                      id="detail-select"
                      value={detailLevel}
                      onChange={(e) => setDetailLevel(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Detailed">Detailed (Exhaustive & In-Depth)</option>
                      <option value="Medium">Medium (Balanced Overview)</option>
                      <option value="Short">Short (Executive High-Density)</option>
                    </select>
                  </div>

                </div>

                {/* Custom Instructions */}
                <div>
                  <label htmlFor="custom-instructions-input" className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Custom Prompt Instructions (Optional)
                  </label>
                  <input
                    id="custom-instructions-input"
                    type="text"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Highlight third-party dependency vulnerabilities and emphasize a 30-day hardening schedule."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                {/* Navigation Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-3 py-1.5"
                    aria-label="Return to Step 1: Source Content"
                  >
                    ← Back to Source
                  </button>

                  <button
                    onClick={handleStartTransform}
                    className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 border border-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    aria-label={`Transform with AI to generate ${selectedOutputs.length} deliverables`}
                  >
                    <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>Transform with AI ({selectedOutputs.length} Outputs)</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* =====================================================================
              STEP 3: TRANSFORM IN PROGRESS (Live Transformation Animation)
             ===================================================================== */}
          {activeStep === 3 && isTransforming && (
            <div className="space-y-8 animate-fadeIn py-8" role="tabpanel" aria-labelledby="step-3-tab">
              
              <div 
                className="max-w-2xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 text-center border border-emerald-500/30 shadow-2xl relative overflow-hidden"
                role="status"
                aria-live="polite"
              >
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-glow-emerald mb-6">
                  <Loader2 className="w-10 h-10 animate-spin" aria-hidden="true" />
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono mb-3 border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
                  <span>Autonomous Multi-Agent Pipeline Running</span>
                </div>

                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Transforming Source Content
                </h2>
                <p className="text-xs sm:text-sm text-emerald-300 font-medium h-6">
                  {STAGE_LABELS[currentStage] || "Processing content..."}
                </p>

                <p className="text-[11px] text-slate-300 max-w-md mx-auto mt-4 leading-relaxed">
                  Generating {selectedOutputs.length} publication-ready deliverables concurrently and auditing factual premises through the AI Validation Node.
                </p>

              </div>

              {/* Dynamic Workflow Graph Visualizer */}
              <WorkflowVisualizer
                currentStage={currentStage}
                isTransforming={isTransforming}
                completedStages={completedStages}
              />

            </div>
          )}

          {/* Error Banner during Transformation */}
          {executionError && (
            <div className="p-6 rounded-3xl bg-red-950/50 border border-red-800 text-center space-y-3" role="alert">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-white">Pipeline Execution Error</h2>
              <p className="text-xs text-red-200 max-w-lg mx-auto">{executionError}</p>
              <button
                onClick={() => setActiveStep(2)}
                className="px-5 py-2 rounded-full bg-red-900/80 text-white text-xs hover:bg-red-800 transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              >
                Back to Output Selection
              </button>
            </div>
          )}

        </>
      )}

    </div>
  );
}
