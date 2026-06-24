import type { Page } from "@playwright/test";

/** Desktop width so Zurück/Weiter nav row is visible (hidden below md). */
export async function useDesktopNav(page: Page) {
  await page.setViewportSize({ width: 1280, height: 720 });
}
