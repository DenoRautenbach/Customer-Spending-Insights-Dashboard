"use client";

import AppShell from "@/components/layout/AppShell";
import TransactionsTable from "@/components/dashboard/TransactionsTable";

export default function TransactionsPage() {
  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Transactions
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Your full transaction history.
          </p>
        </div>
        <TransactionsTable />
      </div>
    </AppShell>
  );
}
