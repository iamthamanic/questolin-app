# Feature: Content — IT-Grundlagen Bibliothek

<!-- issue #4 -->

## Intent
Expand content library to 8 topics with 7-slide flow each.

## Happy Path
- [x] 6 new topics: http, git, auth, frontend-backend, db-indizes, security
- [x] 7-slide flow (hook → … → quiz) per schema v1
- [x] `npm run validate:content` green
- [x] Feed sorts topics alphabetically by title (`loadTopics`)
- [x] No app code changes — JSON only

## Implementation Notes
- `content/topics/de/*.json` — 8 topics total
