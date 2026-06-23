# Feature: CI Playwright e2e in GitHub Actions

<!-- issue #6 -->

## Intent
Run Playwright e2e in CI alongside validate, lint, and build.

## Happy Path
- [x] Workflow: `npx playwright install --with-deps chromium`
- [x] `npm run test:e2e` in CI
- [x] Artefakte bei Failure (`.qa/test-results`)
- [x] Job timeout 5 minutes on `ubuntu-latest`

## Regression
- [x] `npm run checks` job unchanged

## Implementation Notes
- Extended `.github/workflows/checks.yml` with `e2e` job after `checks`
