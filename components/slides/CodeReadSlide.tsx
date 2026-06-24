/**
 * Code read slide — show snippet and explanation.
 * Location: components/slides/CodeReadSlide.tsx
 */

import type { CodeReadContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";
import styles from "./slideContent.module.css";

export function CodeReadSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as CodeReadContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
      <pre className={styles.code}>
        <code>{content.code}</code>
      </pre>
    </SlideShell>
  );
}
