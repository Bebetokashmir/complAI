"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/RiskBadge";
import { AI_ACT_CHECKLIST, GDPR_CHECKLIST } from "@/lib/expert-checklists";
import {
  loadProjects, saveProjects, loadState, saveState,
  loadAssessment, assessmentKey,
} from "@/lib/expert-storage";
import type { ChecklistItem, ItemStatus, Project, ProjectState } from "@/types/expert";
import type { AssessmentResult } from "@/types/assessment";
import type { GdprAssessmentResult } from "@/types/gdpr";
import { GDPR_STATUS } from "@/lib/gdpr";
import {
  Plus, Trash2, ChevronDown, ChevronUp, ExternalLink,
  CheckCircle2, Clock, Circle, MinusCircle,
  Send, Bot, User, Loader2, MessageSquare, X,
  AlertTriangle, ShieldCheck, RefreshCw, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ─── Types ─── */
interface ChatMessage { role: "user" | "assistant"; content: string; }

/* ─── Status config ─── */
const STATUS_CONFIG: Record<ItemStatus, { label: string; icon: React.ReactNode; next: ItemStatus; color: string }> = {
  todo:        { label: "To Do",       icon: <Circle className="h-4 w-4" />,       next: "in_progress", color: "text-foreground/30" },
  in_progress: { label: "In Progress", icon: <Clock className="h-4 w-4" />,         next: "done",        color: "text-blue-400" },
  done:        { label: "Done",        icon: <CheckCircle2 className="h-4 w-4" />,  next: "na",          color: "text-green-400" },
  na:          { label: "N/A",         icon: <MinusCircle className="h-4 w-4" />,   next: "todo",        color: "text-foreground/20" },
};

const gapSeverityStyle: Record<string, string> = {
  critical: "border-red-500/40 text-red-400",
  high:     "border-orange-500/40 text-orange-400",
  medium:   "border-yellow-500/40 text-yellow-400",
  low:      "border-green-500/40 text-green-400",
};

function defaultState(): ProjectState { return { aiAct: {}, gdpr: {} }; }
function getItem(state: ProjectState, reg: "aiAct" | "gdpr", id: string) {
  return state[reg][id] ?? { status: "todo" as ItemStatus, notes: "" };
}

/* ─── Progress ─── */
function calcProgress(items: ChecklistItem[], state: ProjectState, reg: "aiAct" | "gdpr") {
  const mandatory = items.filter((i) => i.mandatory);
  const done = mandatory.filter((i) => getItem(state, reg, i.id).status === "done").length;
  return { done, total: mandatory.length, pct: mandatory.length ? Math.round((done / mandatory.length) * 100) : 0 };
}

/* ─── Assessment summary panel ─── */
function AssessmentSummaryPanel({
  projectId, type,
}: {
  projectId: string; type: "aiAct" | "gdpr";
}) {
  const [data, setData] = useState<(AssessmentResult | GdprAssessmentResult) & { _importedAt?: string } | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function load() {
      const d = loadAssessment(projectId, type) as (AssessmentResult & { _importedAt?: string }) | null;
      setData(d);
    }
    load();
    // Re-load when localStorage changes (e.g. import from another tab)
    const handler = (e: StorageEvent) => {
      if (e.key === assessmentKey(projectId, type)) load();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [projectId, type]);

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 px-5 py-4 flex items-center justify-between text-sm text-foreground/40">
        <span>No {type === "aiAct" ? "AI Act" : "GDPR"} assessment imported yet.</span>
        <Link
          href={type === "aiAct" ? "/" : "/gdpr"}
          className="flex items-center gap-1 text-[color:var(--gold)] hover:opacity-70 text-xs font-medium"
        >
          Run assessment <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const importedAt = data._importedAt ? new Date(data._importedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/4 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" />
          <span className="text-sm font-semibold">
            {type === "aiAct" ? "AI Act" : "GDPR"} Assessment Results
          </span>
          <span className="text-xs text-foreground/35">{importedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={type === "aiAct" ? "/" : "/gdpr"}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-foreground/40 hover:text-[color:var(--gold)] flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Re-assess
          </Link>
          {collapsed ? <ChevronDown className="h-4 w-4 text-foreground/30" /> : <ChevronUp className="h-4 w-4 text-foreground/30" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-3 border-t border-[color:var(--gold)]/15">
          {/* AI Act specific */}
          {type === "aiAct" && (() => {
            const r = data as AssessmentResult;
            return (
              <>
                <div className="flex items-center gap-3 pt-3">
                  <RiskBadge level={r.riskLevel} size="sm" />
                  <p className="text-xs text-foreground/55 leading-relaxed">{r.summary}</p>
                </div>
                {r.complianceGaps.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/35 mb-2">Compliance Gaps</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.complianceGaps.map((g, i) => (
                        <span key={i} className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs",
                          gapSeverityStyle[g.severity] ?? "border-border text-foreground/60"
                        )}>
                          {g.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {r.requiredSafeguards.filter((s) => s.status === "critical" || s.status === "required").length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/35 mb-2">Required Safeguards</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.requiredSafeguards
                        .filter((s) => s.status === "critical" || s.status === "required")
                        .map((s, i) => (
                          <span key={i} className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-xs",
                            s.status === "critical" ? "border-red-500/40 text-red-400" : "border-orange-500/40 text-orange-400"
                          )}>
                            {s.text}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* GDPR specific */}
          {type === "gdpr" && (() => {
            const r = data as GdprAssessmentResult;
            const statusInfo = GDPR_STATUS[r.complianceStatus];
            const statusColor = { compliant: "text-green-400", partial: "text-yellow-400", non_compliant: "text-red-400" }[r.complianceStatus];
            return (
              <>
                <div className="flex items-center gap-3 pt-3">
                  <span className={cn("text-sm font-bold", statusColor)}>{statusInfo.label}</span>
                  <p className="text-xs text-foreground/55 leading-relaxed">{r.summary}</p>
                </div>
                {r.violations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/35 mb-2">Violations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.violations.map((v, i) => (
                        <span key={i} className="inline-flex rounded-full border border-red-500/40 text-red-400 px-2.5 py-1 text-xs">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {r.requiredMeasures.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/35 mb-2">Required Measures</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.requiredMeasures.map((m, i) => (
                        <span key={i} className="inline-flex rounded-full border border-orange-500/40 text-orange-400 px-2.5 py-1 text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {r.dpiaRequired && (
                  <div className="flex items-center gap-2 text-xs text-orange-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    DPIA required · {r.dpoRequired ? "DPO required" : "DPO not required"}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/* ─── Checklist row ─── */
function ChecklistRow({
  item, state, reg, onStatusChange, onNotesChange, onSelect, selected,
}: {
  item: ChecklistItem; state: ProjectState; reg: "aiAct" | "gdpr";
  onStatusChange: (id: string, s: ItemStatus) => void;
  onNotesChange: (id: string, n: string) => void;
  onSelect: (item: ChecklistItem) => void;
  selected: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const itemState = getItem(state, reg, item.id);
  const cfg = STATUS_CONFIG[itemState.status];

  return (
    <li className={cn("border-b border-border/50 last:border-0 transition-colors", selected && "bg-[color:var(--gold)]/5")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => onStatusChange(item.id, cfg.next)}
          className={cn("shrink-0 transition-opacity hover:opacity-60", cfg.color)}
          title={`${cfg.label} — click to advance`}
        >
          {cfg.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[color:var(--gold)]">{item.article}</span>
            {!item.mandatory && (
              <span className="text-xs text-foreground/30 border border-border/50 rounded px-1">optional</span>
            )}
            <span className={cn(
              "text-sm",
              itemState.status === "done" && "line-through text-foreground/30",
              itemState.status === "na"   && "text-foreground/25",
            )}>
              {item.title}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded text-foreground/25 hover:text-foreground/60 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={() => onSelect(item)}
            className={cn(
              "p-1.5 rounded transition-colors",
              selected ? "text-[color:var(--gold)]" : "text-foreground/25 hover:text-[color:var(--gold)]"
            )}
            title="Ask AI about this requirement"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1.5 rounded text-foreground/25 hover:text-foreground/60 transition-colors"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-7">
          <p className="text-xs text-foreground/55 leading-relaxed">{item.description}</p>
          <Textarea
            placeholder="Add notes, evidence links, responsible person…"
            className="text-xs min-h-[60px] resize-none bg-muted/40"
            value={itemState.notes}
            onChange={(e) => onNotesChange(item.id, e.target.value)}
          />
        </div>
      )}
    </li>
  );
}

/* ─── Chat panel ─── */
function ChatPanel({
  selectedItem, regulation, onClose,
}: {
  selectedItem: ChecklistItem | null; regulation: string; onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevItemId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (selectedItem?.id !== prevItemId.current) {
      setMessages([]);
      prevItemId.current = selectedItem?.id;
    }
  }, [selectedItem?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context = selectedItem
    ? { regulation, article: selectedItem.article, title: selectedItem.title, description: selectedItem.description }
    : null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/expert-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      if (!res.ok || !res.body) throw new Error("Chat failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[color:var(--gold)]" />
          <span className="text-sm font-semibold">Compliance Expert AI</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-foreground/30 hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {selectedItem && (
        <div className="px-4 py-2 border-b bg-[color:var(--gold)]/5 shrink-0">
          <p className="text-xs font-semibold text-[color:var(--gold)]">{selectedItem.article} — {selectedItem.title}</p>
          <p className="text-xs text-foreground/40 mt-0.5">Ask how to implement this requirement</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-foreground/35 text-sm py-10 leading-relaxed">
            {selectedItem
              ? <>Ask me how to implement<br /><span className="font-medium text-foreground/50">{selectedItem.title}</span></>
              : "Select a checklist item or ask a compliance question."}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="h-6 w-6 rounded-full bg-[color:var(--gold)]/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              </div>
            )}
            <div className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-wrap"
                : "bg-muted text-foreground rounded-tl-sm"
            )}>
              {m.role === "assistant" ? (
                m.content
                  ? (
                    <ReactMarkdown
                      components={{
                        p:      ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul:     ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                        ol:     ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                        li:     ({ children }) => <li className="leading-snug">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        h1:     ({ children }) => <p className="font-bold mb-1">{children}</p>,
                        h2:     ({ children }) => <p className="font-bold mb-1">{children}</p>,
                        h3:     ({ children }) => <p className="font-semibold mb-1">{children}</p>,
                        code:   ({ children }) => <code className="bg-background/40 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
                        hr:     () => <hr className="border-border/50 my-2" />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  )
                  : <Loader2 className="h-4 w-4 animate-spin text-foreground/40" />
              ) : (
                m.content
              )}
            </div>
            {m.role === "user" && (
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="px-4 py-3 border-t flex gap-2 shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a compliance question…"
          className="flex-1 text-sm"
          disabled={loading}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e as unknown as React.FormEvent); } }}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}

/* ─── Main dashboard ─── */
export function ExpertDashboard() {
  const [projects, setProjects]         = useState<Project[]>([]);
  const [activeProjectId, setActiveId]  = useState<string | null>(null);
  const [state, setState]               = useState<ProjectState>(defaultState());
  const [tab, setTab]                   = useState<"aiAct" | "gdpr">("aiAct");
  const [newName, setNewName]           = useState("");
  const [creating, setCreating]         = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [chatOpen, setChatOpen]         = useState(false);
  const [hydrated, setHydrated]         = useState(false);

  useEffect(() => {
    const ps = loadProjects();
    setProjects(ps);
    if (ps.length > 0) { setActiveId(ps[0].id); setState(loadState(ps[0].id)); }
    setHydrated(true);
  }, []);

  // Re-load state when a new assessment is imported (storage event from same tab)
  useEffect(() => {
    if (!activeProjectId) return;
    function onStorage(e: StorageEvent) {
      if (activeProjectId && (e.key === assessmentKey(activeProjectId, "aiAct") || e.key === assessmentKey(activeProjectId, "gdpr"))) {
        setState(loadState(activeProjectId));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activeProjectId]);

  function switchProject(id: string) {
    setActiveId(id); setState(loadState(id)); setSelectedItem(null);
  }

  function createProject() {
    const name = newName.trim() || "New Project";
    const p: Project = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    const updated = [...projects, p];
    setProjects(updated); saveProjects(updated); saveState(p.id, defaultState());
    switchProject(p.id); setNewName(""); setCreating(false);
  }

  function deleteProject(id: string) {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated); saveProjects(updated); localStorage.removeItem(`complai_state_${id}`);
    if (activeProjectId === id) {
      if (updated.length > 0) switchProject(updated[0].id);
      else { setActiveId(null); setState(defaultState()); }
    }
  }

  function updateStatus(reg: "aiAct" | "gdpr", id: string, status: ItemStatus) {
    if (!activeProjectId) return;
    const next: ProjectState = { ...state, [reg]: { ...state[reg], [id]: { ...getItem(state, reg, id), status } } };
    setState(next); saveState(activeProjectId, next);
  }

  function updateNotes(reg: "aiAct" | "gdpr", id: string, notes: string) {
    if (!activeProjectId) return;
    const next: ProjectState = { ...state, [reg]: { ...state[reg], [id]: { ...getItem(state, reg, id), notes } } };
    setState(next); saveState(activeProjectId, next);
  }

  const checklist = tab === "aiAct" ? AI_ACT_CHECKLIST : GDPR_CHECKLIST;
  const aiProg    = calcProgress(AI_ACT_CHECKLIST, state, "aiAct");
  const gdprProg  = calcProgress(GDPR_CHECKLIST, state, "gdpr");

  const grouped = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item); return acc;
  }, {});

  if (!hydrated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Project bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground/35">Project</span>
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-1">
            <button
              onClick={() => switchProject(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                p.id === activeProjectId
                  ? "bg-[color:var(--gold)]/15 border-[color:var(--gold)]/40 text-[color:var(--gold)]"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {p.name}
            </button>
            <button onClick={() => deleteProject(p.id)} className="p-1 rounded text-foreground/20 hover:text-destructive transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {creating ? (
          <div className="flex items-center gap-2">
            <Input autoFocus placeholder="Project name…" className="h-8 w-44 text-sm"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createProject(); if (e.key === "Escape") setCreating(false); }}
            />
            <Button size="sm" onClick={createProject}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        )}
      </div>

      {!activeProjectId ? (
        <div className="text-center py-24 text-foreground/35">
          <p className="text-lg font-medium mb-2">No project yet</p>
          <p className="text-sm">Create a project to start tracking compliance.</p>
        </div>
      ) : (
        <>
          {/* Progress cards */}
          <div className="grid grid-cols-2 gap-4">
            {([
              { label: "AI Act", prog: aiProg,  reg: "aiAct" as const },
              { label: "GDPR",   prog: gdprProg, reg: "gdpr"  as const },
            ] as const).map(({ label, prog, reg }) => (
              <button key={reg} onClick={() => setTab(reg)} className={cn(
                "text-left p-5 rounded-2xl border transition-all",
                tab === reg ? "bg-card border-[color:var(--gold)]/40" : "bg-muted/40 border-border hover:border-foreground/20"
              )}>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/35 mb-1">{label}</p>
                <p className="text-2xl font-bold text-foreground mb-3">{prog.pct}%</p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      prog.pct === 100 ? "bg-green-500" : prog.pct > 50 ? "bg-[color:var(--gold)]" : "bg-orange-500"
                    )}
                    style={{ width: `${prog.pct}%` }}
                  />
                </div>
                <p className="text-xs text-foreground/35 mt-2">{prog.done} / {prog.total} mandatory items done</p>
              </button>
            ))}
          </div>

          {/* Assessment summary */}
          <AssessmentSummaryPanel projectId={activeProjectId} type={tab} />

          {/* Checklist + Chat */}
          <div className={cn("grid gap-6 items-start", chatOpen ? "grid-cols-1 lg:grid-cols-[1fr_380px]" : "grid-cols-1")}>
            <Card className="overflow-hidden">
              <CardHeader className="pb-0 px-4 pt-4">
                <div className="flex gap-1 border-b pb-3">
                  {(["aiAct", "gdpr"] as const).map((r) => (
                    <button key={r} onClick={() => setTab(r)}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                        tab === r ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]" : "text-muted-foreground hover:text-foreground"
                      )}>
                      {r === "aiAct" ? "AI Act" : "GDPR"}
                    </button>
                  ))}
                  {!chatOpen && (
                    <button onClick={() => setChatOpen(true)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-[color:var(--gold)] transition-colors border border-border hover:border-[color:var(--gold)]/40">
                      <Bot className="h-3.5 w-3.5" /> Ask AI
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-muted/30 border-b border-t border-border/40">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/35">{category}</p>
                    </div>
                    <ul>
                      {items.map((item) => (
                        <ChecklistRow
                          key={item.id} item={item} state={state} reg={tab}
                          onStatusChange={(id, s) => updateStatus(tab, id, s)}
                          onNotesChange={(id, n) => updateNotes(tab, id, n)}
                          onSelect={(item) => { setSelectedItem(item); setChatOpen(true); }}
                          selected={selectedItem?.id === item.id}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {chatOpen && (
              <div className="sticky top-20">
                <Card className="overflow-hidden flex flex-col" style={{ height: "680px" }}>
                  <ChatPanel
                    selectedItem={selectedItem}
                    regulation={tab === "aiAct" ? "EU AI Act" : "GDPR"}
                    onClose={() => { setChatOpen(false); setSelectedItem(null); }}
                  />
                </Card>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
