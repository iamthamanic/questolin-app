/**
 * Maps slide types to React components — new type = one file + registry entry.
 * Location: lib/slides/registry.ts
 */

import type { ComponentType } from "react";
import type { Slide, SlideType } from "../content/types";
import { BeginnerMistakeSlide } from "@/components/slides/BeginnerMistakeSlide";
import { CodeFixSlide } from "@/components/slides/CodeFixSlide";
import { CodeReadSlide } from "@/components/slides/CodeReadSlide";
import { ExplanationSlide } from "@/components/slides/ExplanationSlide";
import { HookSlide } from "@/components/slides/HookSlide";
import { MasteryCheckSlide } from "@/components/slides/MasteryCheckSlide";
import { MiniTaskSlide } from "@/components/slides/MiniTaskSlide";
import { QuizSlide } from "@/components/slides/QuizSlide";
import { RealWorldSlide } from "@/components/slides/RealWorldSlide";
import { ScenarioSlide } from "@/components/slides/ScenarioSlide";
import { UnsupportedSlide } from "@/components/slides/UnsupportedSlide";

export interface SlideComponentProps {
  slide: Slide;
  topicTitle?: string;
}

export const IMPLEMENTED_SLIDE_TYPES = [
  "hook",
  "explanation",
  "real_world",
  "scenario",
  "beginner_mistake",
  "quiz",
  "code_read",
  "code_fix",
  "mastery_check",
  "mini_task",
] as const satisfies readonly SlideType[];

export type ImplementedSlideType = (typeof IMPLEMENTED_SLIDE_TYPES)[number];

export const SLIDE_RENDERERS: Record<
  ImplementedSlideType,
  ComponentType<SlideComponentProps>
> = {
  hook: HookSlide,
  explanation: ExplanationSlide,
  real_world: RealWorldSlide,
  scenario: ScenarioSlide,
  beginner_mistake: BeginnerMistakeSlide,
  quiz: QuizSlide,
  code_read: CodeReadSlide,
  code_fix: CodeFixSlide,
  mastery_check: MasteryCheckSlide,
  mini_task: MiniTaskSlide,
};

export function isImplementedSlideType(
  type: SlideType,
): type is ImplementedSlideType {
  return (IMPLEMENTED_SLIDE_TYPES as readonly string[]).includes(type);
}

export function getSlideRenderer(
  type: SlideType,
): ComponentType<SlideComponentProps> {
  if (isImplementedSlideType(type)) {
    return SLIDE_RENDERERS[type];
  }
  return UnsupportedSlide;
}
