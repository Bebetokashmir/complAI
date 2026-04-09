import { generateText, Output } from "ai";
import { NextRequest } from "next/server";
import { AssessmentSchema, buildAssessmentPrompt } from "@/lib/assessment";

export async function POST(req: NextRequest) {
  const body = await req.json() as { content?: unknown };
  const content = body.content;

  if (!content || typeof content !== "string" || content.trim().length < 20) {
    return Response.json(
      { error: "Beschrijving is te kort. Geef minimaal 20 tekens." },
      { status: 400 }
    );
  }

  try {
    const result = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      output: Output.object({ schema: AssessmentSchema }),
      prompt: buildAssessmentPrompt(content.slice(0, 12000)),
    });

    return Response.json(result.output);
  } catch (err) {
    console.error("[assess] error:", err);
    return Response.json(
      { error: "Beoordeling mislukt. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
