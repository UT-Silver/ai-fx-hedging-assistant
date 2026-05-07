"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  ExposureInput,
  RecommendationContext,
  StrategyKey,
  ExplainMode,
} from "@/lib/types";
import {
  recommendStrategy,
  recommendHedgeRatio,
} from "@/lib/hedging-logic";
import { diagnoseRisk } from "@/lib/risk-diagnosis";
import {
  computeScenarios,
  getSpotRate,
  getForwardRate,
} from "@/lib/scenario-math";
import Hero from "@/components/Hero";
import NarrativeSections from "@/components/NarrativeSections";
import StickyProgress from "@/components/workflow/StickyProgress";
import Step1Exposure from "@/components/workflow/Step1Exposure";
import Step2RiskDiagnosis from "@/components/workflow/Step2RiskDiagnosis";
import Step3StrategyComparison from "@/components/workflow/Step3StrategyComparison";
import Step4Scenario from "@/components/workflow/Step4Scenario";
import Step5HedgeRatio from "@/components/workflow/Step5HedgeRatio";
import Step6Memo from "@/components/workflow/Step6Memo";
import DashboardCards from "@/components/workflow/DashboardCards";
import { SAMPLE_CASE } from "@/data/presets";

const DEFAULT_INPUT: ExposureInput = {
  baseCurrency: "USD",
  foreignCurrency: "EUR",
  amount: 0,
  direction: "paying",
  timeHorizon: "3m",
  riskTolerance: "medium",
  goal: "budget_certainty",
  certainty: "confirmed",
};

export default function Home() {
  const [input, setInput] = useState<ExposureInput>(DEFAULT_INPUT);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyKey>("forward");
  const [hedgeRatio, setHedgeRatio] = useState(75);
  const [explainMode, setExplainMode] = useState<ExplainMode>("cfo");

  const workflowRef = useRef<HTMLDivElement>(null);

  // Build the recommendation context whenever any input changes. This runs
  // even when not "analyzed" so the workflow stays consistent — but the
  // workflow sections only render after the user clicks "Run analysis".
  const ctx: RecommendationContext = useMemo(() => {
    const spotRate =
      input.spotRate ?? getSpotRate(input.baseCurrency, input.foreignCurrency);
    const forwardRate = getForwardRate(
      input.baseCurrency,
      input.foreignCurrency,
      input.timeHorizon,
      input.forwardRate
    );
    const recommendedRatio = recommendHedgeRatio(input);
    const recommendedStrategy = recommendStrategy(input);
    const diagnosis = diagnoseRisk(input, hedgeRatio);
    const scenarios = computeScenarios(input, hedgeRatio);

    return {
      input,
      spotRate,
      forwardRate,
      selectedStrategy,
      hedgeRatio,
      recommendedRatio,
      recommendedStrategy,
      diagnosis,
      scenarios,
    };
  }, [input, selectedStrategy, hedgeRatio]);

  const handleAnalyze = () => {
    // Snap selected strategy + ratio to the engine recommendation on first run.
    const recRatio = recommendHedgeRatio(input);
    const recStrat = recommendStrategy(input);
    setSelectedStrategy(recStrat);
    setHedgeRatio(recRatio);
    setAnalyzed(true);
    // Scroll to the workflow start.
    setTimeout(() => {
      const el = document.getElementById("step-2");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setAnalyzed(false);
    setHedgeRatio(75);
    setSelectedStrategy("forward");
    setExplainMode("cfo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSample = () => {
    setInput(SAMPLE_CASE);
    setSelectedStrategy(recommendStrategy(SAMPLE_CASE));
    setHedgeRatio(recommendHedgeRatio(SAMPLE_CASE));
    setAnalyzed(true);
    setTimeout(() => {
      const el = document.getElementById("step-1");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const startAnalysis = () => {
    const el = document.getElementById("step-1");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <Hero onStart={startAnalysis} onSample={handleSample} />

      <NarrativeSections />

      {analyzed && <StickyProgress />}

      <div ref={workflowRef}>
        <Step1Exposure
          input={input}
          onChange={setInput}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />

        {analyzed && (
          <>
            <DashboardCards ctx={ctx} />
            <Step2RiskDiagnosis ctx={ctx} />
            <Step3StrategyComparison
              selected={selectedStrategy}
              recommended={ctx.recommendedStrategy}
              onSelect={setSelectedStrategy}
            />
            <Step4Scenario
              ctx={ctx}
              mode={explainMode}
              onChangeMode={setExplainMode}
            />
            <Step5HedgeRatio ctx={ctx} onChangeRatio={setHedgeRatio} />
            <Step6Memo ctx={ctx} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="section-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4 text-accent-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 17l4-4 4 4 6-6 4 4M3 7h6m6 0h6"
                />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">
                Treasury<span className="text-accent-400">.</span>Copilot
              </p>
              <p className="text-[11px] text-white/40">
                AI FX Hedging Assistant — pre-trade decision tool
              </p>
            </div>
          </div>
          <p className="text-[11px] text-white/40 max-w-md sm:text-right leading-relaxed">
            Educational demo. Not financial advice. All scenarios use simplified
            assumptions and illustrative exchange rates.
          </p>
        </div>
      </div>
    </footer>
  );
}
