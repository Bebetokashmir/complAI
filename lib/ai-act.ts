import type { RiskLevel } from "@/types/assessment";

export const RISK_LEVELS: Record<
  RiskLevel,
  { label: string; labelNL: string; description: string; color: string }
> = {
  unacceptable: {
    label: "Unacceptable Risk",
    labelNL: "Onaanvaardbaar Risico",
    description:
      "Verboden toepassingen. Het systeem mag niet op de markt worden gebracht.",
    color: "destructive",
  },
  high: {
    label: "High Risk",
    labelNL: "Hoog Risico",
    description:
      "Strenge verplichtingen vóór marktintroductie (Art. 9–15 AI Act).",
    color: "warning",
  },
  limited: {
    label: "Limited Risk",
    labelNL: "Beperkt Risico",
    description: "Transparantieverplichtingen van toepassing.",
    color: "caution",
  },
  minimal: {
    label: "Minimal Risk",
    labelNL: "Minimaal Risico",
    description: "Minimale verplichtingen. Vrijwillige gedragscodes aanbevolen.",
    color: "safe",
  },
};

export const HIGH_RISK_DOMAINS = [
  "Biometrische identificatie en categorisering",
  "Kritieke infrastructuur (energie, water, transport)",
  "Onderwijs en beroepsopleidingen",
  "Werkgelegenheid en personeelsbeheer",
  "Toegang tot essentiële diensten (krediet, sociale zekerheid)",
  "Rechtshandhaving",
  "Migratie en asiel",
  "Rechtsbedeling en democratisch proces",
];

export const FORBIDDEN_USES = [
  "Social scoring door overheidsinstanties",
  "Manipulatie via subliminale technieken",
  "Exploitatie van kwetsbare groepen",
  "Real-time biometrische identificatie in openbare ruimten (met uitzonderingen)",
  "Emotion recognition op de werkplek of in onderwijs",
  "Biometrische categorisering op basis van beschermde kenmerken",
];
