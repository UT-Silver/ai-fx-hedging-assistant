import { ExposureInput, ScenarioResult, DistributionRange } from "./types";

// Illustrative spot rates for demo purposes.
// Pairs are stored as BASE/QUOTE — e.g. EURUSD = 1.085 means 1 EUR = 1.085 USD.
const SPOT_RATES: Record<string, number> = {
  EURUSD: 1.085,
  GBPUSD: 1.265,
  USDJPY: 154.5,
  USDCNY: 7.24,
  USDCHF: 0.883,
  USDCAD: 1.365,
  AUDUSD: 0.655,
  EURGBP: 0.858,
  EURJPY: 167.6,
  GBPJPY: 195.4,
};

export function getSpotRate(base: string, foreign: string): number {
  // Direct pair (e.g. base=USD, foreign=EUR -> USDEUR)
  // Our lookup is in market convention so we try both directions.
  const direct = SPOT_RATES[`${foreign}${base}`]; // e.g. EURUSD when base=USD, foreign=EUR
  if (direct) return direct;
  const inverse = SPOT_RATES[`${base}${foreign}`]; // e.g. USDJPY when base=USD, foreign=JPY
  if (inverse) return 1 / inverse;
  return 1.0;
}

// A simple forward = spot * (1 + carry). Carry is illustrative only — real
// forward points come from interest-rate differentials and can be in either
// direction. We use a small horizon-dependent adjustment so the forward rate
// in the demo doesn't equal spot exactly.
export function getForwardRate(
  base: string,
  foreign: string,
  timeHorizon: string,
  override?: number
): number {
  if (override !== undefined) return override;
  const spot = getSpotRate(base, foreign);
  const monthsMap: Record<string, number> = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
  const m = monthsMap[timeHorizon] ?? 3;
  // 0.4% annualized carry — purely illustrative
  const carry = 0.004 * (m / 12);
  return spot * (1 + carry);
}

// ---------------------------------------------------------------------------
// Scenario for a specific FX shock (used by the slider in Step 4).
// fxMovePct is the % move of the FOREIGN currency vs BASE.
//   +5 means foreign currency appreciates 5% (bad for payers, good for receivers)
// ---------------------------------------------------------------------------

