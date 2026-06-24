/**
 * Mastery check slide — "How do I know I understood it?" self-check list.
 * Location: components/slides/MasteryCheckSlide.tsx
 */

import type { MasteryCheckContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";
import styles from "./slideContent.module.css";

export function MasteryCheckSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as MasteryCheckContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
      {content.checklist && content.checklist.length > 0 && (
        <ul className={styles.masteryList}>
          {content.checklist.map((item) => (
            <li key={item} className={styles.masteryItem}>
              <span className={styles.masteryBullet}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </SlideShell>
  );
}
