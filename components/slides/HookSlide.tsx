/**
 * Hook slide — opening question to spark curiosity.
 * Location: components/slides/HookSlide.tsx
 */

import type { HookContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";

export function HookSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as HookContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
    </SlideShell>
  );
}
