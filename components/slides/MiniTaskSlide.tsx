/**
 * Mini task slide — open-ended practice prompt with optional hint and solution.
 * Location: components/slides/MiniTaskSlide.tsx
 */

"use client";

import { useState } from "react";
import type { MiniTaskContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";
import styles from "./slideContent.module.css";

export function MiniTaskSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as MiniTaskContent;
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.hint && (
        <div className={styles.miniTaskSection}>
          <button
            type="button"
            className={`btn btn-sm btn-outline ${styles.miniTaskToggle}`}
            onClick={() => setShowHint((prev) => !prev)}
          >
            {showHint ? "Hinweis ausblenden" : "Hinweis anzeigen"}
          </button>
          {showHint && <SlideSubtitle text={`Hinweis: ${content.hint}`} />}
        </div>
      )}
      {content.solution && (
        <div className={styles.miniTaskSection}>
          <button
            type="button"
            className={`btn btn-sm btn-outline ${styles.miniTaskToggle}`}
            onClick={() => setShowSolution((prev) => !prev)}
          >
            {showSolution ? "Lösung ausblenden" : "Lösung anzeigen"}
          </button>
          {showSolution && <SlideBody text={content.solution} />}
        </div>
      )}
    </SlideShell>
  );
}
