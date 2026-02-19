"use client";

import { useEffect, useState } from "react";
import type { CustomerProfile } from "@/types/api";

interface HeaderProps {
  profile: CustomerProfile | null;
  isLoading?: boolean;
}

export default function Header({ profile, isLoading }: HeaderProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );
  }, []);

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const joinDate = profile?.joinDate
    ? new Date(profile.joinDate).toLocaleDateString("en-ZA", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <header
      className="border-b"
      style={{
        backgroundImage: "url('/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 55%",
        backgroundRepeat: "no-repeat",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Greeting row — greeting left, burger right on mobile */}
      <div
        className="flex items-center gap-3 px-4 md:px-6 py-4"
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
              <h1
                className="text-base font-bold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {greeting}{firstName ? `, ${firstName}` : ""}
                {profile?.accountType === "premium" && (
                  <span
                    className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(47,112,239,0.12)", color: "#2F70EF" }}
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
      </div>

      {/* Transparent spacer so the banner image is visible below the frosted bar */}
      <div style={{ height: 200 }} aria-hidden="true" />
    </header>
  );
}
