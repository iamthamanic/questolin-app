/**
 * Server-side OpenAI chat completion for the tutor (no client SDK).
 * Location: lib/tutor/openai.ts
 */

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function completeTutorChat(
  messages: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("CONFIG_MISSING_OPENAI");
  }

  const model = process.env.TUTOR_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 600,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("OpenAI tutor error:", res.status, text.slice(0, 200));
    throw new Error("UPSTREAM_OPENAI");
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
