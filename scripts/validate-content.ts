/**
 * Validates all topic JSON files under content/topics/.
 * Run: npm run validate:content
 */

import fs from "fs/promises";
import path from "path";
import { parseTopic } from "../lib/content/topic.schema";

async function main() {
  const root = path.join(process.cwd(), "content", "topics");
  const locales = await fs.readdir(root);
  let ok = 0;
  let fail = 0;

  for (const locale of locales) {
    const dir = path.join(root, locale);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;

    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        parseTopic(JSON.parse(raw), `${locale}/${file}`);
        console.log(`✅ ${locale}/${file}`);
        ok += 1;
      } catch (error) {
        console.error(`❌ ${locale}/${file}`, error);
        fail += 1;
      }
    }
  }

  if (fail > 0) {
    process.exit(1);
  }
  console.log(`\n${ok} topic(s) valid.`);
}

main();
