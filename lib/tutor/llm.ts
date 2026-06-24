/**
 * OpenAI-compatible chat completion for the tutor (Ollama local/cloud, OpenAI).
 * Location: lib/tutor/llm.ts
 */

export type TutorChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface TutorLlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function isLocalOllamaBaseUrl(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Resolve tutor LLM settings from env (Ollama default, OpenAI backward compatible). */
export function getTutorLlmConfig(): TutorLlmConfig | null {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const explicitKey =
    process.env.TUTOR_LLM_API_KEY?.trim() ||
    process.env.OLLAMA_API_KEY?.trim() ||
    openAiKey;

  const explicitBase = process.env.TUTOR_LLM_BASE_URL?.trim();

  let baseUrl: string;
  if (explicitBase) {
    baseUrl = trimTrailingSlash(explicitBase);
  } else if (openAiKey) {
    baseUrl = "https://api.openai.com/v1";
  } else {
    baseUrl = "http://localhost:11434/v1";
  }

  let apiKey = explicitKey;
  if (!apiKey && isLocalOllamaBaseUrl(baseUrl)) {
    apiKey = "ollama";
  }
  if (!apiKey) {
    return null;
  }

  const model =
    process.env.TUTOR_MODEL?.trim() ||
    (baseUrl.includes("api.openai.com") ? "gpt-4o-mini" : "llama3.2");

  return { baseUrl, apiKey, model };
}

export function isTutorLlmConfigured(): boolean {
  return getTutorLlmConfig() !== null;
}

export async function completeTutorChat(
  messages: TutorChatMessage[],
): Promise<string> {
  const config = getTutorLlmConfig();
  if (!config) {
    throw new Error("CONFIG_MISSING_LLM");
  }

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 600,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      "Tutor LLM error:",
      config.baseUrl,
      res.status,
      text.slice(0, 200),
    );
    throw new Error("UPSTREAM_LLM");
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("UPSTREAM_EMPTY");
  }

  return content;
}
