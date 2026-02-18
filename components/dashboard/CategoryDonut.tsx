"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SpendingByCategory } from "@/types/api";

interface CategoryDonutProps {
  data: SpendingByCategory | null;
  isLoading: boolean;
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
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, amount, percentage } = payload[0].payload;
  return (
    <div
      className="card px-3 py-2 text-xs"
      style={{ minWidth: 140, color: "var(--text-primary)" }}
    >
      <p className="font-semibold mb-1">{name}</p>
      <p style={{ color: "var(--text-secondary)" }}>{formatZAR(amount)}</p>
      <p style={{ color: "var(--text-muted)" }}>{percentage}% of total</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-2">
      {payload?.map((entry: { color: string; value: string; payload: { percentage: number } }) => (
        <li key={entry.value} className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--text-secondary)" }} className="truncate">
            {entry.value}
          </span>
          <span className="ml-auto font-medium" style={{ color: "var(--text-muted)" }}>
            {entry.payload.percentage}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryDonut({ data, isLoading }: CategoryDonutProps) {
  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Spending by Category
        </h2>
        {data && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {formatZAR(data.totalAmount)} total
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="skeleton w-44 h-44 rounded-full" />
          <div className="w-full grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-3 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data?.categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="amount"
                nameKey="name"
                strokeWidth={0}
              >
                {data?.categories.map((cat) => (
                  <Cell key={cat.name} fill={cat.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
