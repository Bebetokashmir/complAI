import { ExpertDashboard } from "@/components/ExpertDashboard";

export const metadata = {
  title: "Expert Workspace — ComplAI",
  description: "Manage AI Act and GDPR compliance checklists, track progress, and get expert AI guidance.",
};

export default function ExpertPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="border-b bg-gradient-to-b from-background to-muted/30 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--gold)] mb-1">Expert Workspace</p>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track AI Act and GDPR obligations per project. Click any item to get AI guidance on exactly what to do.
          </p>
        </div>
      </div>
      <main className="flex-1">
        <ExpertDashboard />
      </main>
      <footer className="border-t py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 ComplAI — Not legal advice. Consult a qualified advisor for definitive compliance decisions.</p>
          <p>Powered by Claude AI · EU AI Act 2024/1689 · GDPR 2016/679</p>
        </div>
      </footer>
    </div>
  );
}
