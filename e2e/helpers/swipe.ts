import type { Page } from '@playwright/test';

/** Simulates touch swipe via mouse drag (mobile-chrome project). */
export async function dragSwipe(
  page: Page,
  box: { x: number; y: number; width: number; height: number },
  deltaX: number,
  deltaY: number,
) {
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + deltaX, startY + deltaY, { steps: 24 });
  await page.mouse.up();
  await page.waitForTimeout(350);
}

export async function swipeHorizontalOnDeck(page: Page, direction: 'left' | 'right') {
  const card = page.locator('[data-slide-deck] article').first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  if (!box) throw new Error('Slide card not found for horizontal swipe');
  const delta = direction === 'left' ? -220 : 220;
  await dragSwipe(page, box, delta, 0);
}

export async function swipeVerticalOnHeader(page: Page, direction: 'up' | 'down') {
  const chrome = page.locator('[data-feed-chrome]').first();
  const box = await chrome.boundingBox();
  if (!box) throw new Error('Feed chrome not found for vertical swipe');
  const delta = direction === 'up' ? -280 : 280;
  await dragSwipe(page, box, 0, delta);
}
