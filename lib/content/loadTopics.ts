/**
 * Loads topic JSON from content/topics/<locale>/.
 * Location: lib/content/loadTopics.ts
 */

import fs from "fs/promises";
import path from "path";
import type { Topic } from "./types";
import { isValidTopicId, parseTopic } from "./topic.schema";

const CONTENT_ROOT = path.join(process.cwd(), "content", "topics");

function sortSlides(topic: Topic): Topic {
  return {
    ...topic,
    slides: [...topic.slides].sort((a, b) => a.order - b.order),
  };
}

export async function loadTopics(locale = "de"): Promise<Topic[]> {
  const dir = path.join(CONTENT_ROOT, locale);
  let entries: string[];

  try {
    entries = await fs.readdir(dir);
  } catch {
    console.error(`[loadTopics] Missing directory: ${dir}`);
    return [];
  }

  const jsonFiles = entries.filter((name) => name.endsWith(".json"));
  const topics: Topic[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(dir, file);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(raw) as unknown;
      const topic = parseTopic(data, file) as Topic;
      topics.push(sortSlides(topic));
    } catch (error) {
      console.error(`[loadTopics] Failed to load ${file}:`, error);
    }
  }

  return topics.sort((a, b) => a.title.localeCompare(b.title, "de"));
}

export async function loadTopic(
  id: string,
  locale = "de",
): Promise<Topic | null> {
  if (!isValidTopicId(id)) {
    return null;
  }

  const filePath = path.join(CONTENT_ROOT, locale, `${id}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    return sortSlides(parseTopic(data, `${id}.json`) as Topic);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    console.error(`[loadTopic] Failed to load ${id}:`, error);
    return null;
  }
}
