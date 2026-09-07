import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer 
      role="contentinfo"
      aria-label="Site Footer"
      className="w-full border-t border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#060A0C] text-slate-600 dark:text-slate-400 text-xs py-8 relative overflow-hidden transition-colors"
    >
      {/* Decorative subtle ambient curved line */}
      <div className="absolute inset-0 pointer-events-none opacity-15" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1200 200" fill="none" preserveAspectRatio="none">
          <path 
            d="M-100 100 C300 20, 700 180, 1300 80" 
            stroke="url(#footer-gradient)" 
            strokeWidth="1.5" 
          />
          <defs>
            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-sans text-sm font-bold text-slate-900 dark:text-white tracking-wide">TransformAI</span>
              <span className="text-slate-400 dark:text-slate-500 mx-2" aria-hidden="true">•</span>
              <span className="text-slate-600 dark:text-slate-400 text-xs">One Source. Multiple Intelligent Outputs.</span>
            </div>
          </div>

          <nav aria-label="Footer Navigation" className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 transition-colors">Home</Link>
            <Link href="/workspace" className="hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 transition-colors">Workspace</Link>
            <Link href="/dashboard" className="hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 transition-colors">Dashboard</Link>
            <Link href="/history" className="hover:text-emerald-700 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 transition-colors">History</Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} TransformAI. All rights reserved.</p>
          <p className="text-slate-500">Autonomous Multi-Format Content Transformation Engine</p>
        </div>
      </div>
    </footer>
  );
}
