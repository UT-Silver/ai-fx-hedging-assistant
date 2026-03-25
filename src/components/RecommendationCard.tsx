"use client";

import { HedgingRecommendation } from "@/lib/types";

interface Props {
  recommendation: HedgingRecommendation;
}

export default function RecommendationCard({ recommendation }: Props) {
  const { strategy, hedgeRatio, rationale, tradeoffs, badge } = recommendation;

  // Semantic color for hedge ratio ring
  const ratioRing =
    hedgeRatio >= 75
      ? { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/80", track: "text-emerald-100", stroke: "text-emerald-500" }
      : hedgeRatio >= 25
        ? { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200/80", track: "text-amber-100", stroke: "text-amber-500" }
        : { text: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200/80", track: "text-rose-100", stroke: "text-rose-500" };

  // SVG donut for hedge ratio
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (hedgeRatio / 100) * circumference;

  return (
    <div className="card p-0 animate-fade-in overflow-hidden">
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

      <div className="p-6 sm:p-7">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em]">
              Recommended Strategy
            </h2>
          </div>
          {badge && (
            <span className="inline-flex items-center rounded-lg bg-brand-50/80 border border-brand-100 px-2.5 py-1 text-[10px] font-semibold text-brand-700 tracking-wide">
              {badge}
            </span>
          )}
        </div>

        {/* Strategy hero area */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
          {/* Donut chart */}
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" className="-rotate-90">
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                strokeWidth="6"
                className={ratioRing.track}
                stroke="currentColor"
              />
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={ratioRing.stroke}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-bold ${ratioRing.text}`}>
                {hedgeRatio}%
              </span>
              <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">
                Hedged
              </span>
            </div>
          </div>

          {/* Strategy name */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Strategy
            </p>
            <p className="text-[22px] sm:text-[24px] font-bold text-gray-900 tracking-[-0.02em] leading-tight">
              {strategy}
            </p>
          </div>
        </div>

        {/* Rationale + Tradeoffs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-surface-50 border border-gray-100/60 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <svg
                className="w-3.5 h-3.5 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Rationale
              </h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-[1.65] whitespace-pre-line">
              {rationale}
            </p>
          </div>
          <div className="rounded-xl bg-surface-50 border border-gray-100/60 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <svg
                className="w-3.5 h-3.5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Trade-offs
              </h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-[1.65]">
              {tradeoffs}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
