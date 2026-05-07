"use client";

import { DistributionRange } from "@/lib/types";

interface Props {
  unhedged: DistributionRange;
  hedged: DistributionRange;
  currency: string;
}

// Simple SVG-style range chart. Uses absolute base-currency amounts and
// renders both bands on the same horizontal axis so the user sees the
// width difference at a glance.
export default function BeforeAfterChart({ unhedged, hedged, currency }: Props) {
  // Axis: pad ±2% around the wider band so the bars don't kiss the edge.
  const allValues = [unhedged.low, unhedged.high, hedged.low, hedged.high, unhedged.mid, hedged.mid];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const pad = span * 0.08;
  const axisMin = min - pad;
  const axisMax = max + pad;
  const axisSpan = axisMax - axisMin;

  const pct = (v: number) => ((v - axisMin) / axisSpan) * 100;

  return (
    <div className="card-paper p-6">
      <div className="flex items-baseline justify-between mb-5">
        <p className="font-display text-xl text-ink-900 tracking-tight">
          Before vs after hedging
        </p>
        <p className="text-[11px] text-ink-400">
          Hedging does not maximise profit — it narrows uncertainty.
        </p>
      </div>

      <div className="space-y-7">
        <Band
          label="Unhedged"
          tone="warn"
          range={unhedged}
          pct={pct}
          currency={currency}
        />
        <Band
          label="Hedged"
          tone="ok"
          range={hedged}
          pct={pct}
          currency={currency}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-ink-900/5 flex items-center justify-between text-[11px] text-ink-400 tabular">
        <span>{fmt(axisMin, currency)}</span>
        <span>{fmt(axisMax, currency)}</span>
      </div>
    </div>
  );
}

function Band({
  label,
  tone,
  range,
  pct,
  currency,
}: {
  label: string;
  tone: "warn" | "ok";
  range: DistributionRange;
  pct: (v: number) => number;
  currency: string;
}) {
  const left = pct(range.low);
  const right = 100 - pct(range.high);
  const mid = pct(range.mid);

  const colorBg = tone === "warn" ? "bg-warn-500/30" : "bg-success-500/30";
  const colorEdge = tone === "warn" ? "bg-warn-500" : "bg-success-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-semibold text-ink-700 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[11px] tabular text-ink-500">
          range: {fmt(range.low, currency)} – {fmt(range.high, currency)}
        </p>
      </div>
      <div className="relative h-9 bg-ink-50 rounded-full">
        <div
          className={`absolute top-0 bottom-0 ${colorBg} rounded-full`}
          style={{ left: `${left}%`, right: `${right}%` }}
        />
        <div
          className={`absolute top-0 bottom-0 w-[2px] ${colorEdge}`}
          style={{ left: `calc(${left}% )` }}
        />
        <div
          className={`absolute top-0 bottom-0 w-[2px] ${colorEdge}`}
          style={{ right: `calc(${right}%)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-ink-700"
          style={{ left: `calc(${mid}% - 6px)` }}
        />
      </div>
    </div>
  );
}

function fmt(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}
