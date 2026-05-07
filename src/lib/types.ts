export type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CNY"
  | "CHF"
  | "CAD"
  | "AUD";

export type ExposureDirection = "paying" | "receiving";
export type TimeHorizon = "1m" | "3m" | "6m" | "12m";
export type RiskTolerance = "low" | "medium" | "high";
export type UserGoal =
  | "budget_certainty"
  | "downside_protection"
  | "flexibility"
  | "unsure";
export type ExposureCertainty = "confirmed" | "forecast" | "uncertain";

export type StrategyKey = "forward" | "option" | "collar" | "layered";
export type ExplainMode = "cfo" | "trader" | "beginner";
export type RiskLevel = "low" | "medium" | "high";

export interface ExposureInput {
  baseCurrency: Currency;
  foreignCurrency: Currency;
  amount: number;
  direction: ExposureDirection;
  timeHorizon: TimeHorizon;
  riskTolerance: RiskTolerance;
  goal: UserGoal;
  certainty: ExposureCertainty;
  spotRate?: number; // optional override of illustrative spot
  forwardRate?: number; // optional override of illustrative forward
}

export interface StrategyProfile {
  key: StrategyKey;
  name: string;
  oneLine: string;
  protection: 1 | 2 | 3 | 4 | 5; // 5 = strongest
  flexibility: 1 | 2 | 3 | 4 | 5;
  cost: "low" | "medium" | "high";
  bestUseCase: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface RiskDiagnosis {
  mainRisk: string; // one-sentence risk
  hurtBy: "appreciation" | "depreciation"; // direction of foreign currency move that hurts
  unhedgedExposureBase: number; // exposure in base currency at spot
  riskLevel: RiskLevel; // pre-hedge
  postHedgeLevel: RiskLevel; // post-hedge given hedgeRatio
  explanation: string;
}

export interface ScenarioResult {
  label: string;
  fxMove: number;
  futureSpot: number;
  unhedgedCost: number;
  hedgedCost: number;
  savings: number;
  narrative: string;
}

export interface DistributionRange {
  low: number;
  high: number;
  mid: number;
}

export interface RecommendationContext {
  input: ExposureInput;
  spotRate: number;
  forwardRate: number;
  selectedStrategy: StrategyKey;
  hedgeRatio: number; // 0–100 user-controlled
  recommendedRatio: number; // engine recommendation
  recommendedStrategy: StrategyKey;
  diagnosis: RiskDiagnosis;
  scenarios: ScenarioResult[];
}
