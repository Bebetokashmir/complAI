import { z } from "zod";
import { HIGH_RISK_DOMAINS, FORBIDDEN_USES } from "./ai-act";

export const AssessmentSchema = z.object({
  riskLevel: z.enum(["unacceptable", "high", "limited", "minimal"]),
  riskReason: z.string(),
  applicableArticles: z.array(z.string()),
  complianceGaps: z.array(
    z.object({
      text: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
    })
  ),
  requiredSafeguards: z.array(
    z.object({
      text: z.string(),
      status: z.enum(["critical", "required", "recommended", "implemented"]),
    })
  ),
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
3. Compliance gaps — each with a severity:
   - "critical": must be fixed immediately, risk of prohibition or heavy fine
   - "high": serious gap that needs addressing before deployment
   - "medium": notable gap, should be resolved in the short term
   - "low": minor improvement recommended
4. Required safeguards — each with a status:
   - "critical": mandatory and not yet in place, poses immediate risk
   - "required": mandatory for the risk level, not yet implemented
   - "recommended": not mandatory but strongly advised
   - "implemented": already in place (include positive findings too)
5. Recommended actions (immediate = within 1 month, short = 1–6 months, long = 6–18 months)
6. Estimated compliance costs in EUR (low/high range):
   - Minimal: €2,000–€10,000 (documentation)
   - Limited: €5,000–€25,000
   - High: €50,000–€500,000 (audit, documentation, systems, legal)
   - Unacceptable: N/A (set both to 0)
7. Summary in 2–3 sentences

Respond exclusively in the requested JSON format. Be specific and practically applicable for a startup.`;
}
