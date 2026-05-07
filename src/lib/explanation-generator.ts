import {
  ExposureInput,
  ExplainMode,
  RecommendationContext,
  ScenarioResult,
} from "./types";
import { STRATEGIES } from "./hedging-logic";

const TIME_LABELS: Record<string, string> = {
  "1m": "one month",
  "3m": "three months",
  "6m": "six months",
  "12m": "twelve months",
};

// Each "Explain as" mode reframes the same recommendation for a different
// audience. The numbers stay identical — only the framing and emphasis change.
export function explainForMode(
  ctx: RecommendationContext,
  mode: ExplainMode
): string {
  switch (mode) {
    case "cfo":
      return explainCFO(ctx);
    case "trader":
      return explainTrader(ctx);
    case "beginner":
      return explainBeginner(ctx);
  }
}

function explainCFO(ctx: RecommendationContext): string {
  const { input, hedgeRatio, diagnosis, scenarios } = ctx;
  const strategy = STRATEGIES[ctx.selectedStrategy];
  const adverse = scenarios.find((s) => s.label === "Adverse");
  const horizon = TIME_LABELS[input.timeHorizon];

  return `**Cash-flow impact**
The exposure represents ${fmt(diagnosis.unhedgedExposureBase, input.baseCurrency)} of ${input.baseCurrency} cash flow over the next ${horizon}. Left unhedged, the actual settlement value can drift materially with the ${input.foreignCurrency}/${input.baseCurrency} rate.

**Budget protection**
A ${hedgeRatio}% ${strategy.name.toLowerCase()} secures the majority of the planned figure inside the budget envelope. The hedged portion no longer responds to FX moves; only the residual ${100 - hedgeRatio}% remains sensitive.

**Downside view**
${adverse ? `In an adverse 5% scenario the hedge limits the gap-to-budget by approximately ${fmt(Math.abs(adverse.savings), input.baseCurrency)}. ` : ""}This is the loss avoided that would otherwise hit the P&L through FX.

**Business impact**
Trade-off: the company forgoes some benefit from a favorable FX move on the hedged share. In return, the budgeted figure becomes a number the team can plan and report against with confidence.`;
}

function explainTrader(ctx: RecommendationContext): string {
  const { input, spotRate, forwardRate, hedgeRatio } = ctx;
  const strategy = STRATEGIES[ctx.selectedStrategy];
  const points = ((forwardRate - spotRate) / spotRate) * 10000;
  const horizon = TIME_LABELS[input.timeHorizon];

  return `**Pair & tenor**
${input.foreignCurrency}/${input.baseCurrency}, ${horizon} tenor. Spot ≈ ${spotRate.toFixed(4)}, illustrative forward ≈ ${forwardRate.toFixed(4)} (${points >= 0 ? "+" : ""}${points.toFixed(0)} pips carry).

**Structure**
${strategy.name} on ${hedgeRatio}% of the ${input.amount.toLocaleString()} ${input.foreignCurrency} notional. ${ctx.selectedStrategy === "option" ? "Premium scales with implied vol and tenor — request live indicative levels from the bank desk." : ctx.selectedStrategy === "collar" ? "Pricing is the net of the bought leg minus the sold leg; aim for zero-cost." : ctx.selectedStrategy === "layered" ? "Tranche execution mitigates timing risk; specify trigger levels and intervals." : "Standard outright — quote vs forward points, watch for basis adjustments at fix."}

**Execution timing**
Liquidity in ${input.foreignCurrency}/${input.baseCurrency} is best in overlapping London / NY hours. ${input.timeHorizon === "12m" ? "Long-dated tenors carry wider bid/offer — consider tranching or working an order." : "Standard tenor, market-making is competitive."}

**Market risk**
Residual unhedged delta is ${100 - hedgeRatio}% of notional. Vol regime, central-bank calendar, and tenor matter for both forwards and option pricing.`;
}

function explainBeginner(ctx: RecommendationContext): string {
  const { input, hedgeRatio } = ctx;
  const strategy = STRATEGIES[ctx.selectedStrategy];
  const horizon = TIME_LABELS[input.timeHorizon];
  const directionWord = input.direction === "paying" ? "pay" : "receive";
  const adverse = input.direction === "paying" ? "goes up" : "goes down";

  return `**What is happening**
Your company is going to ${directionWord} ${input.amount.toLocaleString()} ${input.foreignCurrency} in ${horizon}. Until that day, the exchange rate can change, so the actual ${input.baseCurrency} amount is uncertain.

**What the hedge does**
A ${strategy.name.toLowerCase()} on ${hedgeRatio}% of the amount means: for that share, you fix the rate today. Whatever happens in the market, that part of your cash flow is set.

**Why use it**
If ${input.foreignCurrency} ${adverse} before settlement, the hedge protects you. The ${100 - hedgeRatio}% you leave open still moves with the market.

**The trade-off**
Hedging is not about making money. It is about narrowing the range of possible outcomes so the company can plan. You give up some potential upside to remove most of the downside.`;
}

// Compatibility shim — older code paths use a single "explanation" string.
export function generateMockExplanation(
  ctx: RecommendationContext
): string {
  return explainCFO(ctx);
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper used by the memo and elsewhere — labels for time horizons.
export function timeLabel(t: string): string {
  return TIME_LABELS[t] ?? t;
}
