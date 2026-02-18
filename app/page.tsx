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
  const { profile, summary, categories, trends, isLoading, isSummaryLoading } =
    useDashboard(period);

  const summaryLoading = isLoading || isSummaryLoading;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-page)" }}>
      {/* Sidebar */}
      <Sidebar profile={profile} isLoading={isLoading} />

      {/* Main content — offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* Header */}
        <Header
          profile={profile}
          isLoading={isLoading}
          period={period}
          onPeriodChange={setPeriod}
        />

        {/* Dashboard body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* KPI Row */}
          <KpiRow summary={summary} isLoading={summaryLoading} />

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Donut — 2 cols */}
            <div className="lg:col-span-2">
              <CategoryDonut data={categories} isLoading={isLoading} />
            </div>
            {/* Area chart — 3 cols */}
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
