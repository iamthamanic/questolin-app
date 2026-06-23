/**
 * Tracks per-slide quiz completion for tutor spoiler mode.
 * Location: components/tutor/SlideSessionContext.tsx
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

interface SlideSessionContextValue {
  markQuizCompleted: (slideId: string) => void;
  isQuizCompleted: (slideId: string) => boolean;
}

const SlideSessionContext = createContext<SlideSessionContextValue | null>(null);

export function SlideSessionProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const markQuizCompleted = useCallback((slideId: string) => {
    setCompleted((prev) => ({ ...prev, [slideId]: true }));
  }, []);

  const isQuizCompleted = useCallback(
    (slideId: string) => Boolean(completed[slideId]),
    [completed],
  );

  const value = useMemo(
    () => ({ markQuizCompleted, isQuizCompleted }),
    [markQuizCompleted, isQuizCompleted],
  );

  return (
    <SlideSessionContext.Provider value={value}>
      {children}
    </SlideSessionContext.Provider>
  );
}

export function useSlideSessionOptional(): SlideSessionContextValue | null {
  return useContext(SlideSessionContext);
}
