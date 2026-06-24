/**
 * Learning feed — vertical topic swipe (moved from /).
 * Location: app/feed/page.tsx
 */

import { LevelBadge } from "@/components/LevelBadge";
import { VerticalTopicFeed } from "@/components/VerticalTopicFeed";
import { getContentProvider } from "@/lib/content/contentProvider";

interface FeedPageProps {
  searchParams?: { collection?: string };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const provider = getContentProvider();
  const collectionId = searchParams?.collection;
  const allTopics = await provider.listTopics("de", collectionId);
  const levels = (await provider.listLevels?.("de")) ?? [];

  return (
    <>
      {levels.length > 0 && <LevelBadge levels={levels} topics={allTopics} />}
      <VerticalTopicFeed topics={allTopics} levels={levels} />
    </>
  );
}
