"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SpendingTrends } from "@/types/api";

interface TrendsAreaChartProps {
  data: SpendingTrends | null;
  isLoading: boolean;
}

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-ZA", {
    month: "short",
  });
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card px-3 py-2 text-xs"
      style={{ minWidth: 150, color: "var(--text-primary)" }}
    >
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: "var(--brand-accent)" }}>
        {formatZAR(payload[0]?.value ?? 0)}
      </p>
      {payload[0]?.payload?.transactionCount != null && (
        <p style={{ color: "var(--text-muted)" }}>
          {payload[0].payload.transactionCount} transactions
        </p>
      )}
    </div>
  );
}

export default function TrendsAreaChart({ data, isLoading }: TrendsAreaChartProps) {
  const chartData = data?.trends.map((t) => ({
    ...t,
    monthLabel: formatMonth(t.month),
  }));

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Monthly Spending Trends
        </h2>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Last {data?.trends.length ?? "—"} months
        </span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col gap-3 justify-end">
          <div className="flex items-end gap-2 h-40">
            {[65, 80, 55, 90, 70, 85].map((h, i) => (
              <div
                key={i}
                className="skeleton flex-1 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="skeleton h-3 w-full rounded" />
        </div>
      ) : (
        <div className="flex-1 min-h-0" style={{ minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00a3e0" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00a3e0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalSpent"
                stroke="#00a3e0"
                strokeWidth={2.5}
                fill="url(#spendGradient)"
                dot={{ r: 3, fill: "#00a3e0", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#00a3e0", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
