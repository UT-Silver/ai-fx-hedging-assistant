"use client";

import {
  Currency,
  ExposureDirection,
  ExposureInput,
  RiskTolerance,
  TimeHorizon,
  UserGoal,
} from "@/lib/types";
import { PRESETS } from "@/data/presets";

const CURRENCIES: Currency[] = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "CHF",
  "CAD",
  "AUD",
];

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

interface Props {
  input: ExposureInput;
  onChange: (input: ExposureInput) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function ExposureForm({
  input,
  onChange,
  onAnalyze,
  onReset,
}: Props) {
  const update = (partial: Partial<ExposureInput>) =>
    onChange({ ...input, ...partial });

  const isValid =
    input.baseCurrency !== input.foreignCurrency && input.amount > 0;

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em]">
            Exposure Parameters
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Define your FX exposure scenario
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <label className="section-label mb-2.5 block">Quick Start</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange(preset.input)}
              className="group text-[12px] px-3 py-1.5 rounded-lg border border-gray-150 text-gray-500
                hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50/50
                transition-all duration-200 font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Currency pair */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="section-label mb-2 block">Base Currency</label>
            <select
              value={input.baseCurrency}
              onChange={(e) =>
                update({ baseCurrency: e.target.value as Currency })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] font-medium text-gray-800 focus-ring bg-surface-50 appearance-none cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="section-label mb-2 block">Foreign Currency</label>
            <select
              value={input.foreignCurrency}
              onChange={(e) =>
                update({ foreignCurrency: e.target.value as Currency })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] font-medium text-gray-800 focus-ring bg-surface-50 appearance-none cursor-pointer"
            >
              {CURRENCIES.filter((c) => c !== input.baseCurrency).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {input.baseCurrency === input.foreignCurrency && (
          <p className="text-[11px] text-red-500 font-medium">
            Base and foreign currency must differ.
          </p>
        )}

        {/* Amount */}
        <div>
          <label className="section-label mb-2 block">
            Exposure Amount ({input.foreignCurrency})
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={input.amount || ""}
              onChange={(e) =>
                update({ amount: parseFloat(e.target.value) || 0 })
              }
              placeholder="e.g. 500,000"
              className="w-full rounded-xl border border-gray-200 pl-3 pr-12 py-2.5 text-[13px] font-medium text-gray-800 focus-ring bg-surface-50 placeholder:text-gray-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-300">
              {input.foreignCurrency}
            </span>
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="section-label mb-2 block">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                {
                  value: "paying",
                  label: "Paying",
                  desc: "We pay foreign currency",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  ),
                },
                {
                  value: "receiving",
                  label: "Receiving",
                  desc: "We receive foreign currency",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                    </svg>
                  ),
                },
              ] as {
                value: ExposureDirection;
                label: string;
                desc: string;
                icon: React.ReactNode;
              }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ direction: opt.value })}
                className={`flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                  input.direction === opt.value
                    ? "border-brand-300 bg-brand-50/60 text-brand-700 shadow-sm shadow-brand-100/40"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <span
                  className={`${input.direction === opt.value ? "text-brand-500" : "text-gray-300"}`}
                >
                  {opt.icon}
                </span>
                <div>
                  <div className="text-[12px] font-semibold">{opt.label}</div>
                  <div
                    className={`text-[10px] ${input.direction === opt.value ? "text-brand-500/70" : "text-gray-400"}`}
                  >
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time horizon */}
        <div>
          <label className="section-label mb-2 block">Time Horizon</label>
          <div className="flex gap-1.5">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ timeHorizon: opt.value })}
                className={`flex-1 text-[12px] font-medium px-2 py-2 rounded-lg border transition-all duration-200 ${
                  input.timeHorizon === opt.value
                    ? "border-brand-300 bg-brand-50/60 text-brand-700 shadow-sm shadow-brand-100/40"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Risk tolerance */}
        <div>
          <label className="section-label mb-2 block">Risk Tolerance</label>
          <div className="flex gap-1.5">
            {RISK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ riskTolerance: opt.value })}
                className={`flex-1 text-center px-2 py-2.5 rounded-lg border transition-all duration-200 ${
                  input.riskTolerance === opt.value
                    ? "border-brand-300 bg-brand-50/60 text-brand-700 shadow-sm shadow-brand-100/40"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="text-[12px] font-semibold">{opt.label}</div>
                <div
                  className={`text-[10px] mt-0.5 ${input.riskTolerance === opt.value ? "text-brand-500/70" : "text-gray-400"}`}
                >
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="section-label mb-2 block">Primary Goal</label>
          <div className="grid grid-cols-2 gap-1.5">
            {GOAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ goal: opt.value })}
                className={`text-[12px] font-medium px-3 py-2.5 rounded-lg border transition-all duration-200 ${
                  input.goal === opt.value
                    ? "border-brand-300 bg-brand-50/60 text-brand-700 shadow-sm shadow-brand-100/40"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={!isValid}
        className={`mt-7 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-200 ${
          isValid
            ? "bg-brand-600 text-white hover:bg-brand-700 btn-pulse active:scale-[0.98]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Generate Strategy
      </button>
    </div>
  );
}
