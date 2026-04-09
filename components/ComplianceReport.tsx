"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/RiskBadge";
import { RISK_LEVELS, ARTICLE_INFO } from "@/lib/ai-act";
import type { AssessmentResult } from "@/types/assessment";
import {
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  Lock,
  ListChecks,
  EuroIcon,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityLabel = {
  immediate: { label: "Immediate", color: "bg-red-500/15 text-red-600 dark:text-red-400" },
  short: { label: "Short-term (1–6 mo)", color: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  long: { label: "Long-term (6–18 mo)", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
};

function formatEur(n: number) {
  return new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

interface ComplianceReportProps {
  result: AssessmentResult;
}

export function ComplianceReport({ result }: ComplianceReportProps) {
  const levelInfo = RISK_LEVELS[result.riskLevel];

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl border bg-card">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">Risk Classification</p>
          <RiskBadge level={result.riskLevel} size="lg" />
          <p className="mt-2 text-sm text-muted-foreground">{levelInfo.description}</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground mb-1">Estimated compliance cost</p>
          <p className="text-2xl font-bold text-primary">
            {result.estimatedCostRange.low === 0
              ? "N/A"
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{result.summary}</p>
          <p className="mt-3 text-sm text-muted-foreground italic">{result.riskReason}</p>
        </CardContent>
      </Card>

      {/* Applicable Articles */}
      {result.applicableArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Applicable Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {result.applicableArticles.map((a) => {
                const info = ARTICLE_INFO[a];
                const Tag = info ? "a" : "div";
                const linkProps = info
                  ? { href: info.url, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <Tag
                    key={a}
                    {...linkProps}
                    className="group flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold font-mono text-primary w-28 shrink-0">
                        {a}
                      </span>
                      {info?.description && (
                        <span className="text-sm text-muted-foreground">
                          {info.description}
                        </span>
                      )}
                    </div>
                    {info && (
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary shrink-0 ml-3 transition-colors" />
                    )}
                  </Tag>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Gaps */}
      {result.complianceGaps.length > 0 && (
        <Card className="border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Compliance Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.complianceGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                  {gap}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Required Safeguards */}
      {result.requiredSafeguards.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" />
              Required Safeguards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.requiredSafeguards.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      {result.recommendedActions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-primary" />
              Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendedActions.map((a, i) => {
                const p = priorityLabel[a.priority];
                return (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={cn("rounded px-2 py-0.5 text-xs font-medium shrink-0 mt-0.5", p.color)}>
                      {p.label}
                    </span>
                    <span>{a.action}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Cost Estimate (mobile) */}
      <Card className="sm:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <EuroIcon className="h-4 w-4 text-primary" />
            Estimated Compliance Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {result.estimatedCostRange.low === 0
              ? "N/A (prohibited use)"
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Indicative estimate based on typical audit, documentation, and legal costs.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground pb-4">
        This report is an indicative assessment based on AI analysis. Consult a legal advisor for definitive compliance decisions.
      </p>
    </div>
  );
}
