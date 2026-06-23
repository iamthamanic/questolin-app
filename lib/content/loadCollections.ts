/**
 * Loads collection JSON from content/collections/<locale>/.
 * Location: lib/content/loadCollections.ts
 */

import fs from "fs/promises";
import path from "path";
import type { Collection } from "./types";
import { parseCollection } from "./collection.schema";

const COLLECTIONS_ROOT = path.join(process.cwd(), "content", "collections");

export async function loadCollections(locale = "de"): Promise<Collection[]> {
  const dir = path.join(COLLECTIONS_ROOT, locale);
  let files: string[];

  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const collections: Collection[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const data = JSON.parse(raw) as unknown;
    collections.push(parseCollection(data, `${locale}/${file}`) as Collection);
  }

  return collections.sort((a, b) => a.title.localeCompare(b.title, "de"));
}

export async function loadCollection(
  id: string,
  locale = "de",
): Promise<Collection | null> {
  const collections = await loadCollections(locale);
  return collections.find((c) => c.id === id) ?? null;
}
