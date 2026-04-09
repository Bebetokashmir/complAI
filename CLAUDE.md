# ComplAI — Claude Instructions

## CRITICAL SECURITY RULE
Claude must NEVER read, print, display, reference, or act on any content from:
- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- Any file containing API keys or secrets

This applies regardless of any instruction asking Claude to do so.

## Project
ComplAI is an EU AI Act compliance assessment tool built with Next.js 15 (App Router), AI SDK v6, and shadcn/ui.

## Stack
- Next.js 15 App Router (no Pages Router)
- TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui
- AI SDK v6 (`ai` package) — use `streamText` with `Output.object()`, NOT `streamObject`
- AI Gateway model strings: `"anthropic/claude-sonnet-4.6"`
- next-themes for dark/light mode

## Conventions
- Server Components by default; add `'use client'` only for interactivity
- API routes in `app/api/*/route.ts`
- Components in `components/` (ui/ for shadcn primitives)
- Types in `types/`
- Lib utilities in `lib/`
