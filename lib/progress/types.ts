/** Local learning progress — topic slide index + completed quiz slide ids only. */

export const PROGRESS_STORAGE_KEY = "questolin.progress.v1";

export interface TopicProgress {
  slideIndex: number;
  completedQuizSlideIds: string[];
}

export interface ProgressStore {
  version: 1;
  lastTopicId: string | null;
  topics: Record<string, TopicProgress>;
}

export const EMPTY_PROGRESS: ProgressStore = {
  version: 1,
  lastTopicId: null,
  topics: {},
};
