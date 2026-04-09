export type RiskLevel = "unacceptable" | "high" | "limited" | "minimal";

export type ActionPriority = "immediate" | "short" | "long";

export type GapSeverity = "critical" | "high" | "medium" | "low";

export type SafeguardStatus = "critical" | "required" | "recommended" | "implemented";

export interface ComplianceGap {
  text: string;
  severity: GapSeverity;
}

export interface RequiredSafeguard {
  text: string;
  status: SafeguardStatus;
}

export interface RecommendedAction {
  priority: ActionPriority;
  action: string;
}

export interface CostRange {
  low: number;
  high: number;
  currency: "EUR";
}

export interface AssessmentResult {
  riskLevel: RiskLevel;
  riskReason: string;
  applicableArticles: string[];
  complianceGaps: ComplianceGap[];
  requiredSafeguards: RequiredSafeguard[];
  recommendedActions: RecommendedAction[];
  estimatedCostRange: CostRange;
  summary: string;
}

export type InputType = "text" | "url" | "file";
