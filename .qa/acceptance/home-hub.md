# Acceptance: Home Hub (Startscreen)

**Design:** `.qa/design/home-hub.md`

## Intent

Startscreen on `/` with clear entry points; feed moves to `/feed`.

## Happy Path

- [ ] `/` shows Home (Questolin, CTAs) — not the swipe feed
- [ ] Primary collection CTA links to `/feed?collection=grundlagen`
- [ ] „Alle Themen“ links to `/feed`
- [ ] With LocalStorage progress: „Weitermachen“ shows topic + slide counter → `/feed`
- [ ] `/feed` renders existing `VerticalTopicFeed`
- [ ] `/?collection=grundlagen` redirects to `/feed?collection=grundlagen`
- [ ] Feed brand „Questolin“ links back to `/`
- [ ] `npm run checks` passes
- [ ] E2E home-hub + updated feed routes pass

## Edge Cases

- [ ] No progress: no „Weitermachen“ button
- [ ] Empty collections list: only „Alle Themen“

## Implementation Notes

- `/` = `HomeScreen`; `/feed` = `VerticalTopicFeed`; legacy `/?collection=` redirects
- `lib/progress/resume.ts` + `getResumeSnapshot` for Weitermachen CTA
- `FeedChrome` brand links to `/`; topic page „← Start“
- E2E: `e2e/home-hub.spec.ts`; feed routes updated to `/feed`
