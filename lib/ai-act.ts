import type { RiskLevel } from "@/types/assessment";

export const RISK_LEVELS: Record<
  RiskLevel,
  { label: string; description: string; color: string }
> = {
  unacceptable: {
    label: "Unacceptable Risk",
    description:
      "Prohibited applications. This system may not be placed on the market.",
    color: "destructive",
  },
  high: {
    label: "High Risk",
    description:
      "Strict obligations before market introduction (Art. 9–15 AI Act).",
    color: "warning",
  },
  limited: {
    label: "Limited Risk",
    description: "Transparency obligations apply.",
    color: "caution",
  },
  minimal: {
    label: "Minimal Risk",
    description: "Minimal obligations. Voluntary codes of conduct recommended.",
    color: "safe",
  },
};

export const HIGH_RISK_DOMAINS = [
  "Biometric identification and categorisation",
  "Critical infrastructure (energy, water, transport)",
  "Education and vocational training",
  "Employment and workforce management",
  "Access to essential services (credit, social security)",
  "Law enforcement",
  "Migration, asylum and border control",
  "Administration of justice and democratic processes",
];

export const FORBIDDEN_USES = [
  "Social scoring by public authorities",
  "Manipulation via subliminal techniques",
  "Exploitation of vulnerable groups",
  "Real-time remote biometric identification in public spaces (with exceptions)",
  "Emotion recognition in the workplace or educational institutions",
  "Biometric categorisation based on protected characteristics",
];
