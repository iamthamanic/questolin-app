import { test, expect } from '@playwright/test';
import { slideViewport } from './helpers/feed';

test('feed mounts at most three slide decks in the vertical feed', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section[aria-label]').first()).toBeVisible();

  const decks = slideViewport(page);
  const count = await decks.count();
  expect(count).toBeGreaterThanOrEqual(1);
  expect(count).toBeLessThanOrEqual(3);
});
