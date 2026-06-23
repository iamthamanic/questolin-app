/**
 * Builds Questolin tutor context from topic + slide (for /api/tutor later).
 * Location: lib/content/tutorContext.ts
 */

import type { Slide, Topic, TutorContext } from "./types";

function slideBodyText(slide: Slide): string {
  const c = slide.content as Record<string, unknown>;
  const parts: string[] = [];

  if (slide.title) parts.push(slide.title);
  if (typeof c.body === "string") parts.push(c.body);
  if (typeof c.analogy === "string") parts.push(`Analogie: ${c.analogy}`);
  if (typeof c.mistake === "string") parts.push(`Fehler: ${c.mistake}`);
  if (typeof c.whyDangerous === "string") parts.push(`Gefahr: ${c.whyDangerous}`);
  if (typeof c.codeExample === "string") parts.push(`Code:\n${c.codeExample}`);

  return parts.join("\n\n");
}

export function buildTutorContext(
  topic: Topic,
  slide: Slide,
  options?: { quizCompleted?: boolean },
): TutorContext {
  const spoilerMode = slide.type === "quiz" && !options?.quizCompleted;

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    slideId: slide.id,
    slideType: slide.type,
    slideTitle: slide.title,
    slideBody: slideBodyText(slide),
    spoilerMode,
  };
}

export function buildTopicSummaryForTutor(topic: Topic): string {
  return topic.slides
    .map((s) => `- [${s.type}] ${s.title ?? s.id}`)
    .join("\n");
}
