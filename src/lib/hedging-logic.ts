import {
  ExposureInput,
  HedgingRecommendation,
  RiskTolerance,
  UserGoal,
} from "./types";

// Deterministic recommendation engine
// Maps (riskTolerance, goal, direction) → strategy + hedge ratio

interface StrategyProfile {
  strategy: string;
  hedgeRatio: number;
  rationale: string;
  tradeoffs: string;
  badge?: string;
}

const STRATEGY_MAP: Record<
  RiskTolerance,
  Record<UserGoal, StrategyProfile>
> = {
  low: {
    budget_certainty: {
      strategy: "Full Forward Hedge",
      hedgeRatio: 100,
      rationale:
        "A forward contract locks in today's rate for the full exposure amount, eliminating FX uncertainty entirely. This is the standard approach for treasury teams that prioritize predictable cash flows.",
      tradeoffs:
        "You give up all potential benefit if the exchange rate moves in your favor. The cost is fully locked.",
      badge: "Recommended for risk-averse treasurers",
    },
    downside_protection: {
      strategy: "Forward Hedge",
      hedgeRatio: 100,
      rationale:
        "With low risk tolerance and a focus on downside protection, a full forward hedge provides the strongest shield against adverse currency moves.",
      tradeoffs:
        "No upside participation. If the market moves favorably, you won't benefit.",
      badge: "Maximum protection",
    },
    flexibility: {
      strategy: "Protective Option Strategy",
      hedgeRatio: 90,
      rationale:
        "Even with a preference for flexibility, low risk tolerance suggests covering most of the exposure. A currency option protects against downside while preserving some upside.",
      tradeoffs:
        "Options carry a premium cost. The hedge is slightly less than 100% to allow minor flexibility.",
    },
    unsure: {
      strategy: "Forward Hedge",
      hedgeRatio: 100,
      rationale:
        "When goals are unclear but risk tolerance is low, the safest approach is to lock in certainty with a full forward hedge. You can always adjust in future periods.",
      tradeoffs:
        "Eliminates FX risk but also eliminates potential gains from favorable moves.",
      badge: "Safe default",
    },
  },
  medium: {
    budget_certainty: {
      strategy: "Partial Forward Hedge",
      hedgeRatio: 75,
      rationale:
        "Hedging 75% of the exposure locks in the majority of your budget while leaving a portion open to benefit from favorable moves.",
      tradeoffs:
        "25% of the exposure remains unhedged and subject to market fluctuations.",
    },
    downside_protection: {
      strategy: "Vanilla Option Hedge",
      hedgeRatio: 75,
      rationale:
        "A currency option provides downside protection while allowing participation in favorable moves. Suitable for medium risk tolerance focused on avoiding worst-case outcomes.",
      tradeoffs:
        "Options require an upfront premium, which increases the total cost of hedging. The premium is non-refundable.",
      badge: "Balanced approach",
    },
    flexibility: {
      strategy: "Partial Hedge with Monitoring",
      hedgeRatio: 50,
      rationale:
        "Hedging half the exposure provides a safety net while keeping significant flexibility. A layered approach lets you add more hedges if the market turns unfavorable.",
      tradeoffs:
        "50% of the exposure remains at risk. Requires ongoing market monitoring to manage the open portion.",
    },
    unsure: {
      strategy: "Partial Forward Hedge",
      hedgeRatio: 60,
      rationale:
        "A moderate hedge covers the majority of downside risk while preserving optionality. This is a sensible middle ground when objectives aren't fully defined.",
      tradeoffs:
        "40% of the exposure is unhedged. You may wish to revisit as your objectives become clearer.",
    },
  },
  high: {
    budget_certainty: {
      strategy: "Light Hedge with Active Monitoring",
      hedgeRatio: 25,
      rationale:
        "Even with high risk tolerance, some budget certainty can be achieved by hedging a small portion. The remaining exposure is managed through active monitoring.",
      tradeoffs:
        "75% unhedged — significant exposure to adverse moves. Requires discipline to act if the market moves sharply against you.",
    },
    downside_protection: {
      strategy: "Out-of-the-Money Option",
      hedgeRatio: 50,
      rationale:
        "An out-of-the-money option provides catastrophic protection at lower premium cost, fitting a high risk tolerance while still guarding against tail risk.",
      tradeoffs:
        "Protection only kicks in after a significant adverse move. Day-to-day fluctuations are fully absorbed.",
    },
    flexibility: {
      strategy: "No Immediate Hedge — Monitor",
      hedgeRatio: 0,
      rationale:
        "With high risk tolerance and a preference for flexibility, staying unhedged maximizes optionality. Set trigger levels to add hedges if the market moves beyond your comfort zone.",
      tradeoffs:
        "Full exposure to FX risk. Gains and losses flow through entirely. This approach requires active attention.",
    },
    unsure: {
      strategy: "Light Tactical Hedge",
      hedgeRatio: 25,
      rationale:
        "A small hedge provides a token level of protection while you determine your goals. This can be scaled up or unwound as your strategy becomes clearer.",
      tradeoffs:
        "Most of the exposure is open. This is essentially a wait-and-see approach with a small safety net.",
    },
  },
};

export function getRecommendation(input: ExposureInput): HedgingRecommendation {
  const profile = STRATEGY_MAP[input.riskTolerance][input.goal];

  // Adjust rationale wording based on direction
  const directionNote =
    input.direction === "paying"
      ? "Since you are paying in foreign currency, adverse moves mean the foreign currency strengthening (costing you more in your base currency)."
      : "Since you are receiving foreign currency, adverse moves mean the foreign currency weakening (reducing the value you receive in your base currency).";

  return {
    strategy: profile.strategy,
    hedgeRatio: profile.hedgeRatio,
    rationale: `${profile.rationale}\n\n${directionNote}`,
    tradeoffs: profile.tradeoffs,
    badge: profile.badge,
  };
}
