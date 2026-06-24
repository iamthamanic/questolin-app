/**
 * Computes level completion from topics, level definitions and stored progress.
 * Location: lib/progress/levelProgress.ts
 */

import type { Level, Topic } from "@/lib/content/types";
import { getCompletedQuizSlideIds, getUserLevel, maybeAdvanceLevel } from "./storage";

export interface LevelProgress {
  level: Level;
  total: number;
  completed: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export function isTopicQuizCompleted(topic: Topic): boolean {
  const completed = getCompletedQuizSlideIds(topic.id);
  const quizSlides = topic.slides.filter((s) => s.type === "quiz");
  if (quizSlides.length === 0) return false;
  return quizSlides.every((s) => completed.includes(s.id));
}

export function computeLevelProgress(
  levels: Level[],
  topics: Topic[],
  overrideUserLevel?: number,
): LevelProgress[] {
  const userLevel = overrideUserLevel ?? getUserLevel();
  const topicsById = Object.fromEntries(topics.map((t) => [t.id, t]));

  return levels.map((level) => {
    const levelTopics = level.topicIds
      .map((id) => topicsById[id])
      .filter(Boolean) as Topic[];
    const completed = levelTopics.filter(isTopicQuizCompleted).length;
    const isCompleted = levelTopics.length > 0 && completed === levelTopics.length;
    const isUnlocked = level.index <= userLevel;

    return {
      level,
      total: levelTopics.length,
      completed,
      isUnlocked,
      isCompleted,
    };
  });
}

export function getMaxCompletedLevel(levels: Level[], topics: Topic[]): number {
  const progress = computeLevelProgress(levels, topics);
  return progress.reduce((max, p) => (p.isCompleted ? Math.max(max, p.level.index) : max), -1);
}

export function autoAdvanceLevel(levels: Level[], topics: Topic[]): number {
  const maxCompleted = getMaxCompletedLevel(levels, topics);
  maybeAdvanceLevel(maxCompleted);
  return Math.max(getUserLevel(), maxCompleted + 1);
}
