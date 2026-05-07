"use client";

import { TimeHorizon } from "@/lib/types";

interface Props {
  isLayered: boolean;
  timeHorizon: TimeHorizon;
}

const MONTHS_MAP: Record<TimeHorizon, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

// Visual roadmap of the hedging programme. For a layered hedge we show
// staggered tranche execution. For other strategies we show a simpler
// identify -> execute -> settlement timeline.
export default function HedgeTimeline({ isLayered, timeHorizon }: Props) {
  const months = MONTHS_MAP[timeHorizon];
  const events = isLayered
    ? buildLayeredEvents(months)
    : buildSimpleEvents(months);

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-5">
        <p className="font-display text-xl text-white tracking-tight">
          Hedging timeline
        </p>
        <p className="text-[11px] text-white/40">
          {isLayered ? "Layered programme" : "Single-execution programme"}
        </p>
      </div>

      <div className="relative pl-7">
        {/* Vertical rail */}
        <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />

        <ol className="space-y-5">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-[26px] top-1 w-4 h-4 rounded-full border-2 border-accent-500 bg-ink-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent-400 font-semibold">
                  Month {e.month}
                </p>
                <p className="text-[13px] text-white font-medium">{e.title}</p>
              </div>
              <p className="text-[12px] text-white/55 leading-relaxed mt-0.5">
                {e.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function buildLayeredEvents(months: number) {
  // Spread tranches across the horizon; floor the steps to whole months.
  const t1 = 1;
  const t2 = Math.max(2, Math.round(months * 0.35));
  const t3 = Math.max(t2 + 1, Math.round(months * 0.65));
  const settle = months;
  return [
    {
      month: t1,
      title: "Identify exposure",
      body: "Confirm notional, settlement window, and approval. Lock the policy on tranche size and timing.",
    },
    {
      month: t1,
      title: "Hedge first 30%",
      body: "Initial tranche reduces exposure to the worst single-day move risk; rate is locked at today's forward.",
    },
    {
      month: t2,
      title: "Hedge another 30%",
      body: "Second tranche after the first review window. If forecast firmed, this can be increased.",
    },
    {
      month: t3,
      title: "Hedge final tranche",
      body: "Bring total hedge to target ratio as the cash flow becomes more certain.",
    },
    {
      month: settle,
      title: "Settlement",
      body: "Forwards roll into spot at the contractual rate. Hedged share settles at the locked rate.",
    },
    {
      month: settle + 1,
      title: "Review hedge outcome",
      body: "Compare realised vs unhedged outcome. Update the policy if assumptions or thresholds drifted.",
    },
  ];
}

function buildSimpleEvents(months: number) {
  return [
    {
      month: 1,
      title: "Identify exposure",
      body: "Capture the cash flow, confirm tenor, request indicative quotes.",
    },
    {
      month: 1,
      title: "Execute hedge",
      body: "Single execution at the target hedge ratio. Document the trade and any hedge-accounting designation.",
    },
    {
      month: Math.max(1, Math.floor(months / 2)),
      title: "Mid-tenor review",
      body: "Check that the underlying cash flow and forecast still match the hedge tenor and notional.",
    },
    {
      month: months,
      title: "Settlement",
      body: "Hedge fixes vs spot at maturity. Realise the locked rate on the hedged share.",
    },
    {
      month: months + 1,
      title: "Review outcome",
      body: "Compare realised vs unhedged outcome and feed back into the next cycle's policy.",
    },
  ];
}
