import * as cheerio from "cheerio";

const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.",
  "10.",
  "192.168.",
  "172.16.",
  "172.17.",
  "172.18.",
  "172.19.",
  "172.20.",
  "172.21.",
  "172.22.",
  "172.23.",
  "172.24.",
  "172.25.",
  "172.26.",
  "172.27.",
  "172.28.",
  "172.29.",
  "172.30.",
  "172.31.",
];

export function isBlockedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return true;
    const host = url.hostname.toLowerCase();
    return BLOCKED_HOSTS.some((b) => host === b || host.startsWith(b));
  } catch {
    return true;
  }
}

export async function scrapeUrl(urlString: string): Promise<string> {
  if (isBlockedUrl(urlString)) {
    throw new Error("URL niet toegestaan (intern netwerk of ongeldig protocol).");
  }

  const response = await fetch(urlString, {
    headers: { "User-Agent": "ComplAI-Bot/1.0 (EU AI Act Compliance Tool)" },
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Kon de pagina niet ophalen (status ${response.status}).`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove noise elements
  $("script, style, nav, footer, header, aside, noscript, iframe").remove();

  // Prefer semantic content containers
  const content =
    $("main").text() ||
    $("article").text() ||
    $(".content, #content, #main").text() ||
    $("body").text();

  return content
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}
