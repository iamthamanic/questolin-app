/**
 * Validates topic and collection JSON under content/.
 * Run: npm run validate:content
 */

import fs from "fs/promises";
import path from "path";
import { parseCollection } from "../lib/content/collection.schema";
import { parseLevel } from "../lib/content/level.schema";
import { parseTopic } from "../lib/content/topic.schema";

async function validateTopics(): Promise<{ ok: number; fail: number; topicIds: Set<string> }> {
  const root = path.join(process.cwd(), "content", "topics");
  const locales = await fs.readdir(root);
  let ok = 0;
  let fail = 0;
  const topicIds = new Set<string>();

  for (const locale of locales) {
    const dir = path.join(root, locale);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;

    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const label = `topics/${locale}/${file}`;
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const topic = parseTopic(JSON.parse(raw), label);
        topicIds.add(topic.id);
        console.log(`✅ ${label}`);
        ok += 1;
      } catch (error) {
        console.error(`❌ ${label}`, error);
        fail += 1;
      }
    }
  }

  return { ok, fail, topicIds };
}

async function validateCollections(topicIds: Set<string>): Promise<{ ok: number; fail: number }> {
  const root = path.join(process.cwd(), "content", "collections");
  let ok = 0;
  let fail = 0;

  let locales: string[];
  try {
    locales = await fs.readdir(root);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ok, fail };
    }
    throw error;
  }

  for (const locale of locales) {
    const dir = path.join(root, locale);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;

    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const label = `collections/${locale}/${file}`;
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const collection = parseCollection(JSON.parse(raw), label);
        for (const topicId of collection.topicIds) {
          if (!topicIds.has(topicId)) {
            throw new Error(`unknown topicId "${topicId}" in collection`);
          }
        }
        console.log(`✅ ${label}`);
        ok += 1;
      } catch (error) {
        console.error(`❌ ${label}`, error);
        fail += 1;
      }
    }
  }

  return { ok, fail };
}

async function validateLevels(topicIds: Set<string>): Promise<{ ok: number; fail: number }> {
  const root = path.join(process.cwd(), "content", "levels");
  let ok = 0;
  let fail = 0;

  let locales: string[];
  try {
    locales = await fs.readdir(root);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ok, fail };
    }
    throw error;
  }

  for (const locale of locales) {
    const dir = path.join(root, locale);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;

    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const label = `levels/${locale}/${file}`;
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const level = parseLevel(JSON.parse(raw), label);
        for (const topicId of level.topicIds) {
          if (!topicIds.has(topicId)) {
            throw new Error(`unknown topicId "${topicId}" in level`);
          }
        }
        console.log(`✅ ${label}`);
        ok += 1;
      } catch (error) {
        console.error(`❌ ${label}`, error);
        fail += 1;
      }
    }
  }

  return { ok, fail };
}

async function main() {
  const topics = await validateTopics();
  const collections = await validateCollections(topics.topicIds);
  const levels = await validateLevels(topics.topicIds);
  const fail = topics.fail + collections.fail + levels.fail;
  const ok = topics.ok + collections.ok + levels.ok;

  if (fail > 0) {
    process.exit(1);
  }
  console.log(`\n${topics.ok} topic(s), ${collections.ok} collection(s), ${levels.ok} level(s) valid (${ok} total).`);
}

main();
