import { describe, expect, it } from "vitest";
import { parseInlineMarkdown, splitParagraphs } from "@/lib/content/markdown";
import { isValidTopicId, parseTopic } from "@/lib/content/topic.schema";

describe("isValidTopicId", () => {
  it("accepts lowercase ids with hyphens", () => {
    expect(isValidTopicId("api")).toBe(true);
    expect(isValidTopicId("frontend-backend")).toBe(true);
  });

  it("rejects invalid characters", () => {
    expect(isValidTopicId("Not_Valid!")).toBe(false);
    expect(isValidTopicId("")).toBe(false);
  });
});

describe("parseTopic", () => {
  const minimalTopic = {
    schemaVersion: 1,
    id: "test",
    title: "Test",
    category: "Grundlagen",
    locale: "de",
    slides: [
      {
        id: "hook-1",
        type: "hook",
        order: 0,
        content: { body: "Hallo" },
      },
    ],
  };

  it("parses a valid minimal topic", () => {
    const topic = parseTopic(minimalTopic, "unit");
    expect(topic.id).toBe("test");
    expect(topic.slides).toHaveLength(1);
  });

  it("rejects quiz without questions", () => {
    expect(() =>
      parseTopic(
        {
          ...minimalTopic,
          slides: [
            {
              id: "q1",
              type: "quiz",
              order: 0,
              content: { questions: [] },
            },
          ],
        },
        "unit",
      ),
    ).toThrow(/Invalid unit/);
  });

  it("rejects code_fix with missing fields", () => {
    expect(() =>
      parseTopic(
        {
          ...minimalTopic,
          slides: [
            {
              id: "cf1",
              type: "code_fix",
              order: 0,
              content: { body: "Fix", brokenCode: "x" },
            },
          ],
        },
        "unit",
      ),
    ).toThrow(/Invalid unit/);
  });
});

describe("markdown", () => {
  it("parses bold and inline code", () => {
    const segments = parseInlineMarkdown("Das ist **fett** und `code`");
    expect(segments).toEqual([
      { kind: "text", value: "Das ist " },
      { kind: "bold", value: "fett" },
      { kind: "text", value: " und " },
      { kind: "code", value: "code" },
    ]);
  });

  it("splits paragraphs on blank lines", () => {
    expect(splitParagraphs("A\n\nB")).toEqual(["A", "B"]);
  });
});
