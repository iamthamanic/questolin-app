/**
 * TikTok-style vertical feed — one full-viewport panel per topic with horizontal slide deck.
 * Location: components/VerticalTopicFeed.tsx
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Topic } from "@/lib/content/types";
import { hasSeenSwipeCoach, markSwipeCoachSeen } from "@/lib/progress/onboarding";
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

function useDesktopNav(): boolean {
  const [desktop, setDesktop] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return desktop;
}

export function VerticalTopicFeed({ topics }: VerticalTopicFeedProps) {
  const startIndex = useMemo(
    () => getLastTopicIndex(topics.map((t) => t.id)),
    [topics],
  );

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [showCoach, setShowCoach] = useState(false);
  const coachStartIndex = useRef(startIndex);
  const isDesktop = useDesktopNav();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    align: "start",
    containScroll: "trimSnaps",
    watchDrag: (_emblaApi, evt) => !isInsideSlideDeck(evt.target),
    startIndex,
  });

  useEffect(() => {
    setShowCoach(topics.length > 1 && !hasSeenSwipeCoach());
  }, [topics.length]);

  const syncActiveTopic = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveIndex(index);
    const topic = topics[index];
    if (topic) {
      saveLastTopicId(topic.id);
    }
    if (showCoach && index !== coachStartIndex.current) {
      markSwipeCoachSeen();
      setShowCoach(false);
    }
  }, [emblaApi, topics, showCoach]);

  useEffect(() => {
    setActiveIndex(startIndex);
    coachStartIndex.current = startIndex;
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

      {showCoach && (
        <p className={styles.swipeHint}>
          {isDesktop
            ? "↑↓ Nächstes Thema · ←→ Nächster Slide"
            : "Wische ↑↓ für Themen · ←→ für Slides"}
        </p>
      )}
    </div>
  );
}
