# Feature: Feed UI v2: Immersive mobile shell (TikTok-like)

<!-- seeded by ecc-runner from issue #35 on 2026-06-24 — @implement may refine -->

## Intent
From GitHub issue #35: Feed UI v2: Immersive mobile shell (TikTok-like)

## Happy Path
- [ ] - [ ] Slides **full-bleed** auf Mobile (kein `card shadow-xl`-Look im Feed; `SlideShell` immersive Variante)
- [ ] - [ ] Topic-Header kompakt als **Overlay** (`FeedChrome`), nicht als fester Block
- [ ] - [ ] **Zurück/Weiter** auf Mobile ausgeblendet (`< md`); Navigation per Swipe; Desktop behält Buttons
- [ ] - [ ] Dot-Navigation → **dünne Progress-Bar** (oder Segmented-Bar) mit `aria-valuenow`
- [ ] - [ ] Permanenter Swipe-Hint unten **entfernt**; optional einmaliger Coach-Hinweis (LocalStorage `questolin_onboarding_seen`)
- [ ] - [ ] Tutor-FAB + Safe Area unverändert nutzbar (≥44px)
- [ ] - [ ] `/topic/[id]` visuell konsistent mit Feed (immersive deck)
- [ ] - [ ] `docs/UI_STYLEGUIDE.md` — Abschnitt Feed v2
- [ ] - [ ] `.qa/acceptance/feed-ui-v2.md` + E2E (Swipe statt Button-Klick auf Mobile)
- [ ] - [ ] `npm run checks` passes

## Edge Cases
- [ ] (from .qa/edge-cases.md + @implement)

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
<!-- filled after coding -->
