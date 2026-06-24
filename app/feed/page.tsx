/**
 * Learning feed — vertical topic swipe (moved from /).
 * Location: app/feed/page.tsx
 */

import { VerticalTopicFeed } from "@/components/VerticalTopicFeed";
import { getContentProvider } from "@/lib/content/contentProvider";

interface FeedPageProps {
  searchParams?: { collection?: string };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const provider = getContentProvider();
  const collectionId = searchParams?.collection;
  const topics = await provider.listTopics("de", collectionId);

  return <VerticalTopicFeed topics={topics} />;
}
