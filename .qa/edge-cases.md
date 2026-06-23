# Questolin — project-specific edge cases for verify-ui

Extends the universal matrix in the verify-ui skill.

## Global

| ID | Case | Fail if |
|----|------|---------|
| G-01 | App loads | Blank screen, uncaught console errors on `/` |
| G-02 | Locale | UI not German where user-facing |
| G-03 | Dark theme | Light background on default load |

## Feed

| ID | Case | Fail if |
|----|------|---------|
| F-01 | Topics visible | Kein Topic-Panel wenn `content/topics/de/*.json` existiert |
| F-02 | Empty state | No message when topic folder empty |
| F-03 | Navigate | Vertikaler Swipe wechselt Topic; Deep-Link `/topic/[id]` funktioniert |

## Topic / Slide deck

| ID | Case | Fail if |
|----|------|---------|
| T-01 | Slides render | Crash on any slide type in topic |
| T-02 | Progress dots | Wrong count vs. slide list |
| T-03 | Prev disabled | Back works on first slide |
| T-04 | Next disabled | Forward works on last slide |
| T-05 | Quiz | No feedback after answer |
| T-06 | Invalid topic | `/topic/xyz` shows 404, not white screen |

## Content validation

| ID | Case | Fail if |
|----|------|---------|
| C-01 | validate:content | Script fails on valid `api.json` |
| C-02 | Schema | New topic without required slide fields passes validation |

## Phase 2 (placeholder)

| ID | Case | Fail if |
|----|------|---------|
| P2-01 | Tutor | API key exposed in client bundle |
| P2-02 | Tutor | Quiz answer spoiled before user answers |
