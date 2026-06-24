# Supabase Content Layer

Migrate Questolin topics from JSON files to Supabase Postgres while keeping schema v1 payloads.

## Env

```bash
CONTENT_PROVIDER=supabase   # default: json (local files)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

If `CONTENT_PROVIDER=supabase` but env vars are missing, the app **falls back to JSON** and logs a warning.

## Schema (≈ JSON v1)

Run in Supabase SQL editor:

```sql
create table if not exists questolin_topics (
  id text not null,
  locale text not null default 'de',
  payload jsonb not null,
  primary key (id, locale)
);

create table if not exists questolin_collections (
  id text not null,
  locale text not null default 'de',
  payload jsonb not null,
  primary key (id, locale)
);

create index if not exists questolin_topics_locale_idx on questolin_topics (locale);
create index if not exists questolin_collections_locale_idx on questolin_collections (locale);
```

Each `payload` is the full validated Topic/Collection JSON (same shape as `content/topics/de/*.json`).

## Seed from local JSON (example)

```bash
# Export one topic (manual or script) — payload = entire file contents
# insert into questolin_topics (id, locale, payload)
# values ('api', 'de', '<json>'::jsonb);
```

A future script can bulk-import `content/topics/de/*.json`.

## RLS (production)

Enable Row Level Security and allow `select` for `anon` on read-only learning content. Admin writes stay out of scope for this ticket.

## Code

- `lib/content/jsonContentProvider.ts` — local default
- `lib/content/supabaseProvider.ts` — Supabase implementation
- `lib/content/contentProvider.ts` — `getContentProvider()` factory
