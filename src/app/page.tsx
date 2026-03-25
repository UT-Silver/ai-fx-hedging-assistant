"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ExposureForm from "@/components/ExposureForm";
import RecommendationCard from "@/components/RecommendationCard";
import ScenarioAnalysis from "@/components/ScenarioAnalysis";
import AIExplanation from "@/components/AIExplanation";
import Disclaimer from "@/components/Disclaimer";
import { ExposureInput, AnalysisOutput } from "@/lib/types";
import { getRecommendation } from "@/lib/hedging-logic";
import { computeScenarios } from "@/lib/scenario-math";
import { generateMockExplanation } from "@/lib/explanation-generator";

const DEFAULT_INPUT: ExposureInput = {
  baseCurrency: "USD",
  foreignCurrency: "EUR",
  amount: 0,
  direction: "paying",
  timeHorizon: "3m",
  riskTolerance: "medium",
  goal: "budget_certainty",
};

export default function Home() {
  const [input, setInput] = useState<ExposureInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<AnalysisOutput | null>(null);

  const handleAnalyze = () => {
    const recommendation = getRecommendation(input);
    const scenarios = computeScenarios(input, recommendation);
    const explanation = generateMockExplanation(
      input,
      recommendation,
      scenarios
    );
    setResult({ recommendation, scenarios, explanation });
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-7 sm:py-10">
        {/* Product framing banner */}
        <div className="mb-8 rounded-xl bg-white border border-gray-100/80 shadow-card px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
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
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              FX hedging support used to require specialist knowledge,
              spreadsheets, and bank interaction.{" "}
              <span className="font-medium text-gray-800">
                This MVP shows how AI can turn that workflow into a simple
                interactive interface.
              </span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-7">
          {/* Left column — form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ExposureForm
              input={input}
              onChange={setInput}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
            />
          </div>

          {/* Right column — results */}
          <div className="space-y-6">
            {!result ? (
              <div className="flex items-center justify-center h-80 rounded-2xl border-2 border-dashed border-gray-200/60 bg-white/40">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                      />
                    </svg>
                  </div>
                  <p className="text-[13px] text-gray-400 font-medium">
                    Configure your exposure parameters
                  </p>
                  <p className="text-[12px] text-gray-300 mt-1">
                    Click &ldquo;Generate Strategy&rdquo; to see analysis
                  </p>
                </div>
              </div>
            ) : (
              <>
                <RecommendationCard recommendation={result.recommendation} />
                <ScenarioAnalysis
                  scenarios={result.scenarios}
                  baseCurrency={input.baseCurrency}
                />
                <AIExplanation explanation={result.explanation} />
                <Disclaimer />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100/80 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-[8px] font-bold text-gray-400">FX</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              AI FX Hedging Assistant
            </p>
          </div>
          <p className="text-[11px] text-gray-400">
            For educational use only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
