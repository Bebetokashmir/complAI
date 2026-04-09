import type { GdprComplianceStatus } from "@/types/gdpr";

export const GDPR_STATUS: Record<
  GdprComplianceStatus,
  { label: string; description: string; color: string }
> = {
  compliant: {
    label: "Compliant",
    description: "No major gaps identified. Continue monitoring and document processing activities.",
    color: "safe",
  },
  partial: {
    label: "Partially Compliant",
    description: "Gaps exist that must be addressed. Processing may continue while remediating.",
    color: "caution",
  },
  non_compliant: {
    label: "Non-Compliant",
    description: "Serious violations identified. Processing may need to pause until resolved.",
    color: "destructive",
  },
};

const GDPR_BASE =
  "https://gdpr-info.eu/art-";

export const GDPR_ARTICLE_INFO: Record<string, { description: string; url: string }> = {
  "Art. 5":  { description: "Principles of personal data processing",         url: `${GDPR_BASE}5-gdpr/` },
  "Art. 6":  { description: "Lawful basis for processing",                    url: `${GDPR_BASE}6-gdpr/` },
  "Art. 7":  { description: "Conditions for consent",                         url: `${GDPR_BASE}7-gdpr/` },
  "Art. 9":  { description: "Special categories of personal data",            url: `${GDPR_BASE}9-gdpr/` },
  "Art. 12": { description: "Transparent information to data subjects",       url: `${GDPR_BASE}12-gdpr/` },
  "Art. 13": { description: "Information to be provided on collection",       url: `${GDPR_BASE}13-gdpr/` },
  "Art. 14": { description: "Information where data not collected directly",  url: `${GDPR_BASE}14-gdpr/` },
  "Art. 15": { description: "Right of access by the data subject",            url: `${GDPR_BASE}15-gdpr/` },
  "Art. 16": { description: "Right to rectification",                         url: `${GDPR_BASE}16-gdpr/` },
  "Art. 17": { description: "Right to erasure ('right to be forgotten')",     url: `${GDPR_BASE}17-gdpr/` },
  "Art. 18": { description: "Right to restriction of processing",             url: `${GDPR_BASE}18-gdpr/` },
  "Art. 20": { description: "Right to data portability",                      url: `${GDPR_BASE}20-gdpr/` },
  "Art. 21": { description: "Right to object",                                url: `${GDPR_BASE}21-gdpr/` },
  "Art. 22": { description: "Automated decision-making including profiling",  url: `${GDPR_BASE}22-gdpr/` },
  "Art. 24": { description: "Responsibility of the controller",               url: `${GDPR_BASE}24-gdpr/` },
  "Art. 25": { description: "Data protection by design and by default",       url: `${GDPR_BASE}25-gdpr/` },
  "Art. 26": { description: "Joint controllers",                              url: `${GDPR_BASE}26-gdpr/` },
  "Art. 28": { description: "Processor obligations",                          url: `${GDPR_BASE}28-gdpr/` },
  "Art. 30": { description: "Records of processing activities (RoPA)",        url: `${GDPR_BASE}30-gdpr/` },
  "Art. 32": { description: "Security of processing",                         url: `${GDPR_BASE}32-gdpr/` },
  "Art. 33": { description: "Notification of data breach to supervisory authority", url: `${GDPR_BASE}33-gdpr/` },
  "Art. 34": { description: "Communication of data breach to data subjects",  url: `${GDPR_BASE}34-gdpr/` },
  "Art. 35": { description: "Data Protection Impact Assessment (DPIA)",       url: `${GDPR_BASE}35-gdpr/` },
  "Art. 37": { description: "Designation of Data Protection Officer (DPO)",   url: `${GDPR_BASE}37-gdpr/` },
  "Art. 44": { description: "International transfers — general principle",    url: `${GDPR_BASE}44-gdpr/` },
  "Art. 46": { description: "International transfers — appropriate safeguards", url: `${GDPR_BASE}46-gdpr/` },
};

export const LAWFUL_BASIS_OPTIONS = [
  "Consent (Art. 6(1)(a))",
  "Contract performance (Art. 6(1)(b))",
  "Legal obligation (Art. 6(1)(c))",
  "Vital interests (Art. 6(1)(d))",
  "Public task (Art. 6(1)(e))",
  "Legitimate interests (Art. 6(1)(f))",
  "None identified",
];
