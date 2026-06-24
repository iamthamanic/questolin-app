/**
 * Tracks quiz completion per slide for tutor spoiler mode + local progress.
 * Location: components/tutor/SlideQuizContext.tsx
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Level, Topic } from "@/lib/content/types";
import { autoAdvanceLevel } from "@/lib/progress/levelProgress";
import {
  getCompletedQuizSlideIds,
  saveQuizCompleted,
} from "@/lib/progress/storage";

interface SlideQuizContextValue {
  markQuizCompleted: (slideId: string) => void;
  isQuizCompleted: (slideId: string) => boolean;
}

const SlideQuizContext = createContext<SlideQuizContextValue | null>(null);

interface SlideQuizProviderProps {
  topicId: string;
  levels?: Level[];
  topics?: Topic[];
  children: ReactNode;
}

export function SlideQuizProvider({ topicId, levels, topics, children }: SlideQuizProviderProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    return new Set(getCompletedQuizSlideIds(topicId));
  });

  const markQuizCompleted = useCallback(
    (slideId: string) => {
      setCompletedIds((prev) => {
        if (prev.has(slideId)) return prev;
        const next = new Set(prev);
        next.add(slideId);
        return next;
      });
      saveQuizCompleted(topicId, slideId);
      if (levels?.length && topics?.length) {
        autoAdvanceLevel(levels, topics);
      }
    },
    [topicId, levels, topics],
  );

  const isQuizCompleted = useCallback(
    (slideId: string) => completedIds.has(slideId),
    [completedIds],
  );

  const value = useMemo(
    () => ({ markQuizCompleted, isQuizCompleted }),
    [markQuizCompleted, isQuizCompleted],
  );

  return (
    <SlideQuizContext.Provider value={value}>{children}</SlideQuizContext.Provider>
  );
}

export function useSlideQuiz(): SlideQuizContextValue | null {
  return useContext(SlideQuizContext);
}
