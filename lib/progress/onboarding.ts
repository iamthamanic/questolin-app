/**
 * One-time swipe coach hint flag (guest, LocalStorage).
 * Location: lib/progress/onboarding.ts
 */

const ONBOARDING_KEY = "questolin.onboarding.v1";

function canUseStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__questolin_onboarding_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function hasSeenSwipeCoach(): boolean {
  if (!canUseStorage()) return true;
  return window.localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function markSwipeCoachSeen(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // ignore
  }
}
