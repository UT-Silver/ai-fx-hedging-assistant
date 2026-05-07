"use client";

import { useMemo, useState } from "react";
import { ExplainMode, RecommendationContext } from "@/lib/types";
import { computeOutcomeRange, computeShockScenario } from "@/lib/scenario-math";
import { explainForMode } from "@/lib/explanation-generator";
import { SCENARIO_BUTTONS, scenarioNarrative, ScenarioId } from "@/lib/copilot-responses";
import StepShell from "./StepShell";
import BeforeAfterChart from "./BeforeAfterChart";
import ExplainAsToggle from "./ExplainAsToggle";

interface Props {
  ctx: RecommendationContext;
  mode: ExplainMode;
  onChangeMode: (m: ExplainMode) => void;
}

export default function Step4Scenario({ ctx, mode, onChangeMode }: Props) {
  const [shock, setShock] = useState(0);
  const [activeBtn, setActiveBtn] = useState<ScenarioId | null>(null);

  // Recompute the scenario whenever shock or hedge ratio changes.
  const scenario = useMemo(
    () => computeShockScenario(ctx.input, ctx.hedgeRatio, shock),
    [ctx.input, ctx.hedgeRatio, shock]
  );

  const dist = useMemo(
    () => computeOutcomeRange(ctx.input, ctx.hedgeRatio, 10),
    [ctx.input, ctx.hedgeRatio]
  );

  const explanation = useMemo(() => explainForMode(ctx, mode), [ctx, mode]);

  const handleScenarioBtn = (id: ScenarioId) => {
    setActiveBtn(id);
    if (id === "fcy_strengthens") setShock(+5);
    if (id === "fcy_weakens") setShock(-5);
    if (id === "vol_increases") setShock(0);
    if (id === "payment_delayed") setShock(+3);
    if (id === "amount_changes") setShock(shock);
    if (id === "more_conservative") setShock(0);
  };

  const isPaying = ctx.input.direction === "paying";

  return (
    <StepShell
      index={4}
      label="Scenario Analysis"
      title="Test the hedge against FX shocks."
      subtitle="Drag the slider to apply a custom move, or use the one-click scenarios."
      tone="dark"
      id="step-4"
    >
      <div className="space-y-5">
        {/* Slider control */}
        <div className="card p-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="section-label text-accent-400 mb-1">FX shock</p>
              <p className="font-display text-2xl tracking-tight text-white">
                {shock > 0 ? "+" : ""}
                {shock.toFixed(1)}%
                <span className="text-[12px] text-white/40 ml-2 font-sans">
                  on {ctx.input.foreignCurrency}/{ctx.input.baseCurrency}
                </span>
              </p>
            </div>
            <div className="flex gap-1.5">
              {[-5, -2, 0, 2, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setShock(v)}
                  className={`text-[11px] tabular px-2.5 py-1 rounded-full transition-all ${
                    shock === v
                      ? "bg-accent-500 text-ink-900"
                      : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                  }`}
                >
                  {v > 0 ? "+" : ""}
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min={-10}
            max={10}
            step={0.5}
            value={shock}
            onChange={(e) => setShock(parseFloat(e.target.value))}
            className="slider-dark"
            style={{ ["--val" as string]: `${((shock + 10) / 20) * 100}%` }}
          />

          <div className="grid sm:grid-cols-4 gap-3 mt-6 text-[12px]">
            <Stat label="Future spot" value={scenario.futureSpot.toFixed(4)} />
            <Stat label="Unhedged" value={fmt(scenario.unhedgedCost, ctx.input.baseCurrency)} />
            <Stat
              label="With hedge"
              value={fmt(scenario.hedgedCost, ctx.input.baseCurrency)}
              accent
            />
            <Stat
              label={isPaying ? "Loss avoided" : "Loss avoided"}
              value={
                (scenario.savings >= 0 ? "+" : "−") +
                fmt(Math.abs(scenario.savings), ctx.input.baseCurrency)
              }
              tone={scenario.savings >= 0 ? "ok" : "warn"}
            />
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-white/70">
            {scenario.narrative}
          </p>
        </div>

        {/* One-click scenario buttons */}
        <div>
          <p className="section-label text-accent-400 mb-3">One-click scenarios</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {SCENARIO_BUTTONS.map((b) => (
              <button
                key={b.id}
                onClick={() => handleScenarioBtn(b.id)}
                className={`chip ${activeBtn === b.id ? "chip-active" : ""}`}
              >
                <span className="text-accent-400 text-[11px] font-mono">
                  {b.emoji}
                </span>
                {b.label}
              </button>
            ))}
          </div>
          {activeBtn && (
            <p className="text-[13px] text-white/65 leading-relaxed pt-3 border-t border-white/5">
              {scenarioNarrative(activeBtn, ctx)}
            </p>
          )}
        </div>

        {/* Before vs After */}
        <BeforeAfterChart
          unhedged={dist.unhedged}
          hedged={dist.hedged}
          currency={ctx.input.baseCurrency}
        />

        {/* Explain as */}
        <div className="card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <p className="section-label text-accent-400 mb-1">Explain as</p>
              <p className="text-[13px] text-white/55">
                Same numbers, three lenses.
              </p>
            </div>
            <ExplainAsToggle mode={mode} onChange={onChangeMode} />
          </div>
          <div className="prose-treasury">
            {renderText(explanation)}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function Stat({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "ok" | "warn";
}) {
  const color =
    tone === "ok"
      ? "text-success-400"
      : tone === "warn"
        ? "text-warn-400"
        : accent
          ? "text-accent-300"
          : "text-white";
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-1">
        {label}
      </p>
      <p className={`text-[15px] font-semibold tabular ${color}`}>{value}</p>
    </div>
  );
}

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h4
          key={i}
          className="text-[12px] font-semibold text-accent-300 mt-4 first:mt-0 mb-1.5 uppercase tracking-wider"
        >
          {line.replace(/\*\*/g, "")}
        </h4>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-[14px] text-white/75 leading-relaxed">
        {line}
      </p>
    );
  });
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
