"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useDashboard } from "@/hooks/useDashboard";

/**
 * AppShell — wraps every page with the sidebar + hero header.
 * Profile data is fetched here so the sidebar and greeting are
 * always populated, regardless of which route is active.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch profile (and ignore the rest — child pages fetch their own data)
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

      {/* Main column */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">

          {/* Hero header — scrolls with content */}
          <Header
            profile={profile}
            isLoading={isLoading}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
          />

          {/* Page content */}
          {children}

        </main>
      </div>
    </div>
  );
}
