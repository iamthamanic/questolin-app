/**
 * JSON file ContentProvider — default for local development.
 * Location: lib/content/jsonContentProvider.ts
 */

import type { Collection, ContentProvider, Level, Topic } from "./types";
import { loadCollection, loadCollections } from "./loadCollections";
import { loadLevel, loadLevels } from "./loadLevels";
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

  listLevels(locale?: string): Promise<Level[]> {
    return loadLevels(locale ?? this.defaultLocale);
  }

  getLevel(id: string, locale?: string): Promise<Level | null> {
    return loadLevel(id, locale ?? this.defaultLocale);
  }
}
