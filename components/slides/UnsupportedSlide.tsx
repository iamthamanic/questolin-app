/**
 * Fallback for slide types not yet implemented (code_read, code_fix).
 * Location: components/slides/UnsupportedSlide.tsx
 */

import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideShell } from "./SlideShell";

export function UnsupportedSlide({ slide, topicTitle }: SlideComponentProps) {
  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <p>
        Slide-Typ <code className="badge badge-ghost">{slide.type}</code> ist
        im Schema reserviert, aber noch nicht implementiert.
      </p>
      <p className="text-sm opacity-70 mt-2">
        Kommt in Phase 2 (Code-Missions).
      </p>
    </SlideShell>
  );
}
