/**
 * Zod schemas for POST /api/tutor request and error responses.
 * Location: lib/tutor/schemas.ts
 */

import { z } from "zod";
import { isValidTopicId } from "@/lib/content/topic.schema";

export const tutorRequestSchema = z.object({
  topicId: z.string().min(1).refine(isValidTopicId, {
    message: "Ungültige topicId",
  }),
  slideId: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  quizCompleted: z.boolean().optional(),
});

export type TutorRequest = z.infer<typeof tutorRequestSchema>;

export type TutorErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "CONFIG_ERROR"
  | "UPSTREAM_ERROR";

export interface TutorErrorBody {
  error: {
    code: TutorErrorCode;
    message: string;
  };
}

export function tutorError(
  code: TutorErrorCode,
  message: string,
  status: number,
): Response {
  return Response.json({ error: { code, message } } satisfies TutorErrorBody, {
    status,
  });
}
