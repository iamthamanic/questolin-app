/**
 * Interactive quiz slide — one question per view, full-width answer cards.
 * Location: components/slides/QuizSlide.tsx
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizContent, QuizQuestion } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { useSlideQuiz } from "@/components/tutor/SlideQuizContext";
import { useSlideImmersive } from "./SlideImmersiveContext";
import { SlideShell } from "./SlideShell";
import styles from "./slideContent.module.css";

interface QuestionState {
  selected: string | null;
  answered: boolean;
  correct: boolean;
}

function optionClass(
  option: string,
  state: QuestionState,
  correctAnswer: string,
): string {
  const base = `${styles.quizOption} btn justify-start text-left h-auto min-h-[3rem] py-3 px-4 w-full`;
  if (!state.answered) {
    return `${base} btn-outline`;
  }
  if (option === correctAnswer) {
    return `${base} btn-success`;
  }
  if (option === state.selected) {
    return `${base} btn-error`;
  }
  return `${base} btn-ghost opacity-50`;
}

function QuestionView({
  question,
  index,
  total,
  state,
  onSelect,
  onNext,
  isLast,
  correctCount,
  totalAnswered,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  state: QuestionState;
  onSelect: (answer: string) => void;
  onNext: () => void;
  isLast: boolean;
  correctCount: number;
  totalAnswered: number;
}) {
  const feedback =
    state.answered &&
    (state.correct ? question.feedbackCorrect : question.feedbackWrong);

  return (
    <div className={styles.quizView}>
      <p className={styles.quizProgress}>
        Frage {index + 1} / {total}
      </p>
      <h2 className={styles.quizPrompt}>{question.question}</h2>
      <div className={styles.quizOptionList}>
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={optionClass(option, state, question.correctAnswer)}
            disabled={state.answered}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          className={`${styles.feedback} ${
            state.correct ? styles.feedbackOk : styles.feedbackBad
          } ${state.correct ? "" : styles.feedbackShake}`}
          role="status"
        >
          {feedback}
        </div>
      )}
      {state.answered && !isLast && (
        <button type="button" className="btn btn-primary btn-block mt-4" onClick={onNext}>
          Nächste Frage
        </button>
      )}
      {state.answered && isLast && (
        <p className={styles.quizSummary}>
          {totalAnswered} / {total} beantwortet · {correctCount} richtig
        </p>
      )}
    </div>
  );
}

export function QuizSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as QuizContent;
  const immersive = useSlideImmersive();
  const initial = useRef(
    Object.fromEntries(
      content.questions.map((q) => [q.id, { selected: null, answered: false, correct: false }]),
    ),
  ).current;

  const [answers, setAnswers] = useState<Record<string, QuestionState>>(initial);
  const [questionIndex, setQuestionIndex] = useState(0);

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
  const currentQuestion = content.questions[questionIndex];

  useEffect(() => {
    if (
      quizCtx &&
      answeredCount === content.questions.length &&
      content.questions.length > 0
    ) {
      quizCtx.markQuizCompleted(slide.id);
    }
  }, [answeredCount, content.questions.length, quizCtx, slide.id]);

  if (!currentQuestion) return null;

  const questionView = (
    <QuestionView
      question={currentQuestion}
      index={questionIndex}
      total={content.questions.length}
      state={answers[currentQuestion.id]}
      onSelect={(answer) => handleSelect(currentQuestion, answer)}
      onNext={() => setQuestionIndex((i) => Math.min(i + 1, content.questions.length - 1))}
      isLast={questionIndex === content.questions.length - 1}
      correctCount={correctCount}
      totalAnswered={answeredCount}
    />
  );

  if (immersive) {
    return <article className={styles.quizImmersive}>{questionView}</article>;
  }

  return <SlideShell slide={slide} topicTitle={topicTitle}>{questionView}</SlideShell>;
}
