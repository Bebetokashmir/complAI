"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  onError: (msg: string) => void;
}

const ACCEPTED = ".pdf,.docx,.txt";
const MAX_MB = 5;

export function FileUpload({ onTextExtracted, onError }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function processFile(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      onError(`Bestand te groot (max ${MAX_MB} MB).`);
      return;
    }
    setLoading(true);
    setFileName(file.name);
    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        onTextExtracted(text.slice(0, 12000));
      } else {
        // Send to server for PDF/DOCX parsing
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/parse", { method: "POST", body: form });
        if (!res.ok) throw new Error("Bestand kon niet worden verwerkt.");
        const { text } = await res.json();
        onTextExtracted(text);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Fout bij verwerken bestand.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm">Bestand verwerken…</p>
        </div>
      ) : fileName ? (
        <div className="flex items-center justify-center gap-3 text-sm">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium">{fileName}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setFileName(null); onTextExtracted(""); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p className="font-medium text-sm">Sleep een bestand hierheen of klik om te selecteren</p>
          <p className="text-xs">PDF, DOCX of TXT — max {MAX_MB} MB</p>
        </div>
      )}
    </div>
  );
}
