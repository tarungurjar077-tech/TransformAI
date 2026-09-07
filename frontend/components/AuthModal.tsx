"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Lock, Mail, User, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export interface AuthUser {
  name: string;
  email: string;
  token: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = "signin"
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  // Focus trap & auto-focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const user: AuthUser = {
        name: mode === "signup" ? (name || "New User") : (email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Alex Vance"),
        email: email,
        token: "tok_" + Math.random().toString(36).substring(2, 12)
      };

      try {
        localStorage.setItem("transformai_user", JSON.stringify(user));
      } catch (err) {
        // ignore
      }

      setIsSubmitting(false);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setEmail("alex.vance@transformai.dev");
    setPassword("ApexShield2026!");
    setName("Alex Vance");
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white dark:glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-emerald-800/50 shadow-2xl relative overflow-hidden animate-scaleUp"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-sm">
            <Sparkles className="w-6 h-6 animate-pulse-subtle" aria-hidden="true" />
          </div>
          <h2 id="auth-modal-title" className="font-sans text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {mode === "signin" ? "Sign In to TransformAI" : "Create an Account"}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {mode === "signin"
              ? "Access your saved transformations and pipeline analytics"
              : "Start transforming source documents across 10 intelligent formats"}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-full border border-slate-200 dark:border-emerald-900/40 mb-5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => { setMode("signin"); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-full transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
              mode === "signin"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => { setMode("signup"); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-full transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
              mode === "signup"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2" role="alert">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-emerald-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="auth-email"
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-emerald-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 underline focus-visible:ring-1 focus-visible:ring-emerald-400 rounded px-1"
                >
                  Fill Sample Account
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-emerald-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Remember this session</span>
            </label>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">256-bit encrypted</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-medium text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-400/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In to Workspace" : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Quick test convenience note */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            For rapid evaluation, you can enter any email/password or click{" "}
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
            >
              Fill Sample Account
            </button>.
          </p>
        </div>

      </div>
    </div>
  );
}
