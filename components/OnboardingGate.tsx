/**
 * Client gate that shows level onboarding on first real visit.
 * Location: components/OnboardingGate.tsx
 */

"use client";

import { useEffect, useState } from "react";
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
  const [selectorDone, setSelectorDone] = useState(true);

  useEffect(() => {
    setSelectorDone(hasCompletedLevelOnboarding());
  }, []);

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
