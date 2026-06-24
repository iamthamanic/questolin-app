# Design: QuizSlide v2

<!-- Issue #41 — follow-up Feed UI v3 -->

## Problem

Quiz nutzt kleine `btn-outline btn-sm` — wirkt wie Formular. Mehrere Fragen gestapelt auf einem Slide überfordert Mobile.

## Decision

- **Eine Frage pro View** innerhalb des Quiz-Slides (State `questionIndex`, kein nested Embla — vermeidet Konflikt mit horizontalem Deck-Swipe)
- Nach Antwort: Feedback + **„Nächste Frage“** CTA (oder Zusammenfassung bei letzter Frage)
- Volle Breite Karten, min 48px Touch
- Immersive Layout analog HookSlide

## Non-Goals

- Nested horizontal swipe zwischen Quiz-Fragen
- Schema-Änderung

## Ready for @implement

YES
