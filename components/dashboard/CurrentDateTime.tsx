
/**
 * CurrentDateTime
 *
 * A reusable, accessible, and visually cohesive widget for displaying the current date and time.
 * - Fluid layout, never truncates or wraps date.
 * - Visual hierarchy and Capitec branding.
 * - Live indicator with pulse animation.
 * - 8pt grid, 16px padding, and high contrast for accessibility.
 *
 * @param className Optional extra className for outer container
 * @param style Optional style override for outer container
 */
import React, { useEffect, useState } from "react";

// Design tokens for easy reuse and theming
const TOKENS = {
  bgGradient: "linear-gradient(90deg, rgba(0,86,179,0.05) 0%, #F8FAFC 100%)", // Capitec blue to off-white
  border: "#E2E8F0", // light grey-blue
  radius: "1rem", // 16px, matches dashboard cards
  sans: 'Inter, Geist, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  mono: 'JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  charcoal: "#1E293B",
  blue: "#0056B3",
  mutedGrey: "#64748B",
  shadow: '0 2px 8px 0 rgba(30,41,59,0.04)',
};

export interface CurrentDateTimeProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function CurrentDateTime({ className = "", style = {} }: CurrentDateTimeProps) {
  // State for current time
  const [now, setNow] = useState(new Date());
  // State for pulse animation (toggles every second)
  const [showPulse, setShowPulse] = useState(true);

  // Update time every 10s, pulse every 1s
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    const pulseInterval = setInterval(() => setShowPulse((v) => !v), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  // Format date as: Tuesday, 24 February 2026
  const dateString = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // Format time as: 23:31 (24h, no seconds)
  const timeString = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <section
      className={`w-full min-w-0 flex flex-col gap-2 items-start shadow-sm ${className}`}
      style={{
        minWidth: 'max-content',
        background: TOKENS.bgGradient,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: TOKENS.radius,
        padding: 16,
        fontFamily: TOKENS.sans,
        boxShadow: TOKENS.shadow,
        ...style,
      }}
      aria-label="Current date and time"
    >
      {/* Overline Today label, subtle and accessible */}
      <span
        className="uppercase tracking-widest mb-1"
        style={{
          color: TOKENS.mutedGrey,
          letterSpacing: '0.08em',
          fontVariant: 'small-caps',
          fontWeight: 600,
          fontSize: 11,
        }}
      >
        Today
      </span>
      {/* Date string, high contrast and never truncated */}
      <span
        className="truncate"
        style={{
          color: TOKENS.charcoal,
          fontFamily: TOKENS.sans,
          fontWeight: 500,
          fontSize: 16,
          lineHeight: 1.2,
          maxWidth: '100%',
        }}
      >
        {dateString}
      </span>
      {/* Time row with animated live dot */}
      <span className="flex items-center gap-2 mt-1" style={{ minHeight: 32 }}>
        <span
          style={{
            fontFamily: TOKENS.mono,
            color: TOKENS.blue,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '0.04em',
            background: 'none',
          }}
        >
          {timeString}
        </span>
        {/* Live indicator: blue dot with soft halo, pulses every second */}
        <span
          aria-label="Live"
          className="inline-block align-middle"
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 2,
            background: TOKENS.blue,
            boxShadow: showPulse ? '0 0 0 4px rgba(0,86,179,0.25)' : '0 0 0 2px rgba(0,86,179,0.10)',
            opacity: showPulse ? 1 : 0.7,
            transition: 'box-shadow 0.3s, opacity 0.3s',
          }}
        />
      </span>
    </section>
  );
}
