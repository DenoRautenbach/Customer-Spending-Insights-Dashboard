"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  ChevronRight,
  X,
} from "lucide-react";
import type { CustomerProfile } from "@/types/api";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/#overview",      icon: LayoutDashboard },
  { label: "Transactions", href: "/#transactions",  icon: ArrowLeftRight  },
  { label: "Goals",        href: "/#goals",          icon: Target          },
];

interface SidebarProps {
  profile: CustomerProfile | null;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ profile, isLoading, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  // Initialise from current URL hash on mount only
  useEffect(() => {
    setHash(window.location.hash || "#overview");
  }, []);

  const isActive = (href: string) => {
    if (pathname !== "/") return false;
    const hrefHash = href.includes("#") ? `#${href.split("#")[1]}` : "#overview";
    return hash === hrefHash;
  };

  const handleNavClick = (href: string) => {
    const hrefHash = href.includes("#") ? `#${href.split("#")[1]}` : "#overview";
    setHash(hrefHash);
    onClose();
  };

  const initials = profile?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "??";

  const joinYear = profile?.joinDate
    ? new Date(profile.joinDate).getFullYear()
    : null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed right-0 lg:left-0 lg:right-auto top-0 h-screen w-64 flex flex-col z-40 border-l lg:border-r lg:border-l-0",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{
          background: "#FFFFFF",
          borderColor: "var(--border-card)",
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo header */}
        <div
          className="flex items-center justify-between px-5 py-5 border-b"
          style={{ borderColor: "var(--border-card)" }}
        >
          <button
            onClick={() => window.location.reload()}
            aria-label="Refresh dashboard"
            className="focus:outline-none"
          >
            <Image
              src="/logo.svg"
              alt="Capitec"
              width={110}
              height={32}
              priority
              className="object-contain"
            />
          </button>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNavClick(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group"
                style={{
                  background: active ? "rgba(47, 112, 239, 0.07)" : "transparent",
                  color: active ? "var(--brand-blue)" : "var(--text-secondary)",
                  borderLeft: active ? "3px solid var(--brand-blue)" : "3px solid transparent",
                }}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile footer */}
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "var(--border-card)" }}
        >
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
                style={{ background: "var(--brand-red)" }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {profile?.name ?? "—"}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {profile?.accountType === "premium" ? "⭐ Premium" : "Standard"}
                  {joinYear ? ` · since ${joinYear}` : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
