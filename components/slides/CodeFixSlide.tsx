/**
 * Code fix slide — pick the corrected snippet (local quiz state).
 * Location: components/slides/CodeFixSlide.tsx
 */

"use client";

import { useState } from "react";
import type { CodeFixContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell } from "./SlideShell";
import styles from "./slideContent.module.css";

export function CodeFixSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as CodeFixContent;
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const correct = selected === content.correctAnswer;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      <pre className={styles.code}>
        <code>{content.brokenCode}</code>
      </pre>
      <p className="text-sm font-medium mt-4 mb-2">Welche Version ist korrekt?</p>
      <div className="flex flex-col gap-2">
        {content.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === content.correctAnswer;
          let btnClass = "btn btn-outline justify-start text-left min-h-11 whitespace-normal h-auto py-3";
          if (answered && isSelected) {
            btnClass = isCorrect ? "btn btn-success min-h-11" : "btn btn-error min-h-11";
          } else if (answered && isCorrect) {
            btnClass = "btn btn-success btn-outline min-h-11";
          }

          return (
            <button
              key={option}
              type="button"
              className={btnClass}
              disabled={answered}
              onClick={() => setSelected(option)}
            >
              <code className="font-mono text-sm">{option}</code>
            </button>
          );
        })}
      </div>
      {answered && (
        <p className={`mt-3 text-sm ${correct ? "text-success" : "text-error"}`}>
          {correct ? content.feedbackCorrect : content.feedbackWrong}
        </p>
      )}
    </SlideShell>
  );
}
