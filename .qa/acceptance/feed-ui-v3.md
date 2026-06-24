# Acceptance: Feed UI v3

**Issue:** #39  
**Design:** `.qa/design/feed-ui-v3.md`

## Intent

Feed fühlt sich auf Mobile wie TikTok/Reels an: Overlay-Chrome, Story-Bars, Hook als Hero-Frage, kein Desktop-Tastatur-Hinweis auf Mobile.

## Happy Path

- [ ] `/feed` auf 390px: Story-Segmente sichtbar (7 bei API-Topic)
- [ ] Hook-Slide: Frage groß/zentriert, kein sichtbares „Die Frage“-Label
- [ ] FeedChrome überlagert Content (kein großer Header-Block)
- [ ] Swipe-Coach auf Mobile nur Wisch-Text, verschwindet nach Topic-Wechsel
- [ ] `npm run checks` grün
- [ ] E2E `feed-ui-v3` / bestehende feed-specs grün

## Edge Cases

- [ ] Slide 2+: Topic-Titel im Feed-Chrome ausgeblendet (nur Badge + Counter)
- [ ] `/topic/[id]` nutzt gleiche Story-Bar + Overlay
- [ ] Desktop: Zurück/Weiter weiterhin sichtbar ab `md`
- [ ] `prefers-reduced-motion`: keine animierten Segment-Transitions

## Implementation Notes

- `StoryProgressBar` + `deckOverlay` absolute positioning in `HorizontalSlideDeck`
- `HookSlide` immersive hero; hides generic „Die Frage“ title
- `FeedChrome`: category badge; topic `h1` only on slide 1 in compact feed
- Mobile swipe coach: „Wische ↑↓ …“ (desktop keeps keyboard hint)
- E2E: `e2e/feed-ui-v3.spec.ts` (39/39 pass)
