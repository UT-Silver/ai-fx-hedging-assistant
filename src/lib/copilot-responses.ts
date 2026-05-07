import { RecommendationContext } from "./types";
import { STRATEGIES } from "./hedging-logic";

// A small library of canned but context-aware responses for the chat copilot.
// Each entry maps a chip ID to a function that produces a response string from
// the current recommendation context. Real LLM integration can be plugged in
// later — the chat UI just expects (id, ctx) -> string.

export type ChipId =
  | "delay"
  | "ratio_50"
  | "explain_cfo"
  | "more_conservative"
  | "compare_fwd_opt"
  | "execution_risks"
  | "rollover"
  | "what_if_volatile";

export const CHIPS: { id: ChipId; label: string }[] = [
  { id: "delay", label: "What if the payment is delayed by 2 months?" },
  { id: "ratio_50", label: "What if I only hedge 50%?" },
  { id: "explain_cfo", label: "Explain this to my CFO." },
  { id: "more_conservative", label: "Make the recommendation more conservative." },
  { id: "compare_fwd_opt", label: "Compare forward vs option." },
  { id: "execution_risks", label: "What are the execution risks?" },
  { id: "rollover", label: "What happens if I roll the hedge?" },
  { id: "what_if_volatile", label: "What if volatility spikes?" },
];

export function copilotReply(id: ChipId, ctx: RecommendationContext): string {
  const { input, hedgeRatio, selectedStrategy, diagnosis } = ctx;
  const strategy = STRATEGIES[selectedStrategy];
  const isPaying = input.direction === "paying";

  switch (id) {
    case "delay":
      return `If the cash flow slips by ~2 months, two things change. First, the original forward maturity no longer matches the settlement date — you would either roll the forward (paying or earning the carry differential) or unwind and re-execute. Second, the longer effective horizon widens the FX outcome range. A ${strategy.name.toLowerCase()} can absorb minor delays, but if delays of this size are recurring, a ${strategy.key === "layered" ? "tighter layered programme" : "layered structure"} or option-based approach handles timing risk more cleanly.`;

    case "ratio_50":
      return `At a 50% hedge, half of the ${input.amount.toLocaleString()} ${input.foreignCurrency} is locked at the forward rate and half floats with spot. Compared with the recommended ${hedgeRatio}%, you keep more upside but absorb more downside — in an adverse 5% scenario the protection drops roughly proportionally. Reasonable choice if the goal leans toward flexibility, but it does shift the risk level upward.`;

    case "explain_cfo":
      return `The exposure is ${fmt(diagnosis.unhedgedExposureBase, input.baseCurrency)} of ${input.baseCurrency}-equivalent cash flow over the next ${input.timeHorizon}. Without a hedge, the actual settlement amount can drift materially from budget. The proposal is a ${strategy.name.toLowerCase()} on ${hedgeRatio}% of the exposure — that locks in the budgeted figure on the hedged share while leaving ${100 - hedgeRatio}% open to benefit from favourable moves. The cost of certainty is the upside given up on the hedged portion.`;

    case "more_conservative":
      const safeRatio = Math.min(100, hedgeRatio + 20);
      return `For a more conservative posture, increase the hedge ratio toward ${safeRatio}% and prefer ${selectedStrategy === "option" ? "a forward or collar" : "a forward"} over option-only structures. This narrows the outcome range further at the cost of less upside participation. Useful if the cash flow is firm and budget protection is the dominant priority.`;

    case "compare_fwd_opt":
      return `Forward: locks the rate, no upfront cost, but no upside. Best when the cash flow is confirmed and budget certainty is the goal. Option: pays a premium today for the right (not obligation) to exchange at a chosen strike. Best when the cash flow may not happen, or when keeping the upside is valuable. In your case (${input.certainty} cash flow, ${input.riskTolerance} risk tolerance, goal = ${input.goal.replace("_", " ")}), the engine leans ${ctx.recommendedStrategy === "option" || ctx.recommendedStrategy === "collar" ? "toward an option-style structure" : "toward a forward"}.`;

    case "execution_risks":
      return `Main pre-trade execution risks: (1) timing — quoting at a poor moment in the day or before a central-bank event; (2) credit lines — large notionals may need pre-approval with the bank; (3) documentation — ISDA/CSA in place if using derivatives, hedge-accounting designation if you want P&L treatment; (4) exposure verification — confirming the underlying invoice/forecast matches the hedge tenor and notional. Layered programmes also need a written policy on tranche size and triggers.`;

    case "rollover":
      return `Rolling means closing the existing forward and opening a new one to a later date. Economically you crystallise any P&L on the old forward and pick up new forward points to the new date. If the carry has moved against you, the roll cost can be material. A clean alternative: hedge in tranches that align with realistic settlement windows (a layered hedge), so a small slip does not require rolling the whole notional.`;

    case "what_if_volatile":
      return `Higher volatility makes options more expensive (premium scales with vol) but does not change the cost of forwards. If your structure is forward-based, a volatility spike does not directly affect the locked rate — only the residual unhedged ${100 - hedgeRatio}%. If you were considering options, the same protection now costs more, which often pushes treasuries toward forwards or collars in high-vol regimes.`;
  }
}

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// One-click "scenario buttons" — these mutate the recommendation context and
// produce a short narrative string. The page wires them into state.
export type ScenarioId =
  | "fcy_strengthens"
  | "fcy_weakens"
  | "vol_increases"
  | "payment_delayed"
  | "amount_changes"
  | "more_conservative";

