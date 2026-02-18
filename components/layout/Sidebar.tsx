"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Settings,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import type { CustomerProfile } from "@/types/api";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/",             icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions",  icon: ArrowLeftRight  },
  { label: "Goals",        href: "/goals",         icon: Target          },
  { label: "Settings",     href: "/settings",      icon: Settings        },
];

interface SidebarProps {
  profile: CustomerProfile | null;
  isLoading?: boolean;
}

export default function Sidebar({ profile, isLoading }: SidebarProps) {
  const pathname = usePathname();

  const initials = profile?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "??";

  const joinYear = profile?.joinDate
    ? new Date(profile.joinDate).getFullYear()
    : null;

  return (
    <aside
      style={{ background: "var(--bg-sidebar)" }}
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r"
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
          style={{ background: "var(--brand-primary)" }}
        >
          C
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Capitec</p>
          <p className="text-white/40 text-xs">Spending Insights</p>
        </div>
        <TrendingUp className="ml-auto text-white/20" size={16} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
              style={{
                background: active ? "var(--brand-glow)" : "transparent",
                color: active ? "var(--brand-accent)" : "rgba(255,255,255,0.55)",
                borderLeft: active ? `3px solid var(--brand-accent)` : "3px solid transparent",
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile footer */}
      <div className="px-4 py-4 border-t border-white/10">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="skeleton w-9 h-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-2.5 w-16 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "var(--brand-primary)" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile?.name ?? "—"}
              </p>
              <p className="text-white/40 text-xs truncate">
                {profile?.accountType === "premium" ? "⭐ Premium" : "Standard"}
                {joinYear ? ` · since ${joinYear}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
