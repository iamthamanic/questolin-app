/**
 * Initializes Husky only when this directory is a git repository.
 * Location: scripts/prepare-husky.mjs
 */

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

if (existsSync(".git")) {
  execSync("husky", { stdio: "inherit" });
}
