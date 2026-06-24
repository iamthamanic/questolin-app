# Feature: Topic-Feed Virtualisierung (#14)

<!-- @implement 2026-06-24 -->

## Intent
Mount only the active topic panel and immediate neighbors in the vertical feed to reduce Embla + slide deck cost at scale.

## Happy Path
- [ ] `VerticalTopicFeed` mounts `HorizontalSlideDeck` only for `activeIndex ± 1`
- [ ] Vertical swipe still works; placeholder panels preserve Embla snap height
- [ ] `lastTopicId` saved on vertical topic change
- [ ] E2E: at most 3 `[data-slide-deck]` nodes when feed has multiple topics
- [ ] `npm run checks` passes

## Edge Cases
- [ ] Single topic: full deck always mounted
- [ ] Start index from LocalStorage still works

## Implementation Notes
- `VerticalTopicFeed`: mount `HorizontalSlideDeck` only for `activeIndex ± 1`; placeholder preserves layout
- `saveLastTopicId()` on vertical embla `select`
- E2E asserts ≤3 mounted `[data-slide-deck]` nodes (8 topics in feed → 2 at start index 0)
