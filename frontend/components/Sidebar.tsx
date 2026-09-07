"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Zap, 
  LayoutDashboard, 
  Clock, 
  Sparkles, 
  X,
  ChevronRight,
  GitBranch,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Navigation links arranged strictly in top-to-bottom format
  const navItems = [
    { href: "/", label: "Home", icon: Home, badge: null },
    { href: "/workspace", label: "Workspace", icon: Zap, badge: "Studio" },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { href: "/history", label: "History", icon: Clock, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar: Top-to-Bottom Vertical Format */}
      <aside
        id="sidebar-navigation"
        aria-label="Sidebar Primary Navigation"
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#070C0F] border-r border-slate-200 dark:border-emerald-950/60 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out backdrop-blur-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Section: Brand & Mobile Dismiss */}
        <div>
          <div className="h-20 px-5 border-b border-slate-200 dark:border-emerald-950/50 flex items-center justify-between">
            <Link 
              href="/" 
              onClick={onClose}
              className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-xl p-1"
              aria-label="TransformAI Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-[#070C0F] rounded-[11px] flex items-center justify-center transition-colors">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  Transform<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Content Engine</span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links in Vertical Stack (Top to Bottom) */}
          <div className="py-6 px-3">
            <div className="px-3 pb-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
              Platform Menu
            </div>

            <nav className="space-y-1.5" aria-label="Vertical Menu Links">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm font-semibold dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-700/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900/80 border border-transparent"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                        }`} 
                        aria-hidden="true" 
                      />
                      <span className="tracking-wide">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700/50">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight 
                        className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400 transition-transform ${
                          isActive ? "text-emerald-600 dark:text-emerald-400 translate-x-0.5" : ""
                        }`} 
                        aria-hidden="true" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Pipeline Health Indicator */}
        <div className="p-4 border-t border-slate-200 dark:border-emerald-950/50 bg-slate-50 dark:bg-[#06090B]">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-emerald-950 text-xs space-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Workflow</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">7-Stage Pipeline</p>
          </div>
        </div>
      </aside>
    </>
  );
}
