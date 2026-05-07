"use client";

import { ExplainMode } from "@/lib/types";

const OPTIONS: { value: ExplainMode; label: string; sub: string }[] = [
  { value: "cfo", label: "CFO view", sub: "Cash flow & budget" },
  { value: "trader", label: "Trader view", sub: "Pips, vol, execution" },
  { value: "beginner", label: "Beginner view", sub: "Plain English" },
];

interface Props {
  mode: ExplainMode;
  onChange: (m: ExplainMode) => void;
  tone?: "dark" | "paper";
}

export default function ExplainAsToggle({ mode, onChange, tone = "dark" }: Props) {
  const isPaper = tone === "paper";
  return (
    <div
      className={`inline-flex p-1 rounded-full ${
        isPaper ? "bg-ink-50 border border-ink-900/10" : "bg-white/[0.04] border border-white/10"
      }`}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${
            mode === o.value
              ? isPaper
                ? "bg-ink-900 text-white shadow-sm"
                : "bg-accent-500 text-ink-900 shadow-glow-soft"
              : isPaper
                ? "text-ink-500 hover:text-ink-900"
                : "text-white/60 hover:text-white"
          }`}
          title={o.sub}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
