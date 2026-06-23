/**
 * Horizontal Embla slide deck for one topic — shared by feed panels and /topic/[id].
 * Location: components/HorizontalSlideDeck.tsx
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Topic } from "@/lib/content/types";
import { SlideRenderer } from "./SlideRenderer";
import styles from "./feedViewport.module.css";

interface HorizontalSlideDeckProps {
  topic: Topic;
  compact?: boolean;
}

export function HorizontalSlideDeck({ topic, compact = false }: HorizontalSlideDeckProps) {
  const slides = topic.slides;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncIndex();
    emblaApi.on("select", syncIndex);
    emblaApi.on("reInit", syncIndex);
    return () => {
      emblaApi.off("select", syncIndex);
      emblaApi.off("reInit", syncIndex);
    };
  }, [emblaApi, syncIndex]);

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  const atStart = index === 0;
  const atEnd = index === slides.length - 1;

  return (
    <div className="flex flex-col flex-1 min-h-0" data-slide-deck>
      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}: ${s.title ?? s.type}`}
            aria-current={i === index ? "step" : undefined}
            className={`${styles.dot} ${i === index ? styles.dotActive : styles.dotIdle}`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>

      <div className={styles.horizontalViewport} ref={emblaRef}>
        <div className={styles.horizontalContainer}>
          {slides.map((slide) => (
            <div className={styles.horizontalSlide} key={slide.id}>
              <SlideRenderer slide={slide} topicTitle={compact ? undefined : topic.title} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.navRow}>
        <button type="button" className="btn btn-ghost btn-sm" disabled={atStart} onClick={goPrev}>
          Zurück
        </button>
        <span className={styles.topicCounter}>
          {index + 1} / {slides.length}
        </span>
        <button type="button" className="btn btn-primary btn-sm" disabled={atEnd} onClick={goNext}>
          Weiter
        </button>
      </div>
    </div>
  );
}
