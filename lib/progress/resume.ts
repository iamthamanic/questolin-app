/**
 * Resume snapshot for Home Hub (client-safe, no React).
 * Location: lib/progress/resume.ts
 */

import { getLastTopicId, getSavedSlideIndex } from "./storage";

export interface ResumeSnapshot {
  topicId: string;
  slideIndex: number;
  slideCount: number;
}

/**
 * Last topic slide position for Home „Weitermachen“ CTA.
 * `slideCounts` maps topic id → deck length (from server).
 */
export function getResumeSnapshot(
  slideCounts: Record<string, number>,
): ResumeSnapshot | null {
  const topicId = getLastTopicId();
  if (!topicId) return null;

  const slideCount = slideCounts[topicId];
  if (!slideCount || slideCount < 1) return null;

  return {
    topicId,
    slideIndex: getSavedSlideIndex(topicId, slideCount),
    slideCount,
  };
}
