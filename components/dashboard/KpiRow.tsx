import { Hash, TrendingUp, Tag } from "lucide-react";
import KpiCard from "./KpiCard";
import type { SpendingSummary } from "@/types/api";

interface KpiRowProps {
  summary: SpendingSummary | null;
  isLoading: boolean;
}

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function KpiRow({ summary, isLoading }: KpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        label="Total Spent"
        value={summary ? formatZAR(summary.totalSpent) : "—"}
        icon={<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "-0.5px" }}>ZAR</span>}
        delta={summary?.comparedToPrevious.spentChange ?? null}
        deltaLabel="vs prev period"
        isLoading={isLoading}
        accentColor="var(--brand-primary)"
      />
      <KpiCard
        label="Transactions"
        value={summary ? String(summary.transactionCount) : "—"}
        icon={<Hash size={16} />}
        delta={summary?.comparedToPrevious.transactionChange ?? null}
        deltaLabel="vs prev period"
        isLoading={isLoading}
        accentColor="#8b5cf6"
      />
      <KpiCard
        label="Avg Transaction"
        value={summary ? formatZAR(summary.averageTransaction) : "—"}
        icon={<TrendingUp size={16} />}
        delta={null}
        isLoading={isLoading}
        accentColor="#10b981"
      />
      <KpiCard
        label="Top Category"
        value={summary?.topCategory ?? "—"}
        icon={<Tag size={16} />}
        delta={null}
        isLoading={isLoading}
        accentColor="#f59e0b"
      />
    </div>
  );
}
