"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookMarked, Check, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentResult } from "@/types/assessment";
import type { GdprAssessmentResult } from "@/types/gdpr";
import type { Project } from "@/types/expert";
import {
  loadProjects, saveProjects, saveProjects as _sp,
  loadState, saveState, saveAssessment, applyAssessmentToState,
} from "@/lib/expert-storage";

interface ImportToExpertProps {
  type: "aiAct" | "gdpr";
  result: AssessmentResult | GdprAssessmentResult;
}

export function ImportToExpert({ type, result }: ImportToExpertProps) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [saved, setSaved] = useState<string | null>(null); // project id that was saved

  function openPanel() {
    setProjects(loadProjects());
    setOpen(true);
    setSaved(null);
    setNewName("");
    setCreatingNew(false);
  }

  function importToProject(projectId: string) {
    const state = loadState(projectId);
    const nextState = applyAssessmentToState(state, type, result);
    saveState(projectId, nextState);
    saveAssessment(projectId, type, result);
    setSaved(projectId);
  }

  function createAndImport() {
    const name = newName.trim() || (type === "aiAct" ? "AI Act Project" : "GDPR Project");
    const p: Project = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    const updated = [...loadProjects(), p];
    saveProjects(updated);
    setProjects(updated);
    saveState(p.id, { aiAct: {}, gdpr: {} });
    importToProject(p.id);
    setCreatingNew(false);
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-[color:var(--gold)]/40 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
        onClick={openPanel}
      >
        <BookMarked className="h-4 w-4" />
        Save to Expert Workspace
      </Button>
    );
  }

  const savedProject = projects.find((p) => p.id === saved);

  return (
    <div className="rounded-xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[color:var(--gold)]">Save to Expert Workspace</p>
        <button onClick={() => setOpen(false)} className="text-xs text-foreground/40 hover:text-foreground">close</button>
      </div>

      {saved ? (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="h-4 w-4" />
          Saved to <span className="font-semibold">{savedProject?.name}</span>. Checklist items have been updated.
          <a href="/expert" className="ml-auto text-xs underline text-[color:var(--gold)] hover:opacity-70">
            Open Expert →
          </a>
        </div>
      ) : (
        <>
          {projects.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-foreground/50">Select existing project:</p>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => importToProject(p.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-left hover:border-[color:var(--gold)]/40 hover:bg-[color:var(--gold)]/5 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-foreground/40 -rotate-90" />
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {creatingNew ? (
            <div className="flex gap-2">
              <Input
                autoFocus
                placeholder="Project name…"
                className="flex-1 h-8 text-sm"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") createAndImport(); if (e.key === "Escape") setCreatingNew(false); }}
              />
              <Button size="sm" onClick={createAndImport}>Create & Save</Button>
            </div>
          ) : (
            <button
              onClick={() => setCreatingNew(true)}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> New project
            </button>
          )}
        </>
      )}
    </div>
  );
}
