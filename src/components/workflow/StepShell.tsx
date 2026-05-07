"use client";

import React from "react";

interface Props {
  index: number;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "dark" | "paper";
  id?: string;
}

// Shared visual shell for all workflow steps. Renders the step number, kicker,
// and title on the left and the step body on the right. The tone prop allows
// alternating dark/paper sections so the long-scroll workflow has rhythm.
export default function StepShell({
  index,
  label,
  title,
  subtitle,
  children,
  tone = "dark",
  id,
}: Props) {
  const isPaper = tone === "paper";
  return (
    <section
      id={id}
      className={`relative ${isPaper ? "section-paper" : "section-dark"} border-t ${
        isPaper ? "border-ink-900/5" : "border-white/5"
      }`}
    >
      {!isPaper && (
        <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      )}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
          {/* Sidebar: step number + label */}
          <div className="lg:sticky lg:top-28">
            <p className={`section-label mb-3 ${isPaper ? "text-accent-700" : "text-accent-400"}`}>
              Step {String(index).padStart(2, "0")} · {label}
            </p>
            <h2
              className={`font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.05] tracking-tight ${
                isPaper ? "text-ink-900" : "text-white"
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={`mt-3 text-[14px] leading-relaxed ${isPaper ? "text-ink-500" : "text-white/55"}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
