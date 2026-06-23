/**
 * ContentProvider abstraction — JSON now, Supabase later.
 * Location: lib/content/contentProvider.ts
 */

import type { Collection, ContentProvider, Topic } from "./types";
import { loadCollection, loadCollections } from "./loadCollections";
import { loadTopic, loadTopics } from "./loadTopics";

export class JsonContentProvider implements ContentProvider {
  constructor(private defaultLocale = "de") {}

  async listTopics(locale?: string, collectionId?: string): Promise<Topic[]> {
    const loc = locale ?? this.defaultLocale;
    const topics = await loadTopics(loc);

    if (!collectionId) {
      return topics;
    }

    const collection = await loadCollection(collectionId, loc);
    if (!collection) {
      return topics;
    }

    const order = new Map(collection.topicIds.map((id, index) => [id, index]));
    return topics
      .filter((t) => order.has(t.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  getTopic(id: string, locale?: string): Promise<Topic | null> {
    return loadTopic(id, locale ?? this.defaultLocale);
  }

  listCollections(locale?: string): Promise<Collection[]> {
    return loadCollections(locale ?? this.defaultLocale);
  }
}

let defaultProvider: ContentProvider | null = null;

export function getContentProvider(): ContentProvider {
  if (!defaultProvider) {
    defaultProvider = new JsonContentProvider("de");
  }
  return defaultProvider;
}
