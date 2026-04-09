# ComplAI — Assessment Prompt Template

Bestand: `lib/assessment.ts` → functie `buildAssessmentPrompt(content)`

## Prompt Structuur

```
[Rol-instructie]
Je bent een expert in de EU AI Act...

[Invoer]
## Te beoordelen AI-project
{content}

[Referentiekader]
## EU AI Act Risicoclassificatie
- Onaanvaardbaar: [verboden lijst]
- Hoog risico: [sectoren + artikel-verplichtingen]
- Beperkt risico: [transparantie-eisen]
- Minimaal risico: [vrijwillig]

[Opdracht]
Geef een gestructureerde compliance-beoordeling met:
1. Risicoclassificatie (enum)
2. Motivatie + artikelreferenties
3. Compliance-gaps
4. Vereiste waarborgen
5. Aanbevolen acties (prioriteit)
6. Kostenschatting in EUR
7. Samenvatting 2-3 zinnen

Antwoord uitsluitend in JSON.
```

## Prompt-ontwerpbeslissingen

### Taal: Nederlands
Doelgroep zijn Nederlandse startups. Nederlandse output verlaagt de drempel
en verhoogt begrijpelijkheid van de resultaten.

### Enkel JSON
"Antwoord uitsluitend in het gevraagde JSON-formaat" voorkomt preamble
tekst die de JSON-parser breekt. `Output.object()` van AI SDK v6 handelt
de schema-validatie af.

### Expliciete artikel-nummers vereist
De prompt vraagt om verwijzingen naar specifieke artikelen (Art. 9, Art. 13 etc.).
Dit maakt de output bruikbaar voor juridische follow-up.

### Startup-gerichte toon
"Wees specifiek en praktisch toepasbaar voor een startup" stuurt Claude
weg van abstracte juridische taal naar concrete actie-items.

### Kostenmethode
Drie-bands model (documentatie / transparantie / volledige audit) wordt
uitgelegd in de prompt zodat Claude consistente schattingen geeft.

## Variabelen

| Variabele | Bron | Max |
|-----------|------|-----|
| `content` | Gebruikersinvoer | 12.000 tekens |
| `HIGH_RISK_DOMAINS` | `lib/ai-act.ts` | — |
| `FORBIDDEN_USES` | `lib/ai-act.ts` | — |

## Voorbeeldoutput (geanonimiseerd)

```json
{
  "riskLevel": "high",
  "riskReason": "Het systeem beoordeelt kredietwaardigheid van personen (Art. 6 + Bijlage III punt 5b).",
  "applicableArticles": ["Art. 6", "Art. 9", "Art. 10", "Art. 13", "Art. 14", "Art. 43"],
  "complianceGaps": [
    "Geen risicobeheersysteem gedocumenteerd (Art. 9)",
    "Datacriteria voor trainingsdata niet vastgelegd (Art. 10)"
  ],
  "requiredSafeguards": [
    "Implementeer een risicobeheersysteem conform Art. 9",
    "Documenteer datakwaliteitscriteria voor trainings- en testdata"
  ],
  "recommendedActions": [
    { "priority": "immediate", "action": "Juridische gap-analyse laten uitvoeren door EU AI Act specialist" },
    { "priority": "short", "action": "Risicobeheersysteem implementeren en documenteren" }
  ],
  "estimatedCostRange": { "low": 50000, "high": 200000, "currency": "EUR" },
  "summary": "Uw systeem valt onder hoog-risico AI (Art. 6 + Bijlage III). Vóór marktintroductie moet u voldoen aan uitgebreide verplichtingen. Begin onmiddellijk met een juridische gap-analyse."
}
```
