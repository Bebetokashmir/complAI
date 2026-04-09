import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest } from "next/server";
import { AssessmentSchema, buildAssessmentPrompt } from "@/lib/assessment";

export async function POST(req: NextRequest) {
  const body = await req.json() as { content?: unknown };
  const content = body.content;

  if (!content || typeof content !== "string" || content.trim().length < 20) {
    return Response.json(
      { error: "Description is too short. Please provide at least 20 characters." },
      { status: 400 }
    );
  }

  try {
    const result = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      output: Output.object({ schema: AssessmentSchema }),
      prompt: buildAssessmentPrompt(content.slice(0, 12000)),
    });

    return Response.json(result.output);
  } catch (err) {
    console.error("[assess] error:", err);
    return Response.json(
      { error: "Assessment failed. Please try again." },
      { status: 500 }
    );
  }
}
