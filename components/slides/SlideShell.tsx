/**
 * Shared layout wrapper for all slide types.
 * Location: components/slides/SlideShell.tsx
 */

import type { ReactNode } from "react";
import type { Slide } from "@/lib/content/types";
import styles from "./slideContent.module.css";

interface SlideShellProps {
  slide: Slide;
  topicTitle?: string;
  children: ReactNode;
}

export function SlideShell({ slide, topicTitle, children }: SlideShellProps) {
  return (
    <article className={`card bg-base-200 shadow-xl ${styles.shell}`}>
      <div className="card-body">
        {topicTitle && (
          <p className={`text-sm opacity-60 ${styles.topicLabel}`}>{topicTitle}</p>
        )}
        {slide.title && <h2 className={`card-title ${styles.title}`}>{slide.title}</h2>}
        {children}
      </div>
    </article>
  );
}

function renderParagraphs(text: string) {
  return text.split("\n\n").map((block, index) => (
    <p key={index} className={styles.body}>
      {block.split("\n").map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  ));
}

export function SlideBody({ text }: { text: string }) {
  return <>{renderParagraphs(text)}</>;
}

export function SlideSubtitle({ text }: { text: string }) {
  return <p className={styles.subtitle}>{text}</p>;
}
