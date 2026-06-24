# Design: Feed UI v3 — TikTok Presentation Layer

<!-- Issue #39 — closes visual gap after Feed v2 mechanics -->

## Problem & Intent

Feed v2 lieferte full-bleed Slides und Embla-Swipe, aber der Screenshot zeigt weiterhin **Lernkarten-Feeling**: FeedChrome als Flex-Header, generischer Hook-Titel „Die Frage“, kleiner Fließtext, Leerraum, Formular-Quiz, Tastatur-Swipe-Hinweis.

**Ziel:** Presentation Layer an TikTok/Reels/Instagram Stories anpassen — **ohne** Embla, Content-Schema oder Routing zu ändern.

## Scope (Phase A — #39)

| Change | Detail |
|--------|--------|
| Overlay chrome | FeedChrome + Progress absolut über Slide-Fläche |
| Story segments | 7 Segmente statt einer Progress-Linie |
| Hook hero | Frage groß + zentriert; Subtitle als Caption unten |
| Swipe coach | Mobile: nur Wisch-Gesten; Desktop: optional Tastatur |
| Compact meta | Feed: Kategorie-Badge + Counter; Topic-Titel nur Slide 1 |

## Non-Goals (#39)

- QuizSlide v2 (eine Frage pro View, Action Rail) → Follow-up
- Content-JSON-Änderungen (Hook-Titel „Die Frage“ bleibt im JSON, Renderer ignoriert generischen Titel)
- Carousel-Engine-Wechsel (ReelKit etc.)

## Visual Spec

```
│ █ █ █ ░ ░ ░ ░  story segments (safe-top)
│ [Grundlagen]              1/7   ← badge + counter overlay
│                                    │
│         GROSSE FRAGE               │  ← hook: vertical center
│                                    │
│ ▓▓▓ subtitle caption gradient ▓▓▓ │
│                          (FAB)     │
└────────────────────────────────────┘
```

## Decision

Option B aus Feed v2 fortgeführt: CSS + kleine Komponenten (`StoryProgressBar`, Hook-Variante), keine neue Dependency.

## Ready for @implement

YES
