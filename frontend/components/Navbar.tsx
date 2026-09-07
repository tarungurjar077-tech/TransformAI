"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  ChevronDown, 
  Zap,
  CheckCircle2,
  Layers
} from "lucide-react";
import AuthModal, { AuthUser } from "./AuthModal";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarOpen = false }: NavbarProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Load user session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("transformai_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("transformai_user");
    } catch (e) {
      // ignore
    }
    setUser(null);
    setUserDropdownOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-emerald-950/60 bg-white/90 dark:bg-[#090E11]/90 backdrop-blur-xl transition-colors duration-200 h-20 flex items-center px-4 sm:px-6 lg:px-8" 
        role="banner"
      >
        <div className="w-full flex items-center justify-between gap-4">
          
          {/* 1. LEFT SIDE: Sidebar toggle on mobile */}
          <div className="flex items-center justify-start flex-1">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none flex items-center gap-2 text-xs transition-colors"
              aria-label="Toggle navigation sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium text-[11px]">Menu</span>
            </button>
          </div>

          {/* 2. MIDDLE: TransformAI main heading shifted to the center with increased size */}
          <div className="flex items-center justify-center shrink-0">
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-2xl p-1"
              aria-label="TransformAI Home"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-950/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-[#090E11] rounded-[15px] flex items-center justify-center transition-colors">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse-subtle" aria-hidden="true" />
                </div>
              </div>
              <span className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                Transform<span className="text-emerald-600 dark:text-emerald-400 font-sans font-extrabold">AI</span>
              </span>
            </Link>
          </div>

          {/* 3. RIGHT SIDE: ThemeToggle, Login / Sign Up, and Workspace CTA */}
          <div className="flex items-center justify-end flex-1 gap-2.5">
            
            {/* Dark / Light / System Theme Toggle */}
            <ThemeToggle />

            {user ? (
              // Logged-in User Account Menu
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`User profile menu for ${user.name}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-emerald-900/50 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none text-slate-800 dark:text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                    {getUserInitials(user.name)}
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F181C] border border-slate-200 dark:border-emerald-800/40 shadow-2xl p-2 z-50 animate-fadeIn text-slate-800 dark:text-slate-200"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Active Session
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/workspace"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                        role="menuitem"
                      >
                        New Transformation
                      </Link>
                      <Link
                        href="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                        role="menuitem"
                      >
                        Saved Deliverables
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                        role="menuitem"
                      >
                        Operations Dashboard
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In: Actual Login & Sign Up buttons
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenAuth("signin")}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none flex items-center gap-1.5"
                  aria-label="Sign in to your account"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => handleOpenAuth("signup")}
                  className="px-3.5 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/90 dark:hover:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800/70 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none flex items-center gap-1.5 shadow-sm"
                  aria-label="Create a new account"
                >
                  <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Transform Now Primary Action */}
            <Link
              href="/workspace"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs tracking-wide shadow-md transition-all hover:scale-105 active:scale-95 border border-emerald-400/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              aria-label="Open Workspace and start a transformation"
            >
              <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Transform</span>
            </Link>

          </div>

        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />
    </>
  );
}
