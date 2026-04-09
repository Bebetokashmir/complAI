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

export const ARTICLE_DESCRIPTIONS: Record<string, string> = {
  "Art. 5": "Prohibited AI practices",
  "Art. 6": "Classification of high-risk AI systems",
  "Art. 7": "Amendments to Annex III",
  "Art. 9": "Risk management system",
  "Art. 10": "Data and data governance",
  "Art. 11": "Technical documentation",
  "Art. 12": "Record-keeping & logging",
  "Art. 13": "Transparency & information to deployers",
  "Art. 14": "Human oversight",
  "Art. 15": "Accuracy, robustness & cybersecurity",
  "Art. 43": "Conformity assessment",
  "Art. 49": "EU Declaration of Conformity",
  "Art. 50": "Transparency obligations for certain AI systems",
  "Art. 51": "Classification of GPAI models",
  "Art. 53": "Obligations for GPAI model providers",
  "Art. 95": "Codes of conduct",
  "Article 5": "Prohibited AI practices",
  "Article 6": "Classification of high-risk AI systems",
  "Article 9": "Risk management system",
  "Article 10": "Data and data governance",
  "Article 11": "Technical documentation",
  "Article 12": "Record-keeping & logging",
  "Article 13": "Transparency & information to deployers",
  "Article 14": "Human oversight",
  "Article 15": "Accuracy, robustness & cybersecurity",
  "Article 43": "Conformity assessment",
  "Article 49": "EU Declaration of Conformity",
  "Article 50": "Transparency obligations for certain AI systems",
  "Article 50(1)": "Chatbot disclosure obligation",
  "Article 50(2)": "AI-generated content disclosure",
  "Article 51": "Classification of GPAI models",
  "Article 53": "Obligations for GPAI model providers",
  "Article 4": "AI literacy obligations",
  "Article 95": "Codes of conduct",
};

export const FORBIDDEN_USES = [
  "Social scoring by public authorities",
  "Manipulation via subliminal techniques",
  "Exploitation of vulnerable groups",
  "Real-time remote biometric identification in public spaces (with exceptions)",
  "Emotion recognition in the workplace or educational institutions",
  "Biometric categorisation based on protected characteristics",
];
