/**
 * Home Hub — start screen with resume, current level, and feed entry.
 * Location: components/HomeScreen.tsx
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Collection, Level } from "@/lib/content/types";
import { getResumeSnapshot } from "@/lib/progress/resume";
import { getUserLevel } from "@/lib/progress/storage";

interface HomeScreenProps {
  levels: Level[];
  collections: Collection[];
  topicTitles: Record<string, string>;
  topicSlideCounts: Record<string, number>;
}

export function HomeScreen({
  levels,
  collections,
  topicTitles,
  topicSlideCounts,
}: HomeScreenProps) {
  const resume = useMemo(
    () => getResumeSnapshot(topicSlideCounts),
    [topicSlideCounts],
  );

  const resumeTitle = resume ? topicTitles[resume.topicId] : null;
  const userLevel = getUserLevel();
  const currentLevel = levels.find((l) => l.index === userLevel);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 bg-base-100">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <header className="text-center">
          <p className="text-primary font-semibold text-sm">Questolin</p>
          <h1 className="text-2xl font-bold mt-1">Was lernst du heute?</h1>
          <p className="text-sm opacity-70 mt-2">
            Level {userLevel} · Kurze Swipe-Decks · Quiz
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {resume && resumeTitle && (
            <Link
              href="/feed"
              className="btn btn-primary min-h-12 h-auto py-3 whitespace-normal text-left"
              data-testid="home-resume"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="font-semibold">Weitermachen</span>
                <span className="text-sm opacity-90 font-normal">
                  {resumeTitle} · Slide {resume.slideIndex + 1}/{resume.slideCount}
                </span>
              </span>
            </Link>
          )}

          {currentLevel && (
            <Link
              href="/feed"
              className="btn btn-primary min-h-12 h-auto py-3 whitespace-normal text-left"
              data-testid="home-current-level"
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="font-semibold">{currentLevel.title}</span>
                <span className="text-sm opacity-90 font-normal">{currentLevel.description}</span>
              </span>
            </Link>
          )}

          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/feed?collection=${encodeURIComponent(collection.id)}`}
              className="btn btn-outline btn-primary min-h-12 h-auto py-3 whitespace-normal text-left"
              data-testid={`home-collection-${collection.id}`}
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="font-semibold">{collection.title}</span>
                <span className="text-sm opacity-80 font-normal">{collection.description}</span>
              </span>
            </Link>
          ))}

          <Link href="/feed" className="btn btn-ghost min-h-11" data-testid="home-all-topics">
            Alle Themen · freier Feed
          </Link>
        </div>

        <p className="text-center text-xs opacity-50">
          Swipe ↑↓ zwischen Themen · ←→ zwischen Slides
        </p>
      </div>
    </main>
  );
}