export const SCENARIO_BUTTONS: { id: ScenarioId; label: string; emoji: string }[] = [
  { id: "fcy_strengthens", label: "Foreign currency strengthens", emoji: "↑" },
  { id: "fcy_weakens", label: "Foreign currency weakens", emoji: "↓" },
  { id: "vol_increases", label: "Volatility spikes", emoji: "≈" },
  { id: "payment_delayed", label: "Payment delayed", emoji: "⏱" },
  { id: "amount_changes", label: "Exposure amount changes", emoji: "Δ" },
  { id: "more_conservative", label: "Become more conservative", emoji: "↡" },
];

export function scenarioNarrative(id: ScenarioId, ctx: RecommendationContext): string {
  const isPaying = ctx.input.direction === "paying";
  switch (id) {
    case "fcy_strengthens":
      return isPaying
        ? `${ctx.input.foreignCurrency} strengthening hurts a payer — the ${ctx.input.baseCurrency} cost rises. The ${ctx.hedgeRatio}% hedge insulates that share; the residual ${100 - ctx.hedgeRatio}% absorbs the move.`
        : `${ctx.input.foreignCurrency} strengthening helps a receiver — each unit converts to more ${ctx.input.baseCurrency}. The ${100 - ctx.hedgeRatio}% unhedged portion captures this upside; the hedged portion stays flat.`;
    case "fcy_weakens":
      return isPaying
        ? `${ctx.input.foreignCurrency} weakening helps a payer — costs come down. The unhedged ${100 - ctx.hedgeRatio}% benefits; the hedged share is locked.`
        : `${ctx.input.foreignCurrency} weakening hurts a receiver — fewer ${ctx.input.baseCurrency} per unit. The hedge protects the ${ctx.hedgeRatio}% locked share; the rest takes the hit.`;
    case "vol_increases":
      return `Higher implied vol raises option premiums but does not change forward economics. If the structure is option-based, the same protection becomes more expensive — many treasuries pivot to forwards or collars in high-vol regimes.`;
    case "payment_delayed":
      return `If the settlement date slips, a single forward needs to be rolled — paying or earning carry to the new date. A layered hedge or option-based structure handles timing risk more cleanly than a single forward.`;
    case "amount_changes":
      return `If the notional changes, the hedge ratio (in % terms) stays the same, but the absolute hedged amount moves with the exposure. Build the hedge as a % of the latest forecast and rebalance when the forecast firms up.`;
    case "more_conservative":
      return `A more conservative posture pushes the hedge ratio higher (closer to 100%) and prefers forwards or collars over uncovered options. The trade-off: less upside in favourable moves.`;
  }
}
