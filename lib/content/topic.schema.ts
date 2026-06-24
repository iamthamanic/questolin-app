/**
 * Zod validation for Topic v1 JSON files.
 * Location: lib/content/topic.schema.ts
 */

import { z } from "zod";
import { SLIDE_TYPES } from "./types";

const quizQuestionSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["multiple_choice", "true_false"]),
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string().min(1),
  feedbackCorrect: z.string().min(1),
  feedbackWrong: z.string().min(1),
});

const hookContentSchema = z.object({
  body: z.string().min(1),
  subtitle: z.string().optional(),
});

const explanationContentSchema = hookContentSchema;

const realWorldContentSchema = z.object({
  body: z.string().min(1),
  analogy: z.string().optional(),
});

const scenarioContentSchema = hookContentSchema;

const beginnerMistakeContentSchema = z.object({
  body: z.string().min(1),
  mistake: z.string().min(1),
  whyDangerous: z.string().min(1),
  codeExample: z.string().optional(),
});

const quizContentSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1),
});

const codeReadContentSchema = z.object({
  body: z.string().min(1),
  subtitle: z.string().optional(),
  code: z.string().min(1),
  language: z.string().optional(),
});

const codeFixContentSchema = z.object({
  body: z.string().min(1),
  brokenCode: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  feedbackCorrect: z.string().min(1),
  feedbackWrong: z.string().min(1),
});

const slideSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(SLIDE_TYPES),
    order: z.number().int().min(0),
    title: z.string().optional(),
    content: z.record(z.unknown()),
  })
  .superRefine((slide, ctx) => {
    const validators: Record<string, z.ZodType> = {
      hook: hookContentSchema,
      explanation: explanationContentSchema,
      real_world: realWorldContentSchema,
      scenario: scenarioContentSchema,
      beginner_mistake: beginnerMistakeContentSchema,
      quiz: quizContentSchema,
      code_read: codeReadContentSchema,
      code_fix: codeFixContentSchema,
    };

    const validator = validators[slide.type];
    if (!validator) {
      return;
    }

    const result = validator.safeParse(slide.content);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ["content", ...issue.path],
        });
      });
    }
  });

/** Topic id / route param — same rule for JSON files and `/topic/[id]`. */
export const TOPIC_ID_PATTERN = /^[a-z0-9-]+$/;

export function isValidTopicId(id: string): boolean {
  return TOPIC_ID_PATTERN.test(id);
}

export const topicSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(TOPIC_ID_PATTERN),
  title: z.string().min(1),
  category: z.string().min(1),
  locale: z.string().regex(/^[a-z]{2}$/),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimatedMinutes: z.number().min(1).optional(),
  prerequisites: z.array(z.string()).optional(),
  slides: z.array(slideSchema).min(1),
});

export type TopicV1 = z.infer<typeof topicSchema>;

export function parseTopic(data: unknown, sourceLabel = "topic") {
  const result = topicSchema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid ${sourceLabel}: ${message}`);
  }
  return result.data;
}
