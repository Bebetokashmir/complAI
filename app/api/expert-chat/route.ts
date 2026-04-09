import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    messages?: ChatMessage[];
    context?: { regulation: string; article: string; title: string; description: string } | null;
  };

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const contextBlock = body.context
    ? `The expert is currently viewing this compliance item:
Regulation: ${body.context.regulation}
Article: ${body.context.article}
Requirement: ${body.context.title}
Description: ${body.context.description}

Answer specifically in relation to this requirement unless the expert asks something else.`
    : "Answer questions about EU AI Act and GDPR compliance for startups and SMEs.";

  const systemPrompt = `You are a senior EU compliance expert specialising in the AI Act (Regulation 2024/1689) and GDPR (Regulation 2016/679). You help compliance professionals and legal teams understand exactly what they need to do and how to do it.

${contextBlock}

Guidelines:
- Be specific and actionable. Explain not just what to do but concretely how to implement it.
- Reference specific articles, recitals, and official guidance where relevant.
- For implementation steps, use numbered lists.
- For small startups, flag which requirements can be simplified proportionately.
- When asked about templates or documents, provide a practical outline.
- Keep answers focused and professional.`;

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    messages: body.messages,
    maxOutputTokens: 1200,
  });

  return result.toTextStreamResponse();
}
