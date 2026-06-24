import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getTutorLlmConfig, isTutorLlmConfigured } from "@/lib/tutor/llm";

const ENV_KEYS = [
  "TUTOR_LLM_BASE_URL",
  "TUTOR_LLM_API_KEY",
  "OLLAMA_API_KEY",
  "OPENAI_API_KEY",
  "TUTOR_MODEL",
] as const;

let savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>>;

beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = savedEnv[key];
    }
  }
});

describe("getTutorLlmConfig", () => {
  it("defaults to local Ollama without API keys", () => {
    const config = getTutorLlmConfig();
    expect(config).toEqual({
      baseUrl: "http://localhost:11434/v1",
      apiKey: "ollama",
      model: "llama3.2",
    });
    expect(isTutorLlmConfigured()).toBe(true);
  });

  it("uses OpenAI when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    const config = getTutorLlmConfig();
    expect(config).toEqual({
      baseUrl: "https://api.openai.com/v1",
      apiKey: "sk-test",
      model: "gpt-4o-mini",
    });
  });

  it("uses explicit Ollama Cloud settings", () => {
    process.env.TUTOR_LLM_BASE_URL = "https://ollama.com/v1/";
    process.env.OLLAMA_API_KEY = "cloud-key";
    process.env.TUTOR_MODEL = "llama3.2:cloud";
    const config = getTutorLlmConfig();
    expect(config).toEqual({
      baseUrl: "https://ollama.com/v1",
      apiKey: "cloud-key",
      model: "llama3.2:cloud",
    });
  });

  it("returns null when cloud base URL has no API key", () => {
    process.env.TUTOR_LLM_BASE_URL = "https://ollama.com/v1";
    expect(getTutorLlmConfig()).toBeNull();
    expect(isTutorLlmConfigured()).toBe(false);
  });
});
