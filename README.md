# Capitec Customer Spending Insights Dashboard

A production-ready financial dashboard built for the Capitec Bank technical assessment. It visualises customer spending patterns across categories, trends, and monthly budget goals — styled to Capitec's corporate identity.

![Dashboard Preview](public/banner.png)

---

## Table of Contents

- [Features](#features)
- [Architecture Decisions](#architecture-decisions)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Docker](#docker)
- [API Overview](#api-overview)
- [Future Improvements](#future-improvements)

---

## Features

| Feature                | Detail                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **KPI Cards**          | Total spent, transaction count, avg transaction, top category — each with delta vs previous period         |
| **Spending Donut**     | Category breakdown with percentage labels                                                                  |
| **Trends Chart**       | 6-month area chart of monthly spend                                                                        |
| **Period Filtering**   | 7D / 30D / 90D / 1Y — live refetch with pulsing loading feedback                                           |
| **Budget Progress**    | Per-category progress bars colour-coded by status (`on_track` → blue, `warning` → amber, `exceeded` → red) |
| **Transactions Table** | Paginated, sortable list with category colours                                                             |
| **Responsive Layout**  | Mobile-first; sidebar slides in as a right-side overlay on small screens                                   |
| **Capitec Branding**   | NunitoSans variable font, brand colour tokens, logo, banner hero image                                     |

---

## Architecture Decisions

### Framework — Next.js 15 (App Router)

The App Router enables co-located route handlers (`/app/api/...`) for mock API endpoints, which mirrors a real microservice boundary without requiring an external backend. Server components handle the shell; client components are used selectively where interactivity is needed.

### Charting — Recharts

Chosen for its **declarative, composable API** that maps naturally to React's component model. Each chart is a thin wrapper around a Recharts primitive, making it trivial to swap data sources or add new chart types without restructuring.

### UI Primitives — Shadcn UI

Shadcn provides **accessible, unstyled-by-default components** (built on Radix UI) that integrate cleanly with Tailwind. This avoids the opinionated look of fully-styled libraries while still inheriting WAI-ARIA compliance for free.

### Styling — Tailwind CSS + CSS Custom Properties

Capitec brand tokens (`--brand-blue`, `--brand-red`, etc.) are defined as CSS variables in `globals.css` and exposed as Tailwind utilities via `@theme inline`. This means components can use either `style={{ color: "var(--brand-blue)" }}` for dynamic values or `text-brand-blue` for static utility classes.

### Typography — NunitoSans Variable Font

Loaded via `@font-face` in `globals.css` from `/public/fonts/`. Using the variable axis (`font-weight: 100 900`) means a single font file covers all weights with no layout shift.

### Data Fetching — Custom hooks

`useDashboard(period)` fetches profile, summary, categories, and trends in parallel on mount, then re-fetches only the summary when the period changes. `useGoals()` is a separate hook so the budget section loads independently without blocking the KPI row.

---

## Project Structure

```
app/
  api/customers/[id]/   # Mock API route handlers
  page.tsx              # Main dashboard page
  globals.css           # Design tokens + font registration
components/
  layout/               # Sidebar, Header
  dashboard/            # KpiRow, CategoryDonut, TrendsAreaChart,
                        # TransactionsTable, BudgetProgress
hooks/
  useDashboard.ts       # Period-aware data fetching
  useGoals.ts           # Budget goals fetching
types/
  api.ts                # Shared TypeScript interfaces
public/
  fonts/                # NunitoSans variable font
  logo.svg / banner.png / favicon.svg
```

---

## How to Run

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — hot reload is enabled.

### Production Build

```bash
npm run build
npm start
```

---

## Docker

A multi-stage `Dockerfile` is included for reproducible, optimised production images.

```bash
# Build the image
docker build -t capitec-dashboard .

# Run the container
docker run -p 3000:3000 capitec-dashboard
```

Open [http://localhost:3000](http://localhost:3000).

**Stages:**

1. **`deps`** — `npm ci` on `node:18-alpine` for a clean, locked install
2. **`builder`** — copies deps, runs `npm run build`
3. **`runner`** — slim production image; copies only `.next`, `node_modules`, `package.json`, and `public`

A `.dockerignore` excludes `node_modules`, `.next`, `.git`, and `.env*` from the build context to keep image sizes minimal and prevent secrets from being baked in.

---

## API Overview

All endpoints live under `/api/customers/[id]/` and include simulated network latency to mirror real-world conditions.

| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| `GET`  | `/profile`                     | Customer profile and account type    |
| `GET`  | `/spending/summary?period=30d` | KPI summary for a given period       |
| `GET`  | `/spending/categories`         | Spend breakdown by category          |
| `GET`  | `/spending/trends?months=6`    | Monthly trend data                   |
| `GET`  | `/transactions`                | Paginated, sortable transaction list |
| `GET`  | `/goals`                       | Monthly budget goals with status     |

---

## Future Improvements

| Improvement                 | Detail                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Real-time notifications** | WebSocket or SSE alerts when a budget is about to be exceeded (>80% used)                                             |
| **CSV / PDF export**        | Allow users to download their transaction history or monthly summary report                                           |
| **Push notifications**      | Service worker integration for budget warnings even when the app is backgrounded                                      |
| **Multi-currency support**  | Toggle between ZAR and other currencies using live exchange rates                                                     |
| **Spending forecasting**    | Linear regression on trend data to project end-of-month spend                                                         |
| **Authentication**          | NextAuth.js session management with role-based views (customer vs advisor)                                            |
| **TanStack Query**          | Replace custom `useDashboard` hook for automatic background refetching, caching, and stale-while-revalidate behaviour |
| **E2E testing**             | Playwright test suite covering the period filter, budget progress states, and mobile sidebar                          |
