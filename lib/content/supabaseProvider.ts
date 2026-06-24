/**
 * Supabase-backed ContentProvider — topics/collections as JSONB payloads (schema v1).
 * Location: lib/content/supabaseProvider.ts
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { parseCollection } from "./collection.schema";
import type { Collection, ContentProvider, Topic } from "./types";
import { parseTopic } from "./topic.schema";

function sortSlides(topic: Topic): Topic {
  return {
    ...topic,
    slides: [...topic.slides].sort((a, b) => a.order - b.order),
  };
}

function filterByCollection(topics: Topic[], collection: Collection): Topic[] {
  const order = new Map(collection.topicIds.map((id, index) => [id, index]));
  return topics
    .filter((t) => order.has(t.id))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export class SupabaseContentProvider implements ContentProvider {
  constructor(
    private client: SupabaseClient,
    private defaultLocale = "de",
  ) {}

  async listTopics(locale?: string, collectionId?: string): Promise<Topic[]> {
    const loc = locale ?? this.defaultLocale;
    const { data, error } = await this.client
      .from("questolin_topics")
      .select("payload")
      .eq("locale", loc);

    if (error) {
      console.error("[SupabaseContentProvider] listTopics:", error.message);
      return [];
    }

    const topics: Topic[] = [];
    for (const row of data ?? []) {
      try {
        topics.push(sortSlides(parseTopic(row.payload, "supabase") as Topic));
      } catch (err) {
        console.error("[SupabaseContentProvider] invalid topic row:", err);
      }
    }

    const sorted = topics.sort((a, b) => a.title.localeCompare(b.title, "de"));

    if (!collectionId) {
      return sorted;
    }

    const collection = await this.getCollection(collectionId, loc);
    if (!collection) {
      return sorted;
    }

    return filterByCollection(sorted, collection);
  }

  async getTopic(id: string, locale?: string): Promise<Topic | null> {
    const loc = locale ?? this.defaultLocale;
    const { data, error } = await this.client
      .from("questolin_topics")
      .select("payload")
      .eq("locale", loc)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[SupabaseContentProvider] getTopic:", error.message);
      return null;
    }

    if (!data?.payload) {
      return null;
    }

    try {
      return sortSlides(parseTopic(data.payload, `supabase:${id}`) as Topic);
    } catch (err) {
      console.error("[SupabaseContentProvider] invalid topic payload:", err);
      return null;
    }
  }

  async listCollections(locale?: string): Promise<Collection[]> {
    const loc = locale ?? this.defaultLocale;
    const { data, error } = await this.client
      .from("questolin_collections")
      .select("payload")
      .eq("locale", loc);

    if (error) {
      console.error("[SupabaseContentProvider] listCollections:", error.message);
      return [];
    }

    const collections: Collection[] = [];
    for (const row of data ?? []) {
      try {
        collections.push(
          parseCollection(row.payload, "supabase") as Collection,
        );
      } catch (err) {
        console.error("[SupabaseContentProvider] invalid collection row:", err);
      }
    }

    return collections.sort((a, b) => a.title.localeCompare(b.title, "de"));
  }

  private async getCollection(
    id: string,
    locale: string,
  ): Promise<Collection | null> {
    const { data, error } = await this.client
      .from("questolin_collections")
      .select("payload")
      .eq("locale", locale)
      .eq("id", id)
      .maybeSingle();

    if (error || !data?.payload) {
      return null;
    }

    try {
      return parseCollection(data.payload, `supabase:${id}`) as Collection;
    } catch {
      return null;
    }
  }
}

export function createSupabaseContentProvider(
  url: string,
  anonKey: string,
  locale = "de",
): SupabaseContentProvider {
  return new SupabaseContentProvider(createClient(url, anonKey), locale);
}
