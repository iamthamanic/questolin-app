# Acceptance: Swipe Learning Feed

<!-- Historical MVP acceptance — updated 2026-06-23 to reflect shipped Phase 2 -->

## Intent

Questolin content layer + swipe learning UI: versioniertes Topic/Slide-Schema, JSON-Topics, Zod-Validation, SlideRenderer-Registry, Embla Feed.

## Happy Path

- [x] `content/topics/de/*.json` validiert gegen Zod-Schema v1
- [x] Topics haben 7+ Slides (hook … quiz; git inkl. code_read/code_fix)
- [x] `loadTopics()` liefert 8 Topics (alphabetisch nach Titel)
- [x] `SlideRenderer` rendert alle implementierten Slide-Typen
- [x] Reservierte Typen ohne Registry → `UnsupportedSlide` (keine mehr für code_read/code_fix)
- [x] `app/page.tsx` — vertikaler `VerticalTopicFeed`
- [x] `/topic/[id]` — horizontaler `HorizontalSlideDeck`

## Edge Cases

- [x] Fehlende JSON-Datei → Topic nicht in Liste
- [x] Ungültiges JSON → Validation-Fehler mit Pfad
- [x] Quiz ohne `questions` → Validation schlägt fehl
- [x] Ungültige Topic-ID → deutsche 404

## Shipped beyond original MVP

- [x] Vertikaler + horizontaler Embla-Swipe
- [x] `/api/tutor` + Chat-UI
- [x] LocalStorage Fortschritt
- [x] Content Collections (`/?collection=grundlagen`)
- [x] Loading + not-found States

## Out of Scope (Phase 3)

- Supabase ContentProvider
- Feed-Virtualisierung
- Gamification

## Implementation Notes

- Feed: `components/VerticalTopicFeed.tsx`
- Deck: `components/HorizontalSlideDeck.tsx`
- E2E: `.qa/runs/2026-06-23-embla-swipe-ui.spec.ts`, `e2e/smoke.app-loads.spec.ts`
- `npm run checks` + `npm run test:e2e` in CI
