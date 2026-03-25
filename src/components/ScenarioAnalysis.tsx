"use client";

import { ScenarioResult } from "@/lib/types";

interface Props {
  scenarios: ScenarioResult[];
  baseCurrency: string;
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ScenarioAnalysis({ scenarios, baseCurrency }: Props) {
  return (
    <div className="card p-6 sm:p-7 animate-fade-in-delay-1">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em]">
          Scenario Analysis
        </h2>
      </div>
      <p className="text-[12px] text-gray-400 mb-5 ml-[38px]">
        Illustrative impact of a &plusmn;5% exchange rate move
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map((s) => {
          const isAdverse = s.label === "Adverse Move";
          const isFavorable = s.label === "Favorable Move";

          // Accent colors per scenario
          const accent = isAdverse
            ? {
                border: "border-rose-200/70",
                bg: "bg-rose-50/40",
                label: "text-rose-600",
                dot: "bg-rose-400",
                badge: "bg-rose-100 text-rose-600",
              }
            : isFavorable
              ? {
                  border: "border-emerald-200/70",
                  bg: "bg-emerald-50/40",
                  label: "text-emerald-600",
                  dot: "bg-emerald-400",
                  badge: "bg-emerald-100 text-emerald-600",
                }
              : {
                  border: "border-gray-200/70",
                  bg: "bg-gray-50/40",
                  label: "text-gray-500",
                  dot: "bg-gray-400",
                  badge: "bg-gray-100 text-gray-500",
                };

          return (
            <div
              key={s.label}
              className={`rounded-xl border ${accent.border} ${accent.bg} p-4 transition-all duration-200 hover:shadow-sm`}
            >
              {/* Label + badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${accent.label}`}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${accent.badge}`}
                >
                  {s.fxMove > 0 ? "+" : ""}
                  {s.fxMove}%
                </span>
              </div>

              {/* Data rows */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Unhedged
                  </span>
                  <span className="text-[14px] font-semibold text-gray-800 tabular-nums">
                    {fmt(s.unhedgedCost, baseCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Hedged
                  </span>
                  <span className="text-[14px] font-semibold text-gray-800 tabular-nums">
                    {fmt(s.hedgedCost, baseCurrency)}
                  </span>
                </div>
                {s.savings !== 0 && (
                  <>
                    <div className="border-t border-gray-200/50 my-1" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {s.savings > 0 ? "Savings" : "Opportunity cost"}
                      </span>
                      <span
                        className={`text-[14px] font-bold tabular-nums ${s.savings > 0 ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {s.savings > 0 ? "+" : "-"}
                        {fmt(Math.abs(s.savings), baseCurrency)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Narrative */}
              <p className="mt-3.5 pt-3 border-t border-gray-200/40 text-[11px] text-gray-500 leading-relaxed">
                {s.narrative}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
