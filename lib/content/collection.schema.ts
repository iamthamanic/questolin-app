/**
 * Zod schema for content collection JSON files.
 * Location: lib/content/collection.schema.ts
 */

import { z } from "zod";
import { TOPIC_ID_PATTERN } from "./topic.schema";

export const collectionSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(TOPIC_ID_PATTERN),
  title: z.string().min(1),
  description: z.string().min(1),
  locale: z.string().min(2),
  topicIds: z.array(z.string().regex(TOPIC_ID_PATTERN)).min(1),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

export function parseCollection(data: unknown, source = "collection"): CollectionInput {
  const result = collectionSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`[${source}] ${msg}`);
  }
  return result.data;
}
