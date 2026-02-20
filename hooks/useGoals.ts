"use client";

import { useState, useEffect } from "react";
import type { SpendingGoal, Period } from "@/types/api";

const CUSTOMER_ID = "12345";

interface UseGoalsResult {
  goals: SpendingGoal[];
  isLoading: boolean;
  error: string | null;
}

export function useGoals(period: Period = "30d"): UseGoalsResult {
  const [goals, setGoals] = useState<SpendingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/customers/${CUSTOMER_ID}/goals?period=${period}`)
      .then((r) => r.json())
      .then((data) => setGoals(data.goals ?? []))
      .catch(() => setError("Failed to load goals."))
      .finally(() => setIsLoading(false));
  }, [period]);

  return { goals, isLoading, error };
}
