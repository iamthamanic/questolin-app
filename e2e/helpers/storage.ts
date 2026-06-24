import type { Page } from "@playwright/test";

export const ONBOARDING_KEY = "questolin.onboarding.v1";
export const PROGRESS_KEY = "questolin.progress.v1";

/** Clears guest progress keys so feed/topic tests start from a clean state. */
export async function clearQuestolinStorage(page: Page) {
  await page.goto("/feed");
  await page.evaluate(
    (keys) => {
      for (const key of keys) {
        window.localStorage.removeItem(key);
      }
    },
    [ONBOARDING_KEY, PROGRESS_KEY],
  );
}
