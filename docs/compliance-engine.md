# ComplAI — Compliance Engine

## Hoe de beoordeling werkt

### Invoerverwerking
1. **Tekst**: Direct doorgegeven aan Claude (max 12.000 tekens)
2. **URL**: Cheerio scraper extraheert semantische content (`<main>`, `<article>`) en strips navigatie/footer
3. **Document**: TXT direct gelezen; PDF/DOCX via server-side parser, dan als tekst

### AI-beoordelingsproces

De prompt in `lib/assessment.ts` stuurt Claude om te redeneren in vier stappen:

1. **Sector-identificatie**: Valt het project onder Bijlage III van de AI Act?
2. **Risicoklassificatie**: Welk van de vier niveaus is van toepassing?
3. **Article-mapping**: Welke specifieke artikelen zijn relevant?
4. **Gap-analyse**: Wat ontbreekt er nog?

### Output Schema (Zod)

```typescript
AssessmentSchema = z.object({
  riskLevel: z.enum(["unacceptable", "high", "limited", "minimal"]),
  riskReason: z.string(),           // motivatie met artikel-referenties
  applicableArticles: z.array(z.string()), // bijv. ["Art. 9", "Art. 13"]
  complianceGaps: z.array(z.string()),     // wat ontbreekt
  requiredSafeguards: z.array(z.string()), // concrete maatregelen
  recommendedActions: z.array(z.object({
    priority: z.enum(["immediate", "short", "long"]),
    action: z.string(),
  })),
  estimatedCostRange: z.object({
    low: z.number(),    // laagste schatting in EUR
    high: z.number(),   // hoogste schatting in EUR
    currency: z.literal("EUR"),
  }),
  summary: z.string(), // 2-3 zinnen samenvatting
})
```

### Kostenschattingsmethode

| Risiconiveau | Range | Basis |
|-------------|-------|-------|
| Minimaal | €2.000–€10.000 | Basisdocumentatie, vrijwillige gedragscode |
| Beperkt | €5.000–€25.000 | Transparantiedocumenten, labeling implementatie |
| Hoog | €50.000–€500.000 | Conformiteitsbeoordeling, audit, juridisch, systemen |
| Onaanvaardbaar | €0 | Verboden — niet op markt brengen |

Kosten zijn gebaseerd op Europese marktprijzen voor:
- Juridisch advies EU AI Act: €200–€400/uur
- Technische conformiteitsbeoordeling: €15.000–€80.000
- Data governance implementatie: €20.000–€150.000
- Documentatie en processen: €5.000–€30.000

### AI SDK v6 Integratie

```typescript
// lib/assessment.ts
const result = await generateText({
  model: "anthropic/claude-sonnet-4.6",
  output: Output.object({ schema: AssessmentSchema }),
  prompt: buildAssessmentPrompt(content),
});
// result.output is typed as z.infer<typeof AssessmentSchema>
```

`Output.object()` vervangt de verwijderde `generateObject()` functie uit AI SDK v5.

### Kwaliteitsborging prompt

De prompt bevat:
- Concrete voorbeelden per risicocategorie
- Expliciete instructie om artikel-nummers te citeren
- Instructie voor praktische, startup-gerichte aanbevelingen
- Taalinstructie: Nederlands (om aansluiting op doelgroep)
- Formaatinstructie: alleen JSON (geen preamble)
