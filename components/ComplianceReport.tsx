"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/RiskBadge";
import { RISK_LEVELS } from "@/lib/ai-act";
import type { AssessmentResult } from "@/types/assessment";
import {
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  Lock,
  ListChecks,
  EuroIcon,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityLabel = {
  immediate: { label: "Onmiddellijk", color: "bg-red-500/15 text-red-600 dark:text-red-400" },
  short: { label: "Korte termijn (1–6 mnd)", color: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  long: { label: "Lange termijn (6–18 mnd)", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
};

function formatEur(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
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
          <p className="text-sm text-muted-foreground font-medium mb-1">Risicoclassificatie</p>
          <RiskBadge level={result.riskLevel} size="lg" />
          <p className="mt-2 text-sm text-muted-foreground">{levelInfo.description}</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground mb-1">Geschatte compliance-kosten</p>
          <p className="text-2xl font-bold text-primary">
            {result.estimatedCostRange.low === 0
              ? "N.v.t."
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Samenvatting
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
              Van toepassing zijnde artikelen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.applicableArticles.map((a) => (
                <Badge key={a} variant="secondary" className="font-mono text-xs">
                  {a}
                </Badge>
              ))}
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
              Compliance-gaps
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
              Vereiste waarborgen
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
              Actieplan
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
            Geschatte compliance-kosten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {result.estimatedCostRange.low === 0
              ? "N.v.t. (verboden gebruik)"
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Indicatieve schatting op basis van typische audit-, documentatie- en juridische kosten.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground pb-4">
        Dit rapport is een indicatieve beoordeling op basis van AI-analyse. Raadpleeg een juridisch adviseur voor definitieve compliance-beslissingen.
      </p>
    </div>
  );
}
