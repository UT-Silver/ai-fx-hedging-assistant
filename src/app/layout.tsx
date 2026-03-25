import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI FX Hedging Assistant",
  description:
    "An AI-powered educational tool for understanding foreign exchange exposure and hedging strategies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
