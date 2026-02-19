"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import KpiRow from "@/components/dashboard/KpiRow";
import CategoryDonut from "@/components/dashboard/CategoryDonut";
import TrendsAreaChart from "@/components/dashboard/TrendsAreaChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { useDashboard } from "@/hooks/useDashboard";
import { useGoals } from "@/hooks/useGoals";
import type { Period } from "@/types/api";

const PERIODS: { label: string; value: Period }[] = [
  { label: "7 Days",  value: "7d"  },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "1 Year",  value: "1y"  },
];

export default function Home() {
  const [period, setPeriod] = useState<Period>("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { profile, summary, categories, trends, isLoading, isSummaryLoading } =
    useDashboard(period);
  const { goals, isLoading: goalsLoading } = useGoals();

  const summaryLoading = isLoading || isSummaryLoading;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">

        {/* Single scrollable area — header + dashboard content scroll together */}
        <main className="flex-1 overflow-y-auto">

          {/* Hero header — scrolls with content */}
          <Header
            profile={profile}
            isLoading={isLoading}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
          />

          {/* Dashboard content */}
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">

            {/* ── Period switcher row ── */}
            <div className="card flex flex-wrap items-center gap-2 p-2">
              <span
                className="text-xs font-bold uppercase tracking-wide px-2 shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                View by
              </span>
              <div className="flex flex-1 flex-wrap gap-2">
                {PERIODS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setPeriod(value)}
                    disabled={isSummaryLoading}
                    className="flex-1 min-w-[72px] py-2 rounded-xl text-xs font-bold transition-all duration-150 relative"
                    style={{
                      background: period === value ? "#2F70EF" : "transparent",
                      color:      period === value ? "#FFFFFF"  : "var(--text-muted)",
                      border:     period === value ? "none"     : "1px solid var(--border-card)",
                      opacity:    isSummaryLoading && period !== value ? 0.5 : 1,
                    }}
                    aria-pressed={period === value}
                  >
                    {/* Loading pulse on active button while refetching */}
                    {period === value && isSummaryLoading && (
                      <span className="absolute inset-0 rounded-xl animate-pulse"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                      />
                    )}
                    {label}
                  </button>
                ))}
              </div>

              {/* Spinner badge — visible while re-fetching */}
              {isSummaryLoading && (
                <span
                  className="text-xs px-2 py-1 rounded-lg shrink-0 animate-pulse"
                  style={{ background: "rgba(47,112,239,0.10)", color: "#2F70EF" }}
                >
                  Updating…
                </span>
              )}
            </div>

            {/* KPI Row */}
            <KpiRow summary={summary} isLoading={summaryLoading} />

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <CategoryDonut data={categories} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-3">
                <TrendsAreaChart data={trends} isLoading={isLoading} />
              </div>
            </div>

            {/* Budget Progress */}
            <BudgetProgress goals={goals} isLoading={goalsLoading} />

            {/* Transactions table */}
            <TransactionsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
