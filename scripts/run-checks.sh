#!/usr/bin/env bash
# Questolin — local check runner (npm run checks, Husky pre-push, CI)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> validate:content"
npm run validate:content

echo "==> test:unit"
npm run test:unit

echo "==> lint"
npm run lint

echo "==> build"
npm run build

echo "All checks passed."
