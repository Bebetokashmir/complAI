import type { RiskLevel } from "@/types/assessment";

export const RISK_LEVELS: Record<
  RiskLevel,
  { label: string; description: string; color: string }
> = {
  unacceptable: {
    label: "Unacceptable Risk",
    description: "Prohibited applications. This system may not be placed on the market.",
    color: "destructive",
  },
  high: {
    label: "High Risk",
    description: "Strict obligations before market introduction (Art. 9–15 AI Act).",
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

const EURLEX_BASE =
  "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689";

export const ARTICLE_INFO: Record<string, { description: string; url: string }> = {
  "Art. 4":        { description: "AI literacy obligations",                     url: `${EURLEX_BASE}#art_4` },
  "Art. 5":        { description: "Prohibited AI practices",                     url: `${EURLEX_BASE}#art_5` },
  "Art. 6":        { description: "Classification of high-risk AI systems",      url: `${EURLEX_BASE}#art_6` },
  "Art. 7":        { description: "Amendments to Annex III",                     url: `${EURLEX_BASE}#art_7` },
  "Art. 9":        { description: "Risk management system",                      url: `${EURLEX_BASE}#art_9` },
  "Art. 10":       { description: "Data and data governance",                    url: `${EURLEX_BASE}#art_10` },
  "Art. 11":       { description: "Technical documentation",                     url: `${EURLEX_BASE}#art_11` },
  "Art. 12":       { description: "Record-keeping & logging",                    url: `${EURLEX_BASE}#art_12` },
  "Art. 13":       { description: "Transparency & information to deployers",     url: `${EURLEX_BASE}#art_13` },
  "Art. 14":       { description: "Human oversight",                             url: `${EURLEX_BASE}#art_14` },
  "Art. 15":       { description: "Accuracy, robustness & cybersecurity",        url: `${EURLEX_BASE}#art_15` },
  "Art. 43":       { description: "Conformity assessment",                       url: `${EURLEX_BASE}#art_43` },
  "Art. 49":       { description: "EU Declaration of Conformity",                url: `${EURLEX_BASE}#art_49` },
  "Art. 50":       { description: "Transparency obligations for AI systems",     url: `${EURLEX_BASE}#art_50` },
  "Art. 51":       { description: "Classification of GPAI models",               url: `${EURLEX_BASE}#art_51` },
  "Art. 53":       { description: "Obligations for GPAI model providers",        url: `${EURLEX_BASE}#art_53` },
  "Art. 95":       { description: "Codes of conduct",                            url: `${EURLEX_BASE}#art_95` },
  "Article 4":     { description: "AI literacy obligations",                     url: `${EURLEX_BASE}#art_4` },
  "Article 5":     { description: "Prohibited AI practices",                     url: `${EURLEX_BASE}#art_5` },
  "Article 6":     { description: "Classification of high-risk AI systems",      url: `${EURLEX_BASE}#art_6` },
  "Article 9":     { description: "Risk management system",                      url: `${EURLEX_BASE}#art_9` },
  "Article 10":    { description: "Data and data governance",                    url: `${EURLEX_BASE}#art_10` },
  "Article 11":    { description: "Technical documentation",                     url: `${EURLEX_BASE}#art_11` },
  "Article 12":    { description: "Record-keeping & logging",                    url: `${EURLEX_BASE}#art_12` },
  "Article 13":    { description: "Transparency & information to deployers",     url: `${EURLEX_BASE}#art_13` },
  "Article 14":    { description: "Human oversight",                             url: `${EURLEX_BASE}#art_14` },
  "Article 15":    { description: "Accuracy, robustness & cybersecurity",        url: `${EURLEX_BASE}#art_15` },
  "Article 43":    { description: "Conformity assessment",                       url: `${EURLEX_BASE}#art_43` },
  "Article 49":    { description: "EU Declaration of Conformity",                url: `${EURLEX_BASE}#art_49` },
  "Article 50":    { description: "Transparency obligations for AI systems",     url: `${EURLEX_BASE}#art_50` },
  "Article 50(1)": { description: "Chatbot disclosure obligation",               url: `${EURLEX_BASE}#art_50` },
  "Article 50(2)": { description: "AI-generated content disclosure",             url: `${EURLEX_BASE}#art_50` },
  "Article 51":    { description: "Classification of GPAI models",               url: `${EURLEX_BASE}#art_51` },
  "Article 53":    { description: "Obligations for GPAI model providers",        url: `${EURLEX_BASE}#art_53` },
  "Article 95":    { description: "Codes of conduct",                            url: `${EURLEX_BASE}#art_95` },
};
