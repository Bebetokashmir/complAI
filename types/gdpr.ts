export type GdprComplianceStatus = "non_compliant" | "partial" | "compliant";

export type ActionPriority = "immediate" | "short" | "long";

export interface GdprRecommendedAction {
  priority: ActionPriority;
  action: string;
}

export interface GdprAssessmentResult {
  complianceStatus: GdprComplianceStatus;
  statusReason: string;
  legalBasis: string;
  applicableArticles: string[];
  violations: string[];
  requiredMeasures: string[];
  recommendedActions: GdprRecommendedAction[];
  estimatedFineRisk: { low: number; high: number };
  dpiaRequired: boolean;
  dpoRequired: boolean;
  summary: string;
}