export function computeShockScenario(
  input: ExposureInput,
  hedgeRatio: number,
  fxMovePct: number
): ScenarioResult {
  const spot = input.spotRate ?? getSpotRate(input.baseCurrency, input.foreignCurrency);
  const forward = input.forwardRate ?? getForwardRate(input.baseCurrency, input.foreignCurrency, input.timeHorizon);
  const ratio = hedgeRatio / 100;
  const isPaying = input.direction === "paying";

  // Each unit of foreign currency now costs (or yields) spot * (1 + move).
  const futureSpot = spot * (1 + fxMovePct / 100);

  // Unhedged: full exposure converted at the future spot.
  const unhedgedCost = input.amount * futureSpot;
  // Hedged portion: locked at the forward rate (what you would have booked today).
  // Unhedged portion: floats at future spot.
  const hedgedCost =
    ratio * input.amount * forward + (1 - ratio) * input.amount * futureSpot;

  // For a payer, "savings" = unhedged minus hedged when adverse (positive value).
  // For a receiver, the adverse direction is foreign currency *down*, so flip.
  const savings = isPaying
    ? unhedgedCost - hedgedCost
    : hedgedCost - unhedgedCost;

  const moveAbs = Math.abs(fxMovePct);
  const moveDir = fxMovePct > 0 ? "appreciates" : fxMovePct < 0 ? "depreciates" : "is flat";
  const isAdverse = (isPaying && fxMovePct > 0) || (!isPaying && fxMovePct < 0);
  const isFavorable = (isPaying && fxMovePct < 0) || (!isPaying && fxMovePct > 0);

  let narrative: string;
  if (fxMovePct === 0) {
    narrative = `At today's rate, your ${isPaying ? "cost" : "receivable value"} is approximately ${fmt(unhedgedCost, input.baseCurrency)}.`;
  } else if (isAdverse && ratio > 0) {
    narrative = `If ${input.foreignCurrency} ${moveDir} ${moveAbs.toFixed(1)}%, an unhedged position would ${isPaying ? "cost" : "lose"} ${fmt(Math.abs(unhedgedCost), input.baseCurrency)}. With a ${Math.round(hedgeRatio)}% hedge the outcome is ${fmt(Math.abs(hedgedCost), input.baseCurrency)} — ${fmt(Math.abs(savings), input.baseCurrency)} of damage avoided.`;
  } else if (isAdverse) {
    narrative = `Without any hedge, a ${moveAbs.toFixed(1)}% adverse move ${isPaying ? "increases your cost" : "reduces your receivable"} to ${fmt(Math.abs(unhedgedCost), input.baseCurrency)}.`;
  } else if (isFavorable && ratio > 0) {
    narrative = `${input.foreignCurrency} ${moveDir} ${moveAbs.toFixed(1)}% — favorable for you. The hedge gives up about ${fmt(Math.abs(savings), input.baseCurrency)} of upside, the cost of certainty.`;
  } else {
    narrative = `${input.foreignCurrency} ${moveDir} ${moveAbs.toFixed(1)}% — favorable. With no hedge the full benefit flows through.`;
  }

  return {
    label: `${fxMovePct > 0 ? "+" : ""}${fxMovePct.toFixed(1)}% move`,
    fxMove: fxMovePct,
    futureSpot,
    unhedgedCost: Math.round(unhedgedCost),
    hedgedCost: Math.round(hedgedCost),
    savings: Math.round(savings),
    narrative,
  };
}

// Convenience: classic 3-scenario set for the summary card.
export function computeScenarios(
  input: ExposureInput,
  hedgeRatio: number
): ScenarioResult[] {
  const moves = [
    { label: "Favorable", fxMove: input.direction === "paying" ? -5 : +5 },
    { label: "Base", fxMove: 0 },
    { label: "Adverse", fxMove: input.direction === "paying" ? +5 : -5 },
  ];
  return moves.map(({ label, fxMove }) => {
    const s = computeShockScenario(input, hedgeRatio, fxMove);
    return { ...s, label };
  });
}

// ---------------------------------------------------------------------------
// Outcome distribution — used by the "Before vs After" chart.
// We assume an illustrative ±10% range for the unhedged distribution and
// scale the hedged range linearly with the hedge ratio.
// ---------------------------------------------------------------------------

export function computeOutcomeRange(
  input: ExposureInput,
  hedgeRatio: number,
  shockPct = 10
): { unhedged: DistributionRange; hedged: DistributionRange } {
  const spot = input.spotRate ?? getSpotRate(input.baseCurrency, input.foreignCurrency);
  const forward = input.forwardRate ?? getForwardRate(input.baseCurrency, input.foreignCurrency, input.timeHorizon);
  const ratio = hedgeRatio / 100;

  const baseValue = input.amount * spot;
  const lockedValue = ratio * input.amount * forward;
  const floatNotional = (1 - ratio) * input.amount;

  const lowSpot = spot * (1 - shockPct / 100);
  const highSpot = spot * (1 + shockPct / 100);

  const unhedgedLow = input.amount * lowSpot;
  const unhedgedHigh = input.amount * highSpot;
  const hedgedLow = lockedValue + floatNotional * lowSpot;
  const hedgedHigh = lockedValue + floatNotional * highSpot;

  return {
    unhedged: {
      low: Math.round(unhedgedLow),
      high: Math.round(unhedgedHigh),
      mid: Math.round(baseValue),
    },
    hedged: {
      low: Math.round(hedgedLow),
      high: Math.round(hedgedHigh),
      mid: Math.round(lockedValue + floatNotional * spot),
    },
  };
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}
