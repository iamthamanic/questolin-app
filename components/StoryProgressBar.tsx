/**
 * Instagram/TikTok-style segmented progress for slide decks.
 * Location: components/StoryProgressBar.tsx
 */

import styles from "./storyProgress.module.css";

interface StoryProgressBarProps {
  slideCount: number;
  slideIndex: number;
}

export function StoryProgressBar({ slideCount, slideIndex }: StoryProgressBarProps) {
  if (slideCount <= 0) return null;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={slideCount}
      aria-valuenow={slideIndex + 1}
      aria-label={`Slide ${slideIndex + 1} von ${slideCount}`}
    >
      {Array.from({ length: slideCount }, (_, i) => (
        <div className={styles.segment} key={i} data-story-segment>
          <div
            className={styles.segmentFill}
            data-active={i <= slideIndex ? "true" : "false"}
          />
        </div>
      ))}
    </div>
  );
}
