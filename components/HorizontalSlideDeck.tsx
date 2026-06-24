/**
 * Horizontal Embla slide deck for one topic — shared by feed panels and /topic/[id].
 * Location: components/HorizontalSlideDeck.tsx
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Topic } from "@/lib/content/types";
import { getSavedSlideIndex, saveSlideIndex } from "@/lib/progress/storage";
import { SlideQuizProvider } from "@/components/tutor/SlideQuizContext";
import { QuestolinTutorDock } from "@/components/tutor/QuestolinTutorDock";
import { FeedChrome } from "./FeedChrome";
import { SlideRenderer } from "./SlideRenderer";
import { SlideImmersiveProvider } from "./slides/SlideImmersiveContext";
import styles from "./feedViewport.module.css";

interface HorizontalSlideDeckProps {
  topic: Topic;
  compact?: boolean;
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

export function HorizontalSlideDeck({ topic, compact = false }: HorizontalSlideDeckProps) {
  const showDesktopNav = useDesktopNav();
  const slides = topic.slides;
  const savedIndex = useMemo(
    () => getSavedSlideIndex(topic.id, slides.length),
    [topic.id, slides.length],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    startIndex: savedIndex,
  });

  const [index, setIndex] = useState(savedIndex);

  useEffect(() => {
    saveSlideIndex(topic.id, savedIndex, slides.length);
  }, [savedIndex, slides.length, topic.id]);

  const syncIndex = useCallback(() => {
    if (!emblaApi) return;
    const next = emblaApi.selectedScrollSnap();
    setIndex(next);
    saveSlideIndex(topic.id, next, slides.length);
  }, [emblaApi, slides.length, topic.id]);

  useEffect(() => {
    setIndex(savedIndex);
  }, [savedIndex]);

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
  const currentSlide = slides[index];
  const progressPct = slides.length > 0 ? ((index + 1) / slides.length) * 100 : 0;

  return (
    <SlideQuizProvider topicId={topic.id}>
      <SlideImmersiveProvider immersive>
        <div className={`flex flex-col flex-1 min-h-0 ${styles.deckRoot}`} data-topic-deck>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-valuenow={index + 1}
            aria-label={`Slide ${index + 1} von ${slides.length}`}
          >
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>

          <FeedChrome
            topic={topic}
            slideIndex={index}
            slideCount={slides.length}
            showBrand={compact}
          />

          <div className="flex flex-col flex-1 min-h-0" data-slide-deck>
            <div className={styles.horizontalViewport} ref={emblaRef}>
              <div className={styles.horizontalContainer}>
                {slides.map((slide) => (
                  <div className={styles.horizontalSlide} key={slide.id}>
                    <SlideRenderer slide={slide} topicTitle={undefined} />
                  </div>
                ))}
              </div>
            </div>

            {showDesktopNav && (
              <div className={styles.navRow}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={atStart}
                  onClick={goPrev}
                >
                  Zurück
                </button>
                <span className={styles.topicCounter}>
                  {index + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={atEnd}
                  onClick={goNext}
                >
                  Weiter
                </button>
              </div>
            )}

            {currentSlide && <QuestolinTutorDock topic={topic} slide={currentSlide} />}
          </div>
        </div>
      </SlideImmersiveProvider>
    </SlideQuizProvider>
  );
}
