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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((resolve) => setTimeout(resolve, LATENCY));
  return NextResponse.json(mockGoals);
}
