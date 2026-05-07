"use client";

import { RecommendationContext } from "@/lib/types";
import { STRATEGIES } from "@/lib/hedging-logic";

interface Props {
  ctx: RecommendationContext;
}

// Compact summary block shown above the workflow when an analysis exists.
// Acts as the "dashboard at the top" of the result.
export default function DashboardCards({ ctx }: Props) {
  const { input, hedgeRatio, diagnosis, spotRate } = ctx;
  const strategy = STRATEGIES[ctx.selectedStrategy];
  const hedgedAmt = input.amount * (hedgeRatio / 100);
  const unhedgedAmt = input.amount - hedgedAmt;

  const cards = [
    {
      label: "Total exposure",
      value: `${fmtPlain(input.amount)} ${input.foreignCurrency}`,
      sub: `${input.direction === "paying" ? "Payable" : "Receivable"}, ${input.timeHorizon} horizon`,
    },
    {
      label: `${input.baseCurrency} equivalent`,
      value: fmt(diagnosis.unhedgedExposureBase, input.baseCurrency),
      sub: `at spot ${spotRate.toFixed(4)}`,
    },
    {
      label: "Recommended hedge ratio",
      value: `${hedgeRatio}%`,
      sub:
        hedgeRatio === ctx.recommendedRatio
          ? "Matches engine recommendation"
          : `Engine: ${ctx.recommendedRatio}%`,
      accent: true,
    },
    {
      label: "Hedged amount",
      value: `${fmtPlain(hedgedAmt)} ${input.foreignCurrency}`,
      sub: `≈ ${fmt(hedgedAmt * spotRate, input.baseCurrency)}`,
    },
    {
      label: "Unhedged amount",
      value: `${fmtPlain(unhedgedAmt)} ${input.foreignCurrency}`,
      sub: `≈ ${fmt(unhedgedAmt * spotRate, input.baseCurrency)}`,
    },
    {
      label: "Main risk",
      value: diagnosis.hurtBy === "appreciation" ? "FCY ↑" : "FCY ↓",
      sub: diagnosis.hurtBy === "appreciation"
        ? `${input.foreignCurrency} appreciation hurts`
        : `${input.foreignCurrency} depreciation hurts`,
    },
    {
      label: "Recommended strategy",
      value: strategy.name,
      sub: strategy.oneLine,
      accent: true,
    },
    {
      label: "Risk level",
      value: diagnosis.postHedgeLevel.toUpperCase(),
      sub: `Pre-hedge: ${diagnosis.riskLevel.toUpperCase()}`,
      level: diagnosis.postHedgeLevel,
    },
  ];

  return (
    <section className="relative section-dark border-t border-white/5">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <p className="section-label text-accent-400">Snapshot</p>
          <p className="text-[11px] text-white/40">
            Updates live as you tune the workflow below
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {cards.map((c) => (
            <Card key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  label,
  value,
  sub,
  accent,
  level,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  level?: "low" | "medium" | "high";
}) {
  const valueColor = level
    ? level === "high"
      ? "text-danger-400"
      : level === "medium"
        ? "text-warn-400"
        : "text-success-400"
    : accent
      ? "text-accent-300"
      : "text-white";

  return (
    <div className="relative card p-4 card-interactive">
      {accent && (
        <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent" />
      )}
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2.5">
        {label}
      </p>
      <p className={`font-display text-[19px] tracking-tight tabular ${valueColor} leading-tight`}>
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-[11px] text-white/45 leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

function fmt(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${Math.round(n).toLocaleString()}`;
  }
}

function fmtPlain(n: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(n);
}
