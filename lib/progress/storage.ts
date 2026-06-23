/**
 * LocalStorage persistence for guest learning progress (no React).
 * Location: lib/progress/storage.ts
 */

import {
  EMPTY_PROGRESS,
  PROGRESS_STORAGE_KEY,
  type ProgressStore,
  type TopicProgress,
} from "./types";

function canUseStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__questolin_storage_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function readStore(): ProgressStore {
  if (!canUseStorage()) return { ...EMPTY_PROGRESS, topics: {} };
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS, topics: {} };
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed?.version !== 1 || typeof parsed.topics !== "object") {
      return { ...EMPTY_PROGRESS, topics: {} };
    }
    return {
      version: 1,
      lastTopicId: typeof parsed.lastTopicId === "string" ? parsed.lastTopicId : null,
      topics: parsed.topics,
    };
  } catch {
    return { ...EMPTY_PROGRESS, topics: {} };
  }
}

function writeStore(store: ProgressStore): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Private mode or quota — ignore
  }
}

function clampIndex(index: number, slideCount: number): number {
  if (slideCount <= 0) return 0;
  return Math.min(Math.max(0, index), slideCount - 1);
}

function getTopicProgress(topicId: string): TopicProgress {
  const store = readStore();
  const entry = store.topics[topicId];
  return {
    slideIndex: entry?.slideIndex ?? 0,
    completedQuizSlideIds: Array.isArray(entry?.completedQuizSlideIds)
      ? entry.completedQuizSlideIds.filter((id) => typeof id === "string")
      : [],
  };
}

export function getSavedSlideIndex(topicId: string, slideCount: number): number {
  return clampIndex(getTopicProgress(topicId).slideIndex, slideCount);
}

export function getCompletedQuizSlideIds(topicId: string): string[] {
  return getTopicProgress(topicId).completedQuizSlideIds;
}

export function saveSlideIndex(
  topicId: string,
  slideIndex: number,
  slideCount: number,
): void {
  const store = readStore();
  const prev = store.topics[topicId] ?? { slideIndex: 0, completedQuizSlideIds: [] };
  store.topics[topicId] = {
    ...prev,
    slideIndex: clampIndex(slideIndex, slideCount),
  };
  store.lastTopicId = topicId;
  writeStore(store);
}

export function saveQuizCompleted(topicId: string, slideId: string): void {
  const store = readStore();
  const prev = store.topics[topicId] ?? { slideIndex: 0, completedQuizSlideIds: [] };
  const ids = new Set(prev.completedQuizSlideIds);
  ids.add(slideId);
  store.topics[topicId] = {
    ...prev,
    completedQuizSlideIds: [...ids],
  };
  store.lastTopicId = topicId;
  writeStore(store);
}

export function getLastTopicId(): string | null {
  return readStore().lastTopicId;
}

export function getLastTopicIndex(topicIds: string[]): number {
  const lastId = getLastTopicId();
  if (!lastId) return 0;
  const idx = topicIds.indexOf(lastId);
  return idx >= 0 ? idx : 0;
}
