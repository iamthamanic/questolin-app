# verify-ticket — Swipe Feed Hardening

**Datum:** 2026-06-23  
**Acceptance:** `.qa/acceptance/swipe-feed-hardening.md`

## Ergebnis

**PASS**

## Checks

- Command: `npm run checks`
- Exit: 0
- Enthält: `validate:content` (2 Topics), `lint`, `build`

## Acceptance

| Criterion | Status |
|-----------|--------|
| `datenbanken.json` validiert + im Feed | OK — validate + e2e „two topics“ |
| Vertikaler Topic-Wechsel | OK — e2e `vertical swipe switches topic` |
| Horizontaler Touch-Swipe | OK — e2e `horizontal touch swipe advances slide` |
| Gültige Route-`id` only | OK — `isValidTopicId()` in `loadTopic` |
| Ungültige IDs → 404 | OK — e2e `xyz`, `not-valid!` |
| `TopicCard` entfernt | OK — Datei gelöscht, kein Import |
| `TopicSlideDeck` entfernt | OK — `HorizontalSlideDeck` direkt in Route |
| `npm run checks` | OK |
| `npm run test:e2e` | OK — 14 passed |
| Alphabetische Sortierung + Swipe-Hinweis | OK — API vor Datenbank, „Thema 1/2“, Hint |
| `watchDrag` Isolation | OK — e2e horizontal swipe ändert Topic nicht |

## Unit tests

Keine Vitest/Jest-Tests. Verhalten durch Playwright abgedeckt — akzeptabel für dieses Ticket.

## Diff summary

- Kein Git-Repo — manuelle Dateiliste:
  - Neu: `content/topics/de/datenbanken.json`, `e2e/helpers/{feed,swipe}.ts`, `.qa/runs/2026-06-23-swipe-feed-hardening.spec.ts`, `.qa/acceptance/swipe-feed-hardening.md`
  - Geändert: `lib/content/{topic.schema,loadTopics}.ts`, `app/topic/[id]/page.tsx`, Docs, bestehende e2e-Specs
  - Gelöscht: `components/TopicCard.tsx`, `TopicSlideDeck.tsx`

## Gaps / scope issues

- `/topic/../api` nicht als eigener e2e-Case (Next normalisiert URL); Schutz über `isValidTopicId` (kein `.` erlaubt).
- Keine Unit-Tests für `isValidTopicId` — optional.

## Security scan

- Keine Secrets in geänderten Quelldateien.
- Route-`id` validiert vor Dateizugriff (Path-Traversal-Härtung).
- Statischer JSON-Content, kein Auth in Scope.

## UI verification

Completed @verify-ui — `.qa/runs/2026-06-23-verify-ui-swipe-feed-hardening.md` — **PASS**

## Empfehlung

Proceed to @review-ticket. Vor PR optional: `@verification-loop`.
