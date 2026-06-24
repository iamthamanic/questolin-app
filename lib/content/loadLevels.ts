/**
 * Loads level JSON from content/levels/<locale>/.
 * Location: lib/content/loadLevels.ts
 */

import fs from "fs/promises";
import path from "path";
import type { Level } from "./types";
import { parseLevel } from "./level.schema";

const LEVELS_ROOT = path.join(process.cwd(), "content", "levels");

export async function loadLevels(locale = "de"): Promise<Level[]> {
  const dir = path.join(LEVELS_ROOT, locale);
  let files: string[];

  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const levels: Level[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const data = JSON.parse(raw) as unknown;
    levels.push(parseLevel(data, `${locale}/${file}`) as Level);
  }

  return levels.sort((a, b) => a.index - b.index);
}

export async function loadLevel(
  id: string,
  locale = "de",
): Promise<Level | null> {
  const levels = await loadLevels(locale);
  return levels.find((l) => l.id === id) ?? null;
}

export async function loadTopicsByLevel(
  levelIndex: number,
  locale = "de",
): Promise<Level | null> {
  const levels = await loadLevels(locale);
  return levels.find((l) => l.index === levelIndex) ?? null;
}
