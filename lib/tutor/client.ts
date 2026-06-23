/**
 * Client helper — POST /api/tutor and parse German error responses.
 * Location: lib/tutor/client.ts
 */

export interface TutorChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface TutorSuccess {
  reply: string;
}

interface TutorErrorBody {
  error?: { code?: string; message?: string };
}

export async function sendTutorMessage(payload: {
  topicId: string;
  slideId: string;
  message: string;
  quizCompleted?: boolean;
}): Promise<string> {
  const res = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as TutorSuccess & TutorErrorBody;

  if (!res.ok) {
    const message =
      data.error?.message ?? "Der Tutor ist gerade nicht erreichbar.";
    throw new Error(message);
  }

  if (!data.reply) {
    throw new Error("Leere Antwort vom Tutor.");
  }

  return data.reply;
}
