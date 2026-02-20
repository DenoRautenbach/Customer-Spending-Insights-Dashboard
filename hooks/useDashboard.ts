"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  CustomerProfile,
  SpendingSummary,
  SpendingByCategory,
  SpendingTrends,
  Period,
} from "@/types/api";

const CUSTOMER_ID = "12345";

interface DashboardData {
  profile: CustomerProfile | null;
  summary: SpendingSummary | null;
  categories: SpendingByCategory | null;
  trends: SpendingTrends | null;
  isLoading: boolean;
  isSummaryLoading: boolean;
  error: string | null;
}

export function useDashboard(period: Period): DashboardData {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [categories, setCategories] = useState<SpendingByCategory | null>(null);
  const [trends, setTrends] = useState<SpendingTrends | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load — fetch everything including period-sensitive data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/customers/${CUSTOMER_ID}/profile`).then((r) => r.json()),
      fetch(`/api/customers/${CUSTOMER_ID}/spending/summary?period=${period}`).then((r) => r.json()),
      fetch(`/api/customers/${CUSTOMER_ID}/spending/categories?period=${period}`).then((r) => r.json()),
      fetch(`/api/customers/${CUSTOMER_ID}/spending/trends?period=${period}`).then((r) => r.json()),
    ])
      .then(([p, s, c, t]) => {
        setProfile(p);
        setSummary(s);
        setCategories(c);
        setTrends(t);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch all period-sensitive data whenever the period filter changes
  const fetchPeriodData = useCallback(
    (p: Period) => {
      setIsSummaryLoading(true);
      Promise.all([
        fetch(`/api/customers/${CUSTOMER_ID}/spending/summary?period=${p}`).then((r) => r.json()),
        fetch(`/api/customers/${CUSTOMER_ID}/spending/categories?period=${p}`).then((r) => r.json()),
        fetch(`/api/customers/${CUSTOMER_ID}/spending/trends?period=${p}`).then((r) => r.json()),
      ])
        .then(([s, c, t]) => {
          setSummary(s);
          setCategories(c);
          setTrends(t);
        })
        .catch(() => setError("Failed to reload data."))
        .finally(() => setIsSummaryLoading(false));
    },
    []
  );

  useEffect(() => {
    if (!isLoading) {
      fetchPeriodData(period);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return { profile, summary, categories, trends, isLoading, isSummaryLoading, error };
}
