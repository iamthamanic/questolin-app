/**
 * Floating level badge — top-right, tap opens progress sheet.
 * Location: components/LevelBadge.tsx
 */

"use client";

import { useState } from "react";
import type { Level, Topic } from "@/lib/content/types";
import { computeLevelProgress, type LevelProgress } from "@/lib/progress/levelProgress";
import { getUserLevel } from "@/lib/progress/storage";
import { LevelProgressSheet } from "./LevelProgressSheet";
import styles from "./levelBadge.module.css";

interface LevelBadgeProps {
  levels: Level[];
  topics: Topic[];
}

export function LevelBadge({ levels, topics }: LevelBadgeProps) {
  const [open, setOpen] = useState(false);
  const userLevel = getUserLevel();
  const currentLevel = levels.find((l) => l.index === userLevel);
  const progress: LevelProgress[] = computeLevelProgress(levels, topics);
  const current = progress.find((p) => p.level.index === userLevel);

  return (
    <>
      <button
        type="button"
        className={`badge badge-primary badge-lg ${styles.badge}`}
        onClick={() => setOpen(true)}
        aria-label="Level-Fortschritt anzeigen"
      >
        Level {userLevel}
        {current && current.total > 0 && (
          <span className={styles.fraction}>
            {current.completed}/{current.total}
          </span>
        )}
      </button>

      {currentLevel && (
        <LevelProgressSheet
          open={open}
          onClose={() => setOpen(false)}
          items={progress}
        />
      )}
    </>
  );
}
