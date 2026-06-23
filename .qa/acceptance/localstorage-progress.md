# Feature: LocalStorage: Lernfortschritt pro Topic/Slide

<!-- seeded by ecc-runner from issue #3 -->

## Intent
From GitHub issue #3: persist guest learning progress locally.

## Happy Path
- [x] Fortschritt beim Slide-Wechsel und Quiz-Abschluss persistieren
- [x] Feed/Deep-Link setzt Nutzer an letzter Position fort
- [x] Graceful Fallback ohne Storage (Private Mode)
- [x] Keine sensiblen Daten in LocalStorage
- [x] e2e: Fortschritt über Reload erhalten

## Edge Cases
- [x] Slide-Index wird auf gültigen Bereich geklemmt

## Regression
- [x] Feed and topic routes still load (`npm run checks`)

## Assumptions
- Gast-Modus v1; kein Supabase-Sync

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-after-reload.png` |

## Implementation Notes
- `lib/progress/storage.ts` — topic slide index, quiz ids, lastTopicId only
- Embla `startIndex` restores position on feed and topic decks
- E2E: `e2e/progress-storage.spec.ts`
