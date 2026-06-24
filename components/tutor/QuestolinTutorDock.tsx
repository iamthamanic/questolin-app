/**
 * FAB + chat sheet for Questolin tutor on slide decks.
 * Location: components/tutor/QuestolinTutorDock.tsx
 */

"use client";

import { useState } from "react";
import type { Slide, Topic } from "@/lib/content/types";
import { QuestolinChatSheet } from "./QuestolinChatSheet";
import { QuestolinMascot } from "./QuestolinMascot";
import { useSlideQuiz } from "./SlideQuizContext";
import styles from "./tutorDock.module.css";

interface QuestolinTutorDockProps {
  topic: Topic;
  slide: Slide;
}

export function QuestolinTutorDock({ topic, slide }: QuestolinTutorDockProps) {
  const [open, setOpen] = useState(false);
  const quizCtx = useSlideQuiz();
  const quizCompleted =
    slide.type !== "quiz" || (quizCtx?.isQuizCompleted(slide.id) ?? false);

  return (
    <>
      <button
        type="button"
        className={`btn btn-primary btn-circle shadow-lg ${styles.fab}`}
        aria-label="Questolin fragen"
        onClick={() => setOpen(true)}
      >
        <QuestolinMascot state="idle" size={36} />
      </button>

      <QuestolinChatSheet
        open={open}
        onClose={() => setOpen(false)}
        topic={topic}
        slide={slide}
        quizCompleted={quizCompleted}
      />
    </>
  );
}
