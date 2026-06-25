/**
 * Topic detail — horizontal slide deck for one learning topic.
 * Location: app/topic/[id]/page.tsx
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { HorizontalSlideDeck } from "@/components/HorizontalSlideDeck";
import { LevelBadge } from "@/components/LevelBadge";
import { getContentProvider } from "@/lib/content/contentProvider";
import styles from "@/components/feedViewport.module.css";

interface TopicPageProps {
  params: { id: string };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = params;
  const provider = getContentProvider();
  const topic = await provider.getTopic(id, "de");
  const levels = (await provider.listLevels?.("de")) ?? [];
  const allTopics = await provider.listTopics("de");

  if (!topic) {
    notFound();
  }

  return (
    <main className={styles.topicPageRoot}>
      <div className={styles.topicPageBack}>
        <Link href="/" className="btn btn-ghost btn-sm">
          ← Start
        </Link>
        <LevelBadge levels={levels} topics={allTopics} />
      </div>
      <div className="flex flex-col flex-1 min-h-0 px-0">
        <HorizontalSlideDeck topic={topic} levels={levels} topics={allTopics} />
      </div>
    </main>
  );
}
