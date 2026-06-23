/**
 * TikTok-style vertical feed — one full-viewport panel per topic with horizontal slide deck.
 * Location: components/VerticalTopicFeed.tsx
 */

"use client";

import { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Topic } from "@/lib/content/types";
import { getLastTopicIndex } from "@/lib/progress/storage";
import { HorizontalSlideDeck } from "./HorizontalSlideDeck";
import styles from "./feedViewport.module.css";

interface VerticalTopicFeedProps {
  topics: Topic[];
}

function isInsideSlideDeck(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("[data-slide-deck]"));
}

export function VerticalTopicFeed({ topics }: VerticalTopicFeedProps) {
  const startIndex = useMemo(
    () => getLastTopicIndex(topics.map((t) => t.id)),
    [topics],
  );

  const [emblaRef] = useEmblaCarousel({
    axis: "y",
    align: "start",
    containScroll: "trimSnaps",
    watchDrag: (_emblaApi, evt) => !isInsideSlideDeck(evt.target),
    startIndex,
  });

  if (topics.length === 0) {
    return (
      <div className="alert alert-warning m-4">
        <span>Keine Topics in content/topics/de/ gefunden.</span>
      </div>
    );
  }

  return (
    <div className={styles.feedRoot}>
      <div className={styles.verticalViewport} ref={emblaRef}>
        <div className={styles.verticalContainer}>
          {topics.map((topic, i) => (
            <section className={styles.verticalSlide} key={topic.id} aria-label={topic.title}>
              <header className={styles.panelHeader}>
                <p className="text-sm text-primary font-medium">Questolin</p>
                <h1 className="text-xl font-bold leading-tight mt-0.5">{topic.title}</h1>
                <p className={styles.panelMeta}>
                  {topic.category}
                  {topic.estimatedMinutes ? ` · ~${topic.estimatedMinutes} Min` : ""}
                  {topics.length > 1 ? ` · Thema ${i + 1}/${topics.length}` : ""}
                </p>
              </header>

              <HorizontalSlideDeck topic={topic} compact />
            </section>
          ))}
        </div>
      </div>

      {topics.length > 1 && (
        <p className={styles.swipeHint}>↑↓ Nächstes Thema · ←→ Nächster Slide</p>
      )}
    </div>
  );
}
