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
  const showTitle = !showBrand || slideIndex === 0;

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
      {showTitle ? (
        <h1 className={chrome.title}>{topic.title}</h1>
      ) : (
        <span className="sr-only">{topic.title}</span>
      )}
      <p className={chrome.metaRow}>
        <span className={`badge badge-primary badge-sm ${chrome.categoryBadge}`}>
          {topic.category}
        </span>
        <span className={`${chrome.counter} ${deckStyles.topicCounter}`} data-slide-counter>
          {slideIndex + 1} / {slideCount}
        </span>
      </p>
    </header>
  );
}
