import { Badge } from "@/components/ui/badge";
import { RISK_LEVELS } from "@/lib/ai-act";
import type { RiskLevel } from "@/types/assessment";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "lg";
}

const levelStyles: Record<RiskLevel, string> = {
  unacceptable:
    "bg-red-600/15 text-red-600 border-red-600/30 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  high: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30",
  limited:
    "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
  minimal:
    "bg-green-500/15 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
};

export function RiskBadge({ level, size = "sm" }: RiskBadgeProps) {
  const info = RISK_LEVELS[level];
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold border",
        levelStyles[level],
        size === "lg" && "text-base px-4 py-1.5"
      )}
    >
      {info.labelNL.toUpperCase()}
    </Badge>
  );
}
