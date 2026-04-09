import type { AssessmentResult } from "@/types/assessment";
import type { GdprAssessmentResult } from "@/types/gdpr";
import type { Project, ProjectState, ItemStatus } from "@/types/expert";
import { AI_ACT_CHECKLIST, GDPR_CHECKLIST } from "@/lib/expert-checklists";

export const PROJECTS_KEY = "complai_projects";
export const stateKey = (id: string) => `complai_state_${id}`;
export const assessmentKey = (id: string, type: "aiAct" | "gdpr") =>
  `complai_${type}_assessment_${id}`;

export function loadProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? "[]"); } catch { return []; }
}
export function saveProjects(p: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(p));
}

export function loadState(id: string): ProjectState {
  try { return JSON.parse(localStorage.getItem(stateKey(id)) ?? "{}"); } catch { return { aiAct: {}, gdpr: {} }; }
}
export function saveState(id: string, s: ProjectState) {
  localStorage.setItem(stateKey(id), JSON.stringify(s));
}

export function loadAssessment(projectId: string, type: "aiAct" | "gdpr"): AssessmentResult | GdprAssessmentResult | null {
  try { return JSON.parse(localStorage.getItem(assessmentKey(projectId, type)) ?? "null"); } catch { return null; }
}
export function saveAssessment(projectId: string, type: "aiAct" | "gdpr", data: AssessmentResult | GdprAssessmentResult) {
  localStorage.setItem(assessmentKey(projectId, type), JSON.stringify({ ...data, _importedAt: new Date().toISOString() }));
}

/** Extract article numbers from a string like "Art. 9", "Article 22", "Art. 5(1)" */
function extractArticleNumber(s: string): string | null {
  const m = s.match(/\d+/);
  return m ? m[0] : null;
}

/**
 * After importing an assessment, auto-mark checklist items:
 * - Applicable articles → "in_progress" (if currently "todo")
 * - Safeguards with status "implemented" → "done"
 * Returns the updated state.
 */
export function applyAssessmentToState(
  currentState: ProjectState,
  type: "aiAct" | "gdpr",
  result: AssessmentResult | GdprAssessmentResult,
): ProjectState {
  const checklist = type === "aiAct" ? AI_ACT_CHECKLIST : GDPR_CHECKLIST;
  const reg = type;
  const next: ProjectState = {
    aiAct: { ...currentState.aiAct },
    gdpr:  { ...currentState.gdpr  },
  };

  // Collect article numbers that appear in the assessment
  const articleNumbers = new Set<string>();
  const articles = (result as AssessmentResult).applicableArticles
    ?? (result as GdprAssessmentResult).applicableArticles ?? [];
  for (const a of articles) {
    const n = extractArticleNumber(a);
    if (n) articleNumbers.add(n);
  }

  // Advance "todo" items whose article is mentioned → "in_progress"
  for (const item of checklist) {
    const n = extractArticleNumber(item.article);
    if (n && articleNumbers.has(n)) {
      const existing = next[reg][item.id];
      if (!existing || existing.status === "todo") {
        next[reg][item.id] = { status: "in_progress" as ItemStatus, notes: existing?.notes ?? "" };
      }
    }
  }

  // For AI Act: safeguards already implemented → mark matching items "done"
  if (type === "aiAct") {
    const safeguards = (result as AssessmentResult).requiredSafeguards ?? [];
    for (const s of safeguards) {
      if (s.status === "implemented") {
        // Try to match by article number in safeguard text
        const n = extractArticleNumber(s.text);
        if (n) {
          const match = checklist.find((i) => extractArticleNumber(i.article) === n);
          if (match) {
            next[reg][match.id] = { status: "done" as ItemStatus, notes: next[reg][match.id]?.notes ?? "" };
          }
        }
      }
    }
  }

  return next;
}
