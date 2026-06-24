/**
 * Renders trusted slide body text with simple markdown (bold, code, paragraphs).
 * Location: components/slides/MarkdownBody.tsx
 */

import { parseInlineMarkdown, splitParagraphs } from "@/lib/content/markdown";
import styles from "./slideContent.module.css";

interface MarkdownBodyProps {
  text: string;
}

export function MarkdownBody({ text }: MarkdownBodyProps) {
  return (
    <>
      {splitParagraphs(text).map((block, blockIndex) => (
        <p key={blockIndex} className={styles.body}>
          {block.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {parseInlineMarkdown(line).map((segment, segmentIndex) => {
                const key = `${lineIndex}-${segmentIndex}`;
                if (segment.kind === "bold") {
                  return <strong key={key}>{segment.value}</strong>;
                }
                if (segment.kind === "code") {
                  return (
                    <code key={key} className="font-mono text-sm bg-base-300 px-1 rounded">
                      {segment.value}
                    </code>
                  );
                }
                return <span key={key}>{segment.value}</span>;
              })}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}
