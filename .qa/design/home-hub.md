# Design: Home Hub (Startscreen)

<!-- pingpong + implement 2026-06-24 -->

## Problem & Intent

App öffnet bisher direkt im Feed ohne Orientierung. Nutzer brauchen einen **Startscreen**: Wo bin ich? Level 1 vs. alle Themen? Weitermachen?

## Decision

**Home Hub** auf `/`, Feed auf `/feed`. Collections = „Level“ (v1: `grundlagen`).

## User Flow

```
/ (Home)
├── Weitermachen → /feed (LocalStorage Resume)
├── {Collection.title} → /feed?collection={id}  (Level 1)
└── Alle Themen → /feed
```

Legacy: `/?collection=x` → redirect `/feed?collection=x`

## Non-Goals

- XP, Skill-Tree (#15)
- Auth / Sync
- Onboarding-Slideshow

## Ready for /implement

YES
