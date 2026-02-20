import { NextResponse } from "next/server";
import type { SpendingTrends } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 750;

const allTrends: SpendingTrends = {
  trends: [
    { month: "2024-01", totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: "2024-02", totalSpent: 4150.80, transactionCount: 38, averageTransaction: 109.23 },
    { month: "2024-03", totalSpent: 3750.60, transactionCount: 45, averageTransaction: 83.35 },
    { month: "2024-04", totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.70 },
    { month: "2024-05", totalSpent: 3980.30, transactionCount: 44, averageTransaction: 90.46 },
    { month: "2024-06", totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
    { month: "2024-07", totalSpent: 3620.10, transactionCount: 40, averageTransaction: 90.50 },
    { month: "2024-08", totalSpent: 4480.90, transactionCount: 51, averageTransaction: 87.86 },
    { month: "2024-09", totalSpent: 4100.00, transactionCount: 46, averageTransaction: 89.13 },
    { month: "2024-10", totalSpent: 3870.55, transactionCount: 43, averageTransaction: 90.01 },
    { month: "2024-11", totalSpent: 5200.30, transactionCount: 58, averageTransaction: 89.66 },
    { month: "2024-12", totalSpent: 6100.80, transactionCount: 65, averageTransaction: 93.86 },
  ],
};

const PERIOD_TO_MONTHS: Record<string, number> = {
  "7d":  1,
  "30d": 1,
  "90d": 3,
  "1y":  12,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((resolve) => setTimeout(resolve, LATENCY));

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const months = period
    ? (PERIOD_TO_MONTHS[period] ?? 6)
    : Math.min(parseInt(searchParams.get("months") ?? "6", 10), 24);

  const sliced = allTrends.trends.slice(-months);
  return NextResponse.json({ trends: sliced });
}
