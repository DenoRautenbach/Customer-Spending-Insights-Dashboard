import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capitec | Spending Insights",
  description: "Customer spending insights dashboard — track your spending by category, trends, and goals.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
