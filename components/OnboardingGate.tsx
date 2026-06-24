/**
 * Client gate that shows level onboarding on first real visit.
 * Location: components/OnboardingGate.tsx
 */

"use client";

import { useMemo, useState } from "react";
import type { Level } from "@/lib/content/types";
import {
  hasCompletedLevelOnboarding,
  markLevelOnboardingComplete,
} from "@/lib/progress/storage";
import { HomeScreen } from "./HomeScreen";
import { LevelSelector } from "./LevelSelector";

interface OnboardingGateProps {
  levels: Level[];
  homeProps: React.ComponentProps<typeof HomeScreen>;
}

export function OnboardingGate({ levels, homeProps }: OnboardingGateProps) {
  const needsSelector = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !hasCompletedLevelOnboarding();
  }, []);

  const [selectorDone, setSelectorDone] = useState(!needsSelector);

  if (!selectorDone) {
    return (
      <LevelSelector
        levels={levels}
        onSelected={() => {
          markLevelOnboardingComplete();
          setSelectorDone(true);
        }}
      />
    );
  }

  return <HomeScreen {...homeProps} />;
}
