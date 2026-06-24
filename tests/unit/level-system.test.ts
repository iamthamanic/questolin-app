import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseLevel } from "@/lib/content/level.schema";
import type { Level, Topic } from "@/lib/content/types";

function createFakeStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
    _store: store,
  };
}

describe("parseLevel", () => {
  it("parses a valid level", () => {
    const level = parseLevel(
      {
        schemaVersion: 1,
        id: "level-0",
        index: 0,
        title: "Anfänger",
        description: "Grundlagen",
        locale: "de",
        topicIds: ["api", "http"],
      },
      "unit",
    );
    expect(level.id).toBe("level-0");
    expect(level.index).toBe(0);
    expect(level.topicIds).toEqual(["api", "http"]);
  });

  it("allows empty topicIds", () => {
    const level = parseLevel(
      {
        schemaVersion: 1,
        id: "level-5",
        index: 5,
        title: "Experte",
        description: "TBD",
        locale: "de",
      },
      "unit",
    );
    expect(level.topicIds).toEqual([]);
  });

  it("rejects index outside 0..5", () => {
    expect(() =>
      parseLevel(
        {
          schemaVersion: 1,
          id: "level-x",
          index: 6,
          title: "X",
          description: "X",
          locale: "de",
        },
        "unit",
      ),
    ).toThrow(/Invalid unit/);
  });

  it("rejects invalid topic id", () => {
    expect(() =>
      parseLevel(
        {
          schemaVersion: 1,
          id: "level-0",
          index: 0,
          title: "X",
          description: "X",
          locale: "de",
          topicIds: ["Not Valid"],
        },
        "unit",
      ),
    ).toThrow(/Invalid unit/);
  });
});

describe("progress storage", () => {
  let fake: ReturnType<typeof createFakeStorage>;

  beforeEach(() => {
    fake = createFakeStorage();
    vi.stubGlobal("window", {
      localStorage: fake,
    });
    vi.resetModules();
  });

  it("sets and clamps user level", async () => {
    const { setUserLevel, getUserLevel } = await import("@/lib/progress/storage");
    setUserLevel(3);
    expect(getUserLevel()).toBe(3);
    setUserLevel(10);
    expect(getUserLevel()).toBe(5);
    setUserLevel(-2);
    expect(getUserLevel()).toBe(0);
  });

  it("marks level onboarding complete", async () => {
    const { hasCompletedLevelOnboarding, markLevelOnboardingComplete } = await import(
      "@/lib/progress/storage"
    );
    expect(hasCompletedLevelOnboarding()).toBe(false);
    markLevelOnboardingComplete();
    expect(hasCompletedLevelOnboarding()).toBe(true);
  });

  it("migrates legacy v1 store to v2", async () => {
    const legacy = {
      version: 1,
      lastTopicId: "api",
      topics: {
        api: { slideIndex: 2, completedQuizSlideIds: ["q1"] },
      },
    };
    fake.setItem("questolin.progress.v1", JSON.stringify(legacy));

    const { getUserLevel, getLastTopicId } = await import("@/lib/progress/storage");
    expect(getUserLevel()).toBe(0);
    expect(getLastTopicId()).toBe("api");
    expect(fake.getItem("questolin.progress.v1")).toBeNull();
  });

  it("resets corrupted v2 store to defaults", async () => {
    fake.setItem("questolin.progress.v2", "not-json");
    const { getUserLevel } = await import("@/lib/progress/storage");
    expect(getUserLevel()).toBe(0);
  });
});

describe("level progress", () => {
  let fake: ReturnType<typeof createFakeStorage>;

  beforeEach(() => {
    fake = createFakeStorage();
    vi.stubGlobal("window", {
      localStorage: fake,
    });
    vi.resetModules();
  });

  const levels: Level[] = [
    {
      schemaVersion: 1,
      id: "level-0",
      index: 0,
      title: "L0",
      description: "L0",
      locale: "de",
      topicIds: ["api", "http"],
    },
    {
      schemaVersion: 1,
      id: "level-1",
      index: 1,
      title: "L1",
      description: "L1",
      locale: "de",
      topicIds: ["git"],
    },
  ];

  const topics: Topic[] = [
    {
      schemaVersion: 1,
      id: "api",
      title: "API",
      category: "Grundlagen",
      locale: "de",
      level: 0,
      testBlockId: "1",
      slides: [
        { id: "q1", type: "quiz", order: 0, content: { questions: [{ id: "q1", text: "Was?", options: [{ id: "a", text: "A" }], correctOptionId: "a" }] } },
      ],
    },
    {
      schemaVersion: 1,
      id: "http",
      title: "HTTP",
      category: "Grundlagen",
      locale: "de",
      level: 0,
      testBlockId: "1",
      slides: [
        { id: "q2", type: "quiz", order: 0, content: { questions: [{ id: "q2", text: "Wie?", options: [{ id: "b", text: "B" }], correctOptionId: "b" }] } },
      ],
    },
    {
      schemaVersion: 1,
      id: "git",
      title: "Git",
      category: "Grundlagen",
      locale: "de",
      level: 1,
      testBlockId: "1",
      slides: [
        { id: "q3", type: "quiz", order: 0, content: { questions: [{ id: "q3", text: "Wo?", options: [{ id: "c", text: "C" }], correctOptionId: "c" }] } },
      ],
    },
  ];

  it("computes progress per level", async () => {
    const { computeLevelProgress } = await import("@/lib/progress/levelProgress");
    const progress = computeLevelProgress(levels, topics, 0);
    expect(progress[0]).toMatchObject({ total: 2, completed: 0, isUnlocked: true, isCompleted: false });
    expect(progress[1]).toMatchObject({ total: 1, completed: 0, isUnlocked: false, isCompleted: false });
  });

  it("detects completed level", async () => {
    const { saveQuizCompleted, setUserLevel } = await import("@/lib/progress/storage");
    const { getMaxCompletedLevel } = await import("@/lib/progress/levelProgress");

    setUserLevel(0);
    saveQuizCompleted("api", "q1");
    saveQuizCompleted("http", "q2");

    expect(getMaxCompletedLevel(levels, topics)).toBe(0);
  });

  it("auto-advances to next level", async () => {
    const { saveQuizCompleted, setUserLevel, getUserLevel } = await import("@/lib/progress/storage");
    const { autoAdvanceLevel } = await import("@/lib/progress/levelProgress");

    setUserLevel(0);
    saveQuizCompleted("api", "q1");
    saveQuizCompleted("http", "q2");

    autoAdvanceLevel(levels, topics);
    expect(getUserLevel()).toBe(1);
  });
});
