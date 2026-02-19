"use client";

import type { SpendingGoal, GoalStatus } from "@/types/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatZAR(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Visual fill capped at 100 % for the bar; we show the real % in text */
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

const STATUS_CONFIG: Record<
  GoalStatus,
  { barColor: string; badgeText: string; badgeStyle: React.CSSProperties }
> = {
  on_track: {
    barColor: "#2F70EF",
    badgeText: "On track",
    badgeStyle: { background: "rgba(47,112,239,0.10)", color: "#2F70EF" },
  },
  warning: {
    barColor: "#F59E0B",
    badgeText: "Warning",
    badgeStyle: { background: "rgba(245,158,11,0.12)", color: "#B45309" },
  },
  exceeded: {
    barColor: "#EF4444",
    badgeText: "Exceeded",
    badgeStyle: { background: "rgba(239,68,68,0.10)", color: "#DC2626" },
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SkeletonBar() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
          </div>
          <div className="skeleton h-2.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

function GoalRow({ goal }: { goal: SpendingGoal }) {
  const config = STATUS_CONFIG[goal.status];
  const fillPct = clamp(goal.percentageUsed, 0, 100);

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {goal.category}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={config.badgeStyle}
          >
            {config.badgeText}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {formatZAR(goal.currentSpent)}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {" / "}{formatZAR(goal.monthlyBudget)}
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 8, background: "var(--bg-page)" }}
        role="progressbar"
        aria-valuenow={goal.percentageUsed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${goal.category} budget progress`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${fillPct}%`,
            background: config.barColor,
          }}
        />
      </div>

      {/* Meta row */}
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {goal.percentageUsed.toFixed(0)}% used
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {goal.daysRemaining}d remaining
        </span>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface BudgetProgressProps {
  goals: SpendingGoal[];
  isLoading: boolean;
}

export default function BudgetProgress({ goals, isLoading }: BudgetProgressProps) {
  return (
    <div className="card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          Monthly Budget Progress
        </h2>
        {!isLoading && goals.length > 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {goals.filter((g) => g.status === "on_track").length}/{goals.length} on track
          </span>
        )}
      </div>

      {/* Body */}
      {isLoading ? (
        <SkeletonBar />
      ) : goals.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
          No goals configured yet.
        </p>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
