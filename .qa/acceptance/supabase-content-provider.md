# Feature: Supabase ContentProvider (#12)

<!-- @implement 2026-06-24 -->

## Intent
`SupabaseContentProvider` implements the same `ContentProvider` interface as `JsonContentProvider`, with JSON fallback for local dev.

## Happy Path
- [ ] `CONTENT_PROVIDER=supabase` + `SUPABASE_URL` + `SUPABASE_ANON_KEY` selects Supabase
- [ ] Default / missing env → `JsonContentProvider`
- [ ] Topics validated via existing Zod `parseTopic`
- [ ] Migration SQL + README documented
- [ ] Unit tests for provider resolution
- [ ] `npm run checks` passes

## Edge Cases
- [ ] Supabase env incomplete → warn + JSON fallback
- [ ] Invalid row payload → skip row, log error

## Implementation Notes
- `JsonContentProvider` extracted; `SupabaseContentProvider` reads `questolin_topics` / `questolin_collections` JSONB
- `CONTENT_PROVIDER=supabase` + env vars; incomplete env → JSON fallback with warning
- Migration SQL: `docs/supabase-content.md`
- Unit tests: `tests/unit/content-provider.test.ts`
