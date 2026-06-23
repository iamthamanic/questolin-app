# Acceptance: Swipe Learning Feed

<!-- auto-generated for /implement — checkboxes filled by @verify-ui -->

## Intent

Questolin MVP content layer: versioniertes Topic/Slide-Schema, deutsches Beispiel-Topic „API“, Zod-Validation, SlideRenderer-Registry mit Stub-Komponenten, JsonContentProvider. Minimale Next.js-Shell lädt Topics.

## Happy Path

- [ ] `content/topics/de/api.json` validiert gegen Zod-Schema v1
- [ ] Topic hat 7 Slides: hook, explanation, real_world, 2× scenario, beginner_mistake, quiz
- [ ] `loadTopics()` liefert mindestens ein Topic
- [ ] `SlideRenderer` rendert jeden Slide-Typ ohne Crash
- [ ] Unbekannter Slide-Typ zeigt `UnsupportedSlide`
- [ ] `app/page.tsx` listet geladene Topics

## Edge Cases

- [ ] Fehlende JSON-Datei → leere Liste oder klarer Fehler (kein Silent Fail)
- [ ] Ungültiges JSON → Validation-Fehler mit Pfad
- [ ] Quiz ohne `questions` → Validation schlägt fehl
- [ ] Slide-Typ in Enum reserviert aber nicht implementiert → UnsupportedSlide

## Out of Scope (v1)

- Vertical/horizontal Swipe UI (Phase 2)
- `/api/tutor` Questolin
- LocalStorage Progress
- Supabase

## Implementation Notes

- Content layer: `content/schema/v1/`, `content/topics/de/api.json` (7 slides, DE)
- Zod validation: `lib/content/topic.schema.ts`, `npm run validate:content`
- `JsonContentProvider` + `SlideRenderer` registry
- Slide components in `components/slides/` (hook → quiz)
- `TopicSlideDeck`: horizontal navigation (buttons + swipe + dots)
- Feed: `app/page.tsx`, detail: `app/topic/[id]/page.tsx`
- Prior art: `~/.cursor/prior-art/questolin-learning-extensible.md`
- Build passes (`npm run build`)
