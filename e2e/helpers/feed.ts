import type { Locator, Page } from '@playwright/test';

/** Topic panel in the vertical feed (`section` with aria-label = topic title). */
export function topicPanel(page: Page, title: string | RegExp): Locator {
  return page.getByRole('region', { name: title });
}

/** First topic panel in the feed (alphabetical by title). */
export function firstTopicPanel(page: Page): Locator {
  return page.locator('section[aria-label]').first();
}

export function slideCounter(panel: Locator): Locator {
  return panel.locator("[data-slide-counter]");
}

/** Topic deck wrapper (chrome + slides + FAB). */
export function slideDeck(scope: Page | Locator): Locator {
  return scope.locator("[data-topic-deck]");
}

/** Horizontal slide viewport only (for virtualization counts). */
export function slideViewport(scope: Page | Locator): Locator {
  return scope.locator("[data-slide-deck]");
}
