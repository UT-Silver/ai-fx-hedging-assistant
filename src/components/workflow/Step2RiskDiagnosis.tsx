"use client";

import { RecommendationContext } from "@/lib/types";
import StepShell from "./StepShell";
import RiskMeter from "./RiskMeter";

interface Props {
  ctx: RecommendationContext;
}

export default function Step2RiskDiagnosis({ ctx }: Props) {
  const { input, diagnosis } = ctx;
  const isPaying = input.direction === "paying";
  const hurts =
    diagnosis.hurtBy === "appreciation"
      ? `${input.foreignCurrency} appreciation`
      : `${input.foreignCurrency} depreciation`;

  return (
    <StepShell
      index={2}
      label="Risk Diagnosis"
      title="What is the actual risk?"
      subtitle="A plain-English read of the exposure, before any hedge is applied."
      tone="dark"
      id="step-2"
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <DiagnosisCard
            label="Main FX risk"
            value={diagnosis.mainRisk}
            bigText
          />
          <DiagnosisCard
            label="The company is hurt by"
            value={hurts}
            sublabel={
              isPaying
                ? "Paying foreign currency — appreciation increases base-currency cost"
                : "Receiving foreign currency — depreciation reduces base-currency value"
            }
          />
          <DiagnosisCard
            label={`Unhedged exposure (${input.baseCurrency})`}
            value={fmt(diagnosis.unhedgedExposureBase, input.baseCurrency)}
            sublabel={`${input.amount.toLocaleString()} ${input.foreignCurrency} at illustrative spot`}
            mono
          />
          <DiagnosisCard
            label="Risk level"
            value={diagnosis.riskLevel.toUpperCase()}
            sublabel={`Driven by ${input.timeHorizon} horizon, ${input.certainty} cash flow, ${input.riskTolerance} tolerance`}
            level={diagnosis.riskLevel}
          />
        </div>

        <div className="card p-6">
          <p className="section-label text-accent-400 mb-2">Plain English</p>
          <p className="text-[14px] leading-relaxed text-white/75">
            {diagnosis.explanation}
          </p>
        </div>

        <div>
          <p className="section-label text-accent-400 mb-3">Risk meter</p>
          <RiskMeter
            preHedge={diagnosis.riskLevel}
            postHedge={diagnosis.postHedgeLevel}
          />
        </div>
      </div>
    </StepShell>
  );
}

function DiagnosisCard({
  label,
  value,
  sublabel,
  bigText,
  mono,
  level,
}: {
  label: string;
  value: string;
  sublabel?: string;
  bigText?: boolean;
  mono?: boolean;
  level?: "low" | "medium" | "high";
}) {
  const levelColor =
    level === "high"
      ? "text-danger-400"
      : level === "medium"
        ? "text-warn-400"
        : level === "low"
          ? "text-success-400"
          : "text-white";
  return (
    <div className="card p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2.5">
        {label}
      </p>
      <p
        className={`${bigText ? "text-[14px] leading-relaxed" : "font-display text-2xl tracking-tight"} ${
          mono ? "tabular" : ""
        } ${levelColor}`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="mt-2 text-[12px] text-white/50 leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
