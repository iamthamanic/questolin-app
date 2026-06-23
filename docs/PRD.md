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
- Später: Gamification (XP, Streaks), Skill-Tree, KI-Tutor — auf gleicher Content-Architektur

**North Star (Langfrist):** Missions/Topics completed per week per user.

## 3. Non-Goals (v1)

- Skill-Tree, Leaderboard, Pattern Cards
- Code-Editor-Missions (6 Mission-Typen aus Voll-PRD)
- Admin/CMS UI
- Supabase Sync (nur `ContentProvider`-Interface)
- Native iOS/Android
- Englische UI

## 4. Nutzer / Rollen

| Rolle | Beschreibung |
|-------|--------------|
| Lernender (Primary) | Junior bis Mid — Selbsttest, Commute-Lernen |
| Content-Autor (Du) | JSON-Topics unter `content/topics/de/` |
| Gast | Ohne Login, LocalStorage später |

## 5. Kern-Scope (v1 — implementiert / in Arbeit)

### A) Content-Layer ✅

- Schema v1 + Zod-Validation
- `JsonContentProvider`
- Beispiel-Topic `api.json`

### B) Lern-UI ✅ (Phase 1)

- Feed `/`
- Topic-Deck `/topic/[id]` — horizontal, Dots, Touch-Swipe
- Slide-Registry: hook, explanation, real_world, scenario, beginner_mistake, quiz

### C) Phase 2 (geplant)

- Vertikaler TikTok-Feed (`embla-carousel`)
- Questolin KI `/api/tutor`
- LocalStorage Fortschritt
- Supabase `ContentProvider`

## 6. Constraints

| Bereich | Entscheidung |
|---------|--------------|
| Stack | Next.js 14 App Router, React 18, TypeScript, Tailwind, DaisyUI |
| Content | JSON im Repo, Zod |
| Locale (UI) | Deutsch |
| Deployment | Vercel |
| Backend (später) | Supabase (Auth, Postgres) |
| Komponenten | `/components` im Repo-Root |

Details: [AGENTS.md](../AGENTS.md)

## 7. UX / Qualität

- Dark-mode first (DaisyUI `dark`)
- Touch targets ≥ 44px
- Quiz: Feedback richtig/falsch
- Loading / empty / error auf Feed
- WCAG AA Kontrast (siehe UI Styleguide)

## 8. Offene Fragen

- [ ] KI-Modell für Questolin-Tutor
- [ ] Monetization (Post-MVP)
- [ ] Voll-PRD Mission-Types vs. reine Quiz-Slides — Priorität Phase 3

---

**Verwandte Docs:** [AGENTS.md](../AGENTS.md) · [README.md](../README.md) · [.qa/design/swipe-learning-feed.md](../.qa/design/swipe-learning-feed.md)
