/**
 * ContentProvider abstraction — JSON now, Supabase later.
 * Location: lib/content/contentProvider.ts
 */

import type { ContentProvider } from "./types";
import { JsonContentProvider } from "./jsonContentProvider";
import { createSupabaseContentProvider } from "./supabaseProvider";

export { JsonContentProvider } from "./jsonContentProvider";

/** Resolve provider from env; JSON is the safe default for local dev. */
export function resolveContentProvider(): ContentProvider {
  const mode = process.env.CONTENT_PROVIDER?.trim().toLowerCase();
  if (mode === "supabase") {
    const url = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_ANON_KEY?.trim();
    if (url && key) {
      return createSupabaseContentProvider(url, key);
    }
    console.warn(
      "[content] CONTENT_PROVIDER=supabase but SUPABASE_URL/SUPABASE_ANON_KEY missing — using JSON",
    );
  }
  return new JsonContentProvider("de");
}

let defaultProvider: ContentProvider | null = null;

export function getContentProvider(): ContentProvider {
  if (!defaultProvider) {
    defaultProvider = resolveContentProvider();
  }
  return defaultProvider;
}

/** Test helper — reset singleton between unit tests. */
export function resetContentProviderForTests(): void {
  defaultProvider = null;
}
