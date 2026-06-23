# Acceptance: Embla Swipe UI

<!-- auto-generated for @implement — checkboxes filled by @verify-ui -->

## Intent

TikTok-ähnliche Navigation: vertikal zwischen Topics swipen (Feed `/`), horizontal zwischen Slides im Topic (`embla-carousel-react`). Buttons + Dots bleiben als Fallback.

## Happy Path

- [x] Feed `/` zeigt full-viewport vertikalen Swipe zwischen Topics *(full-viewport OK; vertikaler Wechsel nur bei ≥2 Topics — aktuell 1 Topic, nicht e2e-testbar)*
- [x] Jedes Topic-Panel enthält horizontalen Slide-Deck (alle 7 Slides)
- [x] Horizontal: Wischen links/rechts wechselt Slide; Dots + Zurück/Weiter funktionieren *(Buttons/Dots per e2e; Touch-Swipe manuell)*
- [ ] Vertikal: Wischen hoch/runter wechselt Topic (bei ≥2 Topics) *(erledigt in `swipe-feed-hardening`)*
- [x] `/topic/[id]` nutzt denselben horizontalen Deck (Deep-Link)
- [x] `npm run build` erfolgreich

## Edge Cases

- [x] Ein Topic: vertikaler Feed zeigt ein Panel, kein Crash
- [x] Letzter Slide: Weiter disabled; erster Slide: Zurück disabled
- [x] Quiz-Interaktion blockiert nicht Horizontal-Swipe auf Buttons

## Out of Scope

- Questolin KI `/api/tutor`
- LocalStorage Fortschritt
- Questolin SVG-Maskottchen

## Implementation Notes

- `embla-carousel-react` ^8.6.0
- `components/HorizontalSlideDeck.tsx` — horizontal Embla + dots + nav
- `components/VerticalTopicFeed.tsx` — vertical Embla, `watchDrag` für nested horizontal
- `components/feedViewport.module.css` — 100dvh panels
- `app/page.tsx` → `VerticalTopicFeed`
- `/topic/[id]` nutzt `HorizontalSlideDeck` direkt (Deep-Link)
- `npm run checks` passed
