"use client";

import { StrategyKey, StrategyProfile } from "@/lib/types";
import { STRATEGIES, STRATEGY_ORDER } from "@/lib/hedging-logic";
import StepShell from "./StepShell";

interface Props {
  selected: StrategyKey;
  recommended: StrategyKey;
  onSelect: (s: StrategyKey) => void;
}

export default function Step3StrategyComparison({
  selected,
  recommended,
  onSelect,
}: Props) {
  return (
    <StepShell
      index={3}
      label="Strategy Comparison"
      title="Compare hedging structures."
      subtitle="Forward, option, collar, layered — each card snaps the rest of the workflow to that choice."
      tone="paper"
      id="step-3"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {STRATEGY_ORDER.map((key) => (
          <StrategyCard
            key={key}
            profile={STRATEGIES[key]}
            isSelected={selected === key}
            isRecommended={recommended === key}
            onClick={() => onSelect(key)}
          />
        ))}
      </div>

      <p className="mt-6 text-[12px] text-ink-500">
        The selected strategy feeds the scenario analysis, hedge ratio, and treasury memo below.
      </p>
    </StepShell>
  );
}

function StrategyCard({
  profile,
  isSelected,
  isRecommended,
  onClick,
}: {
  profile: StrategyProfile;
  isSelected: boolean;
  isRecommended: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-2xl border p-5 transition-all card-interactive ${
        isSelected
          ? "border-accent-500 bg-white shadow-[0_8px_24px_rgba(30,200,255,0.18)]"
          : "border-ink-900/10 bg-white"
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-ink-900 text-white text-[10px] font-semibold px-2.5 py-1 shadow-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3 h-3 text-accent-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          RECOMMENDED
        </span>
      )}

      {/* Top row: icon + name */}
      <div className="flex items-start gap-3 mb-4">
        <StrategyIcon strategy={profile.key} />
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400 mb-0.5">
            {profile.cost === "low" ? "Low cost" : profile.cost === "medium" ? "Medium cost" : "Premium cost"}
          </p>
          <h3 className="font-display text-2xl tracking-tight text-ink-900 leading-tight">
            {profile.name}
          </h3>
          <p className="text-[12px] text-ink-500 mt-1">{profile.oneLine}</p>
        </div>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-ink-900/5">
        <Bar label="Protection" value={profile.protection} color="emerald" />
        <Bar label="Flexibility" value={profile.flexibility} color="sky" />
      </div>

      {/* Best use case */}
      <div className="rounded-xl bg-ink-50 border border-ink-900/5 p-3 mb-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400 mb-1">
          Best for
        </p>
        <p className="text-[12px] text-ink-700 leading-snug">{profile.bestUseCase}</p>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
        <div>
          <p className="text-success-600 font-semibold mb-1.5">Pros</p>
          <ul className="space-y-1 text-ink-600">
            {profile.pros.map((p) => (
              <li key={p} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-success-500">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-danger-500 font-semibold mb-1.5">Cons</p>
          <ul className="space-y-1 text-ink-600">
            {profile.cons.map((c) => (
              <li key={c} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-danger-500">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Selection bar */}
      <div className="mt-5 pt-4 border-t border-ink-900/5 flex items-center justify-between">
        <span className="text-[12px] text-ink-500">
          {isSelected ? "Selected" : "Click to select"}
        </span>
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isSelected ? "bg-accent-500" : "border border-ink-900/20"
          }`}
        >
          {isSelected && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={3}
              className="w-3 h-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "sky";
}) {
  const colorMap = {
    emerald: "bg-success-500",
    sky: "bg-accent-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-ink-400">
          {label}
        </p>
        <p className="text-[11px] tabular text-ink-600 font-semibold">{value}/5</p>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < value ? colorMap[color] : "bg-ink-900/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StrategyIcon({ strategy }: { strategy: StrategyKey }) {
  const path: Record<StrategyKey, React.ReactNode> = {
    forward: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h12m0 0l-4-4m4 4l-4 4M3 4v16" />
    ),
    option: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l4-4 4 4 4-8 6 6" />
    ),
    collar: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M3 12h18" />
    ),
    layered: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h4v-4H3v4zm6 0h4v-8H9v8zm6 0h4v-12h-4v12z" />
    ),
  };
  return (
    <div className="w-11 h-11 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center flex-shrink-0">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className="w-5 h-5 text-accent-700"
      >
        {path[strategy]}
      </svg>
    </div>
  );
}
