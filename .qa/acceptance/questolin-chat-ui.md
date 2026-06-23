# Feature: Questolin Chat-UI: Bottom Sheet + Maskottchen

<!-- seeded by ecc-runner from issue #2 on 2026-06-23 -->

## Intent
From GitHub issue #2: Questolin Chat-UI: Bottom Sheet + Maskottchen

## Happy Path
- [x] FAB öffnet DaisyUI Bottom Sheet / Modal
- [x] Chat-Verlauf (User + Questolin), Deutsch
- [x] Kontext aus aktuellem Topic + Slide (`sendTutorMessage` mit topicId/slideId)
- [x] Loading-, Error-, Disabled-States
- [x] Mobile-first (~390px), Touch targets ≥ 44px
- [x] Playwright-Szenario: Chat öffnen, Frage senden (mock API)

## Edge Cases
- [x] Quiz-Slides: Tutor erst nach Quiz-Abschluss ohne Spoiler-Hinweis

## Regression
- [x] Feed and topic routes still load (`npm run checks`)

## Assumptions
- Depends on `POST /api/tutor` (issue #1 / PR #17)

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-chat-reply.png` |

## Implementation Notes
- `QuestolinTutorDock` in `HorizontalSlideDeck`; `SlideQuizProvider` + `QuizSlide` mark completion
- E2E: `e2e/questolin-chat.spec.ts` mocks `/api/tutor`
