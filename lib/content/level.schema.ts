/**
 * Zod validation for Level v1 JSON files.
 * Location: lib/content/level.schema.ts
 */

import { z } from "zod";
import { TOPIC_ID_PATTERN } from "./topic.schema";

export const levelSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  index: z.number().int().min(0).max(5),
  title: z.string().min(1),
  description: z.string().min(1),
  locale: z.string().regex(/^[a-z]{2}$/),
  topicIds: z.array(z.string().regex(TOPIC_ID_PATTERN)).default([]),
});

export type LevelV1 = z.infer<typeof levelSchema>;

export function parseLevel(data: unknown, sourceLabel = "level") {
  const result = levelSchema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid ${sourceLabel}: ${message}`);
  }
  return result.data;
}
