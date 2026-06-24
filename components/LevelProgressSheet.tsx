/**
 * Bottom sheet showing current level progress and remaining topics.
 * Location: components/LevelProgressSheet.tsx
 */

"use client";

import { useEffect, useRef } from "react";
import type { LevelProgress as LevelProgressItem } from "@/lib/progress/levelProgress";
import styles from "./levelProgressSheet.module.css";

interface LevelProgressSheetProps {
  open: boolean;
  onClose: () => void;
  items: LevelProgressItem[];
}

function LevelRow({ item }: { item: LevelProgressItem }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <span className={styles.rowTitle}>{item.level.title}</span>
        <span className={styles.rowMeta}>
          {item.completed}/{item.total}
        </span>
      </div>
      <progress
        className={`progress progress-primary w-full ${styles.bar}`}
        value={item.total > 0 ? item.completed : 0}
        max={item.total > 0 ? item.total : 1}
      />
      {!item.isUnlocked && <span className={styles.locked}>Noch gesperrt</span>}
      {item.isCompleted && <span className={styles.completed}>Abgeschlossen</span>}
    </div>
  );
}

export function LevelProgressSheet({ open, onClose, items }: LevelProgressSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onClose={onClose}
    >
      <div className={styles.panel}>
        <div className={styles.handle} />
        <h2 className={styles.title}>Dein Fortschritt</h2>

        <div className={styles.list}>
          {items.map((item) => (
            <LevelRow key={item.level.id} item={item} />
          ))}
        </div>

        <button type="button" className="btn btn-primary w-full mt-4" onClick={onClose}>
          Schließen
        </button>
      </div>
    </dialog>
  );
}
