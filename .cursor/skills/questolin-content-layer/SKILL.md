---
name: questolin-content-layer
description: Questolin content layer — JSON topic decks, Zod validation, slide registry, and ContentProvider pattern. Use when adding topics, slide types, or changing lib/content/.
---

# Questolin Content Layer

## When to use

- Adding or editing learning topics (`content/topics/de/*.json`)
- Adding a new slide type
- Changing `lib/content/` types, schemas, or providers
- Phase 2: `SupabaseContentProvider` implementing the same interface

## Add a new topic (no app rewrite)

1. Create `content/topics/de/<id>.json` matching schema v1
2. Run `npm run validate:content`
3. Topic appears automatically in the feed via `JsonContentProvider`

Schema docs: `content/schema/v1/README.md`

## Slide types

Implemented (registry in `lib/slides/registry.ts`):

| type | Component |
|------|-----------|
| `hook` | `HookSlide` |
| `explanation` | `ExplanationSlide` |
| `real_world` | `RealWorldSlide` |
| `scenario` | `ScenarioSlide` |
| `beginner_mistake` | `BeginnerMistakeSlide` |
| `quiz` | `QuizSlide` |

Planned: `code_read`, `code_fix`

## Add a new slide type

1. Add type to `SLIDE_TYPES` in `lib/content/types.ts` and Zod schema in `lib/content/topic.schema.ts`
2. Create `components/slides/<Name>Slide.tsx` (DaisyUI, German UI)
3. Register in `lib/slides/registry.ts` → `SLIDE_RENDERERS`
4. Update `content/schema/v1/README.md`
5. Add example slide to a topic JSON and run `npm run validate:content`

## Layer boundaries

- `lib/content/` — **no React imports**
- `components/slides/` — render only; quiz state stays local
- `app/` — loads via `getContentProvider()` (Server Components)

## ContentProvider interface

```typescript
interface ContentProvider {
  listTopics(locale?: string): Promise<Topic[]>
  getTopic(id: string, locale?: string): Promise<Topic | null>
}
```

Current: `JsonContentProvider`. Future: `SupabaseContentProvider` with identical interface.

## Validation

```bash
npm run validate:content   # Zod — all topics
npm run checks             # validate + lint + build
```
