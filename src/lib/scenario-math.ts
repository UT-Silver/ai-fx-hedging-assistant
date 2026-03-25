import { ExposureInput, HedgingRecommendation, ScenarioResult } from "./types";

// Illustrative spot rates for demo purposes (vs USD)
const SPOT_RATES: Record<string, number> = {
  EURUSD: 1.085,
  GBPUSD: 1.265,
  USDJPY: 154.5,
  USDCNY: 7.24,
  USDCHF: 0.883,
  USDCAD: 1.365,
  AUDUSD: 0.655,
};

function getSpotRate(base: string, foreign: string): number {
  // Try direct pair
  const direct = SPOT_RATES[`${base}${foreign}`];
  if (direct) return direct;
  // Try inverse
  const inverse = SPOT_RATES[`${foreign}${base}`];
  if (inverse) return 1 / inverse;
  // Default illustrative rate
  return 1.0;
}

const SCENARIO_MOVES = [
  { label: "Favorable Move", fxMove: -5 },
  { label: "No Change", fxMove: 0 },
  { label: "Adverse Move", fxMove: 5 },
];

export function computeScenarios(
  input: ExposureInput,
  rec: HedgingRecommendation
): ScenarioResult[] {
  const spotRate = getSpotRate(input.baseCurrency, input.foreignCurrency);
  const hedgeRatio = rec.hedgeRatio / 100;
  const isPaying = input.direction === "paying";

  return SCENARIO_MOVES.map(({ label, fxMove }) => {
    // A positive fxMove means the foreign currency strengthens vs base
    // For payer: strengthening foreign = higher cost (adverse)
    // For receiver: strengthening foreign = higher value received (favorable)
    // We flip the sign for receivers so "Adverse" is always bad for the user
    const effectiveMove = isPaying ? fxMove : -fxMove;
    const moveMultiplier = 1 + effectiveMove / 100;

    // Cost/value in base currency terms
    const baseAmount = input.amount; // exposure is in foreign currency
    const unhedgedCost = baseAmount * spotRate * moveMultiplier;
    const lockedCost = baseAmount * spotRate; // hedged portion at current rate

    // Blended: hedged portion at locked rate + unhedged portion at scenario rate
    const hedgedCost =
      hedgeRatio * lockedCost + (1 - hedgeRatio) * unhedgedCost;

    const savings = unhedgedCost - hedgedCost;

    // Build narrative
    let narrative: string;
    if (fxMove === 0) {
      narrative = `At current rates, your ${isPaying ? "cost" : "receivable"} is approximately ${formatCurrency(unhedgedCost, input.baseCurrency)}.`;
    } else if ((fxMove > 0 && isPaying) || (fxMove < 0 && !isPaying)) {
      // Adverse scenario
      narrative =
        hedgeRatio > 0
          ? `In an adverse move, the hedge saves you approximately ${formatCurrency(Math.abs(savings), input.baseCurrency)} compared to being fully unhedged.`
          : `Without a hedge, an adverse ${Math.abs(fxMove)}% move increases your ${isPaying ? "cost" : "loss"} by ${formatCurrency(Math.abs(unhedgedCost - baseAmount * spotRate), input.baseCurrency)}.`;
    } else {
      // Favorable scenario
      narrative =
        hedgeRatio > 0
          ? `In a favorable move, the hedge limits your benefit by ${formatCurrency(Math.abs(savings), input.baseCurrency)} — the cost of certainty.`
          : `Without a hedge, you fully benefit from this favorable ${Math.abs(fxMove)}% move.`;
    }

    return {
      label,
      fxMove,
      unhedgedCost: Math.round(unhedgedCost),
      hedgedCost: Math.round(hedgedCost),
      savings: Math.round(savings),
      narrative,
    };
  });
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}
