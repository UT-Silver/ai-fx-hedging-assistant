"use client";

import { RiskLevel } from "@/lib/types";

interface Props {
  preHedge: RiskLevel;
  postHedge: RiskLevel;
  tone?: "dark" | "paper";
}

const LEVELS: RiskLevel[] = ["low", "medium", "high"];

const COLORS: Record<RiskLevel, { fg: string; bg: string; ring: string; label: string }> = {
  low: {
    fg: "text-success-400",
    bg: "bg-success-500/15",
    ring: "border-success-500/40",
    label: "Low",
  },
  medium: {
    fg: "text-warn-400",
    bg: "bg-warn-500/15",
    ring: "border-warn-500/40",
    label: "Medium",
  },
  high: {
    fg: "text-danger-400",
    bg: "bg-danger-500/15",
    ring: "border-danger-500/40",
    label: "High",
  },
};

export default function RiskMeter({ preHedge, postHedge, tone = "dark" }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Meter title="Before hedge" level={preHedge} tone={tone} />
      <Meter title="After hedge" level={postHedge} tone={tone} highlight />
    </div>
  );
}

function Meter({
  title,
  level,
  tone,
  highlight,
}: {
  title: string;
  level: RiskLevel;
  tone: "dark" | "paper";
  highlight?: boolean;
}) {
  const isPaper = tone === "paper";
  const c = COLORS[level];
  const idx = LEVELS.indexOf(level);
  return (
    <div
      className={`rounded-2xl border p-5 ${
        isPaper ? "bg-white border-ink-900/10" : "bg-white/[0.03] border-white/10"
      } ${highlight ? "ring-1 ring-accent-500/30" : ""}`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.16em] mb-3 ${
          isPaper ? "text-ink-400" : "text-white/40"
        }`}
      >
        {title}
      </p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={`font-display text-[28px] tracking-tight ${c.fg}`}>
          {c.label}
        </span>
        <span className={`text-[11px] ${isPaper ? "text-ink-400" : "text-white/40"}`}>
          risk
        </span>
      </div>

      <div className="flex gap-1.5">
        {LEVELS.map((l, i) => (
          <div
            key={l}
            className={`flex-1 h-1.5 rounded-full ${
              i <= idx
                ? l === "high"
                  ? "bg-danger-500"
                  : l === "medium"
                    ? "bg-warn-500"
                    : "bg-success-500"
                : isPaper
                  ? "bg-ink-900/10"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
