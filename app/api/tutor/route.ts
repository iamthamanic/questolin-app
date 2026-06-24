/**
 * POST /api/tutor — Questolin KI-Tutor (OpenAI-compatible LLM, spoiler-safe).
 * Location: app/api/tutor/route.ts
 */

import { getContentProvider } from "@/lib/content/contentProvider";
import { buildTutorContext } from "@/lib/content/tutorContext";
import { completeTutorChat, isTutorLlmConfigured } from "@/lib/tutor/llm";
import { buildTutorMessages } from "@/lib/tutor/prompt";
import {
  checkRateLimit,
  getClientIp,
  getDailyLimit,
} from "@/lib/tutor/rateLimit";
import { tutorError, tutorRequestSchema } from "@/lib/tutor/schemas";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return tutorError(
      "VALIDATION_ERROR",
      "Ungültiger JSON-Body.",
      400,
    );
  }

  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Ungültige Anfragedaten.";
    return tutorError("VALIDATION_ERROR", message, 400);
  }

  const { topicId, slideId, message, quizCompleted } = parsed.data;

  const ip = getClientIp(request);
  const limit = getDailyLimit();
  const rate = checkRateLimit(ip, limit);
  if (!rate.allowed) {
    return tutorError(
      "RATE_LIMIT",
      `Tageslimit erreicht (${limit} Anfragen). Bitte morgen erneut versuchen.`,
      429,
    );
  }

  if (!isTutorLlmConfigured()) {
    return tutorError(
      "CONFIG_ERROR",
      "KI-Tutor ist nicht konfiguriert (TUTOR_LLM_API_KEY, OLLAMA_API_KEY oder OPENAI_API_KEY fehlt).",
      503,
    );
  }

  const provider = getContentProvider();
  const topic = await provider.getTopic(topicId);
  if (!topic) {
    return tutorError(
      "NOT_FOUND",
      "Thema nicht gefunden.",
      404,
    );
  }

  const slide = topic.slides.find((s) => s.id === slideId);
  if (!slide) {
    return tutorError(
      "NOT_FOUND",
      "Slide nicht gefunden.",
      404,
    );
  }

  const context = buildTutorContext(topic, slide, { quizCompleted });
  const messages = buildTutorMessages(context, topic, message);

  try {
    const reply = await completeTutorChat(messages);
    return Response.json(
      { reply },
      {
        headers: {
          "X-RateLimit-Remaining": String(rate.remaining),
        },
      },
    );
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "CONFIG_MISSING_LLM") {
      return tutorError(
        "CONFIG_ERROR",
        "KI-Tutor ist nicht konfiguriert.",
        503,
      );
    }
    return tutorError(
      "UPSTREAM_ERROR",
      "Der Tutor ist gerade nicht erreichbar. Bitte später erneut versuchen.",
      502,
    );
  }
}
