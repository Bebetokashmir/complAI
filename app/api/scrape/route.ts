import { NextRequest } from "next/server";
import { scrapeUrl, isBlockedUrl } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const { url } = await req.json() as { url: string };

  if (!url || typeof url !== "string") {
    return Response.json({ error: "No URL provided." }, { status: 400 });
  }

  if (isBlockedUrl(url)) {
    return Response.json(
      { error: "URL not allowed." },
      { status: 403 }
    );
  }

  try {
    const text = await scrapeUrl(url);
    if (text.length < 50) {
      return Response.json(
        { error: "Not enough text found on the page." },
        { status: 422 }
      );
    }
    return Response.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return Response.json({ error: message }, { status: 500 });
  }
}
