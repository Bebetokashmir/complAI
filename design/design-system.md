# ComplAI — Design System

## Merkidentiteit
**ComplAI** combineert professioneel vertrouwen (donkerblauw/navy) met waarde en prestige (goud).
Doelgroep: startups en bedrijven die serieus willen omgaan met AI-compliance.

## Kleurpalet

### Primaire kleuren (OKLCH)
| Token | Licht | Donker | Gebruik |
|-------|-------|--------|---------|
| `--background` | `oklch(0.97 0.005 240)` | `oklch(0.12 0.04 245)` | Paginaachtergrond |
| `--card` | `oklch(1 0 0)` | `oklch(0.16 0.04 245)` | Kaartachtergrond |
| `--primary` | `oklch(0.18 0.05 245)` navy | `oklch(0.72 0.12 85)` goud | CTA-knoppen, iconen |
| `--accent` / `--gold` | `oklch(0.72 0.12 85)` | `oklch(0.72 0.12 85)` | Accenten, logo |
| `--border` | `oklch(0.88 0.015 240)` | `oklch(1 0 0 / 10%)` | Randen |

### Risico-kleuren
| Niveau | Kleur | Klasse |
|--------|-------|--------|
| Onaanvaardbaar | Rood | `text-red-600 / bg-red-500/15` |
| Hoog | Oranje | `text-orange-600 / bg-orange-500/15` |
| Beperkt | Geel | `text-yellow-700 / bg-yellow-500/15` |
| Minimaal | Groen | `text-green-700 / bg-green-500/15` |

## Typografie
- **Koppen**: Playfair Display (serif) — `font-heading` — elegant en premium
- **Body**: Inter (sans-serif) — `font-sans` — leesbaar en modern
- **Monospace**: System monospace — `font-mono` — voor artikel-codes

## Componenten

### Header
- Sticky, `backdrop-blur-sm`, hoogte 64px
- Logo: navy-vierkant met schild-icoon + "Compl**AI**" (AI in goud)

### Hero
- Gradient achtergrond: `from-background to-muted/30`
- Badge: pulserend groen stipje + verordening-tekst
- Kop: `text-4xl sm:text-5xl` Playfair Display
- Goud gradient tekst: `.gradient-gold` klasse

### Formuliertabs
- Drie tabbladen: Beschrijf | Website | Document
- Iconen: `AlignLeft | Globe | FileText`
- Actieve tab: `bg-background shadow-sm`

### CTA-knop
- Goud in donker modus (primary = goud), navy in licht
- Breedte: 100%, hoogte: 48px
- Icoon: `Sparkles` bij inactief, `Loader2` bij laden

### Rapport-kaarten
- `animate-in fade-in slide-in-from-bottom-4 duration-500`
- Iedere sectie in eigen `Card` component
- Risiconiveau-header: groter, prominenter

## Responsief ontwerp
- Mobiel: gestapelde layout, tabs icoon-only (`hidden sm:inline`)
- Desktop: zij-aan-zij kosten in rapport-header
- Breakpoints: sm (640px), md (768px)

## Dark/light mode
- `next-themes` met `defaultTheme="system"` en `enableSystem`
- `suppressHydrationWarning` op `<html>` voor flash-preventie
- Alle kleuren via CSS-variabelen (automatisch switch)
- ThemeToggle: zon/maan icoon, rechts in header
