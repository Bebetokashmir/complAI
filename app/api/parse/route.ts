import { NextRequest } from "next/server";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Bestand te groot (max 5 MB)." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  try {
    let text = "";

    if (name.endsWith(".pdf")) {
      // pdf-parse has no .default — import the module directly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (await import("pdf-parse")) as any;
      const result = await (typeof pdfParse === "function" ? pdfParse : pdfParse.default ?? pdfParse)(buffer);
      text = result.text;
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return Response.json(
        { error: "Bestandstype niet ondersteund. Gebruik PDF, DOCX of TXT." },
        { status: 415 }
      );
    }

    text = text.replace(/\s+/g, " ").trim().slice(0, 12000);

    if (text.length < 20) {
      return Response.json(
        { error: "Niet genoeg tekst gevonden in het bestand." },
        { status: 422 }
      );
    }

    return Response.json({ text });
  } catch (err) {
    console.error("[parse] error:", err);
    return Response.json(
      { error: "Bestand kon niet worden verwerkt." },
      { status: 500 }
    );
  }
}
