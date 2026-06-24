/**
 * Home Hub — start screen; redirects legacy ?collection= to /feed.
 * Location: app/page.tsx
 */

import { redirect } from "next/navigation";
import { OnboardingGate } from "@/components/OnboardingGate";
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
  const levels = (await provider.listLevels?.("de")) ?? [];

  const topicTitles = Object.fromEntries(topics.map((t) => [t.id, t.title]));
  const topicSlideCounts = Object.fromEntries(
    topics.map((t) => [t.id, t.slides.length]),
  );

  return (
    <OnboardingGate
      levels={levels}
      homeProps={{
        levels,
        collections,
        topicTitles,
        topicSlideCounts,
      }}
    />
  );
}
