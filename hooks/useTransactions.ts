"use client";

import { useState, useEffect, useRef } from "react";
import type { Transaction, Pagination, SortBy } from "@/types/api";

const CUSTOMER_ID = "12345";
const LIMIT = 10;

interface TransactionsState {
  transactions: Transaction[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  setCategory: (cat: string | null) => void;
  setSortBy: (sort: SortBy) => void;
  sortBy: SortBy;
  activeCategory: string | null;
}

export function useTransactions(): TransactionsState {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortByState] = useState<SortBy>("date_desc");
  const [activeCategory, setActiveCategoryState] = useState<string | null>(null);

  // Use a ref for offset so loadMore can read the latest value without
  // needing to be in the effect dependency array
  const offsetRef = useRef(0);

  function doFetch(offset: number, sort: SortBy, category: string | null, append: boolean) {
    setIsLoading(true);
    const params = new URLSearchParams({
      limit: String(LIMIT),
      offset: String(offset),
      sortBy: sort,
    });
    if (category) params.set("category", category);

    fetch(`/api/customers/${CUSTOMER_ID}/transactions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions((prev) =>
          append ? [...prev, ...data.transactions] : data.transactions
        );
        setPagination(data.pagination);
      })
      .catch(() => setError("Failed to load transactions."))
      .finally(() => setIsLoading(false));
  }

  // Fetch on mount and whenever sort/category changes
  useEffect(() => {
    offsetRef.current = 0;
    doFetch(0, sortBy, activeCategory, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, activeCategory]);

  function loadMore() {
    const newOffset = offsetRef.current + LIMIT;
    offsetRef.current = newOffset;
    doFetch(newOffset, sortBy, activeCategory, true);
  }

  return {
    transactions,
    pagination,
    isLoading,
    error,
    loadMore,
    setCategory: setActiveCategoryState,
    setSortBy: setSortByState,
    sortBy,
    activeCategory,
  };
}
