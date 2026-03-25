export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "CHF" | "CAD" | "AUD";

export type ExposureDirection = "paying" | "receiving";
export type TimeHorizon = "1m" | "3m" | "6m" | "12m";
export type RiskTolerance = "low" | "medium" | "high";
export type UserGoal = "budget_certainty" | "downside_protection" | "flexibility" | "unsure";

export interface ExposureInput {
  baseCurrency: Currency;
  foreignCurrency: Currency;
  amount: number;
  direction: ExposureDirection;
  timeHorizon: TimeHorizon;
  riskTolerance: RiskTolerance;
  goal: UserGoal;
}

export interface HedgingRecommendation {
  strategy: string;
  hedgeRatio: number; // 0–100
  rationale: string;
  tradeoffs: string;
  badge?: string;
}

export interface ScenarioResult {
  label: string;
  fxMove: number; // e.g. -5, 0, +5
  unhedgedCost: number;
  hedgedCost: number;
  savings: number;
  narrative: string;
}

export interface AnalysisOutput {
  recommendation: HedgingRecommendation;
  scenarios: ScenarioResult[];
  explanation: string;
}
