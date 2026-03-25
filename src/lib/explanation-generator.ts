import {
  ExposureInput,
  HedgingRecommendation,
  ScenarioResult,
  TimeHorizon,
} from "./types";

const TIME_LABELS: Record<TimeHorizon, string> = {
  "1m": "one month",
  "3m": "three months",
  "6m": "six months",
  "12m": "twelve months",
};

const GOAL_LABELS: Record<string, string> = {
  budget_certainty: "budget certainty",
  downside_protection: "downside protection",
  flexibility: "flexibility",
  unsure: "general risk management",
};

// Template-based explanation that works without any API
export function generateMockExplanation(
  input: ExposureInput,
  rec: HedgingRecommendation,
  scenarios: ScenarioResult[]
): string {
  const direction =
    input.direction === "paying"
      ? `paying ${input.foreignCurrency}`
      : `receiving ${input.foreignCurrency}`;
  const timeLabel = TIME_LABELS[input.timeHorizon];
  const goalLabel = GOAL_LABELS[input.goal];
  const adverseScenario = scenarios.find((s) => s.label === "Adverse Move");

  const hedgeDescription =
    rec.hedgeRatio === 100
      ? "fully hedging"
      : rec.hedgeRatio === 0
        ? "not immediately hedging"
        : `hedging ${rec.hedgeRatio}% of`;

  const protectionNote =
    rec.hedgeRatio > 0 && adverseScenario
      ? `In an adverse scenario, this approach would save approximately ${formatCurrency(Math.abs(adverseScenario.savings), input.baseCurrency)} compared to leaving the position fully unhedged.`
      : "This approach keeps the position open to market movements, which means you absorb both gains and losses.";

  const tradeoffNote =
    rec.hedgeRatio === 100
      ? "The trade-off is that you will not benefit if exchange rates move in your favor — you are paying for certainty."
      : rec.hedgeRatio > 50
        ? "You retain some exposure to favorable moves, while the hedged portion provides a buffer against adverse shifts."
        : rec.hedgeRatio > 0
          ? "Most of your exposure remains open, giving you significant flexibility but also significant risk."
          : "You retain full flexibility but also full risk. Consider setting trigger levels to add protection if the market moves sharply.";

  return `**Your Exposure**
Your company has an FX exposure of ${input.amount.toLocaleString()} ${input.foreignCurrency} that you will be ${direction} over the next ${timeLabel}. This means your ${input.baseCurrency} cash flows are sensitive to changes in the ${input.baseCurrency}/${input.foreignCurrency} exchange rate.

**Why This Strategy**
Given your ${input.riskTolerance} risk tolerance and your priority of ${goalLabel}, we recommend ${hedgeDescription} the exposure using a **${rec.strategy}**. ${rec.hedgeRatio > 0 ? `This locks in the rate on ${rec.hedgeRatio}% of your exposure at approximately today's market level.` : ""}

**What You Gain**
${protectionNote}

**What You Give Up**
${tradeoffNote}

This analysis uses simplified assumptions and illustrative exchange rates. In practice, forward rates, option premiums, and credit considerations would affect the final hedging cost.`;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
