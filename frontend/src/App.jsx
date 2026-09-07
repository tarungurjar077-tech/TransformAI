import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import DocumentUpload from './components/DocumentUpload';
import SourceAnalysis from './components/SourceAnalysis';
import TransformationTabs from './components/TransformationTabs';
import OutputPackViewer from './components/OutputPackViewer';
import HistoryDrawer from './components/HistoryDrawer';
import DownloadModal from './components/DownloadModal';
import ApiKeyModal from './components/ApiKeyModal';
import { api } from './services/api';

function TransformAIApp() {
  // Application State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('transformai_api_key') || '');
  const [currentDoc, setCurrentDoc] = useState(null); // { id, title, filename, source_text, word_count }
  const [analysis, setAnalysis] = useState(null);
  const [transformations, setTransformations] = useState({});
  const [activeTab, setActiveTab] = useState('executive_summary');
  const [selectedTone, setSelectedTone] = useState('balanced');
  const [selectedPersona, setSelectedPersona] = useState('executive');
  const [selectedLength, setSelectedLength] = useState('standard');

  // Loading States
  const [isUploading, setIsUploading] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [generatingTypes, setGeneratingTypes] = useState({});

  // Modals & Drawers
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistoryList(data.documents || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  // Load document history on mount
  useEffect(() => {
    let isMounted = true;
    api.getHistory()
      .then((data) => {
        if (isMounted) {
          setHistoryList(data.documents || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load history:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('transformai_api_key', newKey);
    } else {
      localStorage.removeItem('transformai_api_key');
    }
  };

  // Upload or Preset Selection Handler
  const handleUploadComplete = async (uploadData) => {
    setIsUploading(true);
    try {
      let docResult;
      if (uploadData.type === 'file') {
        docResult = await api.uploadFile(uploadData.file);
      } else {
        docResult = await api.uploadText(uploadData.title, uploadData.text);
      }

      setCurrentDoc(docResult);

      // Step 2: Analyze Document
      const analysisResult = await api.analyze(docResult.id);
      setAnalysis(analysisResult.analysis);

      // Step 3: Automatically generate all 6 transformations
      setIsBatchGenerating(true);
      const batchResult = await api.transformBatch(
        docResult.id,
        null,
        selectedTone,
        apiKey,
        selectedPersona,
        selectedLength
      );
      setTransformations(batchResult.transformations);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      // Refresh history list
      fetchHistory();
    } catch (err) {
      alert(`Error processing document: ${err.message}`);
    } finally {
      setIsUploading(false);
      setIsBatchGenerating(false);
    }
  };

  // Regenerate Single Active Transformation
  const handleRegenerateCurrent = async () => {
    if (!currentDoc) return;
    setGeneratingTypes((prev) => ({ ...prev, [activeTab]: true }));
    try {
      const result = await api.transformSingle(
        currentDoc.id,
        activeTab,
        selectedTone,
        apiKey,
        selectedPersona,
        selectedLength
      );
      setTransformations((prev) => ({
        ...prev,
        [activeTab]: result.content,
      }));
    } catch (err) {
      alert(`Regeneration failed: ${err.message}`);
    } finally {
      setGeneratingTypes((prev) => ({ ...prev, [activeTab]: false }));
    }
  };

  // Regenerate All 6 Transformations
  const handleRegenerateAll = async () => {
    if (!currentDoc) return;
    setIsBatchGenerating(true);
    try {
      const batchResult = await api.transformBatch(
        currentDoc.id,
        null,
        selectedTone,
        apiKey,
        selectedPersona,
        selectedLength
      );
      setTransformations(batchResult.transformations);
    } catch (err) {
      alert(`Batch regeneration failed: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // Save Inline User Edits
  const handleSaveContent = async (type, newContent) => {
    if (!currentDoc) return;
    try {
      await api.saveTransform(currentDoc.id, type, newContent);
      setTransformations((prev) => ({
        ...prev,
        [type]: newContent,
      }));
    } catch (err) {
      alert(`Failed to save edits: ${err.message}`);
    }
  };

  // Load a Saved Document from History
  const handleSelectHistoryDoc = async (docId) => {
    try {
      const doc = await api.getHistoryDetail(docId);
      setCurrentDoc({
        id: doc.id,
        title: doc.title,
        filename: doc.filename,
        source_text: doc.source_text,
        word_count: doc.word_count,
      });
      setAnalysis(doc.analysis);
      setTransformations(doc.transformations || {});
      setActiveTab('executive_summary');
    } catch (err) {
      alert(`Failed to load document: ${err.message}`);
    }
  };

  // Delete a Document from History
  const handleDeleteHistoryDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document and its generated pack?')) {
      return;
    }
    try {
      await api.deleteHistoryItem(docId);
      if (currentDoc?.id === docId) {
        setCurrentDoc(null);
        setAnalysis(null);
        setTransformations({});
      }
      fetchHistory();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleNewDocument = () => {
    setCurrentDoc(null);
    setAnalysis(null);
    setTransformations({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        apiKey={apiKey}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={historyList.length}
        onNewDocument={handleNewDocument}
        hasActiveDoc={Boolean(currentDoc)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentDoc ? (
          /* Step 1: Ingestion Zone */
          <DocumentUpload
            onUploadComplete={handleUploadComplete}
            isProcessing={isUploading || isBatchGenerating}
          />
        ) : (
          /* Step 2: Transformation Studio & Output Pack */
          <div className="space-y-4">
            {/* Document Intelligence Card */}
            <SourceAnalysis
              analysis={analysis}
              docTitle={currentDoc.title}
              wordCount={currentDoc.word_count}
            />

            {/* The 6 Transformation Tabs & Controls */}
            <TransformationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              transformations={transformations}
              generatingTypes={generatingTypes}
              isBatchGenerating={isBatchGenerating}
              selectedTone={selectedTone}
              onToneChange={setSelectedTone}
              selectedPersona={selectedPersona}
              onPersonaChange={setSelectedPersona}
              selectedLength={selectedLength}
              onLengthChange={setSelectedLength}
              onRegenerateCurrent={handleRegenerateCurrent}
              onRegenerateAll={handleRegenerateAll}
            />

            {/* Output Pack Viewer with Split Compare & Markdown Editing */}
            <OutputPackViewer
              docId={currentDoc.id}
              docTitle={currentDoc.title}
              sourceText={currentDoc.source_text}
              activeTab={activeTab}
              content={transformations[activeTab] || ''}
              isGenerating={Boolean(generatingTypes[activeTab]) || isBatchGenerating}
              onSaveContent={handleSaveContent}
              onOpenDownloadModal={() => setDownloadModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={historyList}
        onSelectDoc={handleSelectHistoryDoc}
        onDeleteDoc={handleDeleteHistoryDoc}
        activeDocId={currentDoc?.id}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        docId={currentDoc?.id}
        docTitle={currentDoc?.title || 'Document'}
        transformations={transformations}
        analysis={analysis || {}}
      />

      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('TransformAI ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-white">Something interrupted the workspace</h2>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 break-words text-left">
              {this.state.error?.message || 'An unexpected state occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <TransformAIApp />
    </ErrorBoundary>
  );
}
