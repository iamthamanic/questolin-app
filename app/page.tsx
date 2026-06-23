/**
 * Feed — vertical TikTok-style topic swipe with horizontal slide decks.
 * Location: app/page.tsx
 */

import { VerticalTopicFeed } from "@/components/VerticalTopicFeed";
import { getContentProvider } from "@/lib/content/contentProvider";

export default async function HomePage() {
  const provider = getContentProvider();
  const topics = await provider.listTopics("de");

  return <VerticalTopicFeed topics={topics} />;
}
