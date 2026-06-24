/**
 * Compact topic overlay for immersive feed panels and topic decks.
 * Location: components/FeedChrome.tsx
 */

import Link from "next/link";
import type { Topic } from "@/lib/content/types";
import chrome from "./feedChrome.module.css";
import deckStyles from "./feedViewport.module.css";

interface FeedChromeProps {
  topic: Topic;
  slideIndex: number;
  slideCount: number;
  showBrand?: boolean;
}

export function FeedChrome({
  topic,
  slideIndex,
  slideCount,
  showBrand = false,
}: FeedChromeProps) {
  return (
    <header
      className={chrome.overlay}
      data-feed-chrome
      aria-label={topic.title}
    >
      {showBrand && (
        <Link href="/" className={`${chrome.brand} link link-hover`}>
          Questolin
        </Link>
      )}
      <h1 className={chrome.title}>{topic.title}</h1>
      <p className={chrome.metaRow}>
        <span>
          {topic.category}
          {topic.estimatedMinutes ? ` · ~${topic.estimatedMinutes} Min` : ""}
        </span>
        <span className={`${chrome.counter} ${deckStyles.topicCounter}`} data-slide-counter>
          {slideIndex + 1} / {slideCount}
        </span>
      </p>
    </header>
  );
}
