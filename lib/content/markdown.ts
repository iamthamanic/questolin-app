/**
 * Minimal safe inline markdown — bold and code only (no HTML).
 * Location: lib/content/markdown.ts
 */

export type MarkdownSegment =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "code"; value: string };

const INLINE_PATTERN = /(\*\*[^*\n]+\*\*|`[^`\n]+`)/g;

export function splitParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((block) => block.length > 0);
}

export function parseInlineMarkdown(line: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(INLINE_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ kind: "text", value: line.slice(lastIndex, index) });
    }

    if (token.startsWith("**")) {
      segments.push({ kind: "bold", value: token.slice(2, -2) });
    } else {
      segments.push({ kind: "code", value: token.slice(1, -1) });
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) {
    segments.push({ kind: "text", value: line.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", value: line }];
}
