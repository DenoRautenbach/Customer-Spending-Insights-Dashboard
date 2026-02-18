import { NextResponse } from "next/server";
import type { Transaction, TransactionsResponse, SortBy } from "@/types/api";

// Simulate network latency (ms)
const LATENCY = 700;

const allTransactions: Transaction[] = [
  {
    id: "txn_123456",
    date: "2024-09-16T14:30:00Z",
    merchant: "Pick n Pay",
    category: "Groceries",
    amount: 245.80,
    description: "Weekly groceries",
    paymentMethod: "Credit Card",
    icon: "shopping-cart",
    categoryColor: "#FF6B6B",
  },
  {
    id: "txn_123457",
    date: "2024-09-15T10:15:00Z",
    merchant: "Netflix",
    category: "Entertainment",
    amount: 199.00,
    description: "Monthly subscription",
    paymentMethod: "Debit Order",
    icon: "film",
    categoryColor: "#4ECDC4",
  },
  {
    id: "txn_123458",
    date: "2024-09-14T08:45:00Z",
    merchant: "Uber",
    category: "Transportation",
    amount: 85.50,
    description: "Ride to office",
    paymentMethod: "Credit Card",
    icon: "car",
    categoryColor: "#45B7D1",
  },
  {
    id: "txn_123459",
    date: "2024-09-13T19:30:00Z",
    merchant: "Nando's",
    category: "Dining",
    amount: 320.00,
    description: "Family dinner",
    paymentMethod: "Credit Card",
    icon: "utensils",
    categoryColor: "#F7DC6F",
  },
  {
    id: "txn_123460",
    date: "2024-09-12T11:00:00Z",
    merchant: "Woolworths",
    category: "Shopping",
    amount: 450.80,
    description: "Clothing purchase",
    paymentMethod: "Credit Card",
    icon: "shopping-bag",
    categoryColor: "#BB8FCE",
  },
  {
    id: "txn_123461",
    date: "2024-09-11T09:00:00Z",
    merchant: "City Power",
    category: "Utilities",
    amount: 158.70,
    description: "Electricity bill",
    paymentMethod: "Debit Order",
    icon: "zap",
    categoryColor: "#85C1E9",
  },
  {
    id: "txn_123462",
    date: "2024-09-10T13:20:00Z",
    merchant: "Checkers",
    category: "Groceries",
    amount: 312.40,
    description: "Monthly grocery run",
    paymentMethod: "Debit Card",
    icon: "shopping-cart",
    categoryColor: "#FF6B6B",
  },
  {
    id: "txn_123463",
    date: "2024-09-09T20:00:00Z",
    merchant: "Spotify",
    category: "Entertainment",
    amount: 99.99,
    description: "Music subscription",
    paymentMethod: "Debit Order",
    icon: "film",
    categoryColor: "#4ECDC4",
  },
  {
    id: "txn_123464",
    date: "2024-09-08T07:30:00Z",
    merchant: "Gautrain",
    category: "Transportation",
    amount: 45.00,
    description: "Train fare",
    paymentMethod: "Gautrain Card",
    icon: "car",
    categoryColor: "#45B7D1",
  },
  {
    id: "txn_123465",
    date: "2024-09-07T12:15:00Z",
    merchant: "Steers",
    category: "Dining",
    amount: 89.90,
    description: "Lunch",
    paymentMethod: "Credit Card",
    icon: "utensils",
    categoryColor: "#F7DC6F",
  },
  {
    id: "txn_123466",
    date: "2024-09-06T16:45:00Z",
    merchant: "Edgars",
    category: "Shopping",
    amount: 680.00,
    description: "Seasonal sale",
    paymentMethod: "Store Card",
    icon: "shopping-bag",
    categoryColor: "#BB8FCE",
  },
  {
    id: "txn_123467",
    date: "2024-09-05T09:00:00Z",
    merchant: "Telkom",
    category: "Utilities",
    amount: 300.00,
    description: "Internet bill",
    paymentMethod: "Debit Order",
    icon: "zap",
    categoryColor: "#85C1E9",
  },
  {
    id: "txn_123468",
    date: "2024-09-04T14:00:00Z",
    merchant: "Spar",
    category: "Groceries",
    amount: 198.60,
    description: "Top-up groceries",
    paymentMethod: "Debit Card",
    icon: "shopping-cart",
    categoryColor: "#FF6B6B",
  },
  {
    id: "txn_123469",
    date: "2024-09-03T21:00:00Z",
    merchant: "DStv",
    category: "Entertainment",
    amount: 899.00,
    description: "Premium package",
    paymentMethod: "Debit Order",
    icon: "film",
    categoryColor: "#4ECDC4",
  },
  {
    id: "txn_123470",
    date: "2024-09-02T08:00:00Z",
    merchant: "Shell",
    category: "Transportation",
    amount: 850.00,
    description: "Fuel",
    paymentMethod: "Credit Card",
    icon: "car",
    categoryColor: "#45B7D1",
  },
];

function sortTransactions(txns: Transaction[], sortBy: SortBy): Transaction[] {
  return [...txns].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date_desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount_asc":
        return a.amount - b.amount;
      case "amount_desc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  await new Promise((resolve) => setTimeout(resolve, LATENCY));

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const sortBy = (searchParams.get("sortBy") ?? "date_desc") as SortBy;

  let filtered = allTransactions;

  if (category) {
    filtered = filtered.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (startDate) {
    const start = new Date(startDate).getTime();
    filtered = filtered.filter((t) => new Date(t.date).getTime() >= start);
  }

  if (endDate) {
    const end = new Date(endDate).getTime();
    filtered = filtered.filter((t) => new Date(t.date).getTime() <= end);
  }

  filtered = sortTransactions(filtered, sortBy);

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  const response: TransactionsResponse = {
    transactions: paginated,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };

  return NextResponse.json(response);
}
