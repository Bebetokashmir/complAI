import { AssessmentForm } from "@/components/AssessmentForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">
              Compl<span className="text-[color:var(--gold)]">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground">
              EU AI Act Compliance Tool
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 text-center border-b bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Based on EU AI Act (Regulation 2024/1689)
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Is your AI project{" "}
            <span className="gradient-gold">compliant</span>?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Assess your AI project against the EU AI Act in seconds. Discover your risk level,
            compliance gaps, and the safeguards you need to put in place — built for startups.
          </p>
        </div>
      </section>

      {/* Main form */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <AssessmentForm />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 ComplAI — Not legal advice. Consult a qualified advisor for definitive compliance decisions.</p>
          <p>Powered by Claude AI · EU AI Act 2024/1689</p>
        </div>
      </footer>
    </div>
  );
}
