import {
  ExposureCertainty,
  ExposureInput,
  RiskTolerance,
  StrategyKey,
  StrategyProfile,
  UserGoal,
} from "./types";

// ---------------------------------------------------------------------------
// Strategy catalogue — content used by the "Strategy Comparison" step.
// Numeric levels (1–5) drive the visual indicators in the strategy cards.
// ---------------------------------------------------------------------------

export const STRATEGIES: Record<StrategyKey, StrategyProfile> = {
  forward: {
    key: "forward",
    name: "Forward Hedge",
    oneLine: "Lock in today's rate for a fixed future date.",
    protection: 5,
    flexibility: 1,
    cost: "low",
    bestUseCase:
      "Confirmed cash flows where budget certainty matters more than upside.",
    description:
      "A forward contract fixes the exchange rate now for settlement on a future date. The cash-flow value is fully determined — no surprises in either direction.",
    pros: [
      "Maximum certainty on the hedged amount",
      "No upfront premium to pay",
      "Simple to execute and book",
    ],
    cons: [
      "No participation if FX moves in your favor",
      "Rolling or unwinding has cost if the cash flow shifts",
      "Locks capital usage with the bank line",
    ],
  },
  option: {
    key: "option",
    name: "Currency Option",
    oneLine: "Buy protection but keep the upside.",
    protection: 3,
    flexibility: 5,
    cost: "high",
    bestUseCase:
      "When the upside matters and the cash flow is real but not yet contracted.",
    description:
      "A vanilla option gives the right — but not the obligation — to exchange at a chosen strike. You pay an upfront premium and walk away from the option if the market moves your way.",
    pros: [
      "Downside protection with full upside participation",
      "Right, not obligation — useful when timing is uncertain",
      "Can be tailored on strike, tenor and notional",
    ],
    cons: [
      "Premium is a real, non-refundable cost",
      "Premium pricing depends on volatility and tenor",
      "Some treasuries need internal approval to use derivatives with premium",
    ],
  },
  collar: {
    key: "collar",
    name: "Collar",
    oneLine: "Protected on the downside, capped on the upside — often zero-cost.",
    protection: 4,
    flexibility: 3,
    cost: "low",
    bestUseCase:
      "When you want option-like protection but cannot or will not pay a premium.",
    description:
      "A collar combines a bought option (protection) with a sold option (cap). Premiums offset, often producing a zero or near-zero net cost. You give up extreme upside to fund downside protection.",
    pros: [
      "Low or zero net premium",
      "Defines a clear range for the future rate",
      "Cleaner accounting story than a naked option",
    ],
    cons: [
      "Upside is capped at the sold strike",
      "More moving parts to explain to stakeholders",
      "Margin or credit requirements on the sold leg",
    ],
  },
  layered: {
    key: "layered",
    name: "Layered Hedge",
    oneLine: "Hedge in tranches over time to reduce timing risk.",
    protection: 4,
    flexibility: 4,
    cost: "low",
    bestUseCase:
      "Forecast or recurring exposures where timing of cash flows is uncertain.",
    description:
      "Instead of a single transaction, the exposure is hedged in steps — for example 30% now, 30% in two months, the rest closer to settlement. This averages the entry rate and softens the impact of being wrong on timing.",
    pros: [
      "Reduces the risk of hedging at a bad single moment",
      "Naturally fits recurring or forecast exposures",
      "Easy to ramp up or pause as forecasts firm up",
    ],
    cons: [
      "More operational steps to track",
      "Average rate may underperform a perfect single-shot trade",
      "Requires a policy on tranche size and triggers",
    ],
  },
};

export const STRATEGY_ORDER: StrategyKey[] = [
  "forward",
  "option",
  "collar",
  "layered",
];

// ---------------------------------------------------------------------------
// Recommended hedge-ratio engine.
// Inputs: risk tolerance, goal, exposure certainty, time horizon.
// Output: a target ratio in [0, 100]. The user can override via the slider.
// ---------------------------------------------------------------------------

const RISK_BASE: Record<RiskTolerance, number> = {
  low: 90,
  medium: 60,
  high: 25,
};

const GOAL_ADJ: Record<UserGoal, number> = {
  budget_certainty: 10,
  downside_protection: 5,
  flexibility: -15,
  unsure: 0,
};

const CERTAINTY_ADJ: Record<ExposureCertainty, number> = {
  confirmed: 5,
  forecast: -5,
  uncertain: -15,
};

export function recommendHedgeRatio(input: ExposureInput): number {
  const raw =
    RISK_BASE[input.riskTolerance] +
    GOAL_ADJ[input.goal] +
    CERTAINTY_ADJ[input.certainty];
  return Math.max(0, Math.min(100, Math.round(raw / 5) * 5));
}

// Recommended strategy: derived from the same drivers.
// Forward = full certainty; Option = preserve upside; Collar = balanced w/o premium;
// Layered = uncertain timing or forecast cash flow.
export function recommendStrategy(input: ExposureInput): StrategyKey {
  if (input.certainty === "uncertain") return "layered";
  if (input.certainty === "forecast" && input.riskTolerance !== "low")
    return "layered";

  if (input.goal === "flexibility") {
    return input.riskTolerance === "high" ? "option" : "collar";
  }
  if (input.goal === "downside_protection") {
    return input.riskTolerance === "high" ? "option" : "collar";
  }
  // budget certainty / unsure with confirmed cash flow
  return "forward";
}

// ---------------------------------------------------------------------------
// Risk diagnosis — converts the inputs into a human-readable summary plus a
// pre-hedge / post-hedge risk level used by the risk meter.
// ---------------------------------------------------------------------------

export function classifyRiskLevel(
  hedgeRatio: number,
  riskTolerance: RiskTolerance,
  certainty: ExposureCertainty,
  timeHorizon: string
): "low" | "medium" | "high" {
  // Higher hedge ratio -> lower residual risk
  // Lower certainty + longer horizon -> higher base risk
  let score = 0;
  score += (100 - hedgeRatio) / 20; // 0 at full hedge, 5 at unhedged
  if (riskTolerance === "low") score += 0.5;
  if (certainty === "forecast") score += 1;
  if (certainty === "uncertain") score += 2;
  if (timeHorizon === "6m") score += 0.5;
  if (timeHorizon === "12m") score += 1;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}
