"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { RISK_LEVELS, ARTICLE_INFO } from "@/lib/ai-act";
import type { AssessmentResult, GapSeverity, SafeguardStatus } from "@/types/assessment";
import { ImportToExpert } from "@/components/ImportToExpert";
import {
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  Lock,
  ListChecks,
  EuroIcon,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const gold = "text-[color:var(--gold)]";

const priorityLabel = {
  immediate: { label: "Immediate",           color: "bg-red-500/15 text-red-400" },
  short:     { label: "Short-term (1–6 mo)", color: "bg-orange-500/15 text-orange-400" },
  long:      { label: "Long-term (6–18 mo)", color: "bg-blue-500/15 text-blue-400" },
};

const gapConfig: Record<GapSeverity, { stripe: string; badge: string; label: string }> = {
  critical:    { stripe: "bg-red-500",    badge: "text-red-400 border-red-500/40",       label: "Critical"  },
  high:        { stripe: "bg-orange-500", badge: "text-orange-400 border-orange-500/40", label: "High"      },
  medium:      { stripe: "bg-yellow-500", badge: "text-yellow-400 border-yellow-500/40", label: "Medium"    },
  low:         { stripe: "bg-green-500",  badge: "text-green-400 border-green-500/40",   label: "Low"       },
};

const safeguardConfig: Record<SafeguardStatus, { stripe: string; badge: string; label: string }> = {
  critical:    { stripe: "bg-red-500",    badge: "text-red-400 border-red-500/40",       label: "Critical"    },
  required:    { stripe: "bg-orange-500", badge: "text-orange-400 border-orange-500/40", label: "Required"    },
  recommended: { stripe: "bg-yellow-500", badge: "text-yellow-400 border-yellow-500/40", label: "Recommended" },
  implemented: { stripe: "bg-green-500",  badge: "text-green-400 border-green-500/40",   label: "Implemented" },
};

function formatEur(n: number) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface ComplianceReportProps {
  result: AssessmentResult;
}

export function ComplianceReport({ result }: ComplianceReportProps) {
  const levelInfo = RISK_LEVELS[result.riskLevel];

  return (
    <div className="space-y-5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header — risk + cost */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl border bg-card">
        <div className="flex-1">
          <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", gold)}>
            Risk Classification
          </p>
          <RiskBadge level={result.riskLevel} size="lg" />
          <p className="mt-2 text-sm text-foreground/70">{levelInfo.description}</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className={cn("text-xs font-semibold uppercase tracking-widest mb-1", gold)}>
            Estimated Compliance Cost
          </p>
          <p className="text-2xl font-bold text-foreground">
            {result.estimatedCostRange.low === 0
              ? "N/A"
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
            <ShieldAlert className={cn("h-4 w-4", gold)} />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
          <p className="mt-2 text-sm text-foreground/60 italic">{result.riskReason}</p>
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
                let info = ARTICLE_INFO[a];
                if (!info) {
                  const match = a.match(/^(Art(?:icle)?\.?\s*\d+(?:\(\d+\))?(?:\([a-z]\))?)/i);
                  if (match) info = ARTICLE_INFO[match[1].trim()] ?? ARTICLE_INFO[match[1].replace(/\s+/g, " ").trim()];
                }
                const numMatch = a.match(/\d+/);
                const fallbackUrl = numMatch
                  ? `https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#art_${numMatch[0]}`
                  : null;
                const url = info?.url ?? fallbackUrl;
                const Tag = url ? "a" : "span";
                const linkProps = url
                  ? { href: url, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <Tag
                    key={a}
                    {...linkProps}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 px-3 py-1.5 text-sm hover:bg-[color:var(--gold)]/15 hover:border-[color:var(--gold)]/60 transition-all"
                  >
                    {(() => {
                      const parts = a.split(/\s+[—–-]\s+/);
                      return parts.length > 1 ? (
                        <>
                          <span className="font-semibold text-[color:var(--gold)]">{parts[0]}</span>
                          <span className="text-foreground/80"> — {parts.slice(1).join(" — ")}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-[color:var(--gold)]">{a}</span>
                      );
                    })()}
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

      {/* Compliance Gaps */}
      {result.complianceGaps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <AlertTriangle className={cn("h-4 w-4", gold)} />
              Compliance Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-border/60">
              {result.complianceGaps.map((gap, i) => {
                const cfg = gapConfig[gap.severity];
                return (
                  <li key={i} className="flex items-center gap-4 px-6 py-3.5">
                    <span className={cn("w-1 self-stretch rounded-full shrink-0", cfg.stripe)} />
                    <span className="flex-1 text-sm text-foreground leading-snug">{gap.text}</span>
                    <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.badge)}>
                      {cfg.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Required Safeguards */}
      {result.requiredSafeguards.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
              <Lock className={cn("h-4 w-4", gold)} />
              Required Safeguards
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-border/60">
              {result.requiredSafeguards.map((s, i) => {
                const cfg = safeguardConfig[s.status];
                return (
                  <li key={i} className="flex items-center gap-4 px-6 py-3.5">
                    <span className={cn("w-1 self-stretch rounded-full shrink-0", cfg.stripe)} />
                    {s.status === "implemented" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : null}
                    <span className="flex-1 text-sm text-foreground leading-snug">{s.text}</span>
                    <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.badge)}>
                      {cfg.label}
                    </span>
                  </li>
                );
              })}
            </ul>
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

      {/* Cost Estimate (mobile only) */}
      <Card className="sm:hidden">
        <CardHeader className="pb-2">
          <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-widest", gold)}>
            <EuroIcon className={cn("h-4 w-4", gold)} />
            Estimated Compliance Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {result.estimatedCostRange.low === 0
              ? "N/A — prohibited use"
              : `${formatEur(result.estimatedCostRange.low)} – ${formatEur(result.estimatedCostRange.high)}`}
          </p>
          <p className="text-xs text-foreground/50 mt-1">
            Indicative estimate based on typical audit, documentation, and legal costs.
          </p>
        </CardContent>
      </Card>

      {/* Import to Expert */}
      <ImportToExpert type="aiAct" result={result} />

      <p className="text-xs text-center text-foreground/40 pb-4">
        This report is an indicative assessment based on AI analysis. Consult a legal advisor for definitive compliance decisions.
      </p>
    </div>
  );
}
