import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delta?: number | null;   // percentage change, positive = up
  deltaLabel?: string;
  isLoading?: boolean;
  accentColor?: string;
}

export default function KpiCard({
  label,
  value,
  icon,
  delta,
  deltaLabel,
  isLoading,
  accentColor = "var(--brand-primary)",
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3.5 w-24 rounded" />
          <div className="skeleton w-9 h-9 rounded-xl" />
        </div>
        <div className="skeleton h-7 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  const isUp = delta !== null && delta !== undefined && delta >= 0;
  const deltaColor = isUp ? "var(--color-up)" : "var(--color-down)";
  const deltaArrow = isUp ? "↑" : "↓";

  return (
    <div className="card p-5 flex flex-col gap-3 group">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>

      {/* Delta */}
      {delta !== null && delta !== undefined ? (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
            style={{
              background: `${deltaColor}18`,
              color: deltaColor,
            }}
          >
            {deltaArrow} {Math.abs(delta).toFixed(1)}%
          </span>
          {deltaLabel && (
            <span style={{ color: "var(--text-muted)" }}>{deltaLabel}</span>
          )}
        </div>
      ) : (
        <div className="h-5" /> // spacer
      )}
    </div>
  );
}
