# Feature: Tutor LLM — Ollama (lokal/Cloud) + OpenAI-kompatibel

<!-- @implement 2026-06-23 -->

## Intent
Replace hardcoded OpenAI tutor backend with configurable OpenAI-compatible LLM (Ollama local/cloud default, OpenAI still supported).

## Happy Path
- [ ] `TUTOR_LLM_BASE_URL` + `TUTOR_LLM_API_KEY` (or `OLLAMA_API_KEY`) drive `/api/tutor`
- [ ] Local Ollama default: `http://localhost:11434/v1`, model `llama3.2`
- [ ] Ollama Cloud: `https://ollama.com/v1` + API key
- [ ] Legacy `OPENAI_API_KEY` still works (OpenAI base URL)
- [ ] `.env.example` + README document vars
- [ ] `npm run checks` passes

## Edge Cases
- [ ] Missing API key on non-localhost → 503 CONFIG_ERROR
- [ ] Upstream failure → 502 with German message

## Regression
- [ ] Chat UI unchanged; rate limit + spoiler logic unchanged

## Implementation Notes
- `lib/tutor/openai.ts` → `lib/tutor/llm.ts` with `getTutorLlmConfig()`, `isTutorLlmConfigured()`, `completeTutorChat()`
- Default: local Ollama (`localhost:11434`, dummy key `ollama`, model `llama3.2`)
- Backward compat: `OPENAI_API_KEY` still selects OpenAI base URL + `gpt-4o-mini`
- Unit tests: `tests/unit/tutor-llm.test.ts` (4 cases)
- Docs: `.env.example`, README env table, PRD row updated
