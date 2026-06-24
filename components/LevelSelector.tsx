/**
 * First-start onboarding: pick your starting skill level (0–5).
 * Location: components/LevelSelector.tsx
 */

"use client";

import { useState } from "react";
import type { Level } from "@/lib/content/types";
import { setUserLevel } from "@/lib/progress/storage";
import styles from "./levelSelector.module.css";

interface LevelSelectorProps {
  levels: Level[];
  onSelected: () => void;
}

export function LevelSelector({ levels, onSelected }: LevelSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selected === null) return;
    setUserLevel(selected);
    onSelected();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className="text-primary font-semibold text-sm">Questolin</p>
        <h1 className={styles.title}>Wähle dein Start-Level</h1>
        <p className={styles.subtitle}>
          Du kannst jederzeit weitermachen, wo du stehst. Dein Level bestimmt, welche Fragenblöcke du zuerst siehst.
        </p>
      </header>

      <div className={styles.grid}>
        {levels.map((level) => {
          const active = selected === level.index;
          return (
            <button
              key={level.id}
              type="button"
              className={`${styles.card} ${active ? styles.cardActive : ""}`}
              onClick={() => setSelected(level.index)}
              aria-pressed={active}
            >
              <span className={styles.cardTitle}>{level.title}</span>
              <span className={styles.cardDescription}>{level.description}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`btn btn-primary w-full max-w-lg ${styles.confirm}`}
        disabled={selected === null}
        onClick={handleConfirm}
      >
        Loslegen
      </button>
    </div>
  );
}
