# Questolin App

Swipe-Lernapp für IT-Grundlagen — Content als JSON, erweiterbar ohne Rewrite.

Siehe [docs/PRD.md](docs/PRD.md) für Produktscope.

## Prerequisites

- Node.js 20+ (empfohlen)
- npm

## Setup

```bash
npm install
cp .env.example .env   # optional — Phase 2 KI-Tutor
npm run validate:content
```

## Development

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) → Feed → Thema „Was ist eine API?“

## Checks (quality gate)

```bash
npm run checks
```

Runs `validate:content` → `lint` → `build` via `scripts/run-checks.sh`.

Enforced by Husky pre-push (after `git init`) and GitHub Actions (`.github/workflows/checks.yml`).

```bash
npm run validate:content   # Zod-Validation aller Topics
npm run build
npm run lint
```

Optional security scan: `npx ecc-agentshield scan`

## Tests

```bash
npm run test:e2e      # Playwright — bootstrap via @verify-ui skill
```

## Neues Thema hinzufügen

1. Datei anlegen: `content/topics/de/mein-thema.json`
2. Schema: siehe `content/schema/v1/README.md`
3. Validieren: `npm run validate:content`
4. Fertig — erscheint automatisch im Feed

## Project structure

```
questolin-app/
├── app/                    # Next.js routes
├── components/             # UI-Komponenten
├── content/topics/de/      # Lerninhalte (JSON)
├── docs/PRD.md, UI_STYLEGUIDE.md
├── lib/content/, lib/slides/
├── .cursor/rules/, .cursor/skills/   # Agent harness (ECC-aligned)
├── .qa/                    # Design, Acceptance, verify-ui
└── AGENTS.md
```

## Environment variables

Siehe `.env.example`. Keine Secrets committen.

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Phase 2: Questolin KI-Tutor (serverseitig) |

## Agent workflow

1. `@project-setup` — Bootstrap (einmalig)
2. `@pingpong-solution` — Design vor Features
3. `@implement` — Code + Acceptance
4. `@verify-ui` — Browser-Verifikation

Siehe [AGENTS.md](AGENTS.md).

## Phase 2 (lokal — in Arbeit)

Strategie: **local-first** — alles über `npm run dev`, JSON-Content, LocalStorage, Tutor mit `.env` lokal. Vercel/Supabase siehe GitHub Milestone „Later (Cloud)“.

- ✅ Vertikaler TikTok-Feed (`embla-carousel-react`)
- Questolin KI-Tutor (`/api/tutor`) — lokal mit `OPENAI_API_KEY`
- LocalStorage Fortschritt
- Content Collections (LearnHouse-Pattern, JSON)
- ~~Supabase~~ → später

Roadmap: [GitHub Milestones](https://github.com/iamthamanic/questolin-app/milestones)

Design: `.qa/design/swipe-learning-feed.md`
