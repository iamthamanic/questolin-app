/**
 * Dispatches slide.type to the correct slide component via registry.
 * Location: components/SlideRenderer.tsx
 */

import type { Slide } from "@/lib/content/types";
import { getSlideRenderer } from "@/lib/slides/registry";

interface SlideRendererProps {
  slide: Slide;
  topicTitle?: string;
}

export function SlideRenderer({ slide, topicTitle }: SlideRendererProps) {
  const Component = getSlideRenderer(slide.type);
  return <Component slide={slide} topicTitle={topicTitle} />;
}
