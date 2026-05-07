import { ExposureInput, RiskDiagnosis } from "./types";
import { classifyRiskLevel } from "./hedging-logic";
import { getSpotRate } from "./scenario-math";

// Build a structured risk diagnosis (Step 2 of the workflow).
export function diagnoseRisk(
  input: ExposureInput,
  hedgeRatio: number
): RiskDiagnosis {
  const spot = input.spotRate ?? getSpotRate(input.baseCurrency, input.foreignCurrency);
  const unhedgedExposureBase = input.amount * spot;

  // For a payer, foreign-currency *appreciation* is the adverse direction
  // (you owe in foreign currency — it gets more expensive in base terms).
  // For a receiver, foreign-currency *depreciation* hurts.
  const isPaying = input.direction === "paying";
  const hurtBy = isPaying ? "appreciation" : "depreciation";

  const directionWord = isPaying ? "pay" : "receive";
  const mainRisk = isPaying
    ? `${input.foreignCurrency} appreciating before settlement increases the ${input.baseCurrency} cost of the payable.`
    : `${input.foreignCurrency} depreciating before settlement reduces the ${input.baseCurrency} value of the receivable.`;

  const preHedge = classifyRiskLevel(0, input.riskTolerance, input.certainty, input.timeHorizon);
  const postHedge = classifyRiskLevel(
    hedgeRatio,
    input.riskTolerance,
    input.certainty,
    input.timeHorizon
  );

  const explanation = isPaying
    ? `You owe ${input.amount.toLocaleString()} ${input.foreignCurrency}. If ${input.foreignCurrency} appreciates against ${input.baseCurrency}, each unit costs more ${input.baseCurrency} — your ${directionWord} amount goes up. The longer the horizon and the less certain the cash flow, the wider the range of possible outcomes.`
    : `You expect to receive ${input.amount.toLocaleString()} ${input.foreignCurrency}. If ${input.foreignCurrency} weakens, each unit converts into fewer ${input.baseCurrency} — your ${directionWord} value goes down. The longer the horizon and the less certain the timing, the wider the outcome range.`;

  return {
    mainRisk,
    hurtBy,
    unhedgedExposureBase,
    riskLevel: preHedge,
    postHedgeLevel: postHedge,
    explanation,
  };
}
