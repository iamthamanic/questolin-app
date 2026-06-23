/**
 * Beginner mistake slide — common error and why it is dangerous.
 * Location: components/slides/BeginnerMistakeSlide.tsx
 */

import type { BeginnerMistakeContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell } from "./SlideShell";
import styles from "./slideContent.module.css";

export function BeginnerMistakeSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as BeginnerMistakeContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      <div className={styles.mistakeBox}>
        <p>
          <strong>Typischer Fehler:</strong> {content.mistake}
        </p>
        <p className="mt-2">
          <strong>Warum gefährlich:</strong> {content.whyDangerous}
        </p>
      </div>
      {content.codeExample && (
        <pre className={styles.code}>
          <code>{content.codeExample}</code>
        </pre>
      )}
    </SlideShell>
  );
}
