"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import KpiRow from "@/components/dashboard/KpiRow";
import CategoryDonut from "@/components/dashboard/CategoryDonut";
import TrendsAreaChart from "@/components/dashboard/TrendsAreaChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { useDashboard } from "@/hooks/useDashboard";
import type { Period } from "@/types/api";

export default function Home() {
  const [period, setPeriod] = useState<Period>("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { profile, summary, categories, trends, isLoading, isSummaryLoading } =
    useDashboard(period);

  const summaryLoading = isLoading || isSummaryLoading;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Sidebar — fixed on desktop, overlay on mobile */}
      <Sidebar
        profile={profile}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset on desktop, full-width on mobile */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Header */}
        <Header
          profile={profile}
          isLoading={isLoading}
          period={period}
          onPeriodChange={setPeriod}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />

        {/* Dashboard body — only this scrolls */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* KPI Row */}
          <KpiRow summary={summary} isLoading={summaryLoading} />

          {/* Charts row — stacked on mobile, side-by-side on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <CategoryDonut data={categories} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-3">
              <TrendsAreaChart data={trends} isLoading={isLoading} />
            </div>
          </div>

          {/* Transactions table */}
          <TransactionsTable />
        </main>
      </div>
    </div>
  );
}
