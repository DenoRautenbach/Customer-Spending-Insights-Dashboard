import { NextResponse } from "next/server";
import type { SpendingByCategory } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 900;

const mockCategories: SpendingByCategory = {
  dateRange: {
    startDate: "2024-08-16",
    endDate: "2024-09-16",
  },
  totalAmount: 4250.75,
  categories: [
    {
      name: "Groceries",
      amount: 1250.30,
      percentage: 29.4,
      transactionCount: 15,
      color: "#FF6B6B",
      icon: "shopping-cart",
    },
    {
      name: "Entertainment",
      amount: 890.20,
      percentage: 20.9,
      transactionCount: 8,
      color: "#4ECDC4",
      icon: "film",
    },
    {
      name: "Transportation",
      amount: 680.45,
      percentage: 16.0,
      transactionCount: 12,
      color: "#45B7D1",
      icon: "car",
    },
    {
      name: "Dining",
      amount: 520.30,
      percentage: 12.2,
      transactionCount: 9,
      color: "#F7DC6F",
      icon: "utensils",
    },
    {
      name: "Shopping",
      amount: 450.80,
      percentage: 10.6,
      transactionCount: 6,
      color: "#BB8FCE",
      icon: "shopping-bag",
    },
    {
      name: "Utilities",
      amount: 458.70,
      percentage: 10.8,
      transactionCount: 3,
      color: "#85C1E9",
      icon: "zap",
    },
  ],
};

// Scale factor per period so amounts reflect the selected time window
const PERIOD_SCALE: Record<string, number> = {
  "7d":  7 / 30,
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
  const period = searchParams.get("period") ?? "30d";
  const scale = PERIOD_SCALE[period] ?? 1;

  const scaled = {
    ...mockCategories,
    totalAmount: Math.round(mockCategories.totalAmount * scale),
    categories: mockCategories.categories.map((c) => ({
      ...c,
      amount: Math.round(c.amount * scale * 100) / 100,
      transactionCount: Math.round(c.transactionCount * scale),
    })),
  };

  return NextResponse.json(scaled);
}
