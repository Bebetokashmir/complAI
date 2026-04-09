import { z } from "zod";
import { HIGH_RISK_DOMAINS, FORBIDDEN_USES } from "./ai-act";

export const AssessmentSchema = z.object({
  riskLevel: z.enum(["unacceptable", "high", "limited", "minimal"]),
  riskReason: z.string(),
  applicableArticles: z.array(z.string()),
  complianceGaps: z.array(z.string()),
  requiredSafeguards: z.array(z.string()),
  recommendedActions: z.array(
    z.object({
      priority: z.enum(["immediate", "short", "long"]),
      action: z.string(),
    })
  ),
  estimatedCostRange: z.object({
    low: z.number(),
    high: z.number(),
    currency: z.literal("EUR"),
  }),
  summary: z.string(),
});

export function buildAssessmentPrompt(content: string): string {
  return `Je bent een expert in de EU AI Act (Verordening (EU) 2024/1689). Analyseer het volgende AI-project en beoordeel de compliance.

## Te beoordelen AI-project
${content}

## EU AI Act Risicoclassificatie

### Onaanvaardbaar risico (Art. 5) — VERBODEN
${FORBIDDEN_USES.map((u) => `- ${u}`).join("\n")}

### Hoog risico (Art. 6 + Bijlage III) — STRENGE VERPLICHTINGEN
Sectoren: ${HIGH_RISK_DOMAINS.join(", ")}
Verplichtingen: risicomanagement (Art. 9), datakwaliteit (Art. 10), technische documentatie (Art. 11), logging (Art. 12), transparantie (Art. 13), menselijk toezicht (Art. 14), nauwkeurigheid & robuustheid (Art. 15), conformiteitsbeoordeling (Art. 43).

### Beperkt risico — TRANSPARANTIEVERPLICHTINGEN
Chatbots moeten melden dat ze AI zijn. Deepfakes moeten worden gelabeld.

### Minimaal risico — MINIMALE REGELS
Vrijwillige gedragscodes aanbevolen.

## Opdracht
Geef een gestructureerde compliance-beoordeling met:
1. Risicoclassificatie (unacceptable/high/limited/minimal)
2. Motivatie met verwijzing naar specifieke artikelen
3. Compliance-gaps (wat ontbreekt er aan het project?)
4. Vereiste waarborgen voor het vastgestelde risiconiveau
5. Aanbevolen acties (immediate = binnen 1 maand, short = 1–6 maanden, long = 6–18 maanden)
6. Geschatte compliance-kosten in EUR (low/high range):
   - Minimaal: €2.000–€10.000 (documentatie)
   - Beperkt: €5.000–€25.000
   - Hoog: €50.000–€500.000 (audit, documentatie, systemen, juridisch)
   - Onaanvaardbaar: N.v.t. (verboden)
7. Samenvatting in 2–3 zinnen

Antwoord uitsluitend in het gevraagde JSON-formaat. Wees specifiek en praktisch toepasbaar voor een startup.`;
}
