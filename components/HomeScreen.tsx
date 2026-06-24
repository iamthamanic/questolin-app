/**
 * Home Hub — start screen with resume, collection (Level), and full feed entry.
 * Location: components/HomeScreen.tsx
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Collection } from "@/lib/content/types";
import { getResumeSnapshot } from "@/lib/progress/resume";

interface HomeScreenProps {
  collections: Collection[];
  topicTitles: Record<string, string>;
  topicSlideCounts: Record<string, number>;
}

export function HomeScreen({
  collections,
  topicTitles,
  topicSlideCounts,
}: HomeScreenProps) {
  const resume = useMemo(
    () => getResumeSnapshot(topicSlideCounts),
    [topicSlideCounts],
  );

  const resumeTitle = resume ? topicTitles[resume.topicId] : null;

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 bg-base-100">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <header className="text-center">
          <p className="text-primary font-semibold text-sm">Questolin</p>
          <h1 className="text-2xl font-bold mt-1">Was lernst du heute?</h1>
          <p className="text-sm opacity-70 mt-2">
            Kurze Swipe-Decks · Quiz · Questolin-Tutor
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

          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/feed?collection=${encodeURIComponent(collection.id)}`}
              className={`btn min-h-12 h-auto py-3 whitespace-normal text-left ${
                resume ? "btn-outline btn-primary" : "btn-primary"
              }`}
              data-testid={`home-collection-${collection.id}`}
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="font-semibold">
                  {collections.length > 1 ? `Level ${index + 1}: ` : ""}
                  {collection.title}
                </span>
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
