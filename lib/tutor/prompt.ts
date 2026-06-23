/**
 * System prompt for Questolin KI-Tutor from TutorContext.
 * Location: lib/tutor/prompt.ts
 */

import type { Topic, TutorContext } from "@/lib/content/types";
import { buildTopicSummaryForTutor } from "@/lib/content/tutorContext";

export function buildTutorMessages(
  context: TutorContext,
  topic: Topic,
  userMessage: string,
): { role: "system" | "user"; content: string }[] {
  const spoilerRules = context.spoilerMode
    ? `SPOILER-SCHUTZ AKTIV: Der Nutzer ist auf einer Quiz-Slide und hat das Quiz noch nicht abgeschlossen.
- Nenne NIEMALS die richtige Quiz-Antwort oder Lösungen.
- Erkläre Konzepte allgemein und stelle ggf. Rückfragen.`
    : `Der Nutzer darf Quiz-Inhalte besprechen (Quiz abgeschlossen oder keine Quiz-Slide).`;

  const system = `Du bist Questolin, ein freundlicher IT-Lern-Tutor für Anfänger. Antworte auf Deutsch, kurz und verständlich (max. 3 Absätze).

Thema: ${context.topicTitle}
Aktuelle Slide (${context.slideType}): ${context.slideTitle ?? context.slideId}

Slide-Inhalt:
${context.slideBody}

Überblick aller Slides im Topic:
${buildTopicSummaryForTutor(topic)}

${spoilerRules}

Keine Halluzinationen über Inhalte außerhalb des Topics. Bei Off-Topic: höflich zum Lerninhalt zurückführen.`;

  return [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];
}
