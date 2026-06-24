/** Local learning progress — topic slide index, completed quiz slide ids, user level. */

export const PROGRESS_STORAGE_KEY = "questolin.progress.v2";

export interface TopicProgress {
  slideIndex: number;
  completedQuizSlideIds: string[];
}

export interface ProgressStore {
  version: 2;
  userLevel: number;
  lastTopicId: string | null;
  topics: Record<string, TopicProgress>;
}

export const EMPTY_PROGRESS: ProgressStore = {
  version: 2,
  userLevel: 0,
  lastTopicId: null,
  topics: {},
};
