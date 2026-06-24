#!/usr/bin/env bash
# Smoke test for POST /api/tutor — requires dev server + Ollama (or configured LLM).
# Usage: bash scripts/smoke-tutor.sh [base_url]

set -euo pipefail

BASE="${1:-http://localhost:3000}"
OLLAMA_URL="${TUTOR_LLM_BASE_URL:-http://localhost:11434/v1}"

echo "==> Questolin tutor smoke (base: ${BASE})"

if ! curl -sf --max-time 2 "${OLLAMA_URL%/v1}/api/tags" >/dev/null 2>&1; then
  echo "skip: Ollama not reachable at ${OLLAMA_URL} (run: ollama serve)"
  exit 0
fi

if ! curl -sf --max-time 3 "${BASE}/" >/dev/null; then
  echo "skip: dev server not running at ${BASE} (run: npm run dev)"
  exit 0
fi

RESP=$(curl -sS --max-time 120 -w "\n%{http_code}" -X POST "${BASE}/api/tutor" \
  -H "Content-Type: application/json" \
  -d '{"topicId":"api","slideId":"api-hook","message":"Was ist eine API in einem Satz?"}')

HTTP_CODE=$(echo "${RESP}" | tail -n1)
BODY=$(echo "${RESP}" | sed '$d')

if [[ "${HTTP_CODE}" == "200" ]] && echo "${BODY}" | grep -q '"reply"'; then
  echo "ok: tutor returned a reply (HTTP ${HTTP_CODE})"
  echo "${BODY}" | head -c 200
  echo "..."
  exit 0
fi

echo "fail: HTTP ${HTTP_CODE} — is Questolin running at ${BASE}? (not another app on :3000)"
echo "${BODY}" | head -c 300
exit 1
