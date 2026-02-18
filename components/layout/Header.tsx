"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import type { CustomerProfile } from "@/types/api";

type Period = "7d" | "30d" | "90d" | "1y";

const PERIODS: { label: string; value: Period }[] = [
  { label: "7D",  value: "7d"  },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y",  value: "1y"  },
];

interface HeaderProps {
  profile: CustomerProfile | null;
  isLoading?: boolean;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

export default function Header({ profile, isLoading, period, onPeriodChange }: HeaderProps) {
  // Always start as false for consistent server/client initial render
  const [dark, setDark] = useState(false);
  // Greeting starts empty; set on client only to avoid server/client mismatch
  const [greeting, setGreeting] = useState("");

  // Apply saved dark-mode preference before first paint (client only)
  useLayoutEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // Set time-based greeting on the client only (avoids SSR/CSR mismatch)
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const joinDate = profile?.joinDate
    ? new Date(profile.joinDate).toLocaleDateString("en-ZA", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b"
      style={{
        background: "var(--bg-header)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Greeting */}
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <div className="space-y-1.5">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-3.5 w-32 rounded" />
          </div>
        ) : (
          <>
            <h1 className="text-base font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {greeting}{firstName ? `, ${firstName}` : ""}
              {profile?.accountType === "premium" && (
                <span
                  className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "var(--brand-glow)", color: "var(--brand-accent)" }}
                >
                  Premium
                </span>
              )}
            </h1>
            {joinDate && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Member since {joinDate}
              </p>
            )}
          </>
        )}
      </div>

      {/* Period selector */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{ background: "var(--bg-page)" }}
        role="group"
        aria-label="Time period selector"
      >
        {PERIODS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onPeriodChange(value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              background: period === value ? "var(--bg-card)" : "transparent",
              color: period === value ? "var(--brand-accent)" : "var(--text-muted)",
              boxShadow: period === value ? "var(--shadow-card)" : "none",
            }}
            aria-pressed={period === value}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "var(--bg-page)", color: "var(--text-secondary)" }}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
