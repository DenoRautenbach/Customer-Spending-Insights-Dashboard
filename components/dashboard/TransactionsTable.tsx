"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import type { SortBy } from "@/types/api";

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Date (newest)", value: "date_desc" },
  { label: "Date (oldest)", value: "date_asc" },
  { label: "Amount (high)", value: "amount_desc" },
  { label: "Amount (low)",  value: "amount_asc"  },
];

const CATEGORIES = [
  "Groceries", "Entertainment", "Transportation", "Dining", "Shopping", "Utilities",
];

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-3.5 rounded" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function TransactionsTable() {
  const {
    transactions,
    pagination,
    isLoading,
    loadMore,
    setCategory,
    setSortBy,
    sortBy,
    activeCategory,
  } = useTransactions();

  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Table header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Transactions
          </h2>
          {pagination && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Showing {transactions.length} of {pagination.total}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <div className="relative">
            <select
              value={activeCategory ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="appearance-none text-xs pl-3 pr-7 py-1.5 rounded-lg border cursor-pointer"
              style={{
                background: "var(--bg-page)",
                color: "var(--text-secondary)",
                borderColor: "var(--border-card)",
              }}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none text-xs pl-3 pr-7 py-1.5 rounded-lg border cursor-pointer"
              style={{
                background: "var(--bg-page)",
                color: "var(--text-secondary)",
                borderColor: "var(--border-card)",
              }}
              aria-label="Sort transactions"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ArrowUpDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border-subtle)` }}>
              {["Date", "Merchant", "Category", "Amount", "Method"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && transactions.length === 0
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="transition-colors"
                    style={{ borderBottom: `1px solid var(--border-subtle)` }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-page)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Date */}
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatDate(txn.date)}
                    </td>

                    {/* Merchant + colour badge */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: txn.categoryColor }}
                          aria-hidden="true"
                        />
                        <span
                          className="font-medium text-xs"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {txn.merchant}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 pl-4"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {txn.description}
                      </p>
                    </td>

                    {/* Category badge */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: `${txn.categoryColor}20`,
                          color: txn.categoryColor,
                          border: `1px solid ${txn.categoryColor}40`,
                        }}
                      >
                        {txn.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className="px-4 py-3 font-semibold text-xs whitespace-nowrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatZAR(txn.amount)}
                    </td>

                    {/* Payment method */}
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {txn.paymentMethod}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {pagination?.hasMore && (
        <div
          className="px-5 py-3 border-t flex items-center justify-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              background: "var(--brand-glow)",
              color: "var(--brand-accent)",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
