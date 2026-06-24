# PRD — Questolin

<!-- scaffolded by /project-setup from README + .qa/design — review and confirm -->

Vollständige Produktvision (Jan 2026): extern unter `Questolin PRD/docs/` — dieses Dokument fokussiert den **aktuellen Repo-Stand** und v1.

## 1. Problem / Motivation

Traditionelles Tech-Lernen ist passiv, lang und ohne Retention. Entwickler wollen komplexe Konzepte (API, DB, Security) **kurz, interaktiv und wiederholbar** verstehen — nicht stundenlange Tutorials.

Questolin kombiniert TikTok-ähnliches Swipen mit strukturierten Lernkarten und optionalem KI-Tutor (Questolin-Maskottchen).

## 2. Zielbild / Goals

- IT-Grundlagen in **7-Slide-Decks** pro Thema (Frage → Erklärung → Beispiel → Szenarien → Fehler → Quiz)
- **Neue Themen nur als JSON** — kein App-Rewrite
- Mobile-first, Deutsch, Dark UI
- Später: Gamification (XP, Streaks), Skill-Tree — auf gleicher Content-Architektur

**North Star (Langfrist):** Missions/Topics completed per week per user.

## 3. Non-Goals (v1 / aktuell)

- Skill-Tree, Leaderboard, Pattern Cards
- Admin/CMS UI
- Supabase **Live-DB** (Scaffold ✅; Seed/Prod optional)
- Native iOS/Android (Capacitor/Tauri — erst nach PWA evaluieren)
- Englische UI
- Produktions-Deploy (bewusst zurückgestellt — local-first, #5)
- PWA (nächstes Ticket nach Doku-Sync)

## 4. Nutzer / Rollen

| Rolle | Beschreibung |
|-------|--------------|
| Lernender (Primary) | Junior bis Mid — Selbsttest, Commute-Lernen |
| Content-Autor (Du) | JSON-Topics unter `content/topics/de/` |
| Gast | Ohne Login, LocalStorage für Fortschritt |

## 5. Kern-Scope — Ist-Stand

### A) Content-Layer ✅

- Schema v1 + Zod-Validation (Topics + Collections)
- `JsonContentProvider` mit optionaler Collection-Filterung (`/?collection=grundlagen`)
- **8 Topics** unter `content/topics/de/` (API, HTTP, Git, Auth, …)
- Beispiel-Collection `content/collections/de/grundlagen.json`

### B) Lern-UI ✅

- Vertikaler TikTok-Feed `/` (`VerticalTopicFeed` + Embla)
- Topic-Deck `/topic/[id]` — horizontal, Dots (≥44px Touch), Touch-Swipe
- Slide-Registry: hook, explanation, real_world, scenario, beginner_mistake, quiz, **code_read**, **code_fix**
- Markdown in Slide-Body (`**fett**`, `` `code` ``)
- Loading (`app/loading.tsx`), deutsche 404 (`app/not-found.tsx`)

### C) Phase 2 — lokal ✅

| Feature | Status |
|---------|--------|
| Vertikaler Embla-Feed | ✅ |
| Feed-Virtualisierung (active ± 1) | ✅ (#14) |
| Questolin KI `/api/tutor` | ✅ (Ollama lokal/Cloud oder OpenAI) |
| Chat-UI (FAB + Bottom Sheet) | ✅ |
| LocalStorage Fortschritt | ✅ |
| Content Collections | ✅ |
| Vitest + Playwright in CI | ✅ |

### D) Phase 3 — teilweise ✅

| Feature | Status |
|---------|--------|
| Supabase `ContentProvider` | ✅ Scaffold + JSON-Fallback (#12) |
| Gamification (XP, Streaks, Skill-Tree) | 🔜 needs-design (#15) |
| PWA (Manifest, Icons, Safe Area) | ✅ [#33](https://github.com/iamthamanic/questolin-app/issues/33) |
| Produktions-Deploy (Vercel/Render) | ⏸️ optional (#5) |

## 6. Constraints

| Bereich | Entscheidung |
|---------|--------------|
| Stack | Next.js 14 App Router, React 18, TypeScript, Tailwind, DaisyUI |
| Content | JSON im Repo, Zod |
| Locale (UI) | Deutsch |
| Deployment | Optional (Vercel/Render) — local-first Default |
| Backend (optional) | Supabase ContentProvider (JSON-Fallback) |
| LLM (Tutor) | Ollama lokal/Cloud oder OpenAI |
| Komponenten | `/components` im Repo-Root |
| Tests | Vitest (Unit) + Playwright (e2e) in CI |

Details: [AGENTS.md](../AGENTS.md)

## 7. UX / Qualität

- Dark-mode first (DaisyUI `dark`)
- Touch targets ≥ 44px (Dots, Buttons, Quiz)
- Quiz: Feedback richtig/falsch
- Loading / empty / error auf Feed und Topic-Routes
- `prefers-reduced-motion` auf Dot-Transitions
- WCAG AA Kontrast (siehe UI Styleguide)

## 8. Offene Fragen

- [ ] Monetization (Post-MVP)
- [ ] Voll-PRD Mission-Types vs. reine Quiz-Slides — Priorität mit #15
- [ ] Deploy-Plattform für persönliche PWA: Vercel vs. Render (#5)
- [x] Mobile vor Native: PWA vor Capacitor/Tauri — siehe [docs/personal-use.md](personal-use.md)

---

**Verwandte Docs:** [AGENTS.md](../AGENTS.md) · [README.md](../README.md) · [personal-use.md](personal-use.md) · [.qa/design/swipe-learning-feed.md](../.qa/design/swipe-learning-feed.md)
