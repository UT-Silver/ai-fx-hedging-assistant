import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI FX Hedging Assistant — Treasury Copilot",
  description:
    "Pre-trade decision tool for corporate treasury teams. Identify FX risk, compare hedging strategies, run scenario analysis and generate a treasury-style memo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans bg-ink-950 text-white">
        {children}
      </body>
    </html>
  );
}
