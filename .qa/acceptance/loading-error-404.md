# Feature: Loading, Error & deutsche 404-Seiten

<!-- issue #7 -->

## Intent
Required UI states from styleguide — German loading and not-found screens.

## Happy Path
- [x] `app/loading.tsx` for feed route
- [x] `app/topic/[id]/loading.tsx` for topic route
- [x] `app/not-found.tsx` — Deutsch, DaisyUI, link to feed
- [x] `app/topic/[id]/not-found.tsx` with topic-specific message
- [x] Edge case T-06 covered in e2e

## Regression
- [x] `npm run checks`
- [x] Existing e2e specs pass

## Implementation Notes
- Shared `RouteLoading` and `NotFoundView` components
- E2E: `e2e/not-found.spec.ts`
