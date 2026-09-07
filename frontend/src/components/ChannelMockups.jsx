import React, { useState } from 'react';
import {
  Presentation,
  Mail,
  HelpCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  Heart,
  Bookmark,
  Share,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* =========================================================================
   1. Twitter / X Thread Mockup
   ========================================================================= */
export function TwitterThreadMockup({ content, title }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Extract individual tweets (delimited by **1/7, **2/7 or 1/7, etc.)
  const rawTweets = content
    ? content
        .split(/(?=\*\*\d+\/\d+|^\d+\/\d+)/m)
        .filter((t) => t.trim().length > 0 && !t.startsWith('# 🌐') && !t.startsWith('### 💼') && !t.startsWith('### 📸'))
    : [];

  const tweets = rawTweets.length > 0 ? rawTweets : [content || 'No tweets available.'];

  const handleCopyTweet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 my-2">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
          <XIcon className="w-4 h-4" />
          <span>Simulated X Thread ({tweets.length} Tweets)</span>
        </span>
        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[11px]">
          High Virality Score
        </span>
      </div>

      <div className="space-y-0">
        {tweets.map((tweetText, idx) => {
          const cleanText = tweetText.replace(/\*\*/g, '').replace(/### 🐦 Twitter \/ X Viral Thread.*?\n/g, '').trim();
          const isLast = idx === tweets.length - 1;

          return (
            <div key={idx} className="relative flex space-x-3 bg-slate-900/60 p-4 border-l border-r border-slate-800/80 hover:bg-slate-900/90 transition-colors first:rounded-t-2xl first:border-t last:rounded-b-2xl last:border-b">
              {/* Thread connecting line */}
              {!isLast && (
                <div className="absolute left-8 top-14 bottom-0 w-0.5 bg-slate-700/60" />
              )}

              {/* Avatar */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-950">
                  TA
                </div>
              </div>

              {/* Tweet Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-xs hover:underline cursor-pointer">TransformAI</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                    <span className="text-slate-500 text-xs">@TransformAI &bull; {idx + 1}m</span>
                  </div>
                  <button
                    onClick={() => handleCopyTweet(cleanText, idx)}
                    className="text-slate-500 hover:text-cyan-300 text-[11px] flex items-center space-x-1 p-1 rounded"
                    title="Copy tweet"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <p className="mt-1.5 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {cleanText}
                </p>

                {/* Metrics */}
                <div className="flex items-center justify-between text-slate-500 text-[11px] mt-3 pt-2 border-t border-slate-800/40 max-w-sm">
                  <span className="flex items-center space-x-1 hover:text-cyan-400 cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{12 + idx * 7}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-emerald-400 cursor-pointer">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{34 + idx * 18}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-red-400 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{142 + idx * 64}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{28 + idx * 9}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   2. LinkedIn Post Mockup
   ========================================================================= */
export function LinkedInMockup({ content, title }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  // Extract LinkedIn section if bundle contains multiple
  let postBody = content;
  if (content.includes('### 💼 LinkedIn Thought Leadership Post')) {
    const parts = content.split('### 💼 LinkedIn Thought Leadership Post');
    postBody = parts[1].split('### 📸')[0].trim();
  }

  const cleanLines = postBody.replace(/#+\s/g, '').split('\n').filter((l) => l.trim().length > 0);
  const previewLines = cleanLines.slice(0, 4).join('\n\n');
  const fullText = cleanLines.join('\n\n');

  return (
    <div className="max-w-xl mx-auto my-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-md">
            VP
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-bold text-white text-sm">Alex Mercer</h4>
              <span className="text-slate-500 text-xs">&bull; 1st</span>
            </div>
            <p className="text-[11px] text-slate-400">Chief Strategy Officer &bull; AI Transformation Leader</p>
            <p className="text-[10px] text-slate-500">2h &bull; Edited &bull; 🌐</p>
          </div>
        </div>

        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full hover:bg-blue-500/10 transition-colors">
          + Follow
        </button>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {expanded ? fullText : previewLines}
        {!expanded && cleanLines.length > 4 && (
          <button
            onClick={() => setExpanded(true)}
            className="text-slate-400 hover:text-cyan-400 font-semibold text-xs ml-1 focus:outline-none"
          >
            …see more
          </button>
        )}
      </div>

      {/* Engagement Counter */}
      <div className="px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1">
          <span className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</span>
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">❤️</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white">💡</span>
          </span>
          <span className="ml-1">{liked ? 483 : 482} &bull; 64 comments</span>
        </div>
        <span>18 reposts</span>
      </div>

      {/* Action Bar */}
      <div className="px-2 py-1.5 border-t border-slate-800 flex items-center justify-around text-xs font-semibold text-slate-400">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-1.5 py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors ${liked ? 'text-blue-400' : ''}`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1.5 py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1.5 py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Repeat className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center space-x-1.5 py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   3. Interactive Presentation Slide Deck Player
   ========================================================================= */
export function SlideDeckPlayer({ content, title }) {
  // Parse slide items (separated by ### Slide)
  const rawSlides = content
    ? content
        .split(/(?=###\s*Slide\s*\d+)/i)
        .filter((s) => s.toLowerCase().includes('slide') && s.length > 30)
    : [];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const slides = rawSlides.length > 0 ? rawSlides : [content || 'No slides available.'];
  const activeSlideText = slides[currentSlideIndex] || '';

  // Extract components of the slide
  const titleMatch = activeSlideText.match(/###\s*Slide\s*\d+[:\s-]*(.*)/i);
  const slideTitle = titleMatch ? titleMatch[1].trim() : `Slide ${currentSlideIndex + 1}`;

  const visualMatch = activeSlideText.match(/Visual.*?Direction[:\s*]*(.*?)(?=\n-|\n\*\*|$)/is);
  const visualCue = visualMatch ? visualMatch[1].replace(/\*\*/g, '').trim() : 'Strategic workflow visualization';

  const notesMatch = activeSlideText.match(/Speaker\s*Notes[:\s*]*(.*?)(?=$)/is);
  const speakerNotes = notesMatch ? notesMatch[1].replace(/[\*"]/g, '').trim() : 'Walk the audience through the core takeaways on this slide.';

  // Extract bullets
  const bulletLines = activeSlideText
    .split('\n')
    .filter((l) => l.trim().startsWith('- ') && !l.includes('Visual Direction') && !l.includes('Speaker Notes'))
    .map((l) => l.replace(/^-\s+/, '').replace(/\*\*/g, '').trim());

  return (
    <div className="max-w-3xl mx-auto my-2 space-y-4">
      {/* Presentation Canvas (16:9 Aspect Ratio) */}
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Slide Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[10px] text-cyan-300">
              TransformAI Keynote
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Center Content */}
        <div className="my-auto py-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {slideTitle}
          </h3>

          {/* Visual Cue Pill */}
          <div className="inline-flex items-center space-x-2 my-3 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">Visual Direction:</span>
            <span className="text-slate-300">{visualCue}</span>
          </div>

          {/* Key Bullets */}
          <ul className="space-y-2 mt-2">
            {bulletLines.length > 0 ? (
              bulletLines.map((b, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">Presents key principles and execution benchmarks.</li>
            )}
          </ul>
        </div>

        {/* Slide Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>{title || 'Document Presentation'}</span>
          <span>Confidential &bull; Internal Strategy</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
        >
          {showSpeakerNotes ? 'Hide Speaker Notes' : '🎤 View Speaker Script'}
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      {showSpeakerNotes && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
          <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] block">
            Verbatim Speaker Notes:
          </span>
          <p className="italic">{speakerNotes}</p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   4. Email Newsletter In-Client Mockup
   ========================================================================= */
export function EmailClientMockup({ content, title }) {
  // Extract Subject Lines
  const subjectMatch = content.match(/Subject\s*Line\s*Options[:\s*]*(.*?)(?=Preview\s*Text|###|\n\n\*\*Hey|\n\nHey)/is);
  const subjects = subjectMatch
    ? subjectMatch[1]
        .split('\n')
        .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('• '))
        .map((l) => l.replace(/^[-•]\s+/, '').replace(/\*\*/g, '').trim())
    : ['3 ways to accelerate your execution speed today', 'Why we are rethinking our core roadmap', 'The hidden bottleneck in modern systems'];

  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);

  return (
    <div className="max-w-2xl mx-auto my-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Email Client Top Bar */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        <span className="text-xs text-slate-400 font-mono ml-2">Inbox &bull; TransformAI Newsletter</span>
      </div>

      {/* Subject Line Tester */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-cyan-400">
            A/B Subject Line Options ({subjects.length})
          </span>
          <span>Open Rate Score: 94%</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {subjects.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSubjectIndex(idx)}
              className={`text-left text-xs p-2 rounded-lg border transition-all ${
                activeSubjectIndex === idx
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 font-semibold'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            TA
          </div>
          <div>
            <p className="font-bold text-white text-xs">TransformAI Editorial &lt;insights@transformai.io&gt;</p>
            <p className="text-[11px] text-slate-500">To: Executive Subscribers &bull; Today</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm">
          <p className="font-medium text-slate-100">
            Subject: {subjects[activeSubjectIndex] || title}
          </p>
          <div className="whitespace-pre-wrap mt-4 text-slate-300 leading-relaxed">
            {content.replace(/#.*?\n/g, '').replace(/###\s*Subject.*?\n\n/is, '')}
          </div>
        </div>

        {/* High Converting CTA Button */}
        <div className="pt-4 text-center">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all">
            Access Full Strategic Playbook &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. Interactive FAQ & Study Guide Accordion
   ========================================================================= */
export function FaqAccordionMockup({ content }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [revealedQuiz, setRevealedQuiz] = useState(false);

  // Extract Q&As
  const qaBlocks = content
    ? content
        .split(/(?=###\s*Q\d+:)/i)
        .filter((q) => q.toLowerCase().includes('answer'))
    : [];

  return (
    <div className="max-w-2xl mx-auto my-2 space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {qaBlocks.length > 0 ? (
            qaBlocks.map((block, idx) => {
              const qMatch = block.match(/###\s*Q\d+[:\s-]*(.*?)(?=\n\*\*Answer|$)/is);
              const question = qMatch ? qMatch[1].trim() : `Question ${idx + 1}`;

              const aMatch = block.match(/\*\*Answer\*\*[:\s-]*(.*?)(?=$)/is);
              const answer = aMatch ? aMatch[1].trim() : block;
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 bg-slate-950/40">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400">Loading interactive questions...</p>
          )}
        </div>
      </div>

      {/* Comprehension Quiz Widget */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-500/30">
        <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
          🧠 Knowledge Check Quiz
        </h4>
        <p className="text-xs text-slate-300 mb-3">
          Test your retention: Click below to reveal the verified answer and rationale.
        </p>
        <button
          onClick={() => setRevealedQuiz(!revealedQuiz)}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
        >
          {revealedQuiz ? 'Hide Answer' : '💡 Reveal Answer & Explanation'}
        </button>

        {revealedQuiz && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-emerald-400">
            ✓ Proactive baseline standardization yields immediate compounding execution speed and removes downstream bottlenecks.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   6. Executive Briefing Corporate Memo Mockup
   ========================================================================= */
export function ExecutiveMemoMockup({ content, title }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Deploy Rapid Alignment Initiative across leadership team', done: true },
    { id: 2, text: 'Standardize core architecture and operational safeguards', done: false },
    { id: 3, text: 'Consolidate 30-day deliverables and audit performance ROI', done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="max-w-2xl mx-auto my-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Memo Top Header */}
      <div className="border-b-2 border-cyan-500/40 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
            CONFIDENTIAL &bull; C-SUITE EXECUTIVE MEMO
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">{title || 'Executive Strategic Briefing'}</h2>
        </div>
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Briefcase className="w-5 h-5" />
        </div>
      </div>

      {/* Strategic Risk & Opportunity Heat Badges */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Strategic Risk &amp; Growth Matrix
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            <span className="text-[10px] uppercase font-bold text-red-400 block">Critical Risk</span>
            <p className="mt-1 font-medium">Execution latency from legacy manual workflows</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Growth Lever</span>
            <p className="mt-1 font-medium">Concurrent multi-channel automated repurposing</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
            <span className="text-[10px] uppercase font-bold text-blue-400 block">Priority Level</span>
            <p className="mt-1 font-medium">Immediate 30-Day Implementation Window</p>
          </div>
        </div>
      </div>

      {/* Interactive Action Items Checklist */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Prioritized Action Items
        </h4>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.done ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'}`}>
                {task.done && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`text-xs ${task.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
