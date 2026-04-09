export type ItemStatus = "todo" | "in_progress" | "done" | "na";

export interface ChecklistItem {
  id: string;
  article: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  url?: string;
}

export interface ItemState {
  status: ItemStatus;
  notes: string;
}

export interface ProjectState {
  aiAct: Record<string, ItemState>;
  gdpr: Record<string, ItemState>;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}
