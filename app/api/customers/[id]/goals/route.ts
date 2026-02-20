import { NextResponse } from "next/server";
import type { GoalsResponse } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 650;

const mockGoals: GoalsResponse = {
  goals: [
    {
      id: "goal_001",
      category: "Entertainment",
      monthlyBudget: 1000.00,
      currentSpent: 650.30,
      percentageUsed: 65.03,
      daysRemaining: 12,
      status: "on_track",
    },
    {
      id: "goal_002",
      category: "Groceries",
      monthlyBudget: 1500.00,
      currentSpent: 1450.80,
      percentageUsed: 96.72,
      daysRemaining: 12,
      status: "warning",
    },
    {
      id: "goal_003",
      category: "Dining",
      monthlyBudget: 600.00,
      currentSpent: 520.30,
      percentageUsed: 86.72,
      daysRemaining: 12,
      status: "warning",
    },
    {
      id: "goal_004",
      category: "Transportation",
      monthlyBudget: 1200.00,
      currentSpent: 680.45,
      percentageUsed: 56.70,
      daysRemaining: 12,
      status: "on_track",
    },
    {
      id: "goal_005",
      category: "Shopping",
      monthlyBudget: 500.00,
      currentSpent: 1130.80,
      percentageUsed: 226.16,
      daysRemaining: 12,
      status: "exceeded",
    },
  ],
};

// Proportion of monthly budget consumed in the requested period
const PERIOD_SCALE: Record<string, number> = {
  "7d":  7 / 30,
  "30d": 1,
  "90d": 3,
  "1y":  12,
};

// Days represented by each period
const PERIOD_DAYS: Record<string, number> = {
  "7d":  7,
  "30d": 30,
  "90d": 90,
  "1y":  365,
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
  const days = PERIOD_DAYS[period] ?? 30;

  const scaled = {
    goals: mockGoals.goals.map((g) => {
      // Scale the budget proportionally to the period length
      const periodBudget = Math.round(g.monthlyBudget * scale * 100) / 100;
      // Scale spent by same factor but add slight randomness feel via clamping
      const currentSpent = Math.round(g.currentSpent * scale * 100) / 100;
      const percentageUsed = periodBudget > 0
        ? Math.round((currentSpent / periodBudget) * 10000) / 100
        : 0;
      const status =
        percentageUsed >= 100 ? "exceeded" :
        percentageUsed >= 80  ? "warning"  : "on_track";

      return {
        ...g,
        monthlyBudget: periodBudget,
        currentSpent,
        percentageUsed,
        daysRemaining: days,
        status,
      };
    }),
  };

  return NextResponse.json(scaled);
}
