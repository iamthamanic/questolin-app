/**
 * TikTok-style vertical feed — one full-viewport panel per topic with horizontal slide deck.
 * Location: components/VerticalTopicFeed.tsx
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Topic } from "@/lib/content/types";
import { getLastTopicIndex, saveLastTopicId } from "@/lib/progress/storage";
import { HorizontalSlideDeck } from "./HorizontalSlideDeck";
import styles from "./feedViewport.module.css";

interface VerticalTopicFeedProps {
  topics: Topic[];
}

/** How many topic panels above/below the active one keep a mounted slide deck. */
const MOUNT_RADIUS = 1;

function isInsideSlideDeck(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("[data-slide-deck]"));
}

function shouldMountDeck(topicIndex: number, activeIndex: number): boolean {
  return Math.abs(topicIndex - activeIndex) <= MOUNT_RADIUS;
}

export function VerticalTopicFeed({ topics }: VerticalTopicFeedProps) {
  const startIndex = useMemo(
    () => getLastTopicIndex(topics.map((t) => t.id)),
    [topics],
  );

  const [activeIndex, setActiveIndex] = useState(startIndex);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    align: "start",
    containScroll: "trimSnaps",
    watchDrag: (_emblaApi, evt) => !isInsideSlideDeck(evt.target),
    startIndex,
  });

  const syncActiveTopic = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveIndex(index);
    const topic = topics[index];
    if (topic) {
      saveLastTopicId(topic.id);
    }
  }, [emblaApi, topics]);

  useEffect(() => {
    setActiveIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    syncActiveTopic();
    emblaApi.on("select", syncActiveTopic);
    emblaApi.on("reInit", syncActiveTopic);
    return () => {
      emblaApi.off("select", syncActiveTopic);
      emblaApi.off("reInit", syncActiveTopic);
    };
  }, [emblaApi, syncActiveTopic]);

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
          {topics.map((topic, i) => {
            const mounted = shouldMountDeck(i, activeIndex);
            return (
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

                {mounted ? (
                  <HorizontalSlideDeck topic={topic} compact />
                ) : (
                  <div className={styles.deckPlaceholder} aria-hidden />
                )}
              </section>
            );
          })}
        </div>
      </div>

      {topics.length > 1 && (
        <p className={styles.swipeHint}>↑↓ Nächstes Thema · ←→ Nächster Slide</p>
      )}
    </div>
  );
}
