import { beforeEach, describe, expect, it } from "vitest";
import { getResumeSnapshot } from "@/lib/progress/resume";
import { PROGRESS_STORAGE_KEY, saveSlideIndex } from "@/lib/progress/storage";

describe("getResumeSnapshot", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    const ls = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    };
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: ls });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: ls },
    });
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  });

  it("returns null without last topic", () => {
    expect(getResumeSnapshot({ api: 7 })).toBeNull();
  });

  it("returns slide position after save", () => {
    saveSlideIndex("api", 2, 7);
    expect(getResumeSnapshot({ api: 7 })).toEqual({
      topicId: "api",
      slideIndex: 2,
      slideCount: 7,
    });
  });
});
