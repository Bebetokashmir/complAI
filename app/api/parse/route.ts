import { NextRequest } from "next/server";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file received." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large (max 5 MB)." }, { status: 413 });
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
        { error: "File type not supported. Use PDF, DOCX or TXT." },
        { status: 415 }
      );
    }

    text = text.replace(/\s+/g, " ").trim().slice(0, 12000);

    if (text.length < 20) {
      return Response.json(
        { error: "Not enough text found in the file." },
        { status: 422 }
      );
    }

    return Response.json({ text });
  } catch (err) {
    console.error("[parse] error:", err);
    return Response.json(
      { error: "File could not be processed." },
      { status: 500 }
    );
  }
}
