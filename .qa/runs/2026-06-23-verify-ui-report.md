# verify-ui — Embla Swipe UI

**Datum:** 2026-06-23  
**Feature:** `embla-swipe-ui`  
**Stack:** Next.js 14, App Root = Repo-Root  
**Dev URL:** http://localhost:3000

## Verify UI Progress

- [x] Step 1: Resolve app root and stack
- [x] Step 2: Load project context
- [x] Step 3: Load acceptance from `.qa/acceptance/embla-swipe-ui.md`
- [x] Step 4: Run technical checks (`npm run checks` — exit 0)
- [x] Step 5: Playwright bootstrap (`@playwright/test`, `playwright.config.ts`)
- [x] Step 6: Run e2e scenarios + screenshots
- [x] Step 7: Edge-case matrix (relevant subset)
- [x] Step 8: Report

## Verdict

**PARTIAL**

Kernflows funktionieren im Browser (Feed, horizontale Navigation, Deep-Link, Quiz). Vertikaler Topic-Wechsel und Touch-Swipe-Gesten sind nicht vollständig abgedeckt.

## Technical checks

| Command | Exit |
|---------|------|
| `npm run checks` | 0 |
| `npm run test:e2e` | 0 (8 passed, ~1.3m) |

## E2E results

| Spec | Result |
|------|--------|
| `e2e/smoke.app-loads.spec.ts` | PASS |
| `.qa/runs/2026-06-23-embla-swipe-ui.spec.ts` (7 tests) | PASS |

## Screenshots

`.qa/evidence/embla-swipe-ui/`:

- `01-feed-first-slide.png`
- `02-horizontal-next-slide.png`
- `03-last-slide-disabled-next.png`
- `04-dot-navigation.png`
- `05-quiz-interaction.png`
- `06-topic-deep-link.png`

`.qa/evidence/smoke/01-app-loads.png`

## Acceptance mapping

| AC | Browser | Notes |
|----|---------|-------|
| Full-viewport Feed | OK | Screenshot 01 |
| Horizontal Deck 7 Slides | OK | Counter + dots |
| Horizontal swipe | PARTIAL | Buttons/Dots OK; kein Touch-Drag-Test |
| Vertical Topic swipe | SKIP | Nur 1 Topic — AC verlangt ≥2 |
| Deep-Link `/topic/api` | OK | Screenshot 06 |
| Ein Topic kein Crash | OK | Smoke + feed test |
| Nav disabled Enden | OK | Tests + Screenshots 03 |
| Quiz interaction | OK | Screenshot 05 |

## Edge-case matrix (subset)

| ID | Case | Result |
|----|------|--------|
| G-01 | App loads | PASS |
| G-02 | Locale DE | PASS (UI + Content) |
| G-03 | Dark theme | SKIP (nicht spezifiziert in Styleguide) |
| F-01 | Topics visible | PASS |
| F-02 | Empty state | SKIP (nicht in e2e) |
| F-03 | Tap → topic page | N/A (Swipe-Feed, kein Tap-Nav) |
| T-01 | Slides render | PASS |
| T-02 | Progress dots | PASS |
| T-03 | Prev disabled first | PASS |
| T-04 | Next disabled last | PASS |
| T-05 | Quiz feedback | PASS (Option klickbar) |
| T-06 | Invalid topic 404 | SKIP |

## Playwright bootstrap (neu)

Folgende Dateien wurden angelegt — **bitte vor Commit reviewen**:

- `playwright.config.ts`
- `e2e/smoke.app-loads.spec.ts`
- `.qa/runs/2026-06-23-embla-swipe-ui.spec.ts`
- `package.json` — `test:e2e`, `@playwright/test` devDependency
- `.gitignore` — `.qa/evidence/`, `.qa/test-results/`

## Fix list (für PASS)

1. Zweites Topic unter `content/topics/de/` (z. B. `datenbanken.json`) → vertikalen Swipe e2e-testen.
2. Optional: Playwright `locator.dragTo` / Touch für horizontale/vertikale Embla-Gesten.
3. Optional: e2e für `/topic/xyz` → 404 (`T-06`).
4. `.qa/edge-cases.md` F-03 an Swipe-Feed anpassen.

## Empfehlung

Ticket technisch merge-fähig (@verify-ticket PASS). UI **PARTIAL** — für vollständiges AC: zweites Topic + Swipe-Gesten-Tests. Weiter mit @review-ticket.
