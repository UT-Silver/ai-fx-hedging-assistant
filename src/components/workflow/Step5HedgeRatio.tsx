"use client";

import { RecommendationContext } from "@/lib/types";
import StepShell from "./StepShell";

interface Props {
  ctx: RecommendationContext;
  onChangeRatio: (n: number) => void;
}

export default function Step5HedgeRatio({ ctx, onChangeRatio }: Props) {
  const { input, hedgeRatio, recommendedRatio, spotRate } = ctx;
  const ratio = hedgeRatio / 100;

  // Derived metrics for the four stat cards.
  const hedgedAmt = input.amount * ratio;
  const unhedgedAmt = input.amount * (1 - ratio);
  // Budget certainty / upside flexibility / risk reduction are derived from
  // the ratio. They scale linearly — illustrative, not regulatory.
  const certainty = Math.round(40 + ratio * 60); // 40–100 scale
  const flexibility = Math.round((1 - ratio) * 100);
  const riskReduction = Math.round(ratio * 92); // never quite 100%, residual basis

  return (
    <StepShell
      index={5}
      label="Hedge Ratio Control"
      title="Tune the hedge ratio."
      subtitle="Drag to override the engine recommendation. Every downstream metric updates live."
      tone="paper"
      id="step-5"
    >
      <div className="space-y-5">
        <div className="card-paper p-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="section-label text-accent-700 mb-1">Hedge ratio</p>
              <p className="font-display text-[40px] tracking-tight text-ink-900 leading-none">
                {hedgeRatio}<span className="text-2xl text-ink-400">%</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400">
                Engine recommendation
              </p>
              <p className="text-[14px] tabular text-ink-700 font-semibold">
                {recommendedRatio}%
              </p>
              {hedgeRatio !== recommendedRatio && (
                <button
                  onClick={() => onChangeRatio(recommendedRatio)}
                  className="text-[11px] text-accent-700 hover:underline mt-0.5"
                >
                  Reset to recommended
                </button>
              )}
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={hedgeRatio}
            onChange={(e) => onChangeRatio(parseInt(e.target.value, 10))}
            className="slider-accent"
            style={{ ["--val" as string]: `${hedgeRatio}%` }}
          />

          <div className="flex justify-between text-[11px] text-ink-400 tabular mt-2">
            <span>0% — fully open</span>
            <span>100% — fully locked</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <DerivedCard
            label={`Hedged (${input.foreignCurrency})`}
            value={fmt(hedgedAmt, input.foreignCurrency)}
            sublabel={`≈ ${fmt(hedgedAmt * spotRate, input.baseCurrency)} ${input.baseCurrency}`}
            icon="lock"
          />
          <DerivedCard
            label={`Unhedged (${input.foreignCurrency})`}
            value={fmt(unhedgedAmt, input.foreignCurrency)}
            sublabel={`Floats with spot — ${input.foreignCurrency}/${input.baseCurrency}`}
            icon="float"
          />
          <DerivedCard
            label="Budget certainty"
            value={`${certainty}/100`}
            sublabel="Higher = more predictable cash flow"
            tone="ok"
            icon="bar"
          />
          <DerivedCard
            label="Upside flexibility"
            value={`${flexibility}%`}
            sublabel="Share that benefits from favourable moves"
            tone="warn"
            icon="bar"
          />
        </div>

        <div className="card-paper p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="section-label text-accent-700">Estimated risk reduction</p>
            <p className="text-[13px] tabular text-ink-700 font-semibold">
              {riskReduction}%
            </p>
          </div>
          <div className="h-2 rounded-full bg-ink-50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-success-500 transition-all"
              style={{ width: `${riskReduction}%` }}
            />
          </div>
          <p className="mt-3 text-[12px] text-ink-500 leading-relaxed">
            Approximate reduction in FX P&amp;L variance vs an unhedged position.
            Residual risk reflects basis between forward and actual settlement,
            and the unhedged share.
          </p>
        </div>
      </div>
    </StepShell>
  );
}

function DerivedCard({
  label,
  value,
  sublabel,
  tone,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "ok" | "warn";
  icon?: string;
}) {
  const color =
    tone === "ok" ? "text-success-600" : tone === "warn" ? "text-warn-600" : "text-ink-900";
  return (
    <div className="card-paper p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400 mb-2">
        {label}
      </p>
      <p className={`font-display text-2xl tracking-tight tabular ${color}`}>
        {value}
      </p>
      {sublabel && (
        <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
          {sublabel}
        </p>
      )}
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
