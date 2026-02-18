import { NextResponse } from "next/server";
import type { SpendingSummary, Period } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 800;

const mockSummaries: Record<Period, SpendingSummary> = {
  "7d": {
    period: "7d",
    totalSpent: 980.40,
    transactionCount: 11,
    averageTransaction: 89.13,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 5.2, transactionChange: 10.0 },
  },
  "30d": {
    period: "30d",
    totalSpent: 4250.75,
    transactionCount: 47,
    averageTransaction: 90.44,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 },
  },
  "90d": {
    period: "90d",
    totalSpent: 11790.60,
    transactionCount: 130,
    averageTransaction: 90.70,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: -2.1, transactionChange: 4.5 },
  },
  "1y": {
    period: "1y",
    totalSpent: 48250.00,
    transactionCount: 520,
    averageTransaction: 92.79,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 8.3, transactionChange: 1.1 },
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((resolve) => setTimeout(resolve, LATENCY));

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as Period;
  const summary = mockSummaries[period] ?? mockSummaries["30d"];

  return NextResponse.json(summary);
}
