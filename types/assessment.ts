export type RiskLevel = "unacceptable" | "high" | "limited" | "minimal";

export type ActionPriority = "immediate" | "short" | "long";

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
  complianceGaps: string[];
  requiredSafeguards: string[];
  recommendedActions: RecommendedAction[];
  estimatedCostRange: CostRange;
  summary: string;
}

export type InputType = "text" | "url" | "file";
