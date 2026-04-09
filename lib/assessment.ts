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
  return `You are an expert in the EU AI Act (Regulation (EU) 2024/1689). Analyse the following AI project and assess its compliance.

## AI project to assess
${content}

## EU AI Act Risk Classification

### Unacceptable risk (Art. 5) — PROHIBITED
${FORBIDDEN_USES.map((u) => `- ${u}`).join("\n")}

### High risk (Art. 6 + Annex III) — STRICT OBLIGATIONS
Sectors: ${HIGH_RISK_DOMAINS.join(", ")}
Obligations: risk management (Art. 9), data quality (Art. 10), technical documentation (Art. 11), logging (Art. 12), transparency (Art. 13), human oversight (Art. 14), accuracy & robustness (Art. 15), conformity assessment (Art. 43).

### Limited risk — TRANSPARENCY OBLIGATIONS
Chatbots must disclose they are AI. Deepfakes must be labelled.

### Minimal risk — MINIMAL RULES
Voluntary codes of conduct recommended.

## Task
Provide a structured compliance assessment with:
1. Risk classification (unacceptable/high/limited/minimal)
2. Justification referencing specific articles
3. Compliance gaps (what is missing from the project?)
4. Required safeguards for the identified risk level
5. Recommended actions (immediate = within 1 month, short = 1–6 months, long = 6–18 months)
6. Estimated compliance costs in EUR (low/high range):
   - Minimal: €2,000–€10,000 (documentation)
   - Limited: €5,000–€25,000
   - High: €50,000–€500,000 (audit, documentation, systems, legal)
   - Unacceptable: N/A (prohibited)
7. Summary in 2–3 sentences

Respond exclusively in the requested JSON format. Be specific and practically applicable for a startup.`;
}
