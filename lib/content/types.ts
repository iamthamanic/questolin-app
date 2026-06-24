/**
 * Questolin content types — mirrors content/schema/v1.
 * Location: lib/content/types.ts
 */

export const SLIDE_TYPES = [
  "hook",
  "explanation",
  "real_world",
  "scenario",
  "beginner_mistake",
  "quiz",
  "code_read",
  "code_fix",
  "mastery_check",
  "mini_task",
] as const;

export type SlideType = (typeof SLIDE_TYPES)[number];

export type QuizQuestionKind = "multiple_choice" | "true_false";

export interface QuizQuestion {
  id: string;
  kind: QuizQuestionKind;
  question: string;
  options: string[];
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface HookContent {
  body: string;
  subtitle?: string;
}

export interface ExplanationContent {
  body: string;
  subtitle?: string;
}

export interface RealWorldContent {
  body: string;
  analogy?: string;
}

export interface ScenarioContent {
  body: string;
  subtitle?: string;
}

export interface BeginnerMistakeContent {
  body: string;
  mistake: string;
  whyDangerous: string;
  codeExample?: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface CodeReadContent {
  body: string;
  subtitle?: string;
  code: string;
  language?: string;
}

export interface CodeFixContent {
  body: string;
  brokenCode: string;
  options: string[];
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface MasteryCheckContent {
  body: string;
  subtitle?: string;
  checklist?: string[];
}

export interface MiniTaskContent {
  body: string;
  hint?: string;
  solution?: string;
}

export type SlideContent =
  | HookContent
  | ExplanationContent
  | RealWorldContent
  | ScenarioContent
  | BeginnerMistakeContent
  | QuizContent
  | CodeReadContent
  | CodeFixContent
  | MasteryCheckContent
  | MiniTaskContent
  | Record<string, unknown>;

export interface Slide {
  id: string;
  type: SlideType;
  order: number;
  title?: string;
  content: SlideContent;
}

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export interface Topic {
  schemaVersion: 1;
  id: string;
  title: string;
  category: string;
  locale: string;
  tags?: string[];
  difficulty?: TopicDifficulty;
  estimatedMinutes?: number;
  prerequisites?: string[];
  level?: number;
  testBlockId?: string;
  slides: Slide[];
}

export interface Collection {
  schemaVersion: 1;
  id: string;
  title: string;
  description: string;
  locale: string;
  topicIds: string[];
}

export interface Level {
  schemaVersion: 1;
  id: string;
  index: number;
  title: string;
  description: string;
  locale: string;
  topicIds: string[];
}

export interface ContentProvider {
  listTopics(locale?: string, collectionId?: string): Promise<Topic[]>;
  getTopic(id: string, locale?: string): Promise<Topic | null>;
  listCollections?(locale?: string): Promise<Collection[]>;
  listLevels?(locale?: string): Promise<Level[]>;
  getLevel?(id: string, locale?: string): Promise<Level | null>;
}

export interface TutorContext {
  topicId: string;
  topicTitle: string;
  slideId: string;
  slideType: SlideType;
  slideTitle?: string;
  slideBody: string;
  spoilerMode: boolean;
}
