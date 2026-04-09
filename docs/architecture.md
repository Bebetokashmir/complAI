# ComplAI — Architectuur

## Systeemoverzicht

```
Gebruiker
  ↓ invoer (tekst / URL / document)
AssessmentForm (client component)
  ↓ POST /api/scrape  (bij URL)
  ↓ POST /api/assess  (bij alle typen)
Next.js Route Handler
  ↓ generateText + Output.object (AI SDK v6)
Vercel AI Gateway → anthropic/claude-sonnet-4.6
  ↓ JSON: AssessmentResult
ComplianceReport (client component)
```

## Tech Stack

| Laag | Keuze | Reden |
|------|-------|-------|
| Framework | Next.js 15 App Router | Server Components + Route Handlers |
| AI | AI SDK v6 (`generateText + Output.object`) | Type-safe JSON output |
| Model | `anthropic/claude-sonnet-4.6` via AI Gateway | Meest actuele Sonnet |
| UI | shadcn/ui + Tailwind v4 | Consistente design system |
| Thema | next-themes | OS dark/light sync |
| Scraping | cheerio + fetch | Lichtgewicht, SSRF-safe |
| Lettertypen | Inter + Playfair Display | Professioneel/premium |

## Bestandsstructuur

```
app/
  layout.tsx          Root layout met ThemeProvider + TooltipProvider
  page.tsx            Hoofdpagina: hero + AssessmentForm
  globals.css         CSS tokens (gold, navy, dark/light)
  api/
    assess/route.ts   POST → AI beoordeling (generateText + Output.object)
    scrape/route.ts   POST { url } → { text } (cheerio scraper)
components/
  AssessmentForm.tsx  Tabs: tekst | URL | document
  ComplianceReport.tsx Rapport met risicobadge, gaps, actieplan, kosten
  RiskBadge.tsx       Gekleurde badge per risiconiveau
  FileUpload.tsx      Drag-drop voor PDF/DOCX/TXT
  ThemeToggle.tsx     Zon/maan knop
  ThemeProvider.tsx   next-themes wrapper
lib/
  ai-act.ts           Risico-definities en verboden toepassingen
  assessment.ts       Zod schema + prompt builder
  scraper.ts          URL scraper met SSRF-beveiliging
types/
  assessment.ts       TypeScript interfaces
```

## Data Flow — Beoordeling

1. Gebruiker vult formulier in (tekst/URL/bestand)
2. URL-invoer: `POST /api/scrape` → tekst geëxtraheerd
3. `POST /api/assess` met `{ content: string }`
4. Server roept Claude aan via AI Gateway
5. `Output.object({ schema: AssessmentSchema })` zorgt voor getypeerde JSON
6. Response: `AssessmentResult` object
7. `ComplianceReport` rendert het rapport

## Beveiliging

- SSRF-preventie in scraper: geblokkeerde interne adressen
- Invoer beperkt tot 12.000 tekens (DoS-preventie)
- Geen API-sleutels in client-side code
- `.env.local` staat in `.gitignore`
- CLAUDE.md verbiedt lezen van `.env` bestanden
