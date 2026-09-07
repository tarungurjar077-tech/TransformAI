"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090E11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Left Vertical Navigation: Top to Bottom strictly on left */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area beside Left Sidebar */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 min-w-0">
        {/* 2. Top Header with Centered Brand & Right-side Auth */}
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />

        {/* 3. Main Page Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 ambient-mesh focus:outline-none">
          {children}
        </main>

        {/* 4. Footer */}
        <Footer />
      </div>
    </div>
  );
}
