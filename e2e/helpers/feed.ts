import type { Locator, Page } from '@playwright/test';

/** Topic panel in the vertical feed (`section` with aria-label = topic title). */
export function topicPanel(page: Page, title: string | RegExp): Locator {
  return page.getByRole('region', { name: title });
}

export function slideCounter(panel: Locator): Locator {
  return panel.locator('[class*="topicCounter"]');
}
