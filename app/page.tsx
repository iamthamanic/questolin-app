/**
 * Home Hub — start screen; redirects legacy ?collection= to /feed.
 * Location: app/page.tsx
 */

import { redirect } from "next/navigation";
import { HomeScreen } from "@/components/HomeScreen";
import { getContentProvider } from "@/lib/content/contentProvider";

interface HomePageProps {
  searchParams?: { collection?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const collectionId = searchParams?.collection;
  if (collectionId) {
    redirect(`/feed?collection=${encodeURIComponent(collectionId)}`);
  }

  const provider = getContentProvider();
  const topics = await provider.listTopics("de");
  const collections = (await provider.listCollections?.("de")) ?? [];

  const topicTitles = Object.fromEntries(topics.map((t) => [t.id, t.title]));
  const topicSlideCounts = Object.fromEntries(
    topics.map((t) => [t.id, t.slides.length]),
  );

  return (
    <HomeScreen
      collections={collections}
      topicTitles={topicTitles}
      topicSlideCounts={topicSlideCounts}
    />
  );
}
