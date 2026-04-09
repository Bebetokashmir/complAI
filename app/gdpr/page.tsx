import { GdprForm } from "@/components/GdprForm";

export const metadata = {
  title: "GDPR Compliance — ComplAI",
  description:
    "Assess your product or service against the GDPR. Discover violations, required measures, and data protection obligations.",
};

export default function GdprPage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 text-center border-b bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Based on GDPR — Regulation (EU) 2016/679
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
            Is your product{" "}
            <span className="gradient-gold">GDPR ready</span>?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Assess your product or privacy policy against the GDPR. Discover violations,
            required measures, and data protection obligations — built for startups.
          </p>
        </div>
      </section>

      {/* Main form */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <GdprForm />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 ComplAI — Not legal advice. Consult a qualified advisor for definitive compliance decisions.</p>
          <p>Powered by Claude AI · GDPR 2016/679</p>
        </div>
      </footer>
    </div>
  );
}
