/**
 * TikTok-style vertical feed — one full-viewport panel per topic with horizontal slide deck.
 * Location: components/VerticalTopicFeed.tsx
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Level, Topic } from "@/lib/content/types";
import { hasSeenSwipeCoach, markSwipeCoachSeen } from "@/lib/progress/onboarding";
import {
  getLastTopicIndex,
  getUserLevel,
  saveLastTopicId,
} from "@/lib/progress/storage";
import { HorizontalSlideDeck } from "./HorizontalSlideDeck";
import styles from "./feedViewport.module.css";

interface VerticalTopicFeedProps {
  topics: Topic[];
  levels?: Level[];
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

function filterTopicsByLevel(
  topics: Topic[],
  levels: Level[] | undefined,
  userLevel: number,
): Topic[] {
  if (!levels || levels.length === 0) return topics;
  const unlockedLevelIds = new Set(
    levels.filter((l) => l.index <= userLevel).map((l) => l.id),
  );
  const topicIdToMaxLevel = new Map<string, number>();
  for (const level of levels) {
    if (!unlockedLevelIds.has(level.id)) continue;
    for (const topicId of level.topicIds) {
      topicIdToMaxLevel.set(topicId, Math.max(topicIdToMaxLevel.get(topicId) ?? -1, level.index));
    }
  }
  return topics.filter((t) => topicIdToMaxLevel.has(t.id));
}

export function VerticalTopicFeed({ topics, levels }: VerticalTopicFeedProps) {
  const [userLevel, setUserLevel] = useState(0);

  useEffect(() => {
    setUserLevel(getUserLevel());
    const sync = () => setUserLevel(getUserLevel());
    window.addEventListener("storage", sync);
    window.addEventListener("questolin:level-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("questolin:level-changed", sync);
    };
  }, []);

  const visibleTopics = useMemo(
    () => filterTopicsByLevel(topics, levels, userLevel),
    [topics, levels, userLevel],
  );
  const startIndex = useMemo(
    () => getLastTopicIndex(visibleTopics.map((t) => t.id)),
    [visibleTopics],
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
    setShowCoach(visibleTopics.length > 1 && !hasSeenSwipeCoach());
  }, [visibleTopics.length]);

  const syncActiveTopic = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveIndex(index);
    const topic = visibleTopics[index];
    if (topic) {
      saveLastTopicId(topic.id);
    }
    if (showCoach && index !== coachStartIndex.current) {
      markSwipeCoachSeen();
      setShowCoach(false);
    }
  }, [emblaApi, visibleTopics, showCoach]);

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

  if (visibleTopics.length === 0) {
    return (
      <div className="alert alert-warning m-4">
        <span>Keine passenden Topics für dein Level gefunden.</span>
      </div>
    );
  }

  return (
    <div className={styles.feedRoot}>
      <div className={styles.verticalViewport} ref={emblaRef} data-vertical-feed-viewport>
        <div className={styles.verticalContainer}>
          {visibleTopics.map((topic, i) => {
            const mounted = shouldMountDeck(i, activeIndex);
            return (
              <section className={styles.verticalSlide} key={topic.id} aria-label={topic.title}>
                {mounted ? (
                  <HorizontalSlideDeck topic={topic} levels={levels} topics={visibleTopics} compact />
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
