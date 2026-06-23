/**
 * Tracks quiz completion per slide for tutor spoiler mode.
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

interface SlideQuizContextValue {
  markQuizCompleted: (slideId: string) => void;
  isQuizCompleted: (slideId: string) => boolean;
}

const SlideQuizContext = createContext<SlideQuizContextValue | null>(null);

export function SlideQuizProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const markQuizCompleted = useCallback((slideId: string) => {
    setCompletedIds((prev) => {
      if (prev.has(slideId)) return prev;
      const next = new Set(prev);
      next.add(slideId);
      return next;
    });
  }, []);

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
