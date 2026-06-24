import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  JsonContentProvider,
  resolveContentProvider,
  resetContentProviderForTests,
} from "@/lib/content/contentProvider";
import { SupabaseContentProvider } from "@/lib/content/supabaseProvider";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({})),
}));

const ENV_KEYS = [
  "CONTENT_PROVIDER",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const;

let savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>>;

beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  resetContentProviderForTests();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = savedEnv[key];
    }
  }
  resetContentProviderForTests();
});

describe("resolveContentProvider", () => {
  it("defaults to JsonContentProvider", () => {
    const provider = resolveContentProvider();
    expect(provider).toBeInstanceOf(JsonContentProvider);
  });

  it("uses Supabase when env is complete", () => {
    process.env.CONTENT_PROVIDER = "supabase";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-key";
    const provider = resolveContentProvider();
    expect(provider).toBeInstanceOf(SupabaseContentProvider);
  });

  it("falls back to JSON when supabase env is incomplete", () => {
    process.env.CONTENT_PROVIDER = "supabase";
    const provider = resolveContentProvider();
    expect(provider).toBeInstanceOf(JsonContentProvider);
  });
});
