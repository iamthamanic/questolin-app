/**
 * Topic detail — horizontal slide deck for one learning topic.
 * Location: app/topic/[id]/page.tsx
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { HorizontalSlideDeck } from "@/components/HorizontalSlideDeck";
import { getContentProvider } from "@/lib/content/contentProvider";

interface TopicPageProps {
  params: { id: string };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = params;
  const provider = getContentProvider();
  const topic = await provider.getTopic(id, "de");

  if (!topic) {
    notFound();
  }

  return (
    <main className="max-w-lg mx-auto min-h-[100dvh] flex flex-col px-2 py-4">
      <Link href="/" className="btn btn-ghost btn-sm mb-2 self-start">
        ← Feed
      </Link>
      <div className="flex flex-col flex-1 min-h-0">
        <HorizontalSlideDeck topic={topic} />
      </div>
    </main>
  );
}
