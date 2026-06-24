# Questolin App

Swipe-Lernapp für IT-Grundlagen — Content als JSON, erweiterbar ohne Rewrite.

Siehe [docs/PRD.md](docs/PRD.md) für Produktscope.

## Prerequisites

- Node.js 20+ (empfohlen)
- npm

## Setup

```bash
npm install
cp .env.example .env   # optional — KI-Tutor (Ollama lokal/Cloud oder OpenAI)
npm run validate:content
```

## Development

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) → vertikaler Feed mit 8 Topics.

Beispiel-Deep-Links:

- Feed (alle Topics): `/`
- Collection „IT-Grundlagen“: `/?collection=grundlagen`
- Einzelnes Topic: `/topic/api`

## Checks (quality gate)

```bash
npm run checks
```

Runs `validate:content` → `test:unit` → `lint` → `build` via `scripts/run-checks.sh`.

Enforced by Husky pre-push (after `git init`) and GitHub Actions (`.github/workflows/checks.yml`).

```bash
npm run validate:content   # Topics + Collections (Zod)
npm run test:unit          # Vitest — Schema & Markdown
npm run lint
npm run build
```

Optional security scan: `npx ecc-agentshield scan`

## Tests

```bash
npm run test:unit     # Vitest — lib/content schema
npm run test:e2e      # Playwright — mobile-chrome, in CI
```

## Neues Thema hinzufügen

1. Datei anlegen: `content/topics/de/mein-thema.json`
2. Schema: siehe `content/schema/v1/README.md`
3. Validieren: `npm run validate:content`
4. Fertig — erscheint automatisch im Feed (alphabetisch nach Titel)

Optional: Topic in `content/collections/de/grundlagen.json` eintragen.

## Project structure

```
questolin-app/
├── app/                    # Next.js routes (+ loading/not-found)
├── components/             # UI — Feed, Slides, Tutor
├── content/
│   ├── topics/de/          # 8 Lern-Topics (JSON)
│   └── collections/de/     # Topic-Sammlungen
├── docs/PRD.md, UI_STYLEGUIDE.md
├── lib/content/, lib/slides/, lib/progress/, lib/tutor/
├── tests/unit/             # Vitest
├── e2e/                    # Playwright
├── .cursor/rules/, .cursor/skills/   # Agent harness (ECC-aligned)
├── .qa/                    # Design, Acceptance, verify-ui
└── AGENTS.md
```

## Environment variables

Siehe `.env.example`. Keine Secrets committen.

| Variable | Purpose |
|----------|---------|
| `TUTOR_LLM_BASE_URL` | LLM-Endpoint (Default: `http://localhost:11434/v1` für Ollama lokal) |
| `TUTOR_LLM_API_KEY` / `OLLAMA_API_KEY` | API-Key (Ollama Cloud); lokal optional (`ollama` als Default) |
| `TUTOR_MODEL` | Modellname (Default: `llama3.2` bzw. `gpt-4o-mini` bei OpenAI) |
| `OPENAI_API_KEY` | Legacy — nutzt weiterhin `api.openai.com` |

## Agent workflow

1. `@project-setup` — Bootstrap (einmalig)
2. `@pingpong-solution` — Design vor Features
3. `@implement` — Code + Acceptance
4. `@verify-ticket` — Checks + Acceptance-Match
5. `@verify-ui` — Browser-Verifikation
6. `@review-ticket` — Code-Review vor PR

**Issue-Queue (batch):** `@ecc-runner` — arbeitet GitHub-Issues autonom ab (implement → verify → review → PR). Debug: `ecc-runner step`.

Siehe [AGENTS.md](AGENTS.md).

## Feature-Stand (lokal, Phase 2)

Strategie: **local-first** — `npm run dev`, JSON-Content, LocalStorage, Tutor mit `.env`. Vercel/Supabase: GitHub Milestone „Later (Cloud)“.

| Feature | Status |
|---------|--------|
| Vertikaler TikTok-Feed (Embla) | ✅ |
| Questolin KI-Tutor (`/api/tutor`) | ✅ |
| Chat-UI (FAB + Bottom Sheet) | ✅ |
| LocalStorage Fortschritt | ✅ |
| Content Collections | ✅ |
| 8 IT-Grundlagen-Topics | ✅ |
| Markdown in Slides | ✅ |
| Code-Slides (`code_read`, `code_fix`) | ✅ |
| Unit-Tests (Vitest) + e2e in CI | ✅ |
| Vercel Deploy | ⏸️ zurückgestellt (#5) |
| Supabase ContentProvider | 🔜 Phase 3 |

Roadmap: [GitHub Milestones](https://github.com/iamthamanic/questolin-app/milestones)

Design: `.qa/design/swipe-learning-feed.md`
