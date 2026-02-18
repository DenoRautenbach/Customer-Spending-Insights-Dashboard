import { NextResponse } from "next/server";
import type { FiltersResponse } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 400;

const mockFilters: FiltersResponse = {
  categories: [
    { name: "Groceries",      color: "#FF6B6B", icon: "shopping-cart" },
    { name: "Entertainment",  color: "#4ECDC4", icon: "film"          },
    { name: "Transportation", color: "#45B7D1", icon: "car"           },
    { name: "Dining",         color: "#F7DC6F", icon: "utensils"      },
    { name: "Shopping",       color: "#BB8FCE", icon: "shopping-bag"  },
    { name: "Utilities",      color: "#85C1E9", icon: "zap"           },
  ],
  dateRangePresets: [
    { label: "Last 7 days",  value: "7d"  },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year",    value: "1y"  },
  ],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((resolve) => setTimeout(resolve, LATENCY));
  return NextResponse.json(mockFilters);
}
