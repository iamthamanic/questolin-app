/**
 * Scenario slide — programming / system scenario.
 * Location: components/slides/ScenarioSlide.tsx
 */

import type { ScenarioContent } from "@/lib/content/types";
import type { SlideComponentProps } from "@/lib/slides/registry";
import { SlideBody, SlideShell, SlideSubtitle } from "./SlideShell";

export function ScenarioSlide({ slide, topicTitle }: SlideComponentProps) {
  const content = slide.content as ScenarioContent;

  return (
    <SlideShell slide={slide} topicTitle={topicTitle}>
      <SlideBody text={content.body} />
      {content.subtitle && <SlideSubtitle text={content.subtitle} />}
    </SlideShell>
  );
}
