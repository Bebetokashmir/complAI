# ComplAI — UX Flows

## Gebruikersdoelen
1. Snel weten of mijn AI-project compliant is
2. Begrijpen welke maatregelen ik moet nemen
3. Een kostenscratting krijgen voor compliance

## Primaire flow: Tekstbeschrijving

```
Landingspagina
  → Leest hero + tagline
  → Typt projectbeschrijving in Textarea
  → Klikt "Toets aan AI Act"
  → Ziet laad-indicator ("AI Act beoordeling loopt…")
  → Rapport verschijnt (animated slide-in)
    → Leest risicobadge (eerste oogpunt)
    → Leest samenvatting
    → Bekijkt gaps + waarborgen
    → Bekijkt actieplan + kosten
```

## Alternatieve flow: Website-URL

```
Klikt op "Website" tab
  → Plakt URL in invoerveld
  → Klikt "Ophalen"
  → Tekst wordt opgehaald (scraper)
  → Preview van opgehaalde tekst verschijnt
  → Klikt "Toets aan AI Act"
  → Rapport verschijnt
```

## Alternatieve flow: Document-upload

```
Klikt op "Document" tab
  → Sleept PDF/DOCX/TXT naar drop-zone
     OF klikt drop-zone → bestandsdialoog
  → Bestand verwerkt (loading spinner)
  → Bestandsnaam + tekencount zichtbaar
  → Klikt "Toets aan AI Act"
  → Rapport verschijnt
```

## Foutscenarios

| Situatie | Foutmelding | Herstelpad |
|----------|-------------|------------|
| Te korte beschrijving | "Minimaal 20 tekens" | Langer beschrijven |
| URL onbereikbaar | "Kon de pagina niet ophalen" | Andere URL of handmatige tekst |
| URL intern netwerk | "URL niet toegestaan" | Publieke URL gebruiken |
| Bestand te groot | "Max 5 MB" | Kleiner bestand |
| AI-fout | "Probeer het opnieuw" | Opnieuw proberen |

## Toegankelijkheid
- Alle interactieve elementen hebben `aria-label`
- Kleurcontrast voldoet aan WCAG 2.1 AA
- Formulier werkt zonder muis (tab-navigatie)
- Foutmeldingen zijn leesbaar voor screenreaders

## Mobiel (375px)
- Header: logo links, toggle rechts
- Tabs: icoon-only (tekst verborgen)
- Kostenweergave in rapport: eigen kaart onderaan
- Drop-zone: volledige breedte, hoge touchgebied
- Knop: volledige breedte, 48px hoog

## Copy-principes
- Nederlandse interface (doelgroep: Nederlandse startups)
- Directe, heldere taal ("Toets aan AI Act" — niet "Analyseer")
- Disclaimer onderaan rapport: "geen juridisch advies"
- Risico-labels in het Nederlands: "Hoog Risico", "Minimaal Risico"
