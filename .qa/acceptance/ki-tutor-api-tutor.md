# Feature: Questolin KI-Tutor: /api/tutor Route Handler

<!-- seeded by ecc-runner from issue #1 on 2026-06-23 — @implement may refine -->

## Intent

Serverseitiger KI-Tutor: Nutzer können zum aktuellen Slide nachfragen, ohne Quiz-Spoiler. Kontext via `buildTutorContext` (Hybrid Slide + Topic).

## Happy Path

- [x] `POST /api/tutor` mit validiertem Body (topicId, slideId, message)
- [x] API-Key nur serverseitig, nie im Client-Bundle
- [x] Rate Limiting (`TUTOR_DAILY_LIMIT` oder IP-basiert)
- [x] Spoiler-Modus: keine Quiz-Antworten vor User-Antwort
- [x] Fehler-Responses auf Deutsch, strukturiert
- [x] `npm run checks` grün

## Edge Cases

- [x] Fehlender API-Key → 503 CONFIG_ERROR
- [x] Rate Limit → 429 Deutsch
- [x] Quiz spoilerMode in System-Prompt
- [x] Ungültige topicId/slideId → 400/404

## Regression

- [x] Feed and topic routes still load (build OK)

## Implementation Notes

- `app/api/tutor/route.ts` — POST handler
- `lib/tutor/*` — schemas, rate limit, prompt, OpenAI fetch
- Reuses `buildTutorContext` from content layer
- Unit tests: none (issue #10 covers schema tests separately)
- `npm run checks` green
