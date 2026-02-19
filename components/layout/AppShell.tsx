"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useDashboard } from "@/hooks/useDashboard";

/**
 * AppShell — wraps every page with the sidebar + hero header.
 * The burger button is fixed (sticky) on mobile only; the header itself scrolls.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isLoading } = useDashboard("30d");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Sidebar — fixed on desktop, right-side overlay on mobile */}
      <Sidebar
        profile={profile}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Fixed floating burger — mobile only, always visible */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", color: "var(--text-secondary)" }}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Main column */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">

          {/* Hero header — scrolls with content */}
          <Header
            profile={profile}
            isLoading={isLoading}
          />

          {/* Page content */}
          {children}

        </main>
      </div>
    </div>
  );
}
