# Acceptance: QuizSlide v2

**Issue:** #41

## Happy Path

- [ ] Quiz auf `/topic/auth` Slide 7: eine Frage sichtbar, volle Breite Optionen
- [ ] Nach Tap: richtig/falsch Feedback, dann „Nächste Frage“
- [ ] Letzte Frage: Score-Zusammenfassung
- [ ] `npm run checks` + E2E grün

## Implementation Notes

- One question per view via `questionIndex`; „Nächste Frage“ CTA avoids deck swipe conflict
- Full-width `quizOption` cards; shake on wrong answer
- Immersive `quizImmersive` layout
- E2E: `e2e/quiz-slide-v2.spec.ts`
