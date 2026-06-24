/**
 * Hook slide — opening question to spark curiosity.
 * Location: components/slides/HookSlide.tsx
 */

"use client";

import type { HookContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { useSlideImmersive } from "./SlideImmersiveContext";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";
import styles from "./slideContent.module.css";

const GENERIC_HOOK_TITLE = "Die Frage";

export function HookSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as HookContent;
  const immersive = useSlideImmersive();

  if (immersive) {
    const showTitle =
      slide.title && slide.title !== GENERIC_HOOK_TITLE ? slide.title : null;

    return (
      <article className={styles.hookImmersive}>
        {showTitle && <p className={styles.hookEyebrow}>{showTitle}</p>}
        <div className={styles.hookHero}>
          <SlideBody text={content.body} className={styles.hookBody} />
        </div>
        {content.subtitle && (
          <p className={styles.hookCaption}>{content.subtitle}</p>
        )}
      </article>
    );
  }

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
    </SlideShell>
  );
}
