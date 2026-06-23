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
  children: ReactNode;
}

export function SlideQuizProvider({ topicId, children }: SlideQuizProviderProps) {
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
    },
    [topicId],
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
