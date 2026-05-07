"use client";

import {
  Currency,
  ExposureCertainty,
  ExposureDirection,
  ExposureInput,
  RiskTolerance,
  TimeHorizon,
  UserGoal,
} from "@/lib/types";
import { PRESETS, SAMPLE_CASE } from "@/data/presets";
import StepShell from "./StepShell";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "JPY", "CNY", "CHF", "CAD", "AUD"];

const TIME_OPTIONS: { value: TimeHorizon; label: string }[] = [
  { value: "1m", label: "1 mo" },
  { value: "3m", label: "3 mo" },
  { value: "6m", label: "6 mo" },
  { value: "12m", label: "12 mo" },
];

const RISK_OPTIONS: { value: RiskTolerance; label: string; desc: string }[] = [
  { value: "low", label: "Low", desc: "Minimize risk" },
  { value: "medium", label: "Medium", desc: "Balanced" },
  { value: "high", label: "High", desc: "Accept risk" },
];

const GOAL_OPTIONS: { value: UserGoal; label: string }[] = [
  { value: "budget_certainty", label: "Budget certainty" },
  { value: "downside_protection", label: "Downside protection" },
  { value: "flexibility", label: "Flexibility" },
  { value: "unsure", label: "Not sure yet" },
];

const CERTAINTY_OPTIONS: { value: ExposureCertainty; label: string; desc: string }[] = [
  { value: "confirmed", label: "Confirmed", desc: "Invoice or contract booked" },
  { value: "forecast", label: "Forecast", desc: "Highly likely, not yet booked" },
  { value: "uncertain", label: "Uncertain", desc: "Pipeline / probabilistic" },
];

interface Props {
  input: ExposureInput;
  onChange: (i: ExposureInput) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function Step1Exposure({ input, onChange, onAnalyze, onReset }: Props) {
  const update = (partial: Partial<ExposureInput>) =>
    onChange({ ...input, ...partial });

  const isValid =
    input.baseCurrency !== input.foreignCurrency && input.amount > 0;

  return (
    <StepShell
      index={1}
      label="Exposure Input"
      title="Define the FX exposure."
      subtitle="What does the company owe or expect to receive, when, and how certain is it?"
      tone="paper"
      id="step-1"
    >
      <div className="card-paper p-6 sm:p-8">
        {/* Quick-start row */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-ink-900/5">
          <span className="section-label mr-1">Quick start</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => onChange(p.input)}
              className="chip-light"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => onChange(SAMPLE_CASE)}
            className="chip-light chip-light-active"
          >
            Load sample case
          </button>
          <button onClick={onReset} className="ml-auto text-[12px] text-ink-400 hover:text-ink-700">
            Reset
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Base currency">
            <select
              value={input.baseCurrency}
              onChange={(e) => update({ baseCurrency: e.target.value as Currency })}
              className="input-paper"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Foreign currency">
            <select
              value={input.foreignCurrency}
              onChange={(e) => update({ foreignCurrency: e.target.value as Currency })}
              className="input-paper"
            >
              {CURRENCIES.filter((c) => c !== input.baseCurrency).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label={`Exposure amount (${input.foreignCurrency})`} className="sm:col-span-2">
            <input
              type="number"
              min={0}
              value={input.amount || ""}
              onChange={(e) => update({ amount: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 1,000,000"
              className="input-paper"
            />
          </Field>

          <Field label="Direction" className="sm:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "paying", label: "Payable", desc: "We owe foreign currency" },
                  { value: "receiving", label: "Receivable", desc: "We will receive foreign currency" },
                ] as { value: ExposureDirection; label: string; desc: string }[]
              ).map((opt) => (
                <Toggle
                  key={opt.value}
                  active={input.direction === opt.value}
                  onClick={() => update({ direction: opt.value })}
                >
                  <div className="font-semibold text-[13px]">{opt.label}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{opt.desc}</div>
                </Toggle>
              ))}
            </div>
          </Field>

          <Field label="Time horizon">
            <div className="flex gap-1.5">
              {TIME_OPTIONS.map((opt) => (
                <SegBtn
                  key={opt.value}
                  active={input.timeHorizon === opt.value}
                  onClick={() => update({ timeHorizon: opt.value })}
                >
                  {opt.label}
                </SegBtn>
              ))}
            </div>
          </Field>

          <Field label="Risk tolerance">
            <div className="flex gap-1.5">
              {RISK_OPTIONS.map((opt) => (
                <SegBtn
                  key={opt.value}
                  active={input.riskTolerance === opt.value}
                  onClick={() => update({ riskTolerance: opt.value })}
                >
                  {opt.label}
                </SegBtn>
              ))}
            </div>
          </Field>

          <Field label="Primary goal" className="sm:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={input.goal === opt.value}
                  onClick={() => update({ goal: opt.value })}
                >
                  <div className="text-[13px] font-medium">{opt.label}</div>
                </Toggle>
              ))}
            </div>
          </Field>

          <Field label="Exposure certainty" className="sm:col-span-2">
            <div className="grid grid-cols-3 gap-2">
              {CERTAINTY_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={input.certainty === opt.value}
                  onClick={() => update({ certainty: opt.value })}
                >
                  <div className="text-[13px] font-semibold">{opt.label}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{opt.desc}</div>
                </Toggle>
              ))}
            </div>
          </Field>

          <Field label="Spot rate (optional)">
            <input
              type="number"
              step="0.0001"
              value={input.spotRate ?? ""}
              onChange={(e) =>
                update({
                  spotRate: e.target.value === "" ? undefined : parseFloat(e.target.value),
                })
              }
              placeholder="auto"
              className="input-paper"
            />
          </Field>
          <Field label="Forward rate (optional)">
            <input
              type="number"
              step="0.0001"
              value={input.forwardRate ?? ""}
              onChange={(e) =>
                update({
                  forwardRate:
                    e.target.value === "" ? undefined : parseFloat(e.target.value),
                })
              }
              placeholder="auto"
              className="input-paper"
            />
          </Field>
        </div>

        {input.baseCurrency === input.foreignCurrency && (
          <p className="text-[12px] text-danger-500 font-medium mt-4">
            Base and foreign currency must differ.
          </p>
        )}

        <button
          onClick={onAnalyze}
          disabled={!isValid}
          className={`mt-7 w-full rounded-full py-3.5 text-[14px] font-semibold tracking-tight transition-all ${
            isValid
              ? "btn-primary justify-center"
              : "bg-ink-100 text-ink-400 cursor-not-allowed"
          }`}
        >
          Run analysis
        </button>
      </div>
    </StepShell>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="section-label block mb-2">{label}</label>
      {children}
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-[12px] font-medium px-3 py-2.5 rounded-lg border transition-all ${
        active
          ? "border-accent-500 bg-accent-50 text-accent-700"
          : "border-ink-900/10 text-ink-500 hover:border-ink-400/40"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border px-4 py-3 transition-all ${
        active
          ? "border-accent-500 bg-accent-50 text-accent-700 shadow-sm"
          : "border-ink-900/10 text-ink-700 hover:border-ink-400/40 bg-white"
      }`}
    >
      {children}
    </button>
  );
}
