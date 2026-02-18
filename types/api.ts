// ─── Shared / Primitive Types ────────────────────────────────────────────────

export type Period = "7d" | "30d" | "90d" | "1y";

export type SortBy =
  | "date_desc"
  | "date_asc"
  | "amount_desc"
  | "amount_asc";

export type GoalStatus = "on_track" | "warning" | "exceeded";

export type AccountType = "standard" | "premium";

// ─── 1. Customer Profile ─────────────────────────────────────────────────────

export interface CustomerProfile {
  customerId: number;
  name: string;
  email: string;
  joinDate: string; // ISO date string: YYYY-MM-DD
  accountType: AccountType;
  totalSpent: number;
  currency: string; // e.g. "ZAR"
}

// ─── 2. Spending Summary ─────────────────────────────────────────────────────

export interface PeriodComparison {
  spentChange: number;       // percentage change (positive = increase)
  transactionChange: number; // percentage change (positive = increase)
}

export interface SpendingSummary {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: PeriodComparison;
}

// ─── 3. Spending by Category ─────────────────────────────────────────────────

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string; // hex colour, e.g. "#FF6B6B"
  icon: string;  // lucide / icon name, e.g. "shopping-cart"
}

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface SpendingByCategory {
  dateRange: DateRange;
  totalAmount: number;
  categories: SpendingCategory[];
}

// ─── 4. Monthly Spending Trends ───────────────────────────────────────────────

export interface MonthlyTrend {
  month: string;             // YYYY-MM format
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface SpendingTrends {
  trends: MonthlyTrend[];
}

// ─── 5. Transactions ─────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  date: string;            // ISO 8601 datetime, e.g. "2024-09-16T14:30:00Z"
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;   // hex colour
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

// ─── 6. Spending Goals ────────────────────────────────────────────────────────

export interface SpendingGoal {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
}

export interface GoalsResponse {
  goals: SpendingGoal[];
}

// ─── 7. Filters (Categories + Date Presets) ───────────────────────────────────

export interface CategoryFilter {
  name: string;
  color: string;
  icon: string;
}

export interface DateRangePreset {
  label: string;
  value: Period;
}

export interface FiltersResponse {
  categories: CategoryFilter[];
  dateRangePresets: DateRangePreset[];
}
