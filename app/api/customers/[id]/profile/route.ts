import { NextResponse } from "next/server";
import type { CustomerProfile } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 600;

const mockProfile: CustomerProfile = {
  customerId: 12345,
  name: "John Doe",
  email: "john.doe@email.com",
  joinDate: "2023-01-15",
  accountType: "premium",
  totalSpent: 15420.50,
  currency: "ZAR",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // consume the param (unused in mock)
  await new Promise((resolve) => setTimeout(resolve, LATENCY));
  return NextResponse.json(mockProfile);
}
