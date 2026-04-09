"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GDPR_STATUS, GDPR_ARTICLE_INFO } from "@/lib/gdpr";
import type { GdprAssessmentResult } from "@/types/gdpr";
import {
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Lock,
  ListChecks,
  EuroIcon,
  ExternalLink,
  FileSearch,
  UserCheck,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

const gold = "text-[color:var(--gold)]";

const priorityLabel = {
  immediate: { label: "Immediate",           color: "bg-red-500/15 text-red-400" },
  short:     { label: "Short-term (1–6 mo)", color: "bg-orange-500/15 text-orange-400" },
  long:      { label: "Long-term (6–18 mo)", color: "bg-blue-500/15 text-blue-400" },
};

const statusColors: Record<string, string> = {
  compliant:     "bg-green-500/15 border-green-500/40 text-green-400",
  partial:       "bg-yellow-500/15 border-yellow-500/40 text-yellow-400",
  non_compliant: "bg-red-500/15 border-red-500/40 text-red-400",
};

function formatEur(n: number) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface GdprReportProps {
  result: GdprAssessmentResult;
}

export function GdprReport({ result }: GdprReportProps) {
  const statusInfo = GDPR_STATUS[result.complianceStatus];

  return (
    <div className="space-y-5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header — status + fine risk */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl border bg-card">
        <div className="flex-1">
          <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", gold)}>
            GDPR Compliance Status
          </p>
          <div className={cn(
            "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold",
            statusColors[result.complianceStatus]
          )}>
            {statusInfo.label}
          </div>
          <p className="mt-2 text-sm text-foreground/70">{statusInfo.description}</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className={cn("text-xs font-semibold uppercase tracking-widest mb-1", gold)}>
            Estimated Fine Risk
          </p>
          <p className="text-2xl font-bold text-foreground">
            {result.estimatedFineRisk.low === 0
              ? "Low / None"
              : `${formatEur(result.estimatedFineRisk.low)} – ${formatEur(result.estimatedFineRisk.high)}`}
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
            <ShieldCheck className={cn("h-4 w-4", gold)} />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
          <p className="mt-2 text-sm text-foreground/60 italic">{result.statusReason}</p>
        </CardContent>
      </Card>

      {/* Lawful basis + DPIA/DPO flags */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
            <Scale className={cn("h-4 w-4", gold)} />
            Legal Basis &amp; Obligations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Lawful basis</p>
            <p className="text-sm font-medium text-foreground">{result.legalBasis}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              result.dpiaRequired
                ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                : "bg-green-500/15 border-green-500/40 text-green-400"
            )}>
              <FileSearch className="h-3.5 w-3.5" />
              DPIA {result.dpiaRequired ? "Required" : "Not Required"}
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              result.dpoRequired
                ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                : "bg-green-500/15 border-green-500/40 text-green-400"
            )}>
              <UserCheck className="h-3.5 w-3.5" />
              DPO {result.dpoRequired ? "Required" : "Not Required"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicable Articles */}
      {result.applicableArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <BookOpen className={cn("h-4 w-4", gold)} />
              Applicable Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.applicableArticles.map((a) => {
                let info = GDPR_ARTICLE_INFO[a];
                if (!info) {
                  const numMatch = a.match(/\d+/);
                  if (numMatch) {
                    info = { description: "", url: `https://gdpr-info.eu/art-${numMatch[0]}-gdpr/` };
                  }
                }
                const url = info?.url ?? null;
                const Tag = url ? "a" : "span";
                const linkProps = url
                  ? { href: url, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                const parts = a.split(/\s+[—–-]\s+/);
                return (
                  <Tag
                    key={a}
                    {...(linkProps as object)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 px-3 py-1.5 text-sm hover:bg-[color:var(--gold)]/15 hover:border-[color:var(--gold)]/60 transition-all"
                  >
                    {parts.length > 1 ? (
                      <>
                        <span className="font-semibold text-[color:var(--gold)]">{parts[0]}</span>
                        <span className="text-foreground/80"> — {parts.slice(1).join(" — ")}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-[color:var(--gold)]">{a}</span>
                    )}
                    {url && (
                      <ExternalLink className="h-3 w-3 text-[color:var(--gold)]/50 group-hover:text-[color:var(--gold)] shrink-0 transition-opacity" />
                    )}
                  </Tag>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violations */}
      {result.violations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <AlertTriangle className={cn("h-4 w-4", gold)} />
              Violations &amp; Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.violations.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-400"
                >
                  {v}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Measures */}
      {result.requiredMeasures.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <Lock className={cn("h-4 w-4", gold)} />
              Required Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.requiredMeasures.map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 px-3 py-1.5 text-sm text-foreground/90"
                >
                  {m}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      {result.recommendedActions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <ListChecks className={cn("h-4 w-4", gold)} />
              Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendedActions.map((a, i) => {
                const p = priorityLabel[a.priority];
                return (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 mt-0.5", p.color)}>
                      {p.label}
                    </span>
                    <span className="text-foreground">{a.action}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Fine Risk (mobile) */}
      <Card className="sm:hidden">
        <CardHeader className="pb-2">
          <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
            <EuroIcon className={cn("h-4 w-4", gold)} />
            Estimated Fine Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {result.estimatedFineRisk.low === 0
              ? "Low / None"
              : `${formatEur(result.estimatedFineRisk.low)} – ${formatEur(result.estimatedFineRisk.high)}`}
          </p>
          <p className="text-xs text-foreground/50 mt-1">
            Based on GDPR Art. 83 fine tiers and identified violations.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-foreground/40 pb-4">
        This report is an indicative GDPR assessment based on AI analysis. Consult a data protection legal advisor for definitive compliance decisions.
      </p>
    </div>
  );
}
