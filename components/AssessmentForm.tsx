"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { ComplianceReport } from "@/components/ComplianceReport";
import type { AssessmentResult, InputType } from "@/types/assessment";
import { Loader2, Sparkles, Globe, FileText, AlignLeft } from "lucide-react";

export function AssessmentForm() {
  const [inputType, setInputType] = useState<InputType>("text");
  const [textContent, setTextContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [scrapedUrl, setScrapedUrl] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function scrapeWebsite() {
    setScrapeError("");
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scrape failed.");
      setTextContent(data.text);
      setScrapedUrl(true);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Failed to fetch website.");
    } finally {
      setScraping(false);
    }
  }

  async function handleAssess() {
    setError("");
    setResult(null);

    const content =
      inputType === "text"
        ? textContent
        : inputType === "url"
        ? textContent
        : fileContent;

    if (!content || content.trim().length < 20) {
      setError("Please provide a description of at least 20 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assessment failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs
        value={inputType}
        onValueChange={(v) => {
          setInputType(v as InputType);
          setError("");
          setResult(null);
          setScrapedUrl(false);
          setScrapeError("");
        }}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="text" className="gap-2">
            <AlignLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Describe</span>
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Website</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Document</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            placeholder="Describe your AI project: what does the system do, who are the users, what data is processed, in which sector does it operate…"
            className="min-h-[200px] resize-none text-sm leading-relaxed"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {textContent.length} / 12,000 characters
          </p>
        </TabsContent>

        <TabsContent value="url">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="https://yourcompany.com/product"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setScrapedUrl(false); setScrapeError(""); }}
              className="flex-1"
              type="url"
            />
            <Button
              variant="outline"
              onClick={scrapeWebsite}
              disabled={scraping || !urlInput}
            >
              {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
            </Button>
          </div>
          {scrapeError && (
            <p className="text-sm text-destructive mb-3">{scrapeError}</p>
          )}
          {scrapedUrl && textContent && (
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground max-h-32 overflow-y-auto">
              <p className="font-medium mb-1 text-foreground">Fetched text preview:</p>
              {textContent.slice(0, 400)}…
            </div>
          )}
        </TabsContent>

        <TabsContent value="file">
          <FileUpload
            onTextExtracted={setFileContent}
            onError={setError}
          />
          {fileContent && (
            <p className="text-xs text-muted-foreground mt-2">
              {fileContent.length} characters loaded from document.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <p className="text-sm text-destructive mt-3 text-center">{error}</p>
      )}

      <Button
        className="w-full mt-6 h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90"
        onClick={handleAssess}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Assessing against AI Act…
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Assess AI Act Compliance
          </>
        )}
      </Button>

      {result && <ComplianceReport result={result} />}
    </div>
  );
}
