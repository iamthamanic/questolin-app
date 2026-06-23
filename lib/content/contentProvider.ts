/**
 * ContentProvider abstraction — JSON now, Supabase later.
 * Location: lib/content/contentProvider.ts
 */

import type { ContentProvider, Topic } from "./types";
import { loadTopic, loadTopics } from "./loadTopics";

export class JsonContentProvider implements ContentProvider {
  constructor(private defaultLocale = "de") {}

  listTopics(locale?: string): Promise<Topic[]> {
    return loadTopics(locale ?? this.defaultLocale);
  }

  getTopic(id: string, locale?: string): Promise<Topic | null> {
    return loadTopic(id, locale ?? this.defaultLocale);
  }
}

let defaultProvider: ContentProvider | null = null;

export function getContentProvider(): ContentProvider {
  if (!defaultProvider) {
    defaultProvider = new JsonContentProvider("de");
  }
  return defaultProvider;
}
