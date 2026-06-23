# Acceptance: Swipe Feed Hardening

<!-- auto-generated for @implement — checkboxes filled by @verify-ui -->

## Intent

Review-Follow-ups für die Embla-Swipe-UI: zweites Topic für vertikalen Feed-Wechsel, sichere Route-`id`, Dead-Code entfernen, Touch-Swipe-e2e ergänzen.

## Happy Path

- [x] `content/topics/de/datenbanken.json` validiert und im Feed sichtbar
- [x] Vertikaler Swipe/Wisch wechselt zwischen ≥2 Topics im Feed
- [x] Horizontaler Touch-Swipe wechselt Slides im Topic-Deck
- [x] `/topic/[id]` lädt Topic nur bei gültiger `id` (`^[a-z0-9-]+$`)
- [x] Ungültige Topic-IDs (`/topic/xyz`, `/topic/not-valid!`) → 404 *(Pfad `../api` wird von Next normalisiert; `isValidTopicId` blockt `.`/`..`)*
- [x] `TopicCard` entfernt; Feed nutzt `VerticalTopicFeed`
- [x] `TopicSlideDeck`-Wrapper entfernt; Deep-Link nutzt `HorizontalSlideDeck` direkt
- [x] `npm run checks` erfolgreich
- [x] `npm run test:e2e` erfolgreich (inkl. neue Swipe-Szenarien)

## Edge Cases

- [x] Sortierung: beide Topics alphabetisch geladen, Swipe-Hinweis bei ≥2 Topics
- [x] Horizontaler Swipe startet nicht vertikalen Topic-Wechsel (`watchDrag`)

## Out of Scope

- Dot-Touch-Target-Vergrößerung
- `prefers-reduced-motion`
- Virtualisierung bei vielen Topics

## Implementation Notes

- `content/topics/de/datenbanken.json` — zweites Topic (7 Slides)
- `lib/content/topic.schema.ts` — `TOPIC_ID_PATTERN`, `isValidTopicId()`
- `lib/content/loadTopics.ts` — Route-`id` validieren vor `readFile`
- `app/topic/[id]/page.tsx` — direkt `HorizontalSlideDeck`
- Entfernt: `TopicCard.tsx`, `TopicSlideDeck.tsx`
- `e2e/helpers/swipe.ts` + `.qa/runs/2026-06-23-swipe-feed-hardening.spec.ts`
