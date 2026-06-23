/**
 * Questolin chat bottom sheet — DaisyUI modal, calls /api/tutor.
 * Location: components/tutor/QuestolinChatSheet.tsx
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { Slide, Topic } from "@/lib/content/types";
import { sendTutorMessage, type TutorChatMessage } from "@/lib/tutor/client";
import { QuestolinMascot, type MascotState } from "./QuestolinMascot";

interface QuestolinChatSheetProps {
  open: boolean;
  onClose: () => void;
  topic: Topic;
  slide: Slide;
  quizCompleted: boolean;
}

export function QuestolinChatSheet({
  open,
  onClose,
  topic,
  slide,
  quizCompleted,
}: QuestolinChatSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<TutorChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mascotState: MascotState = loading
    ? "thinking"
    : messages.length > 0 && messages[messages.length - 1]?.role === "assistant"
      ? "happy"
      : "idle";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const reply = await sendTutorMessage({
        topicId: topic.id,
        slideId: slide.id,
        message: text,
        quizCompleted,
      });
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={handleClose}
    >
      <div className="modal-box w-full max-w-lg max-h-[85dvh] flex flex-col p-4 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <QuestolinMascot state={mascotState} size={44} />
          <div className="min-w-0">
            <h2 className="font-bold text-lg leading-tight">Questolin</h2>
            <p className="text-sm opacity-70 truncate">
              {topic.title} · {slide.title ?? slide.type}
            </p>
          </div>
          <form method="dialog" className="ml-auto">
            <button
              type="submit"
              className="btn btn-sm btn-circle btn-ghost min-h-11 min-w-11"
              aria-label="Chat schließen"
            >
              ✕
            </button>
          </form>
        </div>

        <div
          ref={listRef}
          className="flex-1 min-h-[12rem] overflow-y-auto space-y-3 bg-base-200 rounded-lg p-3"
          aria-live="polite"
        >
          {messages.length === 0 && !loading && (
            <p className="text-sm opacity-70">
              Stell eine Frage zum aktuellen Slide — ich helfe dir beim Lernen.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble text-sm ${
                  msg.role === "user" ? "chat-bubble-primary" : "chat-bubble-secondary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary text-sm">
                <span className="loading loading-dots loading-sm" aria-label="Questolin denkt nach" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="alert alert-error text-sm py-2 shrink-0">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
          <input
            type="text"
            className="input input-bordered flex-1 min-h-11"
            placeholder="Deine Frage…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            maxLength={2000}
            aria-label="Frage an Questolin"
          />
          <button
            type="submit"
            className="btn btn-primary min-h-11 min-w-11"
            disabled={loading || !input.trim()}
          >
            Senden
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Schließen">
          schließen
        </button>
      </form>
    </dialog>
  );
}
