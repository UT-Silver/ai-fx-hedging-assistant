import { RecommendationContext } from "./types";
import { STRATEGIES } from "./hedging-logic";
import { timeLabel } from "./explanation-generator";

export type MemoTone = "default" | "conservative" | "simple";

export function generateMemo(
  ctx: RecommendationContext,
  tone: MemoTone = "default"
): string {
  const { input, hedgeRatio, diagnosis, scenarios, spotRate, forwardRate } = ctx;
  const strategy = STRATEGIES[ctx.selectedStrategy];
  const horizon = timeLabel(input.timeHorizon);
  const directionWord = input.direction === "paying" ? "pay" : "receive";
  const adverse = scenarios.find((s) => s.label === "Adverse");
  const favorable = scenarios.find((s) => s.label === "Favorable");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const conservativeNote =
    tone === "conservative"
      ? "\nGiven the prudence preference, this memo recommends operating at the upper end of the suggested hedge ratio and prioritising forward or collar structures over uncovered option exposures."
      : "";
  const simpleHeader =
    tone === "simple"
      ? "Plain-English version. Numbers are rounded for clarity.\n\n"
      : "";

  return `${simpleHeader}TREASURY MEMO
Date: ${today}
Subject: FX Hedging Recommendation — ${input.foreignCurrency}/${input.baseCurrency} ${input.direction === "paying" ? "Payable" : "Receivable"}

1. EXPOSURE SUMMARY
The company will ${directionWord} ${input.amount.toLocaleString()} ${input.foreignCurrency} over the next ${horizon}. At today's illustrative spot of ${spotRate.toFixed(4)}, this represents approximately ${fmt(diagnosis.unhedgedExposureBase, input.baseCurrency)} in ${input.baseCurrency} terms. Cash-flow certainty is currently classified as ${input.certainty}.

2. KEY RISK
${diagnosis.mainRisk} The pre-hedge risk level is ${diagnosis.riskLevel.toUpperCase()}, driven by the time horizon (${horizon}), exposure certainty (${input.certainty}), and the company's stated risk tolerance (${input.riskTolerance}).

3. RECOMMENDED STRATEGY
${strategy.name}. ${strategy.description}

   Best fit because: ${strategy.bestUseCase}

4. RECOMMENDED HEDGE RATIO
${hedgeRatio}% of the exposure (≈ ${fmt(input.amount * (hedgeRatio / 100), input.foreignCurrency, input.foreignCurrency)} of the ${input.amount.toLocaleString()} ${input.foreignCurrency} notional). The remaining ${100 - hedgeRatio}% is left open to retain flexibility and benefit from any favourable moves.${conservativeNote}

5. SCENARIO ANALYSIS
${adverse ? `• Adverse 5% move: unhedged outcome ≈ ${fmt(Math.abs(adverse.unhedgedCost), input.baseCurrency)}; with the proposed hedge ≈ ${fmt(Math.abs(adverse.hedgedCost), input.baseCurrency)}. Estimated loss avoided: ${fmt(Math.abs(adverse.savings), input.baseCurrency)}.` : ""}
${favorable ? `• Favourable 5% move: unhedged ≈ ${fmt(Math.abs(favorable.unhedgedCost), input.baseCurrency)}; hedged ≈ ${fmt(Math.abs(favorable.hedgedCost), input.baseCurrency)}. Foregone upside: ${fmt(Math.abs(favorable.savings), input.baseCurrency)}.` : ""}
After the hedge, residual risk drops to ${diagnosis.postHedgeLevel.toUpperCase()}.

6. RATIONALE
The combination of a ${input.riskTolerance} risk tolerance, ${input.certainty} cash flow, and a ${horizon} horizon points to a ${strategy.name.toLowerCase()} as the cleanest pre-trade structure. Forward reference rate ≈ ${forwardRate.toFixed(4)}, used as the illustrative locked rate.

7. NEXT STEPS
   a. Confirm exposure amount and settlement date with AP / FP&A.
   b. Request indicative quotes from at least two banks for the proposed structure.
   c. Re-run sensitivity at execution if spot has moved more than 1% from ${spotRate.toFixed(4)}.
   d. Document the trade in the treasury system with a hedge-accounting designation if applicable.

— End of memo —`;
}

function fmt(amount: number, currency: string, isoOverride?: string): string {
  const iso = (isoOverride ?? currency).toString();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: iso,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${iso} ${Math.round(amount).toLocaleString()}`;
  }
}
