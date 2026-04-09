import { z } from "zod";

export const GdprAssessmentSchema = z.object({
  complianceStatus: z.enum(["non_compliant", "partial", "compliant"]),
  statusReason: z.string(),
  legalBasis: z.string(),
  applicableArticles: z.array(z.string()),
  violations: z.array(z.string()),
  requiredMeasures: z.array(z.string()),
  recommendedActions: z.array(
    z.object({
      priority: z.enum(["immediate", "short", "long"]),
      action: z.string(),
    })
  ),
  estimatedFineRisk: z.object({
    low: z.number(),
    high: z.number(),
  }),
  dpiaRequired: z.boolean(),
  dpoRequired: z.boolean(),
  summary: z.string(),
});

export function buildGdprPrompt(content: string): string {
  return `You are an expert in the EU General Data Protection Regulation (GDPR — Regulation (EU) 2016/679). Analyse the following project or product description and assess its GDPR compliance.

## Project to assess
${content}

## GDPR Assessment Framework

### Lawful basis (Art. 6)
Determine which lawful basis applies: consent, contract, legal obligation, vital interests, public task, or legitimate interests. If none can be clearly identified, flag it.

### Special categories (Art. 9)
Flag if health, biometric, racial/ethnic origin, political, religious, trade-union, genetic, or sexual orientation data is processed — these require explicit consent or another Art. 9(2) ground.

### Data subject rights (Art. 15–22)
Check whether the system enables: access, rectification, erasure, restriction, portability, objection, and safeguards against automated decision-making/profiling.

### Controller obligations
- Privacy notices (Art. 13/14)
- Records of processing activities (Art. 30)
- Data protection by design and by default (Art. 25)
- Security measures (Art. 32)
- Breach notification process (Art. 33/34)
- Data Processing Agreements with processors (Art. 28)

### DPIA required (Art. 35) when:
- Large-scale processing of special category data
- Systematic monitoring of public areas
- Profiling with legal/significant effects
- New technologies with high risk

### DPO required (Art. 37) when:
- Public authority or body
- Large-scale systematic monitoring
- Large-scale special category data processing

### International transfers (Art. 44–49)
Flag if data is transferred outside the EEA without adequate safeguards (adequacy decision, SCCs, BCRs).

### GDPR Fines (Art. 83)
- Tier 1 (administrative): up to €10,000,000 or 2% global annual turnover
- Tier 2 (serious violations): up to €20,000,000 or 4% global annual turnover

## Task
Provide a structured GDPR compliance assessment:
1. Compliance status: compliant / partial / non_compliant
2. Reason for the status
3. Most likely lawful basis (or "None identified")
4. Applicable GDPR articles (use short form: "Art. 6", "Art. 35", etc.)
5. Violations or gaps found (empty array if none)
6. Required measures to reach compliance
7. Recommended actions with priority (immediate = within 1 month, short = 1–6 months, long = 6–18 months)
8. Estimated fine risk in EUR (low/high) — set both to 0 if fully compliant
9. Whether a DPIA is required (true/false)
10. Whether a DPO is required (true/false)
11. Summary in 2–3 sentences

Respond exclusively in the requested JSON format. Be specific and practically applicable for a startup or SME.`;
}
