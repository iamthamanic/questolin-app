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

## Persönliche Nutzung (Mac + Handy)

Siehe **[docs/personal-use.md](docs/personal-use.md)** — Tutor (Ollama), Smoke-Test, Handy-Zugriff (LAN / Deploy / HTTPS für PWA).

```bash
# Tutor-Smoke (Dev-Server + Ollama müssen laufen)
bash scripts/smoke-tutor.sh
```

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
├── docs/PRD.md, personal-use.md, UI_STYLEGUIDE.md
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
| `CONTENT_PROVIDER` | `json` (default) or `supabase` |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Supabase ContentProvider (SSR-safe anon key) |
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

## Feature-Stand (lokal)

Strategie: **local-first** — `npm run dev`, JSON-Content, LocalStorage, Tutor mit Ollama. Deploy/PWA optional.

| Feature | Status |
|---------|--------|
| Vertikaler TikTok-Feed (Embla) | ✅ |
| Feed-Virtualisierung (active ± 1) | ✅ |
| Questolin KI-Tutor (Ollama/OpenAI) | ✅ |
| Chat-UI (FAB + Bottom Sheet) | ✅ |
| LocalStorage Fortschritt | ✅ |
| Content Collections | ✅ |
| 8 IT-Grundlagen-Topics | ✅ |
| Markdown + Code-Slides | ✅ |
| Unit-Tests (Vitest) + e2e in CI | ✅ |
| Supabase ContentProvider | ✅ scaffold — [docs/supabase-content.md](docs/supabase-content.md) |
| PWA (Home Screen) | ✅ [#33](https://github.com/iamthamanic/questolin-app/issues/33) — [personal-use.md](docs/personal-use.md) |
| Produktions-Deploy | ⏸️ optional (#5) |
| Gamification | 🔜 needs-design (#15) |

Roadmap: [GitHub Milestones](https://github.com/iamthamanic/questolin-app/milestones)

Design: `.qa/design/swipe-learning-feed.md`
