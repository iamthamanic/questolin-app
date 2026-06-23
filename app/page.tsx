/**
 * Feed — vertical TikTok-style topic swipe with horizontal slide decks.
 * Location: app/page.tsx
 */

import { VerticalTopicFeed } from "@/components/VerticalTopicFeed";
import { getContentProvider } from "@/lib/content/contentProvider";

interface HomePageProps {
  searchParams?: { collection?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const provider = getContentProvider();
  const collectionId = searchParams?.collection;
  const topics = await provider.listTopics("de", collectionId);

  return <VerticalTopicFeed topics={topics} />;
}
