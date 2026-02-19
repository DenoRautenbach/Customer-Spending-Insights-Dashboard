"use client";

import AppShell from "@/components/layout/AppShell";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { useGoals } from "@/hooks/useGoals";

export default function GoalsPage() {
  const { goals, isLoading } = useGoals();

  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 mt-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Spending Goals
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Track your monthly budgets across categories.
          </p>
        </div>
        <BudgetProgress goals={goals} isLoading={isLoading} />
      </div>
    </AppShell>
  );
}
