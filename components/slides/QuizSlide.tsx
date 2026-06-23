/**
 * Interactive quiz slide — multiple choice and true/false.
 * Location: components/slides/QuizSlide.tsx
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizContent, QuizQuestion } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { useSlideQuiz } from "@/components/tutor/SlideQuizContext";
import { SlideShell } from "./SlideShell";
import styles from "./slideContent.module.css";

interface QuestionState {
  selected: string | null;
  answered: boolean;
  correct: boolean;
}

function QuestionBlock({
  question,
  state,
  onSelect,
}: {
  question: QuizQuestion;
  state: QuestionState;
  onSelect: (answer: string) => void;
}) {
  const feedback =
    state.answered &&
    (state.correct ? question.feedbackCorrect : question.feedbackWrong);

  return (
    <div className={styles.quizQuestion}>
      <p className="font-medium">{question.question}</p>
      <div className={styles.optionList}>
        {question.options.map((option) => {
          const isSelected = state.selected === option;
          const showResult = state.answered && isSelected;
          let btnClass = "btn btn-outline btn-sm justify-start text-left h-auto py-3";
          if (showResult) {
            btnClass = state.correct ? "btn btn-success btn-sm" : "btn btn-error btn-sm";
          } else if (isSelected) {
            btnClass = "btn btn-primary btn-sm";
          }

          return (
            <button
              key={option}
              type="button"
              className={btnClass}
              disabled={state.answered}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div
          className={`${styles.feedback} ${
            state.correct ? styles.feedbackOk : styles.feedbackBad
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

export function QuizSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as QuizContent;
  const initial = useRef(
    Object.fromEntries(
      content.questions.map((q) => [q.id, { selected: null, answered: false, correct: false }]),
    ),
  ).current;

  const [answers, setAnswers] = useState<Record<string, QuestionState>>(initial);

  const handleSelect = (question: QuizQuestion, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        selected: answer,
        answered: true,
        correct: answer === question.correctAnswer,
      },
    }));
  };

  const answeredCount = Object.values(answers).filter((a) => a.answered).length;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const quizCtx = useSlideQuiz();

  useEffect(() => {
    if (
      quizCtx &&
      answeredCount === content.questions.length &&
      content.questions.length > 0
    ) {
      quizCtx.markQuizCompleted(slide.id);
    }
  }, [answeredCount, content.questions.length, quizCtx, slide.id]);

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      {content.questions.map((question) => (
        <QuestionBlock
          key={question.id}
          question={question}
          state={answers[question.id]}
          onSelect={(answer) => handleSelect(question, answer)}
        />
      ))}
      <p className="text-sm opacity-70 mt-4">
        {answeredCount} / {content.questions.length} beantwortet
        {answeredCount === content.questions.length &&
          ` · ${correctCount} richtig`}
      </p>
    </SlideShell>
  );
}
