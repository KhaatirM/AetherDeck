# AetherDeck

Next-generation AI slide presentation builder with **three cinematic visual tiers**:

| Tier | Name | Experience |
|------|------|------------|
| 1 | **Basic** | Modern minimalist cards, grids, timelines, sleek typography |
| 2 | **Plus** | Framer Motion staggered reveals, morphing slide transitions |
| 3 | **Pro** | Three.js / WebGL starfields, floating orbs, camera travel |

## Stack

- Next.js App Router · TypeScript · React 19
- Tailwind CSS v4 · Radix / shadcn-style primitives
- Zustand · Framer Motion · React Three Fiber
- Vercel AI SDK (OpenAI / Anthropic) with structured Zod schemas
- PPTX via `pptxgenjs` · PDF via print stylesheet

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and optionally set:

```env
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=...
AI_PROVIDER=openai
```

**No API key required** — `/api/generate-deck` returns a rich mock deck tailored to your prompt so the product is fully demoable offline.

## Routes

- `/` — Marketing landing
- `/editor` — Split workspace (thumbnails · live canvas · inspector · AI chat)
- `/present` — Fullscreen player (`Space` / `→` next, `Esc` exit, `N` notes)
- `/api/generate-deck` — Structured deck generation

## Deploy on Render

This repo includes `render.yaml` for a Node web service:

1. Push to GitHub
2. Create a new **Blueprint** (or Web Service) on Render
3. Build: `npm install && npm run build`
4. Start: `npm run start`
5. Add optional env vars `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`

## Project map

```
src/
  app/                  # routes + API
  components/
    ai/                 # prompt modal + regen chat
    editor/             # navigator, viewport, inspector
    player/             # fullscreen presenter
    renderers/
      tier-basic/
      tier-plus/
      tier-pro/         # lazy-loaded R3F canvas
  lib/ai/               # schemas, fallback, generate
  lib/export/           # pptx + pdf
  store/                # Zustand deck store
  types/deck.ts         # core data model
```
