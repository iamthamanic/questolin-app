/**
 * Real-world analogy slide — everyday comparison.
 * Location: components/slides/RealWorldSlide.tsx
 */

import type { RealWorldContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell } from "./SlideShell";
import styles from "./slideContent.module.css";

export function RealWorldSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as RealWorldContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.analogy && (
        <div className={styles.analogy}>
          <strong>Merksatz:</strong> {content.analogy}
        </div>
      )}
    </SlideShell>
  );
}
