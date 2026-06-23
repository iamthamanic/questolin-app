/**
 * Explanation slide — simple concept explanation.
 * Location: components/slides/ExplanationSlide.tsx
 */

import type { ExplanationContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";

export function ExplanationSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as ExplanationContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
    </SlideShell>
  );
}
