import { ExposureInput } from "@/lib/types";

export interface Preset {
  label: string;
  description: string;
  input: ExposureInput;
}

export const PRESETS: Preset[] = [
  {
    label: "European Supplier Payment",
    description: "Pay €500K to a supplier in 3 months",
    input: {
      baseCurrency: "USD",
      foreignCurrency: "EUR",
      amount: 500000,
      direction: "paying",
      timeHorizon: "3m",
      riskTolerance: "low",
      goal: "budget_certainty",
      certainty: "confirmed",
    },
  },
  {
    label: "Export Receivable",
    description: "Receive £250K from a UK customer in 6 months",
    input: {
      baseCurrency: "USD",
      foreignCurrency: "GBP",
      amount: 250000,
      direction: "receiving",
      timeHorizon: "6m",
      riskTolerance: "medium",
      goal: "downside_protection",
      certainty: "confirmed",
    },
  },
  {
    label: "Japan Equipment Purchase",
    description: "Pay ¥50M for equipment in 12 months",
    input: {
      baseCurrency: "USD",
      foreignCurrency: "JPY",
      amount: 50000000,
      direction: "paying",
      timeHorizon: "12m",
      riskTolerance: "medium",
      goal: "flexibility",
      certainty: "forecast",
    },
  },
];

// Sample case used by the "Load Sample Case" button — matches the spec.
export const SAMPLE_CASE: ExposureInput = {
  baseCurrency: "USD",
  foreignCurrency: "EUR",
  amount: 1_000_000,
  direction: "paying",
  timeHorizon: "6m",
  riskTolerance: "medium",
  goal: "budget_certainty",
  certainty: "confirmed",
  spotRate: 1.08,
  forwardRate: 1.09,
};
